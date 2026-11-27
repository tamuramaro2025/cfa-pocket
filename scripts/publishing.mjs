import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { privacyMarkup, escapeHtml } from '../public/legal.js';
import { iconPng } from './icon-artwork.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
export async function publishingInfo() {
  const info = JSON.parse(await readFile(path.join(root, 'config/play-store.json'), 'utf8'));
  info.versionCode = Number(process.env.CFA_VERSION_CODE || info.versionCode);
  info.versionName = process.env.CFA_VERSION_NAME || info.versionName;
  info.publicSiteUrl = info.publicSiteUrl.replace(/\/$/, '');
  if (!Number.isInteger(info.versionCode) || info.versionCode < 1 || info.versionCode > 2100000000) throw Error('versionCode must be an integer from 1 to 2100000000.');
  if (!/^[0-9]+\.[0-9]+\.[0-9]+(?:[-.][a-zA-Z0-9.-]+)?$/.test(info.versionName)) throw Error('Invalid versionName.');
  return info;
}

export function publicationIssues(info) {
  const issues = [];
  if (!info.developerName.trim()) issues.push('開発者名を config/play-store.json の developerName に設定してください。');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.supportEmail)) issues.push('公開する問い合わせ先 supportEmail が必要です。');
  try {
    const url = new URL(info.publicSiteUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw Error();
    if (/(?:^|\.)(?:example\.(?:com|org|net)|localhost)$/.test(url.hostname)) throw Error();
  } catch { issues.push('プライバシーポリシーを配信する実際のHTTPSオリジン publicSiteUrl が必要です。'); }
  return issues;
}

export function legalPage(title, body, script = '') {
  return `<!doctype html>\n<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)} | CFA Pocket</title><link rel="icon" href="/icon.svg"><link rel="stylesheet" href="/style.css"></head><body><main style="max-width:880px;margin:auto"><a class="back-guide" href="/">← CFA Pocket</a><h1>${escapeHtml(title)}</h1>${body}</main>${script ? `<script type="module" src="/${script}"></script>` : ''}</body></html>\n`;
}

export async function buildPublishing() {
  const info = await publishingInfo();
  const publicDir = path.join(root, 'public');
  await writeFile(path.join(publicDir, 'release-info.js'), `// Generated public metadata; never place secrets here.\nexport const releaseInfo = ${JSON.stringify(info, null, 2)};\n`);
  await writeFile(path.join(publicDir, 'privacy.html'), legalPage('プライバシーポリシー', privacyMarkup(info)));
  const packages = ['core', 'android', 'app', 'preferences', 'keyboard'];
  let licenses = '';
  for (const name of packages) {
    const dir = path.join(root, 'node_modules/@capacitor', name);
    const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    const license = await readFile(path.join(dir, 'LICENSE'), 'utf8');
    licenses += `<h2>@capacitor/${name} ${escapeHtml(pkg.version)}</h2><pre style="white-space:pre-wrap;font-size:12px">${escapeHtml(license)}</pre>`;
  }
  const apache = await readFile(path.join(root, 'docs/licenses/Apache-2.0.txt'), 'utf8');
  licenses += `<h2>AndroidX / Android support libraries / Kotlin standard library</h2><p>Copyright The Android Open Source Project / Google LLC / JetBrains s.r.o. Licensed under Apache License 2.0. Runtime dependency versions are recorded in the release dependency report.</p><pre style="white-space:pre-wrap;font-size:12px">${escapeHtml(apache)}</pre>`;
  await writeFile(path.join(publicDir, 'licenses.html'), legalPage('オープンソースライセンス', `<section class="card legal-copy">${licenses}</section>`));
  const out = path.join(root, 'dist/google-play');
  await mkdir(out, { recursive: true });
  await writeFile(path.join(out, 'store-icon-512.png'), iconPng(512));
  await writeFile(path.join(out, 'listing-ja-JP.txt'), `アプリ名: CFA Pocket\nカテゴリ: 教育\n短い説明: 英語で解き、日本語で理解。1回3問から始めるCFA Level Iの基礎学習。\n\n詳しい説明:\nCFA Pocketは、日本語の解説と英語の問題でCFA Level Iの基礎を学ぶ独立した学習アプリです。\n\n・1回3問の短い演習\n・英語の問題と日本語の解説、選択肢ごとの説明\n・10分野の学習ガイドと単元ごとの確認演習\n・正誤と自信度に合わせた復習予定\n・端末内の学習記録、用語の保存、JSONバックアップ\n・教材はアプリ内に収録し、通信なしで学習可能\n\nCFA Instituteとの提携・承認はありません。教材は独自作成で、専門家監修と完全網羅の確認は未完了です。合格を保証するものではありません。教育目的のアプリであり、投資助言・証券取引サービスは提供しません。\n\n学習記録は端末内に保存され、端末間の自動同期はありません。外部リンクを開く場合には通信が必要です。\n`);
  await writeFile(path.join(out, 'release-notes-ja-JP.txt'), '初回テスト版。英語の演習、日本語解説、学習ガイド、復習予定、端末内記録・バックアップに対応。\n');
  await writeFile(path.join(out, 'readiness.json'), JSON.stringify({ generatedAt: new Date().toISOString(), appId: info.appId, versionCode: info.versionCode, versionName: info.versionName, usageMode: 'personal-local', issues: publicationIssues(info), uploaded: false }, null, 2));
  return info;
}
