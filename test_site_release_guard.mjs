import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('site/release-validator.js','utf8');
const context={window:{}};
// The live site must stay fail-closed until a patched signed 1.0 is accepted.
assert.ok(source.includes('const releaseHold=true;'),'old vulnerable binary must be blocked');
const production={window:{}};
vm.runInNewContext(source,production,{timeout:2000});
// Only the isolated test scenario opens the guard to cover all asset validation branches.
const candidateSource=source
  .replace('const releaseHold=true;','const releaseHold=false;')
  .replace('const securityFixApproved=false;','const securityFixApproved=true;')
  .replace("const approvedInstallerSHA256='PENDING_REBUILT_WINDOWS_INSTALLER';","const approvedInstallerSHA256='"+'1'.repeat(64)+"';")
  .replace("const approvedManifestSHA256='PENDING_SIGNED_MANIFEST';","const approvedManifestSHA256='"+'2'.repeat(64)+"';")
  .replace("const approvedMplSourceSHA256='PENDING_FULL_MPL_SOURCE_ARCHIVE';","const approvedMplSourceSHA256='"+'3'.repeat(64)+"';");
vm.runInNewContext(candidateSource,context,{timeout:2000});
const {findStableInstaller,inspectStableReleaseAssets,expectedAssets,approvedStableTag,approvedInstallerSHA256,securityFixApproved}=context.window.SontriqaReleaseValidator;
assert.equal(securityFixApproved,true,'Only isolated synthetic acceptance exercise may lift the guard');
assert.match(source,/if\(releaseHold \|\| !securityFixApproved\)return null/,'releaseHold must participate in the real download decision');
const repo='Crossbill-prog/sontriqa';
const tag='v1.0.0';
assert.equal(approvedStableTag,tag);
assert.equal(approvedInstallerSHA256,'1'.repeat(64));
const base='https://github.com/'+repo+'/releases/download/'+tag+'/';
const assets=Object.entries(expectedAssets).map(([name,minSize])=>({
  name,state:'uploaded',size:minSize+1000,browser_download_url:base+name,
  ...(name==='Sontriqa-Setup-x64.exe'?{digest:'sha256:'+approvedInstallerSHA256}:{}),
  ...(name==='latest.json'?{digest:'sha256:'+'2'.repeat(64)}:{}),
  ...(name==='SELECTORS_0.38.0_MPL_SOURCE.zip'?{digest:'sha256:'+'3'.repeat(64)}:{})
}));
const release={draft:false,prerelease:false,tag_name:tag,assets};
assert.equal(production.window.SontriqaReleaseValidator.findStableInstaller(release,repo),null,'production must not link vulnerable 2.11.1 binary even if complete release is accidentally published');
assert.ok(Object.hasOwn(expectedAssets,'SELECTORS_0.38.0_MPL_SOURCE.zip'),'stable 1.0 must require its exact MPL source');
assert.ok(!Object.hasOwn(expectedAssets,'SELECTORS_0.36.1_MPL_SOURCE.zip'),'RC.18 MPL source cannot substitute for stable 1.0');
assert.equal(findStableInstaller(release,repo)?.name,'Sontriqa-Setup-x64.exe','isolated candidate demonstrates how explicit new approval would work');
assert.equal(production.window.SontriqaReleaseValidator.inspectStableReleaseAssets(release,repo),null,'production inspection must refuse pending hashes, independently of button hold');
const selected=inspectStableReleaseAssets(release,repo);
assert.equal(selected?.name,'Sontriqa-Setup-x64.exe','complete stable release should be downloadable');
for (const [name] of Object.entries(expectedAssets)) {
  const sparse={...release,assets:assets.filter(asset=>asset.name!==name)};
  assert.equal(inspectStableReleaseAssets(sparse,repo),null,'Missing required stable asset must block: '+name);
}
for (const critical of ['latest.json','SELECTORS_0.38.0_MPL_SOURCE.zip']) {
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
const wrongUrl=assets.map(a=>a.name==='latest.json'?{...a,browser_download_url:'https://example.invalid/latest.json'}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:wrongUrl},repo),null);
const wrongState=assets.map(a=>a.name==='Sontriqa-Setup-x64.exe'?{...a,state:'starter'}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:wrongState},repo),null);
const tooSmall=assets.map(a=>a.name==='SELECTORS_0.38.0_MPL_SOURCE.zip'?{...a,size:0}:a);
assert.equal(inspectStableReleaseAssets({...release,assets:tooSmall},repo),null);
assert.equal(inspectStableReleaseAssets({...release,assets:null},repo),null);
console.log('Public stable release guard: complete legal assets, official URLs, prerelease/missing/unsafe cases passed.');
