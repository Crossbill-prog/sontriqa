import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const app=fs.readFileSync('site/app.js','utf8');
const validator=fs.readFileSync('site/release-validator.js','utf8');
assert.match(app,/SontriqaReleaseValidator\?\.findStableInstaller/);
assert.match(validator,/release\.draft \|\| release\.prerelease/);
assert.match(validator,/approvedStableTag='v1\\.0\\.0'/);
assert.match(validator,/approvedInstallerSHA256='de70bd9db13705d9f41bbc0db98e84471629fa3f333b0c6478a15feafb7c4254'/);
assert.match(validator,/installer\\.digest/);
for (const required of [
  'Sontriqa-Setup-x64.exe','Sontriqa-Setup-x64.exe.sig','SHA256SUMS.txt',
  'latest.json','THIRD_PARTY_DEPENDENCIES_GENERATED.txt',
  'ENGINE_SOURCE_SHA256.txt','ENGINE_UPSTREAM_PROVENANCE.json',
  'SELECTORS_0.38.0_MPL_SOURCE.zip','MPL_SOURCE_AVAILABILITY.txt'
]) assert.ok(validator.includes(required),'Missing required stable release asset: '+required);
assert.match(fs.readFileSync('site/index.html','utf8'),/src="release-validator\.js"/);
assert.match(fs.readFileSync('site/index.html','utf8'),/aria-disabled="true"/);
const wf=fs.readFileSync('.github/workflows/pages.yml','utf8');
assert.match(wf,/actions\/deploy-pages@v4/);
const result=spawnSync(process.execPath,['scripts/generate-site-config.mjs','Crossbill-prog/sontriqa','site/config.js'],{encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
assert.match(fs.readFileSync('site/config.js','utf8'),/Crossbill-prog\/sontriqa/);
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
