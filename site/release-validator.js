'use strict';
// Read-only gating of the public download button. GitHub's sha256 digest
// must match the *new*, patched, owner-accepted NSIS candidate from private
// CI #41951613118 (SHA256: ebcaa560685f16bc6e12f724e47999ce9cb9989212c7681e4c50d590afeada6b),
// and only AFTER separate legal/publication approval. The exact reviewed hashes
// are pinned; the site was enabled only after stable publication and checks.
// Browser-side checks are NOT an Ed25519 signature verification.
(() => {
  // Historical 1.0.0 candidate used vulnerable Tauri 2.11.1.
  // The patched 2.12.3 binary was independently verified, owner-accepted,
  // and released publicly as stable v1.0.0 on 6 November 2026.
  const releaseHold=false;
  const approvedStableTag='v1.0.0';
  const approvedInstallerSHA256='ebcaa560685f16bc6e12f724e47999ce9cb9989212c7681e4c50d590afeada6b';
  // SHA-256 for the *actual* signed 1.0.0 candidate has been independently
  // verified against the private release artifact and publicly published on
  // 6 November 2026. The exact hash and other safety checks remain mandatory.
  const approvedManifestSHA256='3fb48fade9830521256666b70d43e9ff59a9baaffae8b1d6960254dcdb1bbbfd';
  const approvedMplSourceSHA256='44a068655cada9bf8746a8a6e853569380c4e4ec2c7b6306e206d1731b83d09b';
  // VULNERABILITY HOLD: original 1.0.0 EXE (tauri@2.11.1) is affected by
  // GHSA-w28w-mhc8-qvjv (patched in tauri >= 2.11.6). The owner-accepted
  // original hash is kept ONLY as an audit record. The download page must NOT
  // automatically promote it even if a Release is accidentally published.
  // The security decision is POSITIVE for this exact patched signed binary.
  // Owner publication approval was given on 6 November 2026; only the
  // exact, complete stable release can pass this guard.
  const securityFixApproved=true;
  // Frozen SHA-256 inventory: exact independently reviewed private
  // Sontriqa_1.0.0_Private_Release_Review_Updated_Notes.zip (11 files).
  // All assets, not only the installer, must match the approved bytes.
  const approvedAssetSHA256 = Object.freeze({
    'BUILD_PROVENANCE.json': '5b00f8b91c67665a97f188e77b61517ef15670136c5ac17877bf9835dbe600a1',
    'ENGINE_SOURCE_SHA256.txt': '341339caa70068993ea35b0e93d61c2c5af6b16e4917c9f97d558e404cfc55fe',
    'ENGINE_UPSTREAM_PROVENANCE.json': 'b8e3ce18e409f2c582d31868ce09ac11a5cf54c5d7cb10f6249f44f0b7674390',
    'MPL_SOURCE_AVAILABILITY.txt': '0de3add643d5ba3b1e65c27d99a734d3d8bc2950258fb394564ce904945c454d',
    'RELEASE_NOTES_RU_EN.md': 'a177d0e5fccfa69eae33b5abe39dbe8a58fe031b93352ff95316b767e5d0368c',
    'SELECTORS_0.38.0_MPL_SOURCE.zip': approvedMplSourceSHA256,
    'SHA256SUMS.txt': '0d5e7dc180a1959272bff32cb5675a4ecc8bccb4e5b50941a886442b99af7d31',
    'Sontriqa-Setup-x64.exe': approvedInstallerSHA256,
    'Sontriqa-Setup-x64.exe.sig': '4141c4466c17d776a28dac75bd4cf4d457740a5d292af969d86c4477f1074990',
    'THIRD_PARTY_DEPENDENCIES_GENERATED.txt': '8e55da0b1aeb7fc72d96ce975d0e84113734566370010bd87a0ae04b82415f06',
    'latest.json': approvedManifestSHA256
  });
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
    // Reject unexpected assets completely: an accidentally uploaded PRIVATE
    // reproducibility ZIP or credential file must never appear in an approved
    // release. GitHub's automatic source-code links are not release.assets.
    if (release.assets.length !== Object.keys(expectedAssets).length) return null;
    for (const asset of release.assets) {
      if (!asset || !Object.hasOwn(expectedAssets, asset.name)) return null;
      if (Object.hasOwn(entries, asset.name)) return null; // Ambiguous duplicate.
      entries[asset.name]=asset;
    }
    for (const [name,minSize] of Object.entries(expectedAssets)) {
      const asset=entries[name];
      if (!asset || asset.state!=='uploaded' || !Number.isSafeInteger(asset.size) ||
          asset.size<minSize || asset.browser_download_url!==prefix+name ||
          !/^[a-f0-9]{64}$/.test(approvedAssetSHA256[name] ?? '') ||
          asset.digest !== `sha256:${approvedAssetSHA256[name]}`) return null;
    }
    // Fail closed if any exact independently verified source or binary hash
    // changes, even after public release.
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
    publicReleaseEnabled: !releaseHold && securityFixApproved,
    approvedStableTag,approvedInstallerSHA256,approvedAssetSHA256,securityFixApproved
  });
})();
