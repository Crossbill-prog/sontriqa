'use strict';
// Read-only gating of the public download button. GitHub's sha256 digest is
// compared to the EXACT owner-accepted Windows installer from CI #41890999313.
// This is not an independent Ed25519 verification or a legal release approval.
// Approve each future stable version explicitly, including its tested EXE hash.
(() => {
  const approvedStableTag='v1.0.0';
  const approvedInstallerSHA256='de70bd9db13705d9f41bbc0db98e84471629fa3f333b0c6478a15feafb7c4254';
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
  function findStableInstaller(release, repo) {
    if (!release || release.draft || release.prerelease ||
        !/^v?\d+\.\d+\.\d+$/.test(release.tag_name || '') ||
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
    return installer;
  }
  window.SontriqaReleaseValidator=Object.freeze({findStableInstaller, expectedAssets, approvedStableTag, approvedInstallerSHA256});
})();
