import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const validator=fs.readFileSync('site/release-validator.js','utf8');
const app=fs.readFileSync('site/app.js','utf8');
function simulate(releaseGuardSource) {
  let requests=0;
  const elements=new Map([
    ['download',{textContent:'',classList:{remove(){}},removeAttribute(){}}],
    ['release-status',{textContent:''}],['releases',{hidden:true}],
    ['copy-email',{addEventListener(){}}],['copy-status',{textContent:''}]
  ]);
  const window={SONTRIQA_REPOSITORY:'Crossbill-prog/sontriqa',addEventListener(){}};
  const ctx={window,document:{getElementById(id){return elements.get(id)}},
    fetch(){requests++;return Promise.resolve({ok:false})},
    navigator:{clipboard:{writeText:async()=>{}}},console};
  if(releaseGuardSource)vm.runInNewContext(releaseGuardSource,ctx,{timeout:2000});
  vm.runInNewContext(app,ctx,{timeout:2000});
  return {requests,button:elements.get('download'),window};
}
const held=simulate(validator);
assert.equal(held.window.SontriqaReleaseValidator.publicReleaseEnabled,false);
assert.equal(held.requests,0,'No visitor GitHub API calls while the public release is held');
assert.equal(held.button.href,undefined,'No download URL while held');
const permitted=simulate(validator.replace('const releaseHold=true;','const releaseHold=false;'));
assert.equal(permitted.requests,1,'Only an approved release can trigger GitHub API lookup');
const denied=simulate(validator.replace('const securityFixApproved=true;','const securityFixApproved=false;'));
assert.equal(denied.requests,0,'Failed security approval also forbids GitHub release lookup');
assert.equal(simulate(null).requests,0,'Missing validator must fail closed');
console.log('Website release API privacy: zero requests before approval; fail-closed cases OK.');
