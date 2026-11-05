import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('site/release-validator.js','utf8');
const context={window:{}};
// The patched signed binary is accepted; legal/publication approval is still blocked.
assert.ok(source.includes('const releaseHold=true;'),'old vulnerable binary must be blocked');
const production={window:{}};
vm.runInNewContext(source,production,{timeout:2000});
// Only the isolated test scenario opens the guard to cover all asset validation branches.
const candidateSource=source
  .replace('const releaseHold=true;','const releaseHold=false;');
vm.runInNewContext(candidateSource,context,{timeout:2000});
const {findStableInstaller,inspectStableReleaseAssets,expectedAssets,approvedStableTag,approvedInstallerSHA256,approvedAssetSHA256,securityFixApproved}=context.window.SontriqaReleaseValidator;
assert.equal(securityFixApproved,true,'Only patched approved EXE is eligible; publication remains separately held');
assert.match(source,/if\(releaseHold \|\| !securityFixApproved\)return null/,'releaseHold must participate in the real download decision');
const repo='Crossbill-prog/sontriqa';
const tag='v1.0.0';
assert.equal(approvedStableTag,tag);
assert.equal(approvedInstallerSHA256,'ebcaa560685f16bc6e12f724e47999ce9cb9989212c7681e4c50d590afeada6b');
assert.ok(source.includes('const releaseHold=true;'),'Production must remain legally held');
assert.equal(production.window.SontriqaReleaseValidator.securityFixApproved,true);
const base='https://github.com/'+repo+'/releases/download/'+tag+'/';
assert.equal(Object.keys(approvedAssetSHA256).length,Object.keys(expectedAssets).length);
const assets=Object.entries(expectedAssets).map(([name,minSize])=>({
  name,state:'uploaded',size:minSize+1000,browser_download_url:base+name,
  digest:'sha256:'+approvedAssetSHA256[name]
}));
const release={draft:false,prerelease:false,tag_name:tag,assets};
assert.equal(production.window.SontriqaReleaseValidator.findStableInstaller(release,repo),null,'production must not link vulnerable 2.11.1 binary even if complete release is accidentally published');
assert.ok(Object.hasOwn(expectedAssets,'SELECTORS_0.38.0_MPL_SOURCE.zip'),'stable 1.0 must require its exact MPL source');
assert.ok(Object.hasOwn(expectedAssets,'BUILD_PROVENANCE.json'),'stable must include filename-rebased cryptographic build evidence');
assert.ok(Object.hasOwn(expectedAssets,'RELEASE_NOTES_RU_EN.md'),'stable must include reviewed bilingual release notes');
assert.ok(!Object.hasOwn(expectedAssets,'SELECTORS_0.36.1_MPL_SOURCE.zip'),'RC.18 MPL source cannot substitute for stable 1.0');
assert.equal(findStableInstaller(release,repo)?.name,'Sontriqa-Setup-x64.exe','isolated candidate demonstrates how explicit new approval would work');
assert.equal(production.window.SontriqaReleaseValidator.inspectStableReleaseAssets(release,repo)?.name,'Sontriqa-Setup-x64.exe',
 'Exact frozen hashes pass inspection while the separate legal publication hold still blocks downloads');
const selected=inspectStableReleaseAssets(release,repo);
assert.equal(selected?.name,'Sontriqa-Setup-x64.exe','complete stable release should be downloadable');
for (const [name] of Object.entries(expectedAssets)) {
  const sparse={...release,assets:assets.filter(asset=>asset.name!==name)};
  assert.equal(inspectStableReleaseAssets(sparse,repo),null,'Missing required stable asset must block: '+name);
}
for (const critical of Object.keys(expectedAssets)) {
  const tampered=assets.map(a=>a.name===critical?{...a,digest:'sha256:'+('0'.repeat(64))}:a);
  assert.equal(inspectStableReleaseAssets({...release,assets:tampered},repo),null,'Wrong signed manifest or covered-source hash must block: '+critical);
  const absent=assets.map(a=>a.name===critical?{...a,digest:undefined}:a);
  assert.equal(inspectStableReleaseAssets({...release,assets:absent},repo),null,'Missing critical digest must block: '+critical);
}
const wrongDigest=assets.map(a=>a.name==='Sontriqa-Setup-x64.exe'?{...a,digest:'sha256:'+('0'.repeat(64))}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:wrongDigest},repo),null,'modified installer must never be linked');
const missingDigest=assets.map(a=>a.name==='Sontriqa-Setup-x64.exe'?{...a,digest:undefined}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:missingDigest},repo),null,'unverified GitHub asset digest must block');
assert.equal(inspectStableReleaseAssets({...release,tag_name:'v1.0.1'},repo),null,'next stable release requires separate hash acceptance');
assert.equal(inspectStableReleaseAssets({...release,tag_name:'1.0.0'},repo),null,'only approved exact tag may be linked');
assert.equal(inspectStableReleaseAssets({...release,draft:true},repo),null);
assert.equal(inspectStableReleaseAssets({...release,prerelease:true},repo),null);
const oldMpl=assets.filter(asset=>asset.name!=='SELECTORS_0.38.0_MPL_SOURCE.zip');
oldMpl.push({name:'SELECTORS_0.36.1_MPL_SOURCE.zip',state:'uploaded',size:100000,browser_download_url:base+'SELECTORS_0.36.1_MPL_SOURCE.zip'});
assert.equal(inspectStableReleaseAssets({...release,assets:oldMpl},repo),null,'RC.18 selectors source ZIP must never satisfy stable release gate');
assert.equal(inspectStableReleaseAssets({...release,tag_name:'v1.0.0-rc.18'},repo),null);
assert.equal(inspectStableReleaseAssets({...release,tag_name:'v1.0.0-rc.18',prerelease:false},repo),null);
assert.equal(inspectStableReleaseAssets(release,'another/sontriqa'),null,'foreign repository must not pass');
assert.equal(inspectStableReleaseAssets({...release,assets:[...assets,assets[0]]},repo),null,'duplicate names must block');
assert.equal(inspectStableReleaseAssets({...release,assets:[...assets,{
  name:'REPRO_LOCKFILES_PRIVATE.zip',state:'uploaded',size:100000,
  browser_download_url:base+'REPRO_LOCKFILES_PRIVATE.zip',digest:'sha256:'+'0'.repeat(64)
}]},repo),null,'Unreviewed private lockfile artifact must block the entire release');
assert.equal(inspectStableReleaseAssets({...release,assets:[...assets,{
  name:'EXTRA_UNREVIEWED.txt',state:'uploaded',size:1000,
  browser_download_url:base+'EXTRA_UNREVIEWED.txt',digest:'sha256:'+'0'.repeat(64)
}]},repo),null,'Unknown release asset must block the exact eleven-file manifest');
const wrongUrl=assets.map(a=>a.name==='latest.json'?{...a,browser_download_url:'https://example.invalid/latest.json'}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:wrongUrl},repo),null);
const wrongState=assets.map(a=>a.name==='Sontriqa-Setup-x64.exe'?{...a,state:'starter'}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:wrongState},repo),null);
const tooSmall=assets.map(a=>a.name==='SELECTORS_0.38.0_MPL_SOURCE.zip'?{...a,size:0}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:tooSmall},repo),null);
assert.equal(inspectStableReleaseAssets({...release,assets:null},repo),null);
console.log('Public stable release guard: complete legal assets, official URLs, prerelease/missing/unsafe cases passed.');
