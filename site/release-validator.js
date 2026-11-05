'use strict';
// Read-only gating of the public download button. GitHub's sha256 digest
// must match the *new*, patched, owner-accepted NSIS candidate from private
// CI #41951613118 (SHA256: ebcaa560685f16bc6e12f724e47999ce9cb9989212c7681e4c50d590afeada6b),
// and only AFTER separate legal/publication approval. DO NOT set the pending
// values below or remove either hold as part of documentation maintenance.
// Browser-side checks are NOT an Ed25519 signature verification.
(() => {
  // The previously accepted installer uses vulnerable Tauri 2.11.1.
  // The new patched binary was built, signed and accepted on Windows; do NOT
  // enable public downloads until explicit legal/publication approval too.
  const releaseHold=true;
  const approvedStableTag='v1.0.0';
  const approvedInstallerSHA256='PENDING_REBUILT_WINDOWS_INSTALLER';
  // Never preapprove the former vulnerable EXE, manifest or source archive.
  // Replace PENDING placeholders only after legal clearance and explicit release
  // approval of the already signed and Windows-accepted new SHA256.
  const approvedManifestSHA256='PENDING_SIGNED_MANIFEST';
  const approvedMplSourceSHA256='PENDING_FULL_MPL_SOURCE_ARCHIVE';
  // VULNERABILITY HOLD: original 1.0.0 EXE (tauri@2.11.1) is affected by
  // GHSA-w28w-mhc8-qvjv (patched in tauri >= 2.11.6). The owner-accepted
  // original hash is kept ONLY as an audit record. The download page must NOT
  // automatically promote it even if a Release is accidentally published.
  // Set true only after independent signature/hash checks AND the separate
  // legal/publication approval; Windows acceptance alone is insufficient.
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
    'MPL_SOURCE_AVAILABILITY.txt': 100,
    'BUILD_PROVENANCE.json': 200,
    'RELEASE_NOTES_RU_EN.md': 200
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
    // No accidental release even if both independent UI holds are lifted:
    // all three EXACT hashes must be explicitly replaced after full acceptance.
    if (![approvedInstallerSHA256,approvedManifestSHA256,approvedMplSourceSHA256]
       .every(hash=>/^[a-f0-9]{64}$/.test(hash))) return null;
    // The formerly accepted 1.0 installer used vulnerable tauri@2.11.1.
    if (approvedInstallerSHA256==='de70bd9db13705d9f41bbc0db98e84471629fa3f333b0c6478a15feafb7c4254') return null;
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
