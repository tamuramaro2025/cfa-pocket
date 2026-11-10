import { units, unitStatus, curriculumYear, curriculumSources } from './curriculum.js';

export function guide({ topics, state, topic = 'all', query = '', esc, heading }) {
  const matched = units.filter(u => (topic === 'all' || u.topic === topic) && [u.title, ...u.notes, ...u.objectives].join(' ').toLowerCase().includes(query.toLowerCase()));
  const read = units.filter(u => state.readUnits?.includes(u.id)).length;
  const attempted = units.filter(u => unitStatus(u, state.progress).attempted > 0).length;
  return `${heading('LEARN THE BIG PICTURE', '学習ガイド', `${curriculumYear}年版を参考に、10分野を短い単元で横断的に学びます。`)}
    <section class="card guide-intro"><h2>読む → 解く → 復習する</h2><p>各単元に日本語の要点・重要な式・間違えやすい点と、確認問題を用意しました。1単元ずつ、知識の空白を埋めていきましょう。</p><div class="guide-counts"><span><b>${units.length}</b> 学習単元</span><span><b>${read}</b> 読了</span><span><b>${attempted}</b> 演習に着手</span></div><p class="subtitle">読了数・演習着手数は、このアプリ内の進捗です。公式学習目標の網羅率・習熟度を示すものではありません。</p></section>
    <section class="card"><h2>問題数ではなく、学習目標から確認</h2><p class="subtitle">公式340項目を照合し、不足に応じて演習を追加しました。関連問題があっても、複合的な学習目標の完全対応とは区別しています。</p><a class="primary" href="#coverage">LOS別の対応状況を見る →</a></section>\n    <form id="guide-search" class="card guide-filters"><label>分野<select name="topic">${[{id:'all',name:'すべての分野'}, ...topics].map(t => `<option value="${t.id}" ${topic === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}</select></label><label>キーワード<input name="query" type="search" value="${esc(query)}" placeholder="例：ベイズ、税、先物"></label><button class="primary" type="submit">絞り込む</button></form>
    <p class="subtitle">${matched.length}単元を表示</p>
    ${topics.filter(t => matched.some(u => u.topic === t.id)).map(t => `<section class="card guide-section"><h2>${t.name}<small>${t.en}</small></h2><div class="unit-grid">${matched.filter(u => u.topic === t.id).map(u => {
      const s = unitStatus(u, state.progress);
      return `<a href="#lesson/${u.id}" class="unit-card"><span class="unit-state">${state.readUnits?.includes(u.id) ? '✓ 読了' : '約3分で読む'} · ${s.attempted}/${s.total}問回答</span><h3>${esc(u.title)}</h3><p>${esc(u.objectives[0])}</p><span class="text-link">学ぶ <span>→</span></span></a>`;
    }).join('')}</div></section>`).join('') || '<section class="empty-state"><h2>一致する単元がありません</h2><p>分野やキーワードを変えてください。</p></section>'}
    <section class="card"><h2>範囲の基準と今後の補強</h2><p class="subtitle">公式の2027年版学習目標を参考にした独自教材です。全340項目を位置別に照合し、関連問題と計算演習の有無を記録しました。全条件・例外までの完全対応、専門家監修、実戦難度の演習は引き続き補強対象です。2026年受験用の差分教材・Practical Skills Modulesは含みません。</p>${curriculumSources.map(s => `<p class="source-link"><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗</a></p>`).join('')}</section>`;
}

export function lesson({ id, topics, state, esc, heading }) {
  const unit = units.find(u => u.id === id);
  if (!unit) return `${heading('LEARNING GUIDE','単元が見つかりません')}<a class="primary" href="#curriculum">学習ガイドへ戻る</a>`;
  const topic = topics.find(t => t.id === unit.topic);
  const s = unitStatus(unit, state.progress);
  const read = state.readUnits?.includes(unit.id);
  return `<a href="#curriculum" class="text-link back-guide">← 学習ガイドへ</a>${heading(`${curriculumYear} · ${esc(topic.en)}`, esc(unit.title))}<article class="card lesson-card"><h2>この単元のゴール</h2><ul>${unit.objectives.map(o => `<li>${esc(o)}</li>`).join('')}</ul><h2>要点をつかむ</h2><ol class="lesson-notes">${unit.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ol>${unit.formula ? `<div class="formula-box"><span class="eyebrow">KEY FORMULA</span><p>${esc(unit.formula)}</p></div>` : ''}<div class="notice"><b>ここに注意</b><p>${esc(unit.pitfall)}</p></div><div class="lesson-actions"><button class="secondary" data-action="read-unit" data-unit="${unit.id}" aria-pressed="${Boolean(read)}">${read ? '✓ 読了を記録済み' : 'この単元を読了にする'}</button><button class="primary" data-action="unit-study" data-unit="${unit.id}">${Math.min(3,unit.questions.length)}問ずつ演習する →</button></div><p class="subtitle">この単元は全${unit.questions.length}問 · ${s.attempted}/${s.total}問に回答 · 直近で正解かつ自信あり：${s.confident}問。確認問題だけで単元の全論点を評価するものではありません。</p><details class="lesson-sources"><summary>参照先・補足</summary><p class="subtitle">独自作成の要点整理です。基準・定義の詳細は参照先で確認できます。</p>${unit.sources.map(url => `<p class="source-link"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(new URL(url).hostname)} の参照資料 ↗</a></p>`).join('')}</details></article>`;
}
