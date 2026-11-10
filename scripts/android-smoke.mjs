// Local-only QA. Explicit emulator serial prevents touching a connected phone.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { questions } from '../public/questions.js';
const serial = process.argv[2];
if (!/^emulator-\d+$/.test(serial || '')) throw Error('Usage: node scripts/android-smoke.mjs emulator-5554');
const adb = process.env.ADB || `${process.env.HOME}/Library/Android/sdk/platform-tools/adb`;
const run = (...args) => execFileSync(adb, ['-s', serial, ...args], { encoding: 'utf8', timeout: 20000 }).trim();
const appId = 'jp.cfapocket.study';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check, description) {
  for (let i = 0; i < 60; i++) { if (await check()) return; await sleep(250); }
  throw Error(`Timed out: ${description}`);
}
async function connect() {
  let pid;
  await until(() => { try { pid = run('shell', 'pidof', appId); return !!pid; } catch { return false; } }, 'Android process startup');
  run('forward', 'tcp:9223', `localabstract:webview_devtools_remote_${pid}`);
  let targets;
  await until(async () => { try { targets = await (await fetch('http://127.0.0.1:9223/json')).json(); return targets.some(t => t.url.startsWith('https://localhost')); } catch { return false; } }, 'WebView debugger');
  const target = targets.find(t => t.url.startsWith('https://localhost'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let id = 0; const waiting = new Map();
  ws.addEventListener('message', ({ data }) => {
    const event = JSON.parse(data);
    if (!event.id) return;
    const callback = waiting.get(event.id); waiting.delete(event.id); callback?.(event);
  });
  const send = (method, params) => new Promise((resolve, reject) => {
    const current = ++id;
    const timeout = setTimeout(() => { waiting.delete(current); reject(Error(`CDP timeout: ${method}`)); }, 10000);
    waiting.set(current, event => { clearTimeout(timeout); event.error ? reject(Error(JSON.stringify(event.error))) : resolve(event.result); });
    ws.send(JSON.stringify({ id: current, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text + ': ' + result.result.description);
    return result.result.value;
  };
  await until(() => evaluate("!!document.querySelector('h1') && !!window.CFA_NATIVE?.preferences"), 'app startup');
  return { evaluate, send, close: () => ws.close() };
}

run('shell', 'am', 'start', '-n', `${appId}/.MainActivity`);
let cdp = await connect();
const state = () => cdp.evaluate("(async()=>JSON.parse((await window.CFA_NATIVE.preferences.get({key:'cfa-pocket-v1'})).value))()");
const before = await state();
const count = before?.history?.length || 0;
await cdp.evaluate("location.hash='home'");
await cdp.evaluate("document.querySelector('[data-action=start]').click()");
for (let i = 0; i < 2; i++) {
  await until(() => cdp.evaluate("!!document.querySelector('.question-text')"), 'question');
  const prompt = await cdp.evaluate("document.querySelector('.question-text').textContent");
  const q = questions.find(q => q.prompt === prompt); assert.ok(q, 'known bundled question');
  const choice = i === 0 ? q.answer : (q.answer + 1) % 3;
  await cdp.evaluate(`document.querySelector('[data-action=choose][data-choice="${choice}"]').click();document.querySelector('[data-action=check]').click()`);
  await cdp.evaluate("document.querySelector('[data-action=finish][data-confidence=sure]').click()");
  await until(async () => (await state())?.history?.length === count + i + 1, 'saved answer');
}
const expected = await state();
assert.equal(expected.history.at(-2).correct, true); assert.equal(expected.history.at(-1).correct, false);
cdp.close();
run('shell', 'am', 'force-stop', appId);
run('shell', 'am', 'start', '-n', `${appId}/.MainActivity`);
cdp = await connect();
assert.deepEqual(await state(), expected, 'real force-stop/relaunch must preserve all records');
await cdp.evaluate("location.hash='stats'");
await until(() => cdp.evaluate("document.querySelector('h1')?.textContent==='学習記録'"), 'stats');
const actual = await cdp.evaluate("[...document.querySelectorAll('.metrics .big-number')].map(x=>x.textContent.trim())");
const accuracy = Math.round(expected.history.filter(h => h.correct).length / expected.history.length * 100);
assert.equal(actual[1], accuracy + '%');
await cdp.send('Network.enable', {});
await cdp.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
await cdp.send('Page.reload', {});
await until(() => cdp.evaluate("document.querySelector('h1')?.textContent==='学習記録'"), 'offline bundled startup');
assert.deepEqual(await state(), expected, 'offline startup preserves native records');
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
const layouts = [];
for (const width of [360, 393, 600, 852]) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 852, deviceScaleFactor: 1, mobile: true });
  const sizes = await cdp.evaluate('({width:innerWidth,content:document.documentElement.scrollWidth})');
  assert.ok(sizes.content <= sizes.width, `no horizontal overflow at ${width}`); layouts.push(sizes);
}
await cdp.send('Emulation.clearDeviceMetricsOverride', {});
await cdp.evaluate("location.hash='lesson/fixed-pricing'");
await until(() => cdp.evaluate("!!document.querySelector('.lesson-card')"), 'lesson');
run('shell', 'input', 'keyevent', 'KEYCODE_BACK');
await until(() => cdp.evaluate("location.hash==='#curriculum'"), 'hardware back to guide');
const input = await cdp.evaluate("(()=>{const input=document.querySelector('input[name=query]');input.scrollIntoView({block:'center'});const r=input.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()");
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: input.x, y: input.y }] });
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await until(() => cdp.evaluate("document.documentElement.classList.contains('keyboard-open')"), 'native input layout');
assert.equal(await cdp.evaluate("getComputedStyle(document.querySelector('.mobile-nav')).display"), 'none');
const keyboard = run('shell', 'dumpsys', 'input_method');
const keyboardShown = /(?:mInputShown|isInputViewShown|mIsInputViewShown|inputShown)=true/.test(keyboard);
run('shell', 'input', 'keyevent', 'KEYCODE_BACK');
await until(() => cdp.evaluate("!document.documentElement.classList.contains('keyboard-open')"), 'bottom navigation restored after keyboard dismissed');
assert.notEqual(await cdp.evaluate("getComputedStyle(document.querySelector('.mobile-nav')).display"), 'none');
console.log(JSON.stringify({ platform: 'Android emulator', serial, restartPersistence: 'PASS', offlineStartup: 'PASS (WebView offline emulation)', answersAdded: 2, totalAnswers: expected.history.length, accuracy: actual[1], progressRecords: Object.keys(expected.progress).length, hardwareBack: 'PASS', keyboardLayout: 'PASS', androidImeShown: keyboardShown, layouts }, null, 2));
cdp.close(); run('forward', '--remove', 'tcp:9223');
