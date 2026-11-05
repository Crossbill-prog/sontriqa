import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const app=fs.readFileSync('site/app.js','utf8');
const validator=fs.readFileSync('site/release-validator.js','utf8');
assert.ok(validator.includes('const releaseHold=true;'),'No stable 1.0 download before legal/publication approval');
assert.match(app,/SontriqaReleaseValidator\?\.findStableInstaller/);
assert.equal((app.match(/releases\.hidden = false;/g)||[]).length,1,
 'Release history must not be exposed while only vulnerable RC18 is available');
assert.ok(app.indexOf('releases.hidden = false;')>app.indexOf('if (!asset) return;'),
 'Expose release history only after signed stable EXE and all required assets pass the hold guard');

assert.match(validator,/release\.draft \|\| release\.prerelease/);
assert.ok(validator.includes("const approvedStableTag='v1.0.0'"),'Only frozen accepted stable version is eligible');
assert.ok(validator.includes("approvedInstallerSHA256='ebcaa560685f16bc6e12f724e47999ce9cb9989212c7681e4c50d590afeada6b'"), 'Accepted signed EXE SHA must be frozen');
assert.ok(validator.includes('de70bd9db13705d9f41bbc0db98e84471629fa3f333b0c6478a15feafb7c4254'),'Known vulnerable installer must remain explicitly denied');
assert.ok(validator.includes('installer.digest'),'Public download must validate GitHub SHA-256');
assert.ok(validator.includes('securityFixApproved=true'),'Patched Tauri has passed cryptographic and Windows acceptance');
assert.ok(validator.includes('if(releaseHold || !securityFixApproved)return null;'),'Both publication and security holds must block download');
assert.ok(validator.includes("approvedManifestSHA256='3fb48fade9830521256666b70d43e9ff59a9baaffae8b1d6960254dcdb1bbbfd'"));
assert.ok(validator.includes("approvedMplSourceSHA256='44a068655cada9bf8746a8a6e853569380c4e4ec2c7b6306e206d1731b83d09b'"));
for (const required of [
  'Sontriqa-Setup-x64.exe','Sontriqa-Setup-x64.exe.sig','SHA256SUMS.txt',
  'latest.json','THIRD_PARTY_DEPENDENCIES_GENERATED.txt',
  'ENGINE_SOURCE_SHA256.txt','ENGINE_UPSTREAM_PROVENANCE.json',
  'SELECTORS_0.38.0_MPL_SOURCE.zip','MPL_SOURCE_AVAILABILITY.txt'
]) assert.ok(validator.includes(required),'Missing required stable release asset: '+required);
assert.match(fs.readFileSync('site/index.html','utf8'),/src="release-validator\.js"/);
assert.match(fs.readFileSync('site/index.html','utf8'),/aria-disabled="true"/);
const advisoryWarning=fs.readFileSync('site/index.html','utf8');
assert.ok(advisoryWarning.includes('Публичная RC.18 использует Tauri 2.11.5'),'Public RC must be clearly marked as affected by advisory');
assert.ok(advisoryWarning.includes('GHSA-w28w-mhc8-qvjv'),'Advisory should be linked');
assert.ok(advisoryWarning.includes('в Sontriqa не подтверждена'),'No claim of proven exploitability');
const wf=fs.readFileSync('.github/workflows/pages.yml','utf8');
assert.match(wf,/actions\/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e/);
assert.ok(wf.includes('name: github-pages-${{ github.run_id }}-${{ github.run_attempt }}'), 'Pages upload artifact must be unique per attempt');
assert.ok(wf.includes('artifact_name: github-pages-${{ github.run_id }}-${{ github.run_attempt }}'), 'Pages deploy must target the same unique artifact');
assert.doesNotMatch(wf,/pages\/deployments\/.*\/cancel/,'Do not keep cancelling a retired historical Pages deployment');
for(const action of [
  'actions/checkout@11d5960a326750d5838078e36cf38b85af677262',
  'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020',
  'actions/configure-pages@983d7736d9b0ae728b81ab479565c72886d7745b',
  'actions/upload-pages-artifact@56afc609e74202658d3ffba0e8f6dda462b719fa',
  'actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e'
]) assert.ok(wf.includes(action),'Pages Action must be pinned to a reviewed immutable commit: '+action);
const result=spawnSync(process.execPath,['scripts/generate-site-config.mjs','Crossbill-prog/sontriqa','site/config.js'],{encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
assert.match(fs.readFileSync('site/config.js','utf8'),/Crossbill-prog\/sontriqa/);
const mplPage=fs.readFileSync('site/open-source.html','utf8');
for(const [pkg,ver] of [["cssparser","0.37.0"],["cssparser-macros","0.7.1"],["dtoa-short","0.3.5"],["option-ext","0.2.0"],["selectors","0.38.0"]]) {
  assert.ok(mplPage.includes(`https://static.crates.io/crates/${pkg}/${pkg}-${ver}.crate`),'Exact MPL source archive link missing: '+pkg);
  assert.ok(mplPage.includes(`https://docs.rs/crate/${pkg}/${ver}/source/`),'Browsable MPL source missing: '+pkg);
}
assert.ok(mplPage.includes('Окончательная контрольная сумма SHA-256 ещё не утверждена'),'Do not publish an obsolete MPL archive hash as final');
assert.ok(mplPage.includes('This is a technical availability statement'));
assert.ok(fs.readFileSync('site/index.html','utf8').includes('href="open-source.html"'));
assert.ok(fs.readFileSync('site/privacy.html','utf8').includes('href="open-source.html"'));
const privacy=fs.readFileSync('site/privacy.html','utf8');
const rootPrivacy=fs.readFileSync('privacy.html','utf8');
const updaterNotice=privacy.match(/<p>(При запуске подписанной Sontriqa[^<]+)<\/p>/)?.[1];
assert.ok(updaterNotice,'Public privacy page must disclose automatic GitHub update checks');
assert.ok(updaterNotice.includes('IP-адрес'),'Disclose network metadata sent to GitHub');
assert.ok(updaterNotice.includes('отдельного подтверждения'),'Background checks must not imply automatic downloads');
assert.ok(rootPrivacy.includes(updaterNotice),'Root and deployed privacy pages must be consistent');
const i18n=fs.readFileSync('site/i18n.js','utf8');
assert.ok(i18n.includes(JSON.stringify(updaterNotice)+': '),'English website must translate the complete signed updater disclosure');
assert.ok(i18n.includes('Downloading and installing an update requires your explicit confirmation.'));
console.log('Public download-site self-check OK');
