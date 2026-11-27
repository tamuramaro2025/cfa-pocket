import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicationIssues } from '../scripts/publishing.mjs';
import { privacyMarkup, aboutMarkup } from '../public/legal.js';

test('optional publication gate rejects missing public metadata', () => {
  const incomplete = { developerName: '', supportEmail: '', publicSiteUrl: '' };
  assert.equal(publicationIssues(incomplete).length, 3);
  const valid = { ...incomplete, developerName: 'Test Publisher', supportEmail: 'support@example.com', publicSiteUrl: 'https://study.cfapocket.jp' };
  assert.deepEqual(publicationIssues(valid), []);
  assert.ok(publicationIssues({ ...valid, publicSiteUrl: 'http://localhost:4173' }).length);
  assert.ok(publicationIssues({ ...valid, publicSiteUrl: 'https://example.com' }).length);
});

test('personal app policy describes device storage and generated assets omit registration', async () => {
  for (const [file, content] of [['privacy.html', '端末内の学習記録'], ['licenses.html', 'MIT License']]) {
    const html = await readFile(new URL('../public/' + file, import.meta.url), 'utf8');
    assert.match(html, /lang="ja"/); assert.ok(html.includes(content));
  }
  const info = { appName: '<script>', versionName: '0.1.0', versionCode: 1, policyUpdated: '2026-11-12' };
  assert.match(aboutMarkup(info), /&lt;script&gt;/);
  assert.match(privacyMarkup(info), /端末内/);
  assert.doesNotMatch(privacyMarkup(info), /delete-account|認証サーバー|アカウント登録/);
  const manifest = await readFile(new URL('../public/precache-manifest.js', import.meta.url), 'utf8');
  assert.doesNotMatch(manifest, /account\.js|delete-account/);
});
