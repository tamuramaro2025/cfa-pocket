import { schedule } from './engine.js';
import { validateBackup } from './backup.js';

export const SYNC_FILENAME = 'cfa-pocket-sync.json';
const GIST_API_BASE = 'https://api.github.com/gists';

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validIso = value => typeof value === 'string' && value.length >= 20 && !Number.isNaN(Date.parse(value));
const maxIso = (a, b) => (!a ? b || '' : !b ? a : a >= b ? a : b);

export function emptyMeta() {
  return {
    bookmarksAt: {},
    readUnitsAt: {},
    goalAt: '',
    examAt: '',
    resetAt: '',
    updatedAt: ''
  };
}

export function sanitizeMeta(raw, questionSet, unitSet) {
  const meta = emptyMeta();
  if (!isRecord(raw)) return meta;
  if (isRecord(raw.bookmarksAt)) {
    for (const [id, entry] of Object.entries(raw.bookmarksAt)) {
      if (questionSet.has(id) && isRecord(entry) && typeof entry.value === 'boolean' && validIso(entry.at)) {
        meta.bookmarksAt[id] = { value: entry.value, at: entry.at };
      }
    }
  }
  if (isRecord(raw.readUnitsAt)) {
    for (const [id, entry] of Object.entries(raw.readUnitsAt)) {
      if (unitSet.has(id) && isRecord(entry) && typeof entry.value === 'boolean' && validIso(entry.at)) {
        meta.readUnitsAt[id] = { value: entry.value, at: entry.at };
      }
    }
  }
  if (validIso(raw.goalAt)) meta.goalAt = raw.goalAt;
  if (validIso(raw.examAt)) meta.examAt = raw.examAt;
  if (validIso(raw.resetAt)) meta.resetAt = raw.resetAt;
  if (validIso(raw.updatedAt)) meta.updatedAt = raw.updatedAt;
  return meta;
}

export function normalizeSyncPayload(raw, questionIds, unitIds) {
  const checked = validateBackup(raw, questionIds, unitIds);
  const questionSet = new Set(questionIds);
  const unitSet = new Set(unitIds);
  return {
    state: {
      ...checked.state,
      meta: sanitizeMeta(raw.meta, questionSet, unitSet)
    },
    skipped: checked.skipped
  };
}

export function serializeForSync(state) {
  return {
    version: 1,
    progress: state.progress || {},
    history: Array.isArray(state.history) ? state.history : [],
    bookmarks: Array.isArray(state.bookmarks) ? state.bookmarks : [],
    readUnits: Array.isArray(state.readUnits) ? state.readUnits : [],
    exam: state.exam || '',
    goal: [3, 6, 9].includes(state.goal) ? state.goal : 3,
    meta: isRecord(state.meta) ? state.meta : emptyMeta()
  };
}

function mergeFlagSet(localList, remoteList, localAt, remoteAt, resetAt, validSet) {
  const ids = new Set([
    ...localList,
    ...remoteList,
    ...Object.keys(localAt),
    ...Object.keys(remoteAt)
  ]);
  const mergedAt = {};
  const result = [];
  for (const id of ids) {
    if (!validSet.has(id)) continue;
    const lEntry = localAt[id] && (!resetAt || localAt[id].at > resetAt) ? localAt[id] : null;
    const rEntry = remoteAt[id] && (!resetAt || remoteAt[id].at > resetAt) ? remoteAt[id] : null;
    if (lEntry && rEntry) {
      const winner = lEntry.at >= rEntry.at ? lEntry : rEntry;
      mergedAt[id] = winner;
      if (winner.value) result.push(id);
    } else if (lEntry || rEntry) {
      const winner = lEntry || rEntry;
      mergedAt[id] = winner;
      if (winner.value) result.push(id);
    } else if (!resetAt) {
      if (localList.includes(id) || remoteList.includes(id)) result.push(id);
    }
  }
  result.sort();
  return { list: result, map: mergedAt };
}

function historyKey(item) {
  return `${item.at}|${item.id}|${item.correct ? 1 : 0}|${item.confidence}|${item.day}`;
}

export function mergeStudyStates(localRaw, remoteRaw, { questionIds, unitIds }) {
  const questionSet = new Set(questionIds);
  const unitSet = new Set(unitIds);
  const local = {
    progress: localRaw?.progress || {},
    history: Array.isArray(localRaw?.history) ? localRaw.history : [],
    bookmarks: Array.isArray(localRaw?.bookmarks) ? localRaw.bookmarks : [],
    readUnits: Array.isArray(localRaw?.readUnits) ? localRaw.readUnits : [],
    exam: localRaw?.exam || '',
    goal: [3, 6, 9].includes(localRaw?.goal) ? localRaw.goal : 3,
    meta: sanitizeMeta(localRaw?.meta, questionSet, unitSet)
  };
  const remote = {
    progress: remoteRaw?.progress || {},
    history: Array.isArray(remoteRaw?.history) ? remoteRaw.history : [],
    bookmarks: Array.isArray(remoteRaw?.bookmarks) ? remoteRaw.bookmarks : [],
    readUnits: Array.isArray(remoteRaw?.readUnits) ? remoteRaw.readUnits : [],
    exam: remoteRaw?.exam || '',
    goal: [3, 6, 9].includes(remoteRaw?.goal) ? remoteRaw.goal : 3,
    meta: sanitizeMeta(remoteRaw?.meta, questionSet, unitSet)
  };

  const resetAt = maxIso(local.meta.resetAt, remote.meta.resetAt);

  // 1. Merge answer history deterministically (deduplicated, sorted by timestamp).
  const historyMap = new Map();
  for (const item of [...local.history, ...remote.history]) {
    if (!questionSet.has(item.id)) continue;
    if (resetAt && item.at <= resetAt) continue;
    historyMap.set(historyKey(item), {
      id: item.id,
      correct: item.correct,
      confidence: item.confidence,
      day: item.day,
      at: item.at
    });
  }
  const history = [...historyMap.values()].sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));

  // 2. Rebuild progress from merged history, falling back to stored progress if history is incomplete.
  const rebuilt = {};
  for (const item of history) {
    rebuilt[item.id] = schedule(rebuilt[item.id], item.correct, item.confidence, item.day);
  }
  const progress = { ...rebuilt };
  const candidateIds = new Set([...Object.keys(local.progress), ...Object.keys(remote.progress)]);
  for (const id of candidateIds) {
    if (!questionSet.has(id)) continue;
    const candidates = [];
    if (progress[id]) candidates.push(progress[id]);
    const localAfterReset = !resetAt || (local.meta.updatedAt && local.meta.updatedAt > resetAt);
    const remoteAfterReset = !resetAt || (remote.meta.updatedAt && remote.meta.updatedAt > resetAt);
    if (local.progress[id] && localAfterReset) candidates.push(local.progress[id]);
    if (remote.progress[id] && remoteAfterReset) candidates.push(remote.progress[id]);
    if (!candidates.length) continue;
    candidates.sort((a, b) => (b.attempts - a.attempts) || b.due.localeCompare(a.due));
    progress[id] = { ...candidates[0] };
  }

  // 3. Merge bookmarks and readUnits using per-item timestamps (union fallback for legacy entries).
  const bookmarks = mergeFlagSet(local.bookmarks, remote.bookmarks, local.meta.bookmarksAt, remote.meta.bookmarksAt, resetAt, questionSet);
  const readUnits = mergeFlagSet(local.readUnits, remote.readUnits, local.meta.readUnitsAt, remote.meta.readUnitsAt, resetAt, unitSet);

  // 4. Merge scalar settings (goal, exam) by last-write-wins timestamp.
  let goal = local.goal;
  let goalAt = local.meta.goalAt;
  if (remote.meta.goalAt > local.meta.goalAt) {
    goal = remote.goal;
    goalAt = remote.meta.goalAt;
  } else if (!local.meta.goalAt && !remote.meta.goalAt && local.goal === 3 && remote.goal !== 3) {
    goal = remote.goal;
  }

  let exam = local.exam;
  let examAt = local.meta.examAt;
  if (remote.meta.examAt > local.meta.examAt) {
    exam = remote.exam;
    examAt = remote.meta.examAt;
  } else if (!local.meta.examAt && !remote.meta.examAt && !local.exam && remote.exam) {
    exam = remote.exam;
  }

  const latestHistoryAt = history.length ? history[history.length - 1].at : '';
  const updatedAt = [local.meta.updatedAt, remote.meta.updatedAt, latestHistoryAt, goalAt, examAt, resetAt].reduce(maxIso, '');

  return {
    progress,
    history,
    bookmarks: bookmarks.list,
    readUnits: readUnits.list,
    exam,
    goal,
    meta: {
      bookmarksAt: bookmarks.map,
      readUnitsAt: readUnits.map,
      goalAt,
      examAt,
      resetAt,
      updatedAt
    }
  };
}

export function statesEqual(a, b) {
  return JSON.stringify(serializeForSync(a)) === JSON.stringify(serializeForSync(b));
}

export function extractGistId(input) {
  const trimmed = String(input || '').trim();
  if (!trimmed) return '';
  const urlMatch = trimmed.match(/gist\.github\.com\/(?:[^/]+\/)?([a-f0-9]{16,64})/i);
  if (urlMatch) return urlMatch[1];
  const idMatch = trimmed.match(/^([a-f0-9]{16,64})$/i);
  return idMatch ? idMatch[1] : '';
}

export function encodePairingCode({ gistId, token }) {
  const id = extractGistId(gistId);
  const pat = String(token || '').trim();
  if (!id || !pat) throw new Error('Gist ID とアクセストークンが必要です。');
  const json = JSON.stringify({ v: 1, g: id, t: pat });
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return 'CFAPOCKET1:' + btoa(binary);
}

export function decodePairingCode(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed.startsWith('CFAPOCKET1:')) throw new Error('接続コードの形式が正しくありません。');
  try {
    const binary = atob(trimmed.slice('CFAPOCKET1:'.length).trim());
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    const gistId = extractGistId(parsed?.g);
    const token = typeof parsed?.t === 'string' ? parsed.t.trim() : '';
    if (parsed?.v !== 1 || !gistId || !token) throw new Error('invalid');
    return { gistId, token };
  } catch {
    throw new Error('接続コードを読み取れませんでした。もう一度コピーして貼り付けてください。');
  }
}

function classifyHttpError(status) {
  if (status === 401) return 'GitHubトークンが無効または期限切れです。設定を確認してください。';
  if (status === 403) return 'GitHubトークンに Gist の読み書き権限がないか、回数制限に達しました。';
  if (status === 404) return '指定されたGistが見つかりません。Gist ID またはトークン権限を確認してください。';
  if (status === 422) return 'Gist の更新内容が拒否されました。';
  return `GitHubとの通信に失敗しました（ステータス ${status}）。`;
}

export function createGistClient({ fetchImpl = globalThis.fetch } = {}) {
  const headers = token => ({
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  });

  async function request(url, options) {
    let response;
    try {
      response = await fetchImpl(url, { ...options, cache: 'no-store' });
    } catch {
      const error = new Error('ネットワークに接続できませんでした。オンラインになってから再度お試しください。');
      error.code = 'NETWORK';
      throw error;
    }
    if (!response.ok) {
      const error = new Error(classifyHttpError(response.status));
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  return {
    async createGist(token, payload) {
      const data = await request(GIST_API_BASE, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({
          description: 'CFA Pocket study progress sync (private)',
          public: false,
          files: {
            [SYNC_FILENAME]: { content: JSON.stringify(payload, null, 2) }
          }
        })
      });
      if (!data?.id) throw new Error('Gist の作成結果から ID を取得できませんでした。');
      return { gistId: data.id, updatedAt: data.updated_at || new Date().toISOString() };
    },

    async fetchPayload(token, gistId) {
      const data = await request(`${GIST_API_BASE}/${encodeURIComponent(gistId)}`, {
        method: 'GET',
        headers: headers(token)
      });
      const file = data?.files?.[SYNC_FILENAME];
      if (!file) return { payload: null, updatedAt: data?.updated_at || '' };
      let content = file.content;
      if (file.truncated && file.raw_url) {
        const rawRes = await fetchImpl(file.raw_url, { cache: 'no-store' });
        if (!rawRes.ok) throw new Error('Gistデータの取得に失敗しました。');
        content = await rawRes.text();
      }
      if (!content || !content.trim()) return { payload: null, updatedAt: data?.updated_at || '' };
      try {
        return { payload: JSON.parse(content), updatedAt: data?.updated_at || '' };
      } catch {
        throw new Error('Gist内の同期データ（JSON）が破損しています。');
      }
    },

    async updatePayload(token, gistId, payload) {
      const data = await request(`${GIST_API_BASE}/${encodeURIComponent(gistId)}`, {
        method: 'PATCH',
        headers: headers(token),
        body: JSON.stringify({
          files: {
            [SYNC_FILENAME]: { content: JSON.stringify(payload, null, 2) }
          }
        })
      });
      return { updatedAt: data?.updated_at || new Date().toISOString() };
    }
  };
}

export function createSyncManager({
  client = createGistClient(),
  configStorage,
  getState,
  applyMergedState,
  questionIds,
  unitIds,
  isOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false),
  onStatusChange = () => {}
}) {
  let config = null; // { token, gistId, lastSyncAt }
  let status = { state: 'disabled', message: '', lastSyncAt: '', pending: false };
  let running = null;
  let queued = false;
  let debounceTimer = null;

  const emit = patch => {
    status = { ...status, ...patch };
    onStatusChange({ ...status, configured: Boolean(config?.token && config?.gistId), gistId: config?.gistId || '' });
  };

  async function persistConfig(next) {
    config = next;
    await configStorage.save(next);
  }

  async function init() {
    try {
      const saved = await configStorage.load();
      if (saved?.token && saved?.gistId) {
        config = { token: saved.token, gistId: saved.gistId, lastSyncAt: saved.lastSyncAt || '' };
        emit({ state: 'idle', message: '', lastSyncAt: config.lastSyncAt, pending: false });
        return true;
      }
    } catch {
      // Ignore corrupt sync config; study records remain untouched.
    }
    config = null;
    emit({ state: 'disabled', message: '', lastSyncAt: '', pending: false });
    return false;
  }

  async function runSync() {
    if (!config?.token || !config?.gistId) return { ok: false, skipped: true };
    if (!isOnline()) {
      emit({ state: 'offline', message: 'オフラインのため待機中です。接続後に自動同期します。', pending: true });
      return { ok: false, offline: true };
    }
    if (running) {
      queued = true;
      return running;
    }
    running = (async () => {
      emit({ state: 'syncing', message: '同期しています…' });
      try {
        const remoteResult = await client.fetchPayload(config.token, config.gistId);
        // Read local state after network fetch so answers recorded during fetch are never lost.
        const localBefore = serializeForSync(getState());
        let merged;
        let shouldPush = false;

        if (!remoteResult.payload) {
          merged = mergeStudyStates(localBefore, null, { questionIds, unitIds });
          shouldPush = true;
        } else {
          const normalizedRemote = normalizeSyncPayload(remoteResult.payload, questionIds, unitIds).state;
          merged = mergeStudyStates(localBefore, normalizedRemote, { questionIds, unitIds });
          shouldPush = !statesEqual(normalizedRemote, merged);
        }

        const localChanged = !statesEqual(localBefore, merged);
        if (localChanged) {
          await applyMergedState(merged);
        }
        if (shouldPush) {
          await client.updatePayload(config.token, config.gistId, serializeForSync(merged));
        }

        const now = new Date().toISOString();
        await persistConfig({ ...config, lastSyncAt: now });
        emit({ state: 'synced', message: '同期しました。', lastSyncAt: now, pending: false });
        return { ok: true, localChanged, pushed: shouldPush };
      } catch (error) {
        const offline = error.code === 'NETWORK' || !isOnline();
        emit({
          state: offline ? 'offline' : 'error',
          message: error.message || '同期に失敗しました。',
          pending: true
        });
        return { ok: false, error };
      } finally {
        running = null;
        if (queued) {
          queued = false;
          void runSync();
        }
      }
    })();
    return running;
  }

  function scheduleSync(delayMs = 1500) {
    if (!config?.token || !config?.gistId) return;
    emit({ pending: true });
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void runSync();
    }, delayMs);
  }

  async function connect({ token, gistId }) {
    const cleanToken = String(token || '').trim();
    if (!cleanToken) throw new Error('GitHubアクセストークンを入力してください。');
    const cleanId = gistId ? extractGistId(gistId) : '';
    if (gistId && !cleanId) throw new Error('Gist ID または Gist の URL の形式が正しくありません。');

    emit({ state: 'syncing', message: cleanId ? '既存のGistと同期しています…' : '非公開Gistを作成しています…' });
    try {
      let targetId = cleanId;
      if (!targetId) {
        const created = await client.createGist(cleanToken, serializeForSync(getState()));
        targetId = created.gistId;
        const now = new Date().toISOString();
        await persistConfig({ token: cleanToken, gistId: targetId, lastSyncAt: now });
        emit({ state: 'synced', message: '新しい非公開Gistを作成し、連携を開始しました。', lastSyncAt: now, pending: false });
        return { gistId: targetId, created: true };
      }
      await persistConfig({ token: cleanToken, gistId: targetId, lastSyncAt: '' });
      const result = await runSync();
      if (!result.ok) {
        await persistConfig(null);
        throw result.error || new Error('同期に失敗しました。');
      }
      return { gistId: targetId, created: false };
    } catch (error) {
      if (!config?.token || !config?.gistId) {
        emit({ state: 'disabled', message: error.message || '連携に失敗しました。', lastSyncAt: '', pending: false });
      }
      throw error;
    }
  }

  async function disconnect() {
    if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
    queued = false;
    await persistConfig(null);
    emit({ state: 'disabled', message: 'クラウド同期を解除しました（端末内の学習記録は残っています）。', lastSyncAt: '', pending: false });
  }

  return {
    init,
    syncNow: runSync,
    scheduleSync,
    connect,
    disconnect,
    getConfig: () => (config ? { ...config } : null),
    getStatus: () => ({ ...status, configured: Boolean(config?.token && config?.gistId), gistId: config?.gistId || '' })
  };
}
