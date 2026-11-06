/**
 * Deterministic, dependency-free build entrypoint for Cloudflare Pages.
 * Uses the same protected static site as the legacy GitHub Pages workflow.
 * Never enables the stable download, signs files or publishes any release.
 */
import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync} from 'node:fs';

const repository='Crossbill-prog/sontriqa';
function run(script,args=[]) {
  const result=spawnSync(process.execPath,[script,...args],{
    cwd:process.cwd(),stdio:'inherit',timeout:120000
  });
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(`Failed: ${script} (${result.status ?? result.signal})`);
}
run('scripts/generate-site-config.mjs',[repository,'site/config.js']);
for(const test of [
  'test_site.mjs','test_site_i18n.mjs','test_site_release_guard.mjs',
  'test_site_no_pre_release_network.mjs'
])run(test);
for(const file of ['index.html','config.js','app.js','i18n.js','release-validator.js','privacy.html','open-source.html']){
  if(!existsSync(`site/${file}`))throw Error('Missing static site file: '+file);
}
const guard=readFileSync('site/release-validator.js','utf8');
if(!guard.includes('const releaseHold=true;'))throw Error('Stable download legal hold must be enabled');
if(!guard.includes('if(releaseHold || !securityFixApproved)return null;')){
  throw Error('Stable download must remain fail-closed');
}
const files=readdirSync('site',{recursive:true});
if(files.some(p=>/(?:^|[/\\])(?:\.env|\.git|REPRO_LOCKFILES_PRIVATE\.zip)(?:$|[/\\])/i.test(p) ||
  /\.(?:pem|p12|pfx|key|exe)$/i.test(p))){
  throw Error('Unexpected private key, executable, or reproducibility artifact in static output');
}
console.log('Cloudflare Pages static output ready: site/ — 11-asset gate and legal hold verified.');
