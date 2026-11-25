import { units, unitStatus, curriculumYear, curriculumSources } from './curriculum.js';
import { questions } from './questions.js';
import {
  vocabularyForUnit,
  questionsForUnit,
  allVocabulary,
  renderQuestionPreview
} from './vocabulary.js';

function matchesFilter(q, filter, state) {
  if (!filter || filter === 'all') return true;
  const p = state?.progress?.[q.id];
  if (filter === 'attempted') return Boolean(p);
  if (filter === 'unseen') return !p;
  if (filter === 'saved') return Boolean(state?.bookmarks?.includes(q.id));
  if (filter === 'review') return Boolean(p && (!p.lastCorrect || p.lastConfidence !== 'sure'));
  return true;
}

function matchesQuestionQuery(q, queryLower, unitsById) {
  if (!queryLower) return true;
  const unitTitle = unitsById.get(q.unit)?.title || '';
  const haystack = [
    q.id,
    q.term,
    q.meaning,
    q.prompt,
    ...q.options,
    q.summary,
    q.explanation,
    unitTitle
  ].join(' ').toLowerCase();
  return haystack.includes(queryLower);
}

export function guide({ topics, state, topic = 'all', query = '', mode = 'units', filter = 'all', esc, heading }) {
  const qLower = query.toLowerCase();
  const unitsById = new Map(units.map(u => [u.id, u]));
  const vocabAll = allVocabulary(units, questions);
  const read = units.filter(u => state.readUnits?.includes(u.id)).length;
  const attempted = units.filter(u => unitStatus(u, state.progress).attempted > 0).length;

  const tabs = `<div class="guide-tabs" role="tablist" aria-label="学習ガイドの表示切替">
    <button type="button" class="guide-tab ${mode === 'units' ? 'active' : ''}" data-action="guide-mode" data-mode="units">単元ガイド（${units.length}単元）</button>
    <button type="button" class="guide-tab ${mode === 'vocab' ? 'active' : ''}" data-action="guide-mode" data-mode="vocab">学ぶべき英単語（${vocabAll.length}語）</button>
    <button type="button" class="guide-tab ${mode === 'questions' ? 'active' : ''}" data-action="guide-mode" data-mode="questions">問題一覧・検索（${questions.length}問）</button>
  </div>`;

  const filterSelect = mode !== 'units'
    ? `<label>学習状況<select name="filter">${[
        ['all', 'すべて'],
        ['attempted', '解いたことがある'],
        ['review', '間違えた・要復習'],
        ['saved', '保存した用語'],
        ['unseen', 'まだ解いていない']
      ].map(([val, label]) => `<option value="${val}" ${filter === val ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`
    : '';

  const placeholder = mode === 'questions'
    ? '例：duration、ベイズ、PER、q15、问题文の英単語'
    : mode === 'vocab'
    ? '例：skewness、歪度、covenant、利回り'
    : '例：ベイズ、税、先物、duration';

  const searchForm = `<form id="guide-search" class="card guide-filters">
    <label>分野<select name="topic">${[{ id: 'all', name: 'すべての分野' }, ...topics].map(t => `<option value="${t.id}" ${topic === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}</select></label>
    ${filterSelect}
    <label>キーワード<input name="query" type="search" value="${esc(query)}" placeholder="${placeholder}"></label>
    <button class="primary" type="submit">絞り込む</button>
  </form>`;

  let body = '';

  if (mode === 'vocab') {
    const matchedVocab = vocabAll.filter(v => {
      if (topic !== 'all' && v.topic !== topic) return false;
      if (filter !== 'all') {
        if (!v.question) return false;
        if (!matchesFilter(v.question, filter, state)) return false;
      }
      if (!qLower) return true;
      const unitTitle = unitsById.get(v.unitId)?.title || '';
      return [v.term, v.meaning, v.note, unitTitle, v.question?.prompt || ''].join(' ').toLowerCase().includes(qLower);
    });

    body = `<p class="subtitle">${matchedVocab.length}語の重要英単語を表示（英語で問われるキーワードと日本語の要点、関連問題を確認できます）</p>
      ${topics.filter(t => matchedVocab.some(v => v.topic === t.id)).map(t => {
        const list = matchedVocab.filter(v => v.topic === t.id);
        return `<section class="card guide-section">
          <h2>${t.name}<small>${t.en} · ${list.length}語</small></h2>
          <div class="vocab-list">
            ${list.map(v => {
              const unit = unitsById.get(v.unitId);
              const q = v.question;
              const bookmarked = q && state.bookmarks?.includes(q.id);
              return `<article class="vocab-item">
                <div class="vocab-item-main">
                  <div class="vocab-head">
                    <strong class="vocab-en" lang="en">${esc(v.term)}</strong>
                    <span class="vocab-ja">${esc(v.meaning)}</span>
                    ${unit ? `<a class="vocab-unit-link" href="#lesson/${esc(unit.id)}">${esc(unit.title)} →</a>` : ''}
                  </div>
                  <p class="vocab-note">${esc(v.note)}</p>
                  ${q ? `<details class="vocab-q-details">
                    <summary>この英単語の問題と解説を見る（${esc(q.id)}）</summary>
                    <div class="vocab-q-box">
                      <p class="q-preview-prompt" lang="en">${esc(q.prompt)}</p>
                      <div class="q-preview-options">
                        ${q.options.map((opt, i) => `<div class="q-preview-opt ${i === q.answer ? 'is-answer' : ''}"><span class="q-opt-letter">${'ABC'[i]}</span><span lang="en">${esc(opt)}</span>${i === q.answer ? '<b>✓ 正解</b>' : ''}</div>`).join('')}
                      </div>
                      <p class="q-exp-summary"><b>解説：</b>${esc(q.explanation)}</p>
                    </div>
                  </details>` : ''}
                </div>
                ${q ? `<div class="vocab-item-actions">
                  <button class="secondary" data-action="audit-question" data-id="${esc(q.id)}">1問解く</button>
                  <button class="secondary" data-action="bookmark" data-id="${esc(q.id)}">${bookmarked ? '✓ 保存済み' : '＋ 保存'}</button>
                </div>` : ''}
              </article>`;
            }).join('')}
          </div>
        </section>`;
      }).join('') || '<section class="empty-state"><h2>一致する英単語がありません</h2><p>分野や学習状況、キーワードを変えてください。</p></section>'}`;
  } else if (mode === 'questions') {
    const matchedQuestions = questions.filter(q =>
      (topic === 'all' || q.topic === topic) &&
      matchesFilter(q, filter, state) &&
      matchesQuestionQuery(q, qLower, unitsById)
    );

    body = `<p class="subtitle">${matchedQuestions.length}問を表示（「選択肢と正解・日本語解説を見る」で問題の中身を確認したり、「この1問を解く」で演習できます）</p>
      ${matchedQuestions.length
        ? `<div class="q-preview-list">${matchedQuestions.map(q => renderQuestionPreview(q, { state, topics, units, esc })).join('')}</div>`
        : '<section class="empty-state"><h2>一致する問題がありません</h2><p>分野や学習状況、キーワードを変えてください。</p></section>'}`;
  } else {
    const matched = units.filter(u => {
      if (topic !== 'all' && u.topic !== topic) return false;
      if (!qLower) return true;
      const unitTerms = vocabularyForUnit(u, questions).flatMap(v => [v.term, v.meaning]);
      return [u.title, ...u.notes, ...u.objectives, ...unitTerms].join(' ').toLowerCase().includes(qLower);
    });

    body = `<p class="subtitle">${matched.length}単元を表示（各単元で学ぶべき英単語と確認問題の一覧も見られます）</p>
      ${topics.filter(t => matched.some(u => u.topic === t.id)).map(t => `<section class="card guide-section"><h2>${t.name}<small>${t.en}</small></h2><div class="unit-grid">${matched.filter(u => u.topic === t.id).map(u => {
        const s = unitStatus(u, state.progress);
        const vocab = vocabularyForUnit(u, questions);
        const sampleTerms = vocab.slice(0, 3).map(v => `<span class="term-chip" lang="en">${esc(v.term)}</span>`).join('');
        const extraCount = vocab.length > 3 ? `<span class="term-chip more">+${vocab.length - 3}語</span>` : '';
        return `<a href="#lesson/${u.id}" class="unit-card"><span class="unit-state">${state.readUnits?.includes(u.id) ? '✓ 読了' : '約3分で読む'} · ${s.attempted}/${s.total}問回答</span><h3>${esc(u.title)}</h3><p>${esc(u.objectives[0])}</p><div class="unit-term-chips">${sampleTerms}${extraCount}</div><span class="text-link">要点・英単語・問題を見る <span>→</span></span></a>`;
      }).join('')}</div></section>`).join('') || '<section class="empty-state"><h2>一致する単元がありません</h2><p>分野やキーワードを変えてください。</p></section>'}`;
  }

  return `${heading('LEARN THE BIG PICTURE', '学習ガイド', `${curriculumYear}年版を参考に、10分野の要点・学ぶべき英単語・全${questions.length}問を確認できます。`)}
    <section class="card guide-intro"><h2>読む → 英単語と問題を確認する → 解く</h2><p>各単元に日本語の要点・重要な式・学ぶべき英単語と、収録問題の一覧を用意しました。「あの問題なんだっけ？」と思ったときは「問題一覧・検索」や各単元ページからすぐに問題文と解説を見返せます。</p><div class="guide-counts"><span><b>${units.length}</b> 学習単元</span><span><b>${vocabAll.length}</b> 重要英単語</span><span><b>${questions.length}</b> 収録問題</span><span><b>${read}</b> 読了</span><span><b>${attempted}</b> 演習に着手</span></div><p class="subtitle">読了数・演習着手数は、このアプリ内の進捗です。公式学習目標の網羅率・習熟度を示すものではありません。</p></section>
    <section class="card"><h2>問題数ではなく、学習目標から確認</h2><p class="subtitle">公式340項目を照合し、不足に応じて演習を追加しました。関連問題があっても、複合的な学習目標の完全対応とは区別しています。</p><a class="primary" href="#coverage">LOS別の対応状況を見る →</a></section>
    ${tabs}
    ${searchForm}
    ${body}
    <section class="card"><h2>範囲の基準と今後の補強</h2><p class="subtitle">公式の2027年版学習目標を参考にした独自教材です。全340項目を位置別に照合し、関連問題と計算演習の有無を記録しました。全条件・例外までの完全対応、専門家監修、実戦難度の演習は引き続き補強対象です。2026年受験用の差分教材・Practical Skills Modulesは含みません。</p>${curriculumSources.map(s => `<p class="source-link"><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗</a></p>`).join('')}</section>`;
}

export function lesson({ id, topics, state, esc, heading }) {
  const unit = units.find(u => u.id === id);
  if (!unit) return `${heading('LEARNING GUIDE','単元が見つかりません')}<a class="primary" href="#curriculum">学習ガイドへ戻る</a>`;
  const topic = topics.find(t => t.id === unit.topic);
  const s = unitStatus(unit, state.progress);
  const read = state.readUnits?.includes(unit.id);
  const vocab = vocabularyForUnit(unit, questions);
  const unitQs = questionsForUnit(unit, questions);

  return `<a href="#curriculum" class="text-link back-guide">← 学習ガイドへ</a>${heading(`${curriculumYear} · ${esc(topic.en)}`, esc(unit.title))}
    <article class="card lesson-card">
      <h2>この単元のゴール</h2>
      <ul>${unit.objectives.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
      <h2>要点をつかむ</h2>
      <ol class="lesson-notes">${unit.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ol>
      ${unit.formula ? `<div class="formula-box"><span class="eyebrow">KEY FORMULA</span><p>${esc(unit.formula)}</p></div>` : ''}
      <div class="notice"><b>ここに注意</b><p>${esc(unit.pitfall)}</p></div>

      <h2>この単元で学ぶべき英単語（${vocab.length}語）</h2>
      <p class="subtitle">英語の問題文で頻出するキーワードと日本語の意味・ポイントです。用語を保存して学習記録から復習することもできます。</p>
      <div class="vocab-list lesson-vocab-list">
        ${vocab.map(v => {
          const q = v.question;
          const bookmarked = q && state.bookmarks?.includes(q.id);
          return `<div class="vocab-item">
            <div class="vocab-item-main">
              <div class="vocab-head">
                <strong class="vocab-en" lang="en">${esc(v.term)}</strong>
                <span class="vocab-ja">${esc(v.meaning)}</span>
                ${q ? `<span class="q-id-label">問題 ${esc(q.id)}</span>` : '<span class="q-id-label">単元重要語</span>'}
              </div>
              <p class="vocab-note">${esc(v.note)}</p>
            </div>
            ${q ? `<div class="vocab-item-actions">
              <button class="secondary" data-action="audit-question" data-id="${esc(q.id)}">1問解く</button>
              <button class="secondary" data-action="bookmark" data-id="${esc(q.id)}">${bookmarked ? '✓ 保存済み' : '＋ 保存'}</button>
            </div>` : ''}
          </div>`;
        }).join('')}
      </div>

      <div class="lesson-actions">
        <button class="secondary" data-action="read-unit" data-unit="${unit.id}" aria-pressed="${Boolean(read)}">${read ? '✓ 読了を記録済み' : 'この単元を読了にする'}</button>
        <button class="primary" data-action="unit-study" data-unit="${unit.id}">${Math.min(3,unit.questions.length)}問ずつ演習する →</button>
      </div>
      <p class="subtitle">この単元は全${unit.questions.length}問（基礎演習を含めると${unitQs.length}問） · ${s.attempted}/${s.total}問に回答 · 直近で正解かつ自信あり：${s.confident}問。確認問題だけで単元の全論点を評価するものではありません。</p>

      <div class="lesson-questions-section">
        <h2>この単元の問題を確認する（全${unitQs.length}問）</h2>
        <p class="subtitle">「あの問題なんだっけ？」と見返したいときは、下の「選択肢と正解・日本語解説を見る」を開くとその場で問題と解説を確認できます。「この1問を解く」で1問ずつ演習もできます。</p>
        <div class="q-preview-list">
          ${unitQs.map(q => renderQuestionPreview(q, { state, topics, units, esc, showUnitLink: false })).join('')}
        </div>
      </div>

      <details class="lesson-sources"><summary>参照先・補足</summary><p class="subtitle">独自作成の要点整理です。基準・定義の詳細は参照先で確認できます。</p>${unit.sources.map(url => `<p class="source-link"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(new URL(url).hostname)} の参照資料 ↗</a></p>`).join('')}</details>
    </article>`;
}
