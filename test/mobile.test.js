import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, readdir } from 'node:fs/promises';
import { validateBackup } from '../public/backup.js';

test('Android manifest has PNG install icons and scoped launch links',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../public/manifest.webmanifest',import.meta.url),'utf8'));
  assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'/#home');assert.equal(manifest.scope,'/');
  for(const size of [192,512])assert.ok(manifest.icons.some(icon=>icon.sizes===`${size}x${size}`&&icon.type==='image/png'&&icon.purpose==='any'));
  assert.ok(manifest.icons.some(icon=>icon.purpose==='maskable'));
  for(const icon of manifest.icons){
    const bytes=await readFile(new URL('../public'+icon.src,import.meta.url));
    assert.equal(bytes.readUInt32BE(16),Number(icon.sizes.split('x')[0]));assert.equal(bytes.readUInt32BE(20),Number(icon.sizes.split('x')[1]));
  }
});

test('offline manifest contains every app module, not user records or auth routes',async()=>{
  const code=await readFile(new URL('../public/precache-manifest.js',import.meta.url),'utf8');const self={};vm.runInNewContext(code,{self});
  const files=await readdir(new URL('../public/',import.meta.url));
  for(const name of files.filter(name=>name.endsWith('.js')&&!['sw.js','precache-manifest.js'].includes(name)))assert.ok(self.CFA_PRECACHE.includes('/'+name),name);
  assert.ok(self.CFA_PRECACHE.includes('/'));
  assert.ok(self.CFA_PRECACHE.includes('/index.html'));
  assert.ok(!self.CFA_PRECACHE.some(url=>/signin|callback|backup|\.local/.test(url)&&url!=='/backup.js'));
  assert.match(self.CFA_CACHE_VERSION,/^[a-f0-9]{16}$/);
});

test('backup validation reconstructs known data and rejects invalid values',()=>{
  const original={version:1,progress:{q1:{stage:1,due:'2026-11-10',attempts:2,correct:1,lastCorrect:true,lastConfidence:'sure'}},history:[{id:'q1',day:'2026-11-09',at:'2026-11-09T12:00:00.000Z',correct:true,confidence:'sure'}],bookmarks:['q1','q1','unknown'],readUnits:['quant-probability'],exam:'',goal:6};
  const result=validateBackup(original,['q1'],['quant-probability']);
  assert.equal(result.state.history.length,1);assert.deepEqual(result.state.bookmarks,['q1']);assert.equal(result.state.goal,6);
  assert.throws(()=>validateBackup({...original,version:99},['q1'],[]));
  assert.throws(()=>validateBackup({...original,exam:'2026-02-30'},['q1'],[]));
  assert.throws(()=>validateBackup({...original,progress:{q1:{...original.progress.q1,correct:3}}},['q1'],[]));
  assert.throws(()=>validateBackup({...original,history:[{...original.history[0],correct:'true'}]},['q1'],[]));
  const unknown=validateBackup({...original,history:[{id:'old'}]},['q1'],[]);
  assert.equal(unknown.skipped,1);assert.equal(unknown.state.history.length,0);
});

async function workerHarness(failScript=false){
  const handlers={},stores=new Map(),origin='https://pocket.test';let failed=false;let skip=false;
  const caches={
    async open(name){if(!stores.has(name))stores.set(name,new Map());const data=stores.get(name);return{async put(key,response){data.set(key,response.clone());},async match(key){return data.get(key)?.clone();}};},
    async keys(){return[...stores.keys()];},async delete(name){return stores.delete(name);}
  };
  const self={location:{origin},clients:{claim:async()=>{}},skipWaiting:()=>{skip=true;},addEventListener:(name,fn)=>{handlers[name]=fn;}};
  class ScopedRequest extends Request{constructor(url,options){super(new URL(url,origin),options);}}
  const fetch=async request=>{
    if(failed)throw new Error('offline');
    if(failScript&&new URL(request.url).pathname==='/app.js')return new Response('<html>signin</html>',{headers:{'Content-Type':'text/html'}});
    return new Response('asset:'+new URL(request.url).pathname,{headers:{'Content-Type':request.url.endsWith('.js')?'text/javascript':'text/html'}});
  };
  vm.runInNewContext(await readFile(new URL('../public/sw.js',import.meta.url),'utf8'),{
    self,caches,fetch,Request:ScopedRequest,Response,URL,
    importScripts:()=>{self.CFA_CACHE_VERSION='test';self.CFA_PRECACHE=['/','/index.html','/app.js','/questions.js'];}
  });
  return{handlers,stores,caches,setOffline:()=>{failed=true;},skipped:()=>skip};
}
test('service worker preserves a consistent offline app and does not intercept authentication',async()=>{
  const h=await workerHarness();let task;await h.caches.open('unrelated-cache');await h.caches.open('cfa-pocket-assets-old');
  h.handlers.install({waitUntil:p=>{task=p;}});await task;assert.equal(h.skipped(),false);
  h.handlers.activate({waitUntil:p=>{task=p;}});await task;
  assert.ok(h.stores.has('unrelated-cache'));assert.ok(!h.stores.has('cfa-pocket-assets-old'));
  h.setOffline();let response;
  h.handlers.fetch({request:new Request('https://pocket.test/app.js'),respondWith:p=>{response=p;}});
  assert.match(await(await response).text(),/asset:\/app.js/);
  let intercepted=false;
  h.handlers.fetch({request:new Request('https://pocket.test/signin-with-chatgpt'),respondWith:()=>{intercepted=true;}});assert.equal(intercepted,false);
  let status;
  h.handlers.message({data:{type:'OFFLINE_STATUS'},ports:[{postMessage:value=>{status=value;}}],waitUntil:p=>{task=p;}});await task;assert.equal(status.ready,true);
  h.stores.get('cfa-pocket-assets-test').delete('/questions.js');
  h.handlers.message({data:{type:'OFFLINE_STATUS'},ports:[{postMessage:value=>{status=value;}}],waitUntil:p=>{task=p;}});await task;assert.equal(status.ready,false);
});
test('failed offline installation does not replace the previous cache',async()=>{
  const h=await workerHarness(true);await h.caches.open('cfa-pocket-assets-old');let task;
  h.handlers.install({waitUntil:p=>{task=p;}});await assert.rejects(task,/Unexpected script/);
  assert.ok(h.stores.has('cfa-pocket-assets-old'));assert.ok(!h.stores.has('cfa-pocket-assets-test'));
});
