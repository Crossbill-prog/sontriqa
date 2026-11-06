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
const approved=simulate(validator);
assert.equal(approved.window.SontriqaReleaseValidator.publicReleaseEnabled,true);
assert.equal(approved.requests,1,'Only published approved stable may trigger the GitHub API lookup');
const held=simulate(validator.replace('const releaseHold=false;','const releaseHold=true;'));
assert.equal(held.window.SontriqaReleaseValidator.publicReleaseEnabled,false);
assert.equal(held.requests,0,'Emergency hold must prevent release API requests');
assert.equal(held.button.href,undefined,'No download URL while held');
const denied=simulate(validator.replace('const securityFixApproved=true;','const securityFixApproved=false;'));
assert.equal(denied.requests,0,'Failed security approval also forbids GitHub release lookup');
assert.equal(simulate(null).requests,0,'Missing validator must fail closed');
console.log('Website release API: approved stable lookup, emergency hold, security veto and fail-closed cases OK.');
