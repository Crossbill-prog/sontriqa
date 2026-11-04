'use strict';
// Read-only gating of the public download button. GitHub's sha256 digest is
// compared to the EXACT owner-accepted Windows installer from CI #41890999313.
// This is not an independent Ed25519 verification or a legal release approval.
// Approve each future stable version explicitly, including its tested EXE hash.
(() => {
  // The previously accepted installer uses vulnerable Tauri 2.11.1.
  // Do NOT enable downloads until a new patched Windows binary is built,
  // signed, verified, and explicitly approved with a replacement SHA-256.
  const releaseHold=true;
  const approvedStableTag='v1.0.0';
  const approvedInstallerSHA256='de70bd9db13705d9f41bbc0db98e84471629fa3f333b0c6478a15feafb7c4254';
  // Hashes taken from the exact privately verified release draft and bridge.
  const approvedManifestSHA256='bd095a956e9652670006f7bae7ee7685767ca236237506592df37538151ee227';
  const approvedMplSourceSHA256='a335861acf87a44528af2be1fccca202962f18b2443651abe4a9498a40c8b3bf';
  // VULNERABILITY HOLD: original 1.0.0 EXE (tauri@2.11.1) is affected by
  // GHSA-w28w-mhc8-qvjv (patched in tauri >= 2.11.6). The owner-accepted
  // original hash is kept ONLY as an audit record. The download page must NOT
  // automatically promote it even if a Release is accidentally published.
  // Set true ONLY together with independently verified patched EXE hashes,
  // new signed manifest, rebuilt MPL archive, and renewed Windows acceptance.
  const securityFixApproved=false;
  const expectedAssets = Object.freeze({
    'Sontriqa-Setup-x64.exe': 750000,
    'Sontriqa-Setup-x64.exe.sig': 60,
    'SHA256SUMS.txt': 65,
    'latest.json': 100,
    'THIRD_PARTY_DEPENDENCIES_GENERATED.txt': 100,
    'ENGINE_SOURCE_SHA256.txt': 65,
    'ENGINE_UPSTREAM_PROVENANCE.json': 100,
    'SELECTORS_0.38.0_MPL_SOURCE.zip': 1000,
    'MPL_SOURCE_AVAILABILITY.txt': 100
  });
  function inspectStableReleaseAssets(release, repo) {
    if (!release || release.draft || release.prerelease ||
        release.tag_name!==approvedStableTag ||
        !/^[\w.-]+\/[\w.-]+$/.test(repo || '') ||
        !Array.isArray(release.assets)) return null;
    const prefix='https://github.com/'+repo+'/releases/download/'+release.tag_name+'/';
    const entries={};
    for (const asset of release.assets) {
      if (!asset || !Object.hasOwn(expectedAssets, asset.name)) continue;
      if (Object.hasOwn(entries, asset.name)) return null; // Ambiguous duplicate.
      entries[asset.name]=asset;
    }
    for (const [name,minSize] of Object.entries(expectedAssets)) {
      const asset=entries[name];
      if (!asset || asset.state!=='uploaded' || !Number.isSafeInteger(asset.size) ||
          asset.size<minSize || asset.browser_download_url!==prefix+name) return null;
    }
    const installer=entries['Sontriqa-Setup-x64.exe'];
    if (installer.digest!==`sha256:${approvedInstallerSHA256}`) return null;
    if (entries['latest.json'].digest!==`sha256:${approvedManifestSHA256}`) return null;
    if (entries['SELECTORS_0.38.0_MPL_SOURCE.zip'].digest!==`sha256:${approvedMplSourceSHA256}`) return null;
    return installer;
  }
  function findStableInstaller(release,repo){
    if(releaseHold || !securityFixApproved)return null;
    return inspectStableReleaseAssets(release,repo);
  }
  window.SontriqaReleaseValidator=Object.freeze({
    findStableInstaller,inspectStableReleaseAssets,expectedAssets,
    approvedStableTag,approvedInstallerSHA256,securityFixApproved
  });
})();
