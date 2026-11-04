import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const index = fs.readFileSync('site/index.html','utf8');
const privacy = fs.readFileSync('site/privacy.html','utf8');
const app = fs.readFileSync('site/app.js','utf8');
assert.match(index, /data-lang="ru"/);
assert.match(index, /data-lang="en"/);
assert.match(index, /src="i18n\.js"/);
assert.match(privacy, /data-lang="ru"/);
assert.match(privacy, /data-lang="en"/);
assert.match(privacy, /src="i18n\.js"/);
assert.match(app, /setStatusMessage/);

function createMock(saved) {
  const cache = new Map(saved);
  const nodes = [
    {nodeValue: 'Твой звук —', parentElement: {closest: () => null}},
    {nodeValue: 'твои правила', parentElement: {closest: () => null}},
    {nodeValue: 'Конфиденциальность', parentElement: {closest: () => null}}
  ];
  const flags = [];
  const buttons = ['ru','en'].map(lang => ({
    dataset:{lang},classList:{toggle:(n,on)=>flags.push([lang,n,on])},
    setAttribute:(n,v)=>flags.push([lang,n,v])
  }));
  const elements = new Map([['release-status', {
    isConnected: true, textContent:'',
    setAttribute(){}
  }]]);
  const listeners = {};
  const doc = {
    readyState:'complete',documentElement:{lang:'ru'},
    createTreeWalker:()=>{let index=-1;return {nextNode:()=>nodes[++index]||null};},
    querySelectorAll:(selector)=>selector.includes('site-lang')?buttons:[],
    getElementById:(id)=>elements.get(id),
    addEventListener:(event,cb)=>{listeners[event]=cb}
  };
  const storage = {getItem:(k)=>cache.get(k)??null,setItem:(k,v)=>cache.set(k,v)};
  const win = {dispatchEvent:(evt)=>{ if(evt.type==='sontriqa:language')listeners.changed=evt; }};
  const sandbox={window:win,document:doc,localStorage:storage,NodeFilter:{SHOW_TEXT:4},CustomEvent:class CustomEvent{constructor(type,opts){this.type=type;this.detail=opts.detail}}};
  vm.runInNewContext(fs.readFileSync('site/i18n.js','utf8'),sandbox,{filename:'site/i18n.js'});
  return {win,doc,cache,nodes,elements,flags};
}
const publicRcWarning="Публичная RC.18 использует Tauri 2.11.5, входящую в диапазон известной уязвимости GHSA-w28w-mhc8-qvjv. Возможность эксплуатации именно в Sontriqa не подтверждена; для новых установок дождитесь исправленной стабильной сборки.";
const publicRcWarningEnglish="The public RC.18 uses Tauri 2.11.5, which falls within the affected versions for GHSA-w28w-mhc8-qvjv. Exploitability in Sontriqa is not established; for new installations, wait for the patched stable build.";
const first=createMock();
assert.equal(first.win.SontriqaI18n.language,'ru');
assert.equal(first.nodes[0].nodeValue,'Твой звук —');
first.win.SontriqaI18n.setLanguage('en');
assert.equal(first.win.SontriqaI18n.language,'en');
assert.equal(first.win.SontriqaI18n.translate(publicRcWarning),publicRcWarningEnglish,'Security notice must translate into English');
assert.equal(first.win.SontriqaI18n.translate('Подробнее'),'Advisory details');
assert.equal(first.doc.documentElement.lang,'en');
assert.equal(first.nodes[0].nodeValue,'Your sound —');
assert.equal(first.nodes[1].nodeValue,'your rules');
assert.equal(first.nodes[2].nodeValue,'Privacy');
first.win.SontriqaI18n.dynamicText('release-status','Стабильный установщик пока не опубликован.');
assert.equal(first.elements.get('release-status').textContent,'The stable installer has not been released yet.');
assert.equal(first.cache.get('sontriqa:language:v1'),'en');
const second=createMock(first.cache);
assert.equal(second.win.SontriqaI18n.language,'en','language survives navigation');
assert.equal(second.nodes[0].nodeValue,'Your sound —');
second.win.SontriqaI18n.setLanguage('ru');
assert.equal(second.nodes[0].nodeValue,'Твой звук —');
assert.equal(second.doc.documentElement.lang,'ru');
assert.equal(second.cache.get('sontriqa:language:v1'),'ru');
console.log('Site localization: RU default, EN switch, persisted preference, privacy and release messages OK.');
