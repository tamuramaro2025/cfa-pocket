import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createStudyStorage, STORAGE_KEY } from '../public/storage.js';
import { backDestination, installKeyboardLayout } from '../public/android-navigation.js';
import { schedule } from '../public/engine.js';

function localStore() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
function prefsStore() {
  const data = new Map();
  return { get: async ({ key }) => ({ value: data.get(key) ?? null }), set: async ({ key, value }) => { data.set(key, value); } };
}
const record = () => ({ progress: { q1: schedule(null, true, 'sure') }, history: [{ id: 'q1', correct: true, confidence: 'sure', day: '2026-11-10' }], bookmarks: ['q1'], readUnits: ['fixed-pricing'], goal: 6, exam: '2027-02-01' });

test('Web keeps existing key and records after a fresh storage instance', async () => {
  const local = localStore(); local.setItem(STORAGE_KEY, JSON.stringify(record()));
  const storage = createStudyStorage({ local });
  const state = await storage.load(); state.history.push({ id: 'q2', correct: false });
  await storage.save(state);
  assert.deepEqual(await createStudyStorage({ local }).load(), state);
});
test('native restart preserves answers, accuracy inputs, due dates, reading and settings without localStorage', async () => {
  const preferences = prefsStore();
  const local = { getItem: () => { throw new Error('unavailable'); }, setItem: () => { throw new Error('unavailable'); } };
  const first = createStudyStorage({ local, preferences });
  assert.equal(await first.save(record()), true);
  const restored = await createStudyStorage({ local, preferences }).load();
  assert.deepEqual(restored, record());
  assert.equal(restored.history.filter(item => item.correct).length / restored.history.length, 1);
  assert.equal(restored.progress.q1.attempts, 1);
});
test('native migration copies legacy WebView data without deleting it and never replaces native records', async () => {
  const local = localStore(), preferences = prefsStore();
  local.setItem(STORAGE_KEY, JSON.stringify(record()));
  const storage = createStudyStorage({ local, preferences });
  assert.deepEqual(await storage.load(), record());
  assert.equal(local.getItem(STORAGE_KEY), JSON.stringify(record()));
  await storage.save({ ...record(), goal: 9 });
  assert.equal((await storage.load()).goal, 9);
});
test('native writes are ordered immutable snapshots and failures are visible and retryable', async () => {
  const writes = []; let fail = true; let errors = 0;
  const preferences = { set: async ({ value }) => { if (fail) { fail = false; throw Error('disk'); } writes.push(JSON.parse(value)); } };
  const storage = createStudyStorage({ local: localStore(), preferences, onError: () => errors++ });
  const state = { goal: 3 };
  const first = storage.save(state); state.goal = 6;
  const second = storage.save(state); state.goal = 9;
  const third = storage.save(state); state.goal = 100;
  assert.equal(await first, false); assert.equal(await second, true); await third; await storage.flush();
  assert.deepEqual(writes, [{ goal: 6 }, { goal: 9 }]); assert.equal(errors, 1);
});
test('corrupt native records are not silently overwritten with an empty state', async () => {
  let writes = 0;
  const storage = createStudyStorage({ local: localStore(), preferences: { get: async () => ({ value: 'broken' }), set: async () => writes++ } });
  await assert.rejects(storage.load()); assert.equal(writes, 0);
});
test('Android back maps study to its lesson, lessons to guide and root to minimize', () => {
  assert.equal(backDestination('study', 'fixed-pricing'), 'lesson/fixed-pricing');
  assert.equal(backDestination('result', null), 'home');
  assert.equal(backDestination('lesson/fixed-pricing'), 'curriculum');
  assert.equal(backDestination('settings'), 'home'); assert.equal(backDestination('home'), null);
});
test('native keyboard show/hide restores navigation even when the input keeps focus', () => {
  const events = {}, classes = new Set(); let scrolls = 0;
  const doc = { documentElement: { classList: { add: value => classes.add(value), remove: value => classes.delete(value) } }, activeElement: { tagName: 'INPUT', scrollIntoView: () => scrolls++ } };
  installKeyboardLayout({ CFA_NATIVE: { keyboard: { addListener: (type, fn) => { events[type] = fn; } } } }, doc);
  events.keyboardDidShow(); assert.ok(classes.has('keyboard-open')); assert.equal(scrolls, 1);
  events.keyboardDidHide(); assert.ok(!classes.has('keyboard-open')); assert.equal(doc.activeElement.tagName, 'INPUT');
});
test('Android has local bundled assets, no live URL, no cleartext or cloud backup', async () => {
  const config = JSON.parse(await readFile(new URL('../capacitor.config.json', import.meta.url)));
  assert.equal(config.webDir, 'www'); assert.equal(config.server?.url, undefined);
  assert.equal(config.android.allowMixedContent, false);
  const manifest = await readFile(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
  assert.match(manifest, /allowBackup="false"/); assert.match(manifest, /windowSoftInputMode="adjustResize"/);
  assert.doesNotMatch(manifest, /usesCleartextTraffic="true"|WRITE_EXTERNAL_STORAGE/);
});
