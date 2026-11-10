import { topics, questions } from './questions.js';
import { units, curriculumYear } from './curriculum.js';
import { guide, lesson } from './learning-guide.js';
import { auditView } from './los-audit.js';
import { initPwa, pwaState, onPwaChange, pwaPanel, installApp, applyUpdate, protectStorage } from './pwa.js';
import { validateBackup } from './backup.js';
import { dayKey, addDays, dueQuestions, makeQueue, schedule, streak } from './engine.js';

const KEY = 'cfa-pocket-v1';
const empty = () => ({ progress: {}, history: [], bookmarks: [], readUnits: [], exam: '', goal: 3 });
let state = empty();
let warning = '';
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && saved.progress && Array.isArray(saved.history) && Array.isArray(saved.bookmarks)) state = { ...empty(), ...saved };
} catch { warning = '保存データを読み込めませんでした。この画面では新しい記録で開始します。'; }
let page = 'home';
let session = null;
let guideTopic = 'all';
let guideQuery = '';
let pendingImport = null;
let importMessage = '';
const validPage = value => ['home','topics','curriculum','coverage','review','stats','settings'].includes(value) || value.startsWith('lesson/');
const app = document.querySelector('#app');
const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const topicOf = q => topics.find(t => t.id === q.topic);
const saved = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { warning = 'ブラウザの保存領域が利用できません。記録はこの画面を閉じると失われます。'; }
};
const todayCount = () => state.history.filter(h => h.day === dayKey()).length;
const due = () => dueQuestions(questions, state.progress);
const button = (label, action, cls = '', extra = '') => `<button class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const topicBadge = topic => `<span class="topic-icon" style="background:${topic.color}">${topic.icon}</span>`;
const percent = list => list.length ? Math.round(list.filter(h => h.correct).length / list.length * 100) : 0;

function refreshPwaUi() {
  const panel=document.querySelector('#pwa-panel'); if(panel) panel.innerHTML=pwaPanel(esc,page==='study');
  const status=pwaState(); const notices=document.querySelector('#pwa-notices');
  if(notices) notices.innerHTML = !status.online ? `<a class="pwa-toast" href="#settings">${status.offlineReady ? '○ オフラインで学習中' : '○ オフライン · 教材保存を確認してください'}</a>` : status.updateReady ? `<a class="pwa-toast" href="#settings">新しい教材があります。学習後に設定から更新できます →</a>` : '';
}
function render() {
  const views = { home, topics: topicPage, coverage: () => auditView({heading, esc}), curriculum: () => guide({topics, state, topic: guideTopic, query: guideQuery, esc, heading}), review, stats, settings, study, result };
  if (page.startsWith('lesson/')) views[page] = () => lesson({ id: page.slice(7), topics, state, esc, heading });
  app.innerHTML = `<aside class="sidebar"><a href="#home" class="brand"><span class="brand-mark">▥</span><span>CFA<span class="brand-light"> Pocket</span><small>小さな時間、大きな一歩。</small></span></a><div class="level">LEVEL I <span>基礎トレーニング</span></div><nav aria-label="メインナビゲーション">${[['home','⌂','ホーム'],['topics','▦','分野から学ぶ'],['curriculum','☷','学習ガイド'],['review','↻','復習する'],['stats','▥','学習記録']].map(([key,icon,label]) => `<a href="#${key}" class="${page === key ? 'active' : ''}"><span>${icon}</span>${label}${key === 'review' && due().length ? `<b>${due().length}</b>` : ''}</a>`).join('')}</nav><div class="side-bottom"><div class="side-note"><span>ONE STEP AT A TIME</span><p>5分の積み重ねが、<br>未来の自信になる。</p><div class="steps"><i></i><i></i><i></i><i></i><i></i></div></div><a href="#settings" class="settings-link">⚙ 学習設定</a><small class="muted">独立した非公式の学習プロトタイプ</small></div></aside><div class="workspace"><header class="topbar"><span>CFA LEVEL I <span class="header-sep">/</span> YOUR DAILY PROGRESS</span><a href="#settings" class="profile" aria-label="学習設定">JP</a></header><main id="main">${warning ? `<div class="notice" role="status">${esc(warning)}</div>` : ''}${(views[page] || home)()}</main><footer>英語で解いて、日本語で理解する。<span>CFA Pocket · Prototype 0.1</span></footer></div><nav class="mobile-nav" aria-label="モバイルナビゲーション">${[['home','⌂','ホーム'],['topics','▦','分野'],['curriculum','☷','ガイド'],['review','↻','復習'],['stats','▥','記録'],['settings','⚙','設定']].map(([key,icon,label]) => `<a href="#${key}" class="${page === key ? 'active' : ''}"><span>${icon}</span>${label}</a>`).join('')}</nav>`;
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
function review() {
  const list = due();
  const upcoming = questions.filter(q => state.progress[q.id]?.due > dayKey()).sort((a,b) => state.progress[a.id].due.localeCompare(state.progress[b.id].due));
  return `${heading('A LITTLE RECALL, A LOT OF GROWTH','復習する','忘れる前のもう一度が、知識を自分のものに。')}<section class="card review-summary"><span class="metric-icon green">↻</span><div><h2>今日の復習は${list.length}問</h2><p class="subtitle">${list.length ? '1回3問まで。短い時間で取り組めます。' : '今のところ、期限を迎えた問題はありません。'}</p></div>${list.length ? button('復習をはじめる →','review-start','primary') : ''}</section>${list.length ? `<section class="card"><h2>復習のタイミング</h2>${list.map(reviewRow).join('')}</section>` : `<div class="empty-state"><span>✓</span><h2>次の一歩を、気軽に。</h2><p>新しい問題に答えると、ここに復習予定が表示されます。</p>${button('3問学習する →','start','primary')}</div>`}${upcoming.length ? `<section class="card"><h2>これからの復習</h2>${upcoming.map(reviewRow).join('')}</section>` : ''}`;
}
function reviewRow(q) { return `<div class="review-row">${topicBadge(topicOf(q))}<div><strong>${esc(q.term)}</strong><small>${esc(q.meaning)} · ${topicOf(q).name}</small></div><span class="due-label">${esc(state.progress[q.id].due)}</span></div>`; }
function stats() {
  const days = Array.from({ length: 7 }, (_, i) => addDays(dayKey(), i - 6));
  return `${heading('LOOK HOW FAR YOU HAVE COME','学習記録','小さな積み重ねを、見えるかたちに。')}<section class="metrics"><article class="card"><p class="subtitle">累計回答</p><strong class="big-number">${state.history.length}<small> 問</small></strong></article><article class="card"><p class="subtitle">全体正答率</p><strong class="big-number">${state.history.length ? percent(state.history) + '%' : '—'}</strong></article><article class="card"><p class="subtitle">学習した問題</p><strong class="big-number">${questions.filter(q => state.progress[q.id]).length}<small> / ${questions.length}</small></strong></article></section><section class="card"><h2>この7日間</h2><div class="week-grid">${days.map(day => { const n = state.history.filter(h => h.day === day).length; return `<div class="week-day ${n ? 'done' : ''}"><small>${Number(day.slice(-2))}日</small><span>${n ? '✓' : '·'}</span><small>${n}問</small></div>`; }).join('')}</div></section><section class="card"><h2>分野別の記録</h2>${topics.map(t => { const list = state.history.filter(h => questions.find(q => q.id === h.id)?.topic === t.id); return `<div class="review-row">${topicBadge(t)}<div><strong>${t.name}</strong><small>${list.length}回答</small></div><b>${list.length ? percent(list) + '%' : '未学習'}</b></div>`; }).join('')}</section><section class="card"><h2>保存した用語</h2>${state.bookmarks.length ? questions.filter(q => state.bookmarks.includes(q.id)).map(q => `<div class="review-row"><div><strong>${esc(q.term)}</strong><small>${esc(q.meaning)}</small></div>${button('解除','bookmark','','data-id="'+q.id+'"')}</div>`).join('') : '<p class="subtitle">解説画面で重要用語を保存できます。</p>'}</section>`;
}
function settings() {
  return `${heading('YOUR OWN PACE','学習設定','無理なく続けられるペースを選びましょう。')}<div id="pwa-panel">${pwaPanel(esc,page==='study')}</div><form id="settings-form" class="card settings-form"><label>1日の目標<select name="goal">${[3,6,9].map(n => `<option value="${n}" ${state.goal === n ? 'selected' : ''}>${n}問（約${n}〜${Math.round(n*1.7)}分）</option>`).join('')}</select></label><label>受験予定日（任意）<input type="date" name="exam" value="${esc(state.exam)}"></label><p class="subtitle">予定日はこのブラウザに保存されます。現時点では出題内容には影響しません。</p><button class="primary" type="submit">設定を保存する</button><p id="settings-status" role="status"></p></form><section class="card"><h2>データの保存</h2><p class="subtitle">学習記録はこの端末・ブラウザ内に保存されます。アカウント同期・通知・課金機能は未実装です。</p>${button('学習データをダウンロード','export','secondary')}<div class="backup-import"><label>Macなどのバックアップを読み込む<input id="backup-file" type="file" accept=".json,application/json"></label><p class="subtitle">ファイル確認後、この端末の記録を置き換えます。必要なら先に現在のデータをダウンロードしてください。</p>${importMessage ? `<p class="notice" role="status">${esc(importMessage)}</p>` : ''}${pendingImport ? `<p>${pendingImport.state.history.length}回答・${Object.keys(pendingImport.state.progress).length}問の復習情報を読み込みます。</p>${button('読み込んで記録を置き換える','import-confirm','secondary')}${button('キャンセル','import-cancel','plain')}` : ''}</div><details class="danger-zone"><summary>学習データの初期化</summary><p>回答履歴、復習予定、保存した用語、設定をこのブラウザから削除します。先にデータのダウンロードをおすすめします。</p>${button('すべての学習データを削除','reset','danger')}</details></section><p class="content-note">CFA Instituteとは提携していない非公式プロトタイプです。収録問題は独自作成・未監修の学習サンプルです。</p>`;
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
app.addEventListener('click', event => {
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
  if(action==='import-confirm'&&pendingImport){state=pendingImport.state;session=null;pendingImport=null;importMessage='✓ バックアップを読み込みました。';saved();}
  if (action === 'audit-question') return start('daily', 'all', null, el.dataset.id);
  if (action === 'continue-unit') return start('daily', 'all', session?.unit);
  if (action === 'unit-study') return start('daily', 'all', el.dataset.unit);
  if (action === 'read-unit' && units.some(u => u.id === el.dataset.unit)) {
    const id = el.dataset.unit;
    const read = state.readUnits || [];
    state.readUnits = read.includes(id) ? read.filter(x => x !== id) : [...read, id]; saved();
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
    const id = session.ids[session.index];
    const q = questions.find(q => q.id === id);
    const correct = session.choice === q.answer;
    state.progress[id] = schedule(state.progress[id], correct, el.dataset.confidence);
    state.history.push({ id, correct, confidence: el.dataset.confidence, day: dayKey(), at: new Date().toISOString() });
    session.results.push({ id, correct, due: state.progress[id].due }); saved();
    if (session.index + 1 >= session.ids.length) page = 'result';
    else { session.index++; session.choice = null; session.checked = false; }
    window.scrollTo(0,0);
  }
  if (action === 'bookmark') {
    const id = el.dataset.id;
    state.bookmarks = state.bookmarks.includes(id) ? state.bookmarks.filter(x => x !== id) : [...state.bookmarks, id]; saved();
  }
  if (action === 'export') {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, ...state }, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `cfa-pocket-${dayKey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); return;
  }
  if (action === 'reset') {
    if (!confirm('このブラウザの学習記録をすべて削除します。この操作は元に戻せません。削除しますか？')) return;
    state = empty(); session = null; saved();
  }
  render();
  if (action === 'check') document.querySelector('.answer-feedback')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
app.addEventListener('submit', event => {
  if (event.target.id === 'guide-search') {
    event.preventDefault(); const data = new FormData(event.target);
    guideTopic = String(data.get('topic')); guideQuery = String(data.get('query') || '').trim(); render(); return;
  }
  if (event.target.id !== 'settings-form') return;
  event.preventDefault(); const data = new FormData(event.target);
  state.goal = [3,6,9].includes(Number(data.get('goal'))) ? Number(data.get('goal')) : 3;
  state.exam = String(data.get('exam') || ''); saved(); render();
  document.querySelector('#settings-status').textContent = warning || '✓ 設定を保存しました。';
});
app.addEventListener('change', async event=>{
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
render();
void initPwa();
