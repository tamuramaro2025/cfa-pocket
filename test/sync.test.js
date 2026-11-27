import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeStudyStates,
  extractGistId,
  encodePairingCode,
  decodePairingCode,
  createGistClient,
  createSyncManager,
  SYNC_FILENAME
} from '../public/sync.js';
import { createStudyStorage, SYNC_CONFIG_KEY } from '../public/storage.js';
import { schedule } from '../public/engine.js';

const IDS = {
  questionIds: ['q1', 'q2', 'q3'],
  unitIds: ['u1', 'u2']
};

function memoryStore() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('mergeStudyStates combines answers from PC and phone and rebuilds review schedule', () => {
  const pc = {
    progress: { q1: schedule(null, true, 'sure', '2026-11-20') },
    history: [{ id: 'q1', correct: true, confidence: 'sure', day: '2026-11-20', at: '2026-11-20T09:00:00.000Z' }],
    bookmarks: ['q1'],
    readUnits: ['u1'],
    exam: '2027-05-15',
    goal: 6,
    meta: {
      bookmarksAt: { q1: { value: true, at: '2026-11-20T09:01:00.000Z' } },
      readUnitsAt: { u1: { value: true, at: '2026-11-20T09:02:00.000Z' } },
      goalAt: '2026-11-20T09:03:00.000Z',
      examAt: '2026-11-20T09:03:00.000Z',
      resetAt: '',
      updatedAt: '2026-11-20T09:03:00.000Z'
    }
  };
  const phone = {
    progress: {
      q1: schedule(null, true, 'sure', '2026-11-21'),
      q2: schedule(null, false, 'unsure', '2026-11-21')
    },
    history: [
      { id: 'q1', correct: true, confidence: 'sure', day: '2026-11-21', at: '2026-11-21T08:00:00.000Z' },
      { id: 'q2', correct: false, confidence: 'unsure', day: '2026-11-21', at: '2026-11-21T08:05:00.000Z' }
    ],
    bookmarks: ['q2'],
    readUnits: ['u2'],
    exam: '',
    goal: 9,
    meta: {
      bookmarksAt: { q2: { value: true, at: '2026-11-21T08:06:00.000Z' } },
      readUnitsAt: { u2: { value: true, at: '2026-11-21T08:07:00.000Z' } },
      goalAt: '2026-11-21T08:08:00.000Z',
      examAt: '',
      resetAt: '',
      updatedAt: '2026-11-21T08:08:00.000Z'
    }
  };

  const merged = mergeStudyStates(pc, phone, IDS);
  assert.equal(merged.history.length, 3);
  // q1 answered sure twice (Nov 20 -> stage 1, Nov 21 -> stage 2, +7 days = Nov 28)
  assert.equal(merged.progress.q1.attempts, 2);
  assert.equal(merged.progress.q1.stage, 2);
  assert.equal(merged.progress.q1.due, '2026-11-28');
  assert.equal(merged.progress.q2.attempts, 1);
  assert.equal(merged.progress.q2.due, '2026-11-22');
  assert.deepEqual(merged.bookmarks, ['q1', 'q2']);
  assert.deepEqual(merged.readUnits, ['u1', 'u2']);
  assert.equal(merged.goal, 9);
  assert.equal(merged.exam, '2027-05-15');

  // Re-merging identical history does not duplicate entries
  const again = mergeStudyStates(merged, phone, IDS);
  assert.equal(again.history.length, 3);
});

test('mergeStudyStates respects latest bookmark toggle and resetAt cutoff', () => {
  const older = {
    progress: { q1: schedule(null, true, 'sure', '2026-11-10') },
    history: [{ id: 'q1', correct: true, confidence: 'sure', day: '2026-11-10', at: '2026-11-10T10:00:00.000Z' }],
    bookmarks: ['q1'],
    readUnits: ['u1'],
    exam: '',
    goal: 3,
    meta: {
      bookmarksAt: { q1: { value: true, at: '2026-11-10T10:00:00.000Z' } },
      readUnitsAt: { u1: { value: true, at: '2026-11-10T10:00:00.000Z' } },
      goalAt: '',
      examAt: '',
      resetAt: '',
      updatedAt: '2026-11-10T10:00:00.000Z'
    }
  };
  const removed = {
    ...older,
    bookmarks: [],
    meta: {
      ...older.meta,
      bookmarksAt: { q1: { value: false, at: '2026-11-11T10:00:00.000Z' } },
      updatedAt: '2026-11-11T10:00:00.000Z'
    }
  };
  const mergedToggle = mergeStudyStates(older, removed, IDS);
  assert.deepEqual(mergedToggle.bookmarks, []);

  const resetState = {
    progress: {},
    history: [{ id: 'q2', correct: true, confidence: 'sure', day: '2026-11-22', at: '2026-11-22T12:00:00.000Z' }],
    bookmarks: [],
    readUnits: [],
    exam: '',
    goal: 3,
    meta: {
      bookmarksAt: {},
      readUnitsAt: {},
      goalAt: '',
      examAt: '',
      resetAt: '2026-11-22T00:00:00.000Z',
      updatedAt: '2026-11-22T12:00:00.000Z'
    }
  };
  const mergedReset = mergeStudyStates(older, resetState, IDS);
  assert.deepEqual(mergedReset.history.map(h => h.id), ['q2']);
  assert.equal(mergedReset.progress.q1, undefined);
  assert.deepEqual(mergedReset.bookmarks, []);
  assert.deepEqual(mergedReset.readUnits, []);
});

test('extractGistId and pairing code round-trip cleanly and reject invalid input', () => {
  const gistId = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
  assert.equal(extractGistId(gistId), gistId);
  assert.equal(extractGistId(`https://gist.github.com/user/${gistId}`), gistId);
  assert.equal(extractGistId('not-a-gist'), '');

  const code = encodePairingCode({ gistId, token: 'test-placeholder-token' });
  assert.ok(code.startsWith('CFAPOCKET1:'));
  assert.deepEqual(decodePairingCode(code), { gistId, token: 'test-placeholder-token' });
  assert.throws(() => decodePairingCode('invalid-code'));
});

test('createGistClient creates private gists, fetches, updates, and surfaces clear HTTP errors', async () => {
  const calls = [];
  const sampleGistId = '0123456789abcdef0123456789abcdef';
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init.method, body: init.body ? JSON.parse(init.body) : null });
    if (init.method === 'POST') {
      return new Response(JSON.stringify({ id: sampleGistId, updated_at: '2026-11-23T01:00:00.000Z' }), { status: 201 });
    }
    if (init.method === 'GET' && url.includes('bad401')) return new Response('{}', { status: 401 });
    if (init.method === 'GET') {
      return new Response(JSON.stringify({
        updated_at: '2026-11-23T02:00:00.000Z',
        files: { [SYNC_FILENAME]: { content: JSON.stringify({ version: 1, progress: {}, history: [], bookmarks: [], readUnits: [], exam: '', goal: 3 }) } }
      }), { status: 200 });
    }
    return new Response(JSON.stringify({ updated_at: '2026-11-23T03:00:00.000Z' }), { status: 200 });
  };

  const client = createGistClient({ fetchImpl });
  const created = await client.createGist('test-placeholder-token', { version: 1, progress: {}, history: [], bookmarks: [] });
  assert.equal(created.gistId, sampleGistId);
  assert.equal(calls[0].body.public, false);
  assert.ok(calls[0].body.files[SYNC_FILENAME]);

  const fetched = await client.fetchPayload('test-placeholder-token', sampleGistId);
  assert.equal(fetched.payload.version, 1);

  await assert.rejects(() => client.fetchPayload('test-placeholder-token', 'bad401'), /トークン/);
});

test('createSyncManager syncs two devices, merges concurrent offline progress, and never leaks token in payload', async () => {
  let remoteDoc = null;
  const pushedBodies = [];
  const sampleGistId = 'abcdef0123456789abcdef0123456789';
  const client = {
    async createGist(_tok, payload) {
      pushedBodies.push(JSON.stringify(payload));
      remoteDoc = payload;
      return { gistId: sampleGistId, updatedAt: '2026-11-23T01:00:00.000Z' };
    },
    async fetchPayload() {
      return { payload: remoteDoc ? JSON.parse(JSON.stringify(remoteDoc)) : null, updatedAt: '2026-11-23T02:00:00.000Z' };
    },
    async updatePayload(_tok, _id, payload) {
      pushedBodies.push(JSON.stringify(payload));
      remoteDoc = payload;
      return { updatedAt: '2026-11-23T03:00:00.000Z' };
    }
  };

  let pcState = {
    progress: { q1: schedule(null, true, 'sure', '2026-11-23') },
    history: [{ id: 'q1', correct: true, confidence: 'sure', day: '2026-11-23', at: '2026-11-23T01:00:00.000Z' }],
    bookmarks: ['q1'],
    readUnits: [],
    exam: '',
    goal: 3
  };
  let phoneState = {
    progress: { q2: schedule(null, true, 'maybe', '2026-11-23') },
    history: [{ id: 'q2', correct: true, confidence: 'maybe', day: '2026-11-23', at: '2026-11-23T02:00:00.000Z' }],
    bookmarks: ['q2'],
    readUnits: ['u1'],
    exam: '2027-08-01',
    goal: 6
  };

  const pcSync = createSyncManager({
    client,
    configStorage: createStudyStorage({ local: memoryStore(), key: SYNC_CONFIG_KEY }),
    getState: () => pcState,
    applyMergedState: async next => { pcState = next; },
    ...IDS
  });
  const phoneSync = createSyncManager({
    client,
    configStorage: createStudyStorage({ local: memoryStore(), key: SYNC_CONFIG_KEY }),
    getState: () => phoneState,
    applyMergedState: async next => { phoneState = next; },
    ...IDS
  });

  // 1. PC connects and creates a new private Gist
  const created = await pcSync.connect({ token: 'test-placeholder-secret' });
  assert.equal(created.created, true);
  assert.equal(created.gistId, sampleGistId);

  // 2. Phone connects using pairing code -> merges both devices and pushes merged state
  const pairingCode = encodePairingCode({ gistId: created.gistId, token: 'test-placeholder-secret' });
  const linked = await phoneSync.connect(decodePairingCode(pairingCode));
  assert.equal(linked.created, false);
  assert.equal(phoneState.history.length, 2);
  assert.deepEqual(phoneState.bookmarks, ['q1', 'q2']);

  // 3. PC syncs -> pulls phone's progress automatically
  const res = await pcSync.syncNow();
  assert.equal(res.ok, true);
  assert.equal(res.localChanged, true);
  assert.equal(pcState.history.length, 2);
  assert.equal(pcState.exam, '2027-08-01');
  assert.equal(pcState.goal, 6);

  // 4. Token must never appear in any synced payload
  for (const body of pushedBodies) {
    assert.ok(!body.includes('test-placeholder-secret'));
  }
});
