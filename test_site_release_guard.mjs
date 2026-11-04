import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('site/release-validator.js','utf8');
const context={window:{}};
vm.runInNewContext(source,context,{timeout:2000});
const {findStableInstaller,expectedAssets}=context.window.SontriqaReleaseValidator;
const repo='Crossbill-prog/sontriqa';
const tag='v1.0.0';
const base='https://github.com/'+repo+'/releases/download/'+tag+'/';
const assets=Object.entries(expectedAssets).map(([name,minSize])=>({
  name,state:'uploaded',size:minSize+1000,browser_download_url:base+name
}));
const release={draft:false,prerelease:false,tag_name:tag,assets};
const selected=findStableInstaller(release,repo);
assert.equal(selected?.name,'Sontriqa-Setup-x64.exe','complete stable release should be downloadable');
for (const [name] of Object.entries(expectedAssets)) {
  const sparse={...release,assets:assets.filter(asset=>asset.name!==name)};
  assert.equal(findStableInstaller(sparse,repo),null,'Missing required stable asset must block: '+name);
}
assert.equal(findStableInstaller({...release,draft:true},repo),null);
assert.equal(findStableInstaller({...release,prerelease:true},repo),null);
assert.equal(findStableInstaller({...release,tag_name:'v1.0.0-rc.18'},repo),null);
assert.equal(findStableInstaller({...release,tag_name:'v1.0.0-rc.18',prerelease:false},repo),null);
assert.equal(findStableInstaller(release,'another/sontriqa'),null,'foreign repository must not pass');
assert.equal(findStableInstaller({...release,assets:[...assets,assets[0]]},repo),null,'duplicate names must block');
const wrongUrl=assets.map(a=>a.name==='latest.json'?{...a,browser_download_url:'https://example.invalid/latest.json'}:a);
assert.equal(findStableInstaller({...release,assets:wrongUrl},repo),null);
const wrongState=assets.map(a=>a.name==='Sontriqa-Setup-x64.exe'?{...a,state:'starter'}:a);
assert.equal(findStableInstaller({...release,assets:wrongState},repo),null);
const tooSmall=assets.map(a=>a.name==='SELECTORS_0.36.1_MPL_SOURCE.zip'?{...a,size:0}:a);
assert.equal(findStableInstaller({...release,assets:tooSmall},repo),null);
assert.equal(findStableInstaller({...release,assets:null},repo),null);
console.log('Public stable release guard: complete legal assets, official URLs, prerelease/missing/unsafe cases passed.');
