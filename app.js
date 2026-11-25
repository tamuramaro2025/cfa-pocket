import { topics, questions } from './questions.js';
import { units, curriculumYear } from './curriculum.js';
import { guide, lesson } from './learning-guide.js';
import { auditView } from './los-audit.js';
import { initPwa, pwaState, onPwaChange, pwaPanel, installApp, applyUpdate, protectStorage } from './pwa.js';
import { validateBackup } from './backup.js';
import { dayKey, addDays, dueQuestions, makeQueue, schedule, streak } from './engine.js';
import { createStudyStorage, SYNC_CONFIG_KEY } from './storage.js';
import { createSyncManager, emptyMeta, encodePairingCode, decodePairingCode } from './sync.js';
import { backDestination, installKeyboardLayout } from './android-navigation.js';
import { privacyMarkup, aboutMarkup } from './legal.js';
import { releaseInfo } from './release-info.js';

const empty = () => ({ progress: {}, history: [], bookmarks: [], readUnits: [], exam: '', goal: 3, meta: emptyMeta() });
let state = empty();
let warning = '';
let saving = false;
let loadFailed = false;
const native = window.CFA_NATIVE;
const localBridge = { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
const storage = createStudyStorage({
  local: localBridge,
  preferences: native?.preferences,
  onError: () => { warning = '記録を保存できませんでした。アプリを閉じる前にバックアップしてください。'; }
});
const syncConfigStorage = createStudyStorage({
  local: localBridge,
  preferences: native?.preferences,
  key: SYNC_CONFIG_KEY
});
let page = 'home';
let session = null;
let guideTopic = 'all';
let guideQuery = '';
let guideMode = 'units';
let guideFilter = 'all';
let pendingImport = null;
let importMessage = '';
let syncFeedback = '';
let syncFeedbackError = false;
let pairingCodeRevealed = '';
let syncBusy = false;
const validPage = value => ['home','topics','curriculum','coverage','review','stats','settings','privacy','about'].includes(value) || value.startsWith('lesson/');
const app = document.querySelector('#app');
const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const topicOf = q => topics.find(t => t.id === q.topic);
const ensureMeta = () => {
  if (!state.meta || typeof state.meta !== 'object') state.meta = emptyMeta();
  if (!state.meta.bookmarksAt) state.meta.bookmarksAt = {};
  if (!state.meta.readUnitsAt) state.meta.readUnitsAt = {};
  return state.meta;
};
const syncManager = createSyncManager({
  configStorage: syncConfigStorage,
  getState: () => state,
  applyMergedState: async merged => {
    if (loadFailed) return;
    state = { ...empty(), ...merged };
    await storage.save(state);
    if (page !== 'study') render();
  },
  questionIds: questions.map(q => q.id),
  unitIds: units.map(u => u.id),
  onStatusChange: () => { refreshSyncUi(); }
});
const saved = async ({ skipSync = false } = {}) => {
  if (loadFailed) { warning = '元の保存データを保護するため書き込みを停止しています。データを削除せずアプリを開き直してください。'; return false; }
  const ok = await storage.save(state);
  if (ok && !skipSync) syncManager.scheduleSync();
  return ok;
};
const todayCount = () => state.history.filter(h => h.day === dayKey()).length;
const due = () => dueQuestions(questions, state.progress);
const button = (label, action, cls = '', extra = '') => `<button class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const topicBadge = topic => `<span class="topic-icon" style="background:${topic.color}">${topic.icon}</span>`;
const percent = list => list.length ? Math.round(list.filter(h => h.correct).length / list.length * 100) : 0;

function formatSyncTime(iso) {
  if (!iso) return '未同期';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '未同期';
  return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}
function syncBadgeMarkup() {
  const s = syncManager.getStatus();
  if (!s.configured) return '';
  if (s.state === 'syncing') return `<a href="#settings" class="sync-pill syncing">↻ 同期中…</a>`;
  if (s.state === 'offline') return `<a href="#settings" class="sync-pill offline">○ 未同期（オフライン）</a>`;
  if (s.state === 'error') return `<a href="#settings" class="sync-pill error">! 同期エラー</a>`;
  return `<a href="#settings" class="sync-pill">${s.pending ? '↻ 同期待機' : `✓ 同期済み ${esc(formatSyncTime(s.lastSyncAt))}`}</a>`;
}
function syncStatusCopy(s) {
  if (s.state === 'syncing') return { title: '同期しています…', detail: s.message || 'GitHub Gist と照合中' };
  if (s.state === 'offline') return { title: 'オフラインで待機中', detail: '接続が戻ると自動で同期します。' };
  if (s.state === 'error') return { title: '同期に失敗しました', detail: s.message || '設定を確認して再試行してください。' };
  if (s.lastSyncAt) return { title: s.pending ? '変更を同期待機中' : 'PC・スマホ同期が有効です', detail: `最終同期：${formatSyncTime(s.lastSyncAt)} · Gist ID: ${s.gistId.slice(0, 10)}…` };
  return { title: '同期の準備ができています', detail: `Gist ID: ${s.gistId.slice(0, 10)}…` };
}
function syncPanelMarkup() {
  const s = syncManager.getStatus();
  const feedback = syncFeedback ? `<p class="sync-msg ${syncFeedbackError ? 'error' : ''}" role="status">${esc(syncFeedback)}</p>` : '';
  if (s.configured) {
    const copy = syncStatusCopy(s);
    return `<section class="card sync-card" data-sync-configured="1"><h2>PC・スマホ自動同期（GitHub Gist）</h2><p class="subtitle">回答やブックマークを非公開の GitHub Gist 経由で自動マージ同期します。両端末で別々に学習しても記録は合体されます。</p><div class="sync-status-row" id="sync-status-area"><div><strong>${esc(copy.title)}</strong><small>${esc(copy.detail)}</small></div></div>${feedback}<div class="sync-actions">${button(s.state === 'syncing' ? '同期中…' : '今すぐ同期する', 'sync-now', 'primary', s.state === 'syncing' ? 'disabled' : '')}${button('他の端末用の接続コードをコピー', 'sync-copy-code', 'secondary')}${button('連携を解除', 'sync-disconnect', 'plain')}</div>${pairingCodeRevealed ? `<div><p class="subtitle">2台目の端末の設定画面で「接続コードで連携」に貼り付けてください（トークンを含むため他人には共有しないでください）。</p><textarea class="sync-code-box" readonly aria-label="他の端末用の接続コード">${esc(pairingCodeRevealed)}</textarea>${button('コードを閉じる', 'sync-hide-code', 'plain')}</div>` : ''}</section>`;
  }
  return `<section class="card sync-card" data-sync-configured="0"><h2>PC・スマホ自動同期（GitHub Gist）</h2><p class="subtitle">自分の非公開 GitHub Gist を使って、PC と Android アプリの学習進捗を自動で同期・マージします。</p>${feedback}<form id="sync-connect-form" class="sync-form"><label>GitHub アクセストークン（Gist 権限のみ）<input type="password" name="token" placeholder="github_pat_... または ghp_..." autocomplete="off" required></label><label>Gist ID または URL（1台目は空欄で自動作成）<input type="text" name="gistId" placeholder="空欄のままにすると非公開Gistを自動作成します" autocomplete="off"></label><button class="primary" type="submit" ${syncBusy ? 'disabled' : ''}>${syncBusy ? '連携中…' : '連携して同期をはじめる'}</button></form><div class="sync-divider"><h3>2台目の端末をかんたん連携</h3><p class="subtitle">すでに連携済みの端末でコピーした「接続コード」を貼り付けるだけで設定できます。</p><form id="sync-pairing-form" class="sync-form"><label>接続コード<textarea class="sync-code-box" name="code" placeholder="CFAPOCKET1:..." autocomplete="off" required></textarea></label><button class="secondary" type="submit" ${syncBusy ? 'disabled' : ''}>${syncBusy ? '連携中…' : '接続コードで連携する'}</button></form></div><details class="sync-help"><summary>GitHub トークンの作成手順（初回のみ・約1分）</summary><ol><li>GitHub の <b>Settings → Developer settings → Personal access tokens → Tokens (classic)</b>（または Fine-grained tokens）を開きます。</li><li>「Generate new token」から、権限は <b>gist</b>（Fine-grained の場合は Account permissions の <b>Gists: Read and write</b>）だけを有効にして作成します。</li><li>表示されたトークンを上の欄に貼り付け、Gist ID は空欄のまま「連携して同期をはじめる」を押します。</li><li>完了後、「他の端末用の接続コードをコピー」してスマホ側のアプリに貼り付ければ連携完了です。</li></ol><p class="subtitle">トークンはこの端末内のみに保存され、JSON バックアップや Gist 内容には含まれません。</p></details></section>`;
}
function refreshSyncUi() {
  const badge = document.querySelector('#sync-badge');
  if (badge) badge.innerHTML = syncBadgeMarkup();
  const panel = document.querySelector('#sync-panel');
  if (!panel) return;
  const s = syncManager.getStatus();
  const currentCard = panel.querySelector('[data-sync-configured]');
  const wasConfigured = currentCard?.dataset.syncConfigured === '1';
  if (wasConfigured !== s.configured || s.configured) {
    panel.innerHTML = syncPanelMarkup();
  }
}
function refreshPwaUi() {
  const panel=document.querySelector('#pwa-panel'); if(panel) panel.innerHTML=pwaPanel(esc,page==='study');
  const status=pwaState(); const notices=document.querySelector('#pwa-notices');
  if(notices) notices.innerHTML = !status.online ? `<a class="pwa-toast" href="#settings">${status.offlineReady ? '○ オフラインで学習中' : '○ オフライン · 教材保存を確認してください'}</a>` : status.updateReady ? `<a class="pwa-toast" href="#settings">新しい教材があります。学習後に設定から更新できます →</a>` : '';
}
function render() {
  const views = { home, topics: topicPage, coverage: () => auditView({heading, esc}), curriculum: () => guide({topics, state, topic: guideTopic, query: guideQuery, mode: guideMode, filter: guideFilter, esc, heading}), review, stats, settings, study, result };
  views.privacy = () => heading('YOUR PRIVACY', 'プライバシー') + privacyMarkup();
  views.about = () => heading('ABOUT CFA POCKET', 'このアプリについて') + aboutMarkup();
  if (page.startsWith('lesson/')) views[page] = () => lesson({ id: page.slice(7), topics, state, esc, heading });
  app.innerHTML = `<aside class="sidebar"><a href="#home" class="brand"><span class="brand-mark" aria-hidden="true"></span><span>CFA<span class="brand-light"> Pocket</span><small>小さな時間、大きな一歩。</small></span></a><div class="level">LEVEL I <span>基礎トレーニング</span></div><nav aria-label="メインナビゲーション">${[['home','⌂','ホーム'],['topics','▦','分野から学ぶ'],['curriculum','☷','学習ガイド'],['review','↻','復習する'],['stats','▥','学習記録']].map(([key,icon,label]) => `<a href="#${key}" class="${page === key ? 'active' : ''}"><span>${icon}</span>${label}${key === 'review' && due().length ? `<b>${due().length}</b>` : ''}</a>`).join('')}</nav><div class="side-bottom"><div class="side-note"><span>ONE STEP AT A TIME</span><p>5分の積み重ねが、<br>未来の自信になる。</p><div class="steps"><i></i><i></i><i></i><i></i><i></i></div></div><a href="#settings" class="settings-link">⚙ 学習設定</a><small class="muted">独立した非公式の学習アプリ</small></div></aside><div class="workspace"><header class="topbar"><span>CFA LEVEL I <span class="header-sep">/</span> YOUR DAILY PROGRESS</span><div class="topbar-actions"><span id="sync-badge">${syncBadgeMarkup()}</span><a href="#about" class="about-link">アプリについて</a></div></header><main id="main">${warning ? `<div class="notice" role="status">${esc(warning)}</div>` : ''}${(views[page] || home)()}</main><footer>英語で解いて、日本語で理解する。<span>CFA Pocket · ${esc(releaseInfo.versionName)}</span></footer></div><nav class="mobile-nav" aria-label="モバイルナビゲーション">${[['home','⌂','ホーム'],['topics','▦','分野'],['curriculum','☷','ガイド'],['review','↻','復習'],['stats','▥','記録'],['settings','⚙','設定']].map(([key,icon,label]) => `<a href="#${key}" class="${page === key ? 'active' : ''}"><span>${icon}</span>${label}</a>`).join('')}</nav>`;
  refreshPwaUi();
}
function heading(kicker, title, subtitle = '') { return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1>${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}</div><span class="date-label">${new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date())}</span></div>`; }
function home() {
  const count = todayCount();
  const progress = Math.min(count / state.goal, 1);
  const recent = state.history.slice(-30);
  return `${heading('MAKE A LITTLE PROGRESS', '今日も、ひとつずつ。', 'まとまった時間がなくても、大丈夫。今日の5分を始めましょう。')}<section class="hero"><div class="hero-copy"><span class="pill">YOUR DAILY SESSION</span><h2>${count >= state.goal ? '今日の目標、達成です。' : '5分を、未来の力に。'}</h2><p>英語でチャレンジ、日本語で納得。<br>3問の小さな一歩から、合格への習慣を。</p>${button(count >= state.goal ? 'もう3問チャレンジ <span>→</span>' : '今日の3問をはじめる <span>→</span>', 'start', 'primary light')}<div class="hero-meta"><span>◷ 約3〜5分</span><span>✦ 日本語の解説つき</span></div></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="art-card"><span>DAILY GROWTH</span><div class="art-chart"><i></i><i></i><i></i><i></i><i></i></div><b>一歩ずつ、着実に。 ↗</b></div><div class="art-tag">✓ SMALL STEPS, BIG CHANGE</div></div></section><section class="metrics" aria-label="学習の状況"><article class="metric"><span class="metric-icon green">✓</span><div><p>今日の学習</p><strong>${count}<small> / ${state.goal}問</small></strong><div class="mini-track"><i style="width:${progress * 100}%"></i></div></div></article><article class="metric"><span class="metric-icon orange">♧</span><div><p>連続学習</p><strong>${streak(state.history)}<small> 日</small></strong><span class="metric-caption">自分のペースで続けよう</span></div></article><article class="metric"><span class="metric-icon purple">◎</span><div><p>最近の正答率 <small>最大30回答</small></p><strong>${recent.length ? percent(recent) : '—'}<small> ${recent.length ? '%' : ''}</small></strong><span class="metric-caption">${recent.length ? `${recent.length}回答の記録から` : 'まずは最初の3問から'}</span></div></article></section><div class="content-grid"><section class="card"><div class="section-heading"><h2>分野から学ぶ</h2><a href="#topics">すべて見る →</a></div>${topics.slice(0,3).map(topicRow).join('')}</section><div class="right-stack"><section class="review-card"><span class="eyebrow">TIME TO RECALL</span><div class="section-heading"><h2>記憶が、定着する前に。</h2><span class="round-icon">↻</span></div><p>${due().length ? `復習のタイミングを迎えた問題が${due().length}問あります。` : '回答した問題は、自信度に合わせて復習に登場します。'}</p><a href="#review" class="text-link">復習リストを見る <span>→</span></a></section><section class="tip-card"><span class="tip-label">✦ POCKET TIP</span><h3>「わかった」を、英語でも。</h3><p>解説を読んだら、英語のキーワードをひとつ覚えてみましょう。</p></section></div></div><p class="content-note">独自作成の基礎問題${questions.length}問・${topics.length}分野を収録。${curriculumYear}年版を参考にした${units.length}単元の<a href="#curriculum">学習ガイド →</a>も利用できます。</p>`;
}
function topicRow(t) {
  const qs = questions.filter(q => q.topic === t.id);
  const touched = qs.filter(q => state.progress[q.id]).length;
  return `<button class="topic-row" data-action="topic" data-topic="${t.id}">${topicBadge(t)}<span class="topic-info"><strong>${t.name}</strong><small>${t.en}</small></span><span class="topic-progress"><small>${touched} / ${qs.length}問</small><span class="mini-track"><i style="width:${touched/qs.length*100}%"></i></span></span><span class="arrow">↗</span></button>`;
}
function topicPage() { return `${heading('BUILD YOUR FOUNDATION','分野から学ぶ','気になる分野を、3問ずつ。まずは基礎を固めましょう。')}<section class="card">${topics.map(topicRow).join('')}</section><div class="notice">${topics.length}分野・合計${questions.length}問。<a href="#curriculum">${units.length}単元の学習ガイド →</a>で要点から学べます。</div>`; }
function inlineQuestionDetails(q) {
  return `<details class="inline-q-preview"><summary>問題文と選択肢・解説を見る</summary><div class="inline-q-box"><p class="q-preview-prompt" lang="en">${esc(q.prompt)}</p><div class="q-preview-options">${q.options.map((opt, i) => `<div class="q-preview-opt ${i === q.answer ? 'is-answer' : ''}"><span class="q-opt-letter">${'ABC'[i]}</span><span lang="en">${esc(opt)}</span>${i === q.answer ? '<b>✓ 正解</b>' : ''}</div>`).join('')}</div><p class="q-exp-summary"><b>要点：</b>${esc(q.summary)}</p><p class="q-exp-text">${esc(q.explanation)}</p><div class="q-exp-reasons">${q.reasons.map((r, i) => `<p><b>${'ABC'[i]}.</b> ${esc(r)}</p>`).join('')}</div></div></details>`;
}
function review() {
  const list = due();
  const upcoming = questions.filter(q => state.progress[q.id]?.due > dayKey()).sort((a,b) => state.progress[a.id].due.localeCompare(state.progress[b.id].due));
  return `${heading('A LITTLE RECALL, A LOT OF GROWTH','復習する','忘れる前のもう一度が、知識を自分のものに。')}<section class="card review-summary"><span class="metric-icon green">↻</span><div><h2>今日の復習は${list.length}問</h2><p class="subtitle">${list.length ? '1回3問まで。短い時間で取り組めます。各行から問題文と解説を直接確認することもできます。' : '今のところ、期限を迎えた問題はありません。'}</p></div>${list.length ? button('復習をはじめる →','review-start','primary') : ''}</section>${list.length ? `<section class="card"><h2>復習のタイミング</h2>${list.map(reviewRow).join('')}</section>` : `<div class="empty-state"><span>✓</span><h2>次の一歩を、気軽に。</h2><p>新しい問題に答えると、ここに復習予定が表示されます。</p>${button('3問学習する →','start','primary')}</div>`}${upcoming.length ? `<section class="card"><h2>これからの復習</h2>${upcoming.map(reviewRow).join('')}</section>` : ''}`;
}
function reviewRow(q) {
  return `<div class="review-row review-row-expandable"><div class="review-row-top">${topicBadge(topicOf(q))}<div class="review-row-info"><strong>${esc(q.term)}</strong><small>${esc(q.meaning)} · ${topicOf(q).name}（${esc(q.id)}）</small></div><div class="review-row-right"><span class="due-label">${esc(state.progress[q.id].due)}</span>${button('1問解く','audit-question','secondary',`data-id="${esc(q.id)}"`)}</div></div>${inlineQuestionDetails(q)}</div>`;
}
function stats() {
  const days = Array.from({ length: 7 }, (_, i) => addDays(dayKey(), i - 6));
  const recentIds = [...new Set([...state.history].reverse().map(h => h.id))].slice(0, 15);
  const recentQuestions = recentIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
  return `${heading('LOOK HOW FAR YOU HAVE COME','学習記録','小さな積み重ねを、見えるかたちに。')}<section class="metrics"><article class="card"><p class="subtitle">累計回答</p><strong class="big-number">${state.history.length}<small> 問</small></strong></article><article class="card"><p class="subtitle">全体正答率</p><strong class="big-number">${state.history.length ? percent(state.history) + '%' : '—'}</strong></article><article class="card"><p class="subtitle">学習した問題</p><strong class="big-number">${questions.filter(q => state.progress[q.id]).length}<small> / ${questions.length}</small></strong></article></section><section class="card"><h2>この7日間</h2><div class="week-grid">${days.map(day => { const n = state.history.filter(h => h.day === day).length; return `<div class="week-day ${n ? 'done' : ''}"><small>${Number(day.slice(-2))}日</small><span>${n ? '✓' : '·'}</span><small>${n}問</small></div>`; }).join('')}</div></section><section class="card"><h2>分野別の記録</h2>${topics.map(t => { const list = state.history.filter(h => questions.find(q => q.id === h.id)?.topic === t.id); return `<div class="review-row">${topicBadge(t)}<div><strong>${t.name}</strong><small>${list.length}回答</small></div><b>${list.length ? percent(list) + '%' : '未学習'}</b></div>`; }).join('')}</section><section class="card"><div class="section-heading"><h2>保存した用語と問題</h2>${button('全問題・英単語を検索 →','open-question-bank','plain')}</div>${state.bookmarks.length ? questions.filter(q => state.bookmarks.includes(q.id)).map(q => `<div class="review-row review-row-expandable"><div class="review-row-top">${topicBadge(topicOf(q))}<div class="review-row-info"><strong>${esc(q.term)}</strong><small>${esc(q.meaning)} · ${topicOf(q).name}（${esc(q.id)}）</small></div><div class="review-row-right">${button('1問解く','audit-question','secondary',`data-id="${esc(q.id)}"`)}${button('解除','bookmark','secondary','data-id="'+esc(q.id)+'"')}</div></div>${inlineQuestionDetails(q)}</div>`).join('') : '<p class="subtitle">解説画面や学習ガイドで重要用語を保存すると、ここからいつでも問題と解説を見返せます。</p>'}</section><section class="card"><div class="section-heading"><h2>最近解いた問題を見返す</h2>${button('全396問の一覧を見る →','open-question-bank','plain')}</div>${recentQuestions.length ? recentQuestions.map(q => { const p = state.progress[q.id]; return `<div class="review-row review-row-expandable"><div class="review-row-top">${topicBadge(topicOf(q))}<div class="review-row-info"><strong>${esc(q.term)}（${esc(q.meaning)}）</strong><small>${p ? (p.lastCorrect ? '直近：✓ 正解' : '直近：× 不正解') + ` · 正解 ${p.correct}/${p.attempts}回 · 次回 ${esc(p.due)}` : ''}</small></div><div class="review-row-right">${button('1問解く','audit-question','secondary',`data-id="${esc(q.id)}"`)}</div></div>${inlineQuestionDetails(q)}</div>`; }).join('') : '<p class="subtitle">問題を解くと、ここに最近解いた問題と解説の履歴が表示されます。</p>'}</section>`;
}
function settings() {
  return `${heading('YOUR OWN PACE','学習設定','無理なく続けられるペースを選びましょう。')}<div id="sync-panel">${syncPanelMarkup()}</div><div id="pwa-panel">${pwaPanel(esc,page==='study')}</div><form id="settings-form" class="card settings-form"><label>1日の目標<select name="goal">${[3,6,9].map(n => `<option value="${n}" ${state.goal === n ? 'selected' : ''}>${n}問（約${n}〜${Math.round(n*1.7)}分）</option>`).join('')}</select></label><label>受験予定日（任意）<input type="date" name="exam" value="${esc(state.exam)}"></label><p class="subtitle">予定日はこのブラウザに保存されます。現時点では出題内容には影響しません。</p><button class="primary" type="submit">設定を保存する</button><p id="settings-status" role="status"></p></form><section class="card"><h2>データの保存</h2><p class="subtitle">学習記録はこの端末・ブラウザ内に保存されます。自分専用の学習アプリです。別の端末へ移すときは、バックアップを書き出して読み込んでください。</p>${button('学習データをダウンロード','export','secondary')}<div class="backup-import"><label>Macなどのバックアップを読み込む<input id="backup-file" type="file" accept=".json,application/json"></label><p class="subtitle">ファイル確認後、この端末の記録を置き換えます。必要なら先に現在のデータをダウンロードしてください。</p>${importMessage ? `<p class="notice" role="status">${esc(importMessage)}</p>` : ''}${pendingImport ? `<p>${pendingImport.state.history.length}回答・${Object.keys(pendingImport.state.progress).length}問の復習情報を読み込みます。</p>${button('読み込んで記録を置き換える','import-confirm','secondary')}${button('キャンセル','import-cancel','plain')}` : ''}</div><details class="danger-zone"><summary>学習データの初期化</summary><p>回答履歴、復習予定、保存した用語、設定をこのブラウザから削除します。先にデータのダウンロードをおすすめします。</p>${button('すべての学習データを削除','reset','danger')}</details></section><div class="legal-links"><a href="#privacy">データの保存について</a><a href="#about">このアプリについて</a></div><p class="content-note">CFA Instituteとは提携していない独立した学習アプリです。収録問題は独自作成・未監修の学習サンプルです。</p>`;
}
function start(mode = 'daily', topic = 'all', unitId = null, questionId = null) {
  const pool = questionId ? questions.filter(q => q.id === questionId) : unitId ? questions.filter(q => q.unit === unitId) : questions;
  const queue = makeQueue(pool, state.progress, { mode, topic });
  if (!queue.length) { page = 'review'; render(); return; }
  session = { ids: queue.map(q => q.id), index: 0, choice: null, checked: false, results: [], unit: unitId, started: Date.now() };
  page = 'study'; render(); window.scrollTo(0,0);
}
function study() {
  if (!session) return home();
  const q = questions.find(q => q.id === session.ids[session.index]);
  const checked = session.checked;
  const correct = session.choice === q.answer;
  return `<div class="study-top">${button('← 学習を終了','exit','plain')}<span>DAILY SESSION · ${session.index + 1} / ${session.ids.length}</span></div><div class="session-track">${session.ids.map((_,i) => `<i class="${i <= session.index ? 'filled' : ''}"></i>`).join('')}</div><section class="card question-card"><div class="question-meta"><span class="pill soft">${topicOf(q).en}</span><span class="muted">LEVEL I · 基礎</span></div>${q.unit ? `<a class="text-link back-guide" href="#lesson/${q.unit}">この問題の要点を読む →</a>` : ''}<h1 class="question-text" lang="en">${esc(q.prompt)}</h1><details class="hint"><summary>英語のキーワードを見る</summary><p><b>${esc(q.term)}</b>：${esc(q.meaning)}</p></details><div class="options">${q.options.map((option, i) => `<button data-action="choose" data-choice="${i}" class="option ${session.choice === i ? 'selected' : ''} ${checked && i === q.answer ? 'correct' : ''} ${checked && i === session.choice && !correct ? 'incorrect' : ''}" ${checked ? 'disabled' : ''}><span>${'ABC'[i]}</span><span lang="en">${esc(option)}</span>${checked && i === q.answer ? '<b>✓</b>' : ''}</button>`).join('')}</div>${!checked ? button('回答を確認する','check','primary full',session.choice === null ? 'disabled' : '') : `<div class="answer-feedback ${correct ? 'is-correct' : 'is-incorrect'}" role="status"><b>${correct ? '✓ 正解です！' : 'もう一度、理解を深めよう。正解は ' + 'ABC'[q.answer]}</b><p>${esc(q.summary)}</p></div><section class="explanation"><span class="eyebrow">UNDERSTAND IN JAPANESE</span><h2>日本語で理解する</h2><p>${esc(q.explanation)}</p><details><summary>各選択肢のポイント</summary>${q.reasons.map((reason,i) => `<p><b>${'ABC'[i]}.</b> ${esc(reason)}</p>`).join('')}</details><div class="term-box"><div><small>KEYWORD</small><strong>${esc(q.term)}</strong><span>${esc(q.meaning)}</span></div>${button(state.bookmarks.includes(q.id) ? '✓ 保存済み' : '＋ 用語を保存','bookmark','secondary',`data-id="${q.id}"`)}</div></section><section class="confidence"><h3>今の理解度は？</h3><p class="subtitle">回答と自信度を記録して、次の復習を決めます。</p><div class="confidence-buttons">${button('まだ不安','finish','','data-confidence="unsure"')}${button('少し迷った','finish','','data-confidence="maybe"')}${button('自信あり ✓','finish','','data-confidence="sure"')}</div></section>`}</section>`;
}
function result() {
  if (!session) return home();
  const correct = session.results.filter(r => r.correct).length;
  return `${heading('A SMALL STEP, WELL DONE','今日の一歩、おつかれさま。')}<section class="card result-card"><span class="result-icon">✦</span><h2>またひとつ、前に進みました。</h2><p class="subtitle">${session.results.length}問の学習を記録しました。</p><div class="result-score">${correct}<span> / ${session.results.length}問正解</span></div><p>次の復習は、それぞれの理解度に合わせて。</p>${session.results.map(r => { const q = questions.find(q => q.id === r.id); return `<div class="review-row"><span class="result-dot ${r.correct ? 'yes' : ''}">${r.correct ? '✓' : '↻'}</span><div><strong>${esc(q.term)}</strong><small>次の復習：${esc(r.due)}</small></div></div>`; }).join('')}<div class="result-actions"><a class="primary" href="#home">ホームに戻る</a>${session.unit ? button('この単元を続ける','continue-unit','secondary') : button('もう3問学ぶ','start','secondary')}</div></section>`;
}
app.addEventListener('click', async event => {
  if (saving) return;
  const link = event.target.closest('a[href^="#"]');
  if (link) {
    event.preventDefault();
    const target = link.getAttribute('href').slice(1);
    if (validPage(target)) {
      page = target; location.hash = target; render(); window.scrollTo(0,0);
    }
    return;
  }
  const el = event.target.closest('[data-action]'); if (!el) return;
  const action = el.dataset.action;
  if(action==='pwa-install') return void installApp();
  if(action==='pwa-persist') return void protectStorage();
  if(action==='pwa-update') { if(page==='study') return; return applyUpdate(); }
  if(action==='import-cancel'){pendingImport=null;importMessage='';}
  if(action==='import-confirm'&&pendingImport){
    const now = new Date().toISOString();
    state={...empty(),...pendingImport.state,meta:{...emptyMeta(),updatedAt:now}};
    session=null;pendingImport=null;importMessage='✓ バックアップを読み込みました。';await saved();
  }
  if(action==='sync-now'){
    syncFeedback='';syncFeedbackError=false;
    const res=await syncManager.syncNow();
    if(res.ok){syncFeedback='✓ 同期が完了しました。';syncFeedbackError=false;}
    else if(!res.skipped){syncFeedback=syncManager.getStatus().message||'同期できませんでした。';syncFeedbackError=true;}
    refreshSyncUi();return;
  }
  if(action==='sync-copy-code'){
    const cfg=syncManager.getConfig();
    if(cfg){
      try{
        const code=encodePairingCode({gistId:cfg.gistId,token:cfg.token});
        pairingCodeRevealed=code;
        if(navigator.clipboard?.writeText){
          try{await navigator.clipboard.writeText(code);syncFeedback='✓ 接続コードをコピーしました。もう一方の端末に貼り付けてください。';syncFeedbackError=false;}
          catch{syncFeedback='下の欄から接続コードをコピーして、もう一方の端末に貼り付けてください。';syncFeedbackError=false;}
        }else{
          syncFeedback='下の欄から接続コードをコピーして、もう一方の端末に貼り付けてください。';syncFeedbackError=false;
        }
      }catch(error){syncFeedback=error.message;syncFeedbackError=true;}
    }
    refreshSyncUi();return;
  }
  if(action==='sync-hide-code'){pairingCodeRevealed='';refreshSyncUi();return;}
  if(action==='sync-disconnect'){
    if(!confirm('クラウド同期の連携を解除しますか？（端末内の学習記録は削除されません）')) return;
    pairingCodeRevealed='';syncFeedback='クラウド同期を解除しました。';syncFeedbackError=false;
    await syncManager.disconnect();render();return;
  }
  if (action === 'guide-mode') {
    const nextMode = el.dataset.mode;
    if (['units', 'vocab', 'questions'].includes(nextMode)) {
      guideMode = nextMode;
      render();
    }
    return;
  }
  if (action === 'open-question-bank') {
    guideMode = 'questions';
    page = 'curriculum';
    location.hash = 'curriculum';
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (action === 'audit-question') return start('daily', 'all', null, el.dataset.id);
  if (action === 'continue-unit') return start('daily', 'all', session?.unit);
  if (action === 'unit-study') return start('daily', 'all', el.dataset.unit);
  if (action === 'read-unit' && units.some(u => u.id === el.dataset.unit)) {
    const id = el.dataset.unit;
    const read = state.readUnits || [];
    const nextRead = !read.includes(id);
    state.readUnits = nextRead ? [...read, id] : read.filter(x => x !== id);
    const now = new Date().toISOString();
    const meta = ensureMeta();
    meta.readUnitsAt[id] = { value: nextRead, at: now };
    meta.updatedAt = now;
    await saved();
  }
  if (action === 'start') return start();
  if (action === 'review-start') return start('review');
  if (action === 'topic') return start('daily', el.dataset.topic);
  if (action === 'choose' && session && !session.checked) session.choice = Number(el.dataset.choice);
  if (action === 'check' && session && session.choice !== null) session.checked = true;
  if (action === 'exit') {
    if (!confirm('学習を終了しますか？ 理解度を選んで記録した回答は保存されています。')) return;
    session = null; page = 'home';
  }
  if (action === 'finish' && session?.checked) {
    saving = true;
    document.querySelectorAll('[data-action="finish"]').forEach(button => { button.disabled = true; });
    const id = session.ids[session.index];
    const q = questions.find(q => q.id === id);
    const correct = session.choice === q.answer;
    const now = new Date().toISOString();
    state.progress[id] = schedule(state.progress[id], correct, el.dataset.confidence);
    state.history.push({ id, correct, confidence: el.dataset.confidence, day: dayKey(), at: now });
    ensureMeta().updatedAt = now;
    session.results.push({ id, correct, due: state.progress[id].due }); await saved();
    saving = false;
    if (session.index + 1 >= session.ids.length) page = 'result';
    else { session.index++; session.choice = null; session.checked = false; }
    window.scrollTo(0,0);
  }
  if (action === 'bookmark') {
    const id = el.dataset.id;
    const nextSaved = !state.bookmarks.includes(id);
    state.bookmarks = nextSaved ? [...state.bookmarks, id] : state.bookmarks.filter(x => x !== id);
    const now = new Date().toISOString();
    const meta = ensureMeta();
    meta.bookmarksAt[id] = { value: nextSaved, at: now };
    meta.updatedAt = now;
    await saved();
  }
  if (action === 'export') {
    const payload = JSON.stringify({ version: 1, progress: state.progress, history: state.history, bookmarks: state.bookmarks, readUnits: state.readUnits, exam: state.exam, goal: state.goal }, null, 2);
    if (native) {
      try { await native.backup.save({ filename: `cfa-pocket-${dayKey()}.json`, content: payload }); }
      catch { warning = 'バックアップを保存できませんでした。保存先を選んで再度お試しください。'; render(); }
      return;
    }
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `cfa-pocket-${dayKey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); return;
  }
  if (action === 'reset') {
    if (!confirm('このブラウザの学習記録をすべて削除します。この操作は元に戻せません。削除しますか？')) return;
    const now = new Date().toISOString();
    state = empty();
    state.meta.resetAt = now;
    state.meta.updatedAt = now;
    session = null; await saved();
  }
  render();
  if (action === 'check') document.querySelector('.answer-feedback')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
app.addEventListener('submit', async event => {
  if (saving) { event.preventDefault(); return; }
  if (event.target.id === 'guide-search') {
    event.preventDefault(); const data = new FormData(event.target);
    guideTopic = String(data.get('topic') || 'all');
    guideFilter = String(data.get('filter') || guideFilter || 'all');
    guideQuery = String(data.get('query') || '').trim();
    render(); return;
  }
  if (event.target.id === 'sync-connect-form' || event.target.id === 'sync-pairing-form') {
    event.preventDefault();
    if (syncBusy) return;
    syncBusy = true; syncFeedback = ''; syncFeedbackError = false;
    const data = new FormData(event.target);
    try {
      const creds = event.target.id === 'sync-pairing-form'
        ? decodePairingCode(String(data.get('code') || ''))
        : { token: String(data.get('token') || ''), gistId: String(data.get('gistId') || '') };
      const res = await syncManager.connect(creds);
      syncFeedback = res.created
        ? '✓ 非公開Gistを作成し、自動同期を開始しました。2台目の端末には「接続コードをコピー」して貼り付けてください。'
        : '✓ 既存のGistと連携し、学習記録を統合しました。';
      syncFeedbackError = false;
    } catch (error) {
      syncFeedback = error.message || '連携できませんでした。入力内容を確認してください。';
      syncFeedbackError = true;
    } finally {
      syncBusy = false;
      render();
    }
    return;
  }
  if (event.target.id !== 'settings-form') return;
  event.preventDefault(); const data = new FormData(event.target);
  const nextGoal = [3,6,9].includes(Number(data.get('goal'))) ? Number(data.get('goal')) : 3;
  const nextExam = String(data.get('exam') || '');
  const now = new Date().toISOString();
  const meta = ensureMeta();
  if (nextGoal !== state.goal) meta.goalAt = now;
  if (nextExam !== state.exam) meta.examAt = now;
  meta.updatedAt = now;
  state.goal = nextGoal;
  state.exam = nextExam; await saved(); render();
  document.querySelector('#settings-status').textContent = warning || '✓ 設定を保存しました。';
});
app.addEventListener('change', async event=>{
  if(event.target.form?.id==='guide-search'&&(event.target.name==='topic'||event.target.name==='filter')){
    const data=new FormData(event.target.form);
    guideTopic=String(data.get('topic')||'all');
    guideFilter=String(data.get('filter')||guideFilter||'all');
    guideQuery=String(data.get('query')||'').trim();
    render();return;
  }
  if(event.target.id!=='backup-file')return;
  const file=event.target.files?.[0];if(!file)return;
  pendingImport=null;
  try{
    if(file.size>10*1024*1024)throw new Error('10MB以下のバックアップを選んでください。');
    const checked=validateBackup(JSON.parse(await file.text()),questions.map(q=>q.id),units.map(u=>u.id));
    pendingImport=checked;importMessage=checked.skipped ? `内容を確認しました。現行教材にない${checked.skipped}件は除きます。` : '内容を確認しました。下のボタンで読み込みを確定してください。';
  }catch(error){importMessage=error instanceof SyntaxError?'JSONファイルを読み取れませんでした。':error.message;}
  if(page==='settings')render();
});
window.addEventListener('hashchange', () => { page = location.hash.slice(1) || 'home'; if (!validPage(page)) page = 'home'; render(); window.scrollTo(0,0); });
page = validPage(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
onPwaChange(refreshPwaUi);
async function boot() {
  try {
    const record = await storage.load();
    if (record !== null) {
      if (!record?.progress || !Array.isArray(record.history) || !Array.isArray(record.bookmarks)) throw new Error('Invalid stored state');
      state = { ...empty(), ...record };
    }
  } catch {
    loadFailed = true;
    warning = '保存データを読み込めませんでした。元データを保護するため書き込みは停止しています。データを削除せず開き直してください。';
  }
  render();
  installKeyboardLayout(window, document);
  if (native) {
    await native.app.addListener('backButton', async () => {
      if (saving) return;
      const active = document.activeElement;
      if (document.documentElement.classList.contains('keyboard-open')) { active?.blur(); await native.keyboard.hide(); return; }
      if (page === 'study' && !confirm('学習を終了しますか？ 理解度を選んで記録した回答は保存されています。')) return;
      const target = backDestination(page, session?.unit);
      await storage.flush();
      if (!target) { await native.app.minimizeApp(); return; }
      session = null; page = target; location.hash = target; render(); window.scrollTo(0, 0);
    });
    await native.app.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) void storage.flush();
      else void syncManager.syncNow();
    });
  }
  window.addEventListener('online', () => { void syncManager.syncNow(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void syncManager.syncNow(); });
  const syncConfigured = await syncManager.init();
  if (syncConfigured) {
    refreshSyncUi();
    void syncManager.syncNow();
  }
  void initPwa();
}
void boot();
