import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { publishingInfo, publicationIssues } from './publishing.mjs';

export async function checkPlayRelease({ online = false } = {}) {
  const info = await publishingInfo();
  const issues = publicationIssues(info);
  const config = JSON.parse(await readFile(new URL('../capacitor.config.json', import.meta.url), 'utf8'));
  if (config.appId !== info.appId) issues.push('Capacitorと公開設定のappIdが一致していません。');
  if (config.server?.url || config.android?.allowMixedContent || config.android?.webContentsDebuggingEnabled || config.loggingBehavior !== 'none') issues.push('公開用のWebView / ログ / 通信設定を確認してください。');
  if (online && !issues.length) {
    for (const [route, expected] of [['/privacy.html', 'プライバシーポリシー']]) {
      try {
        const response = await fetch(info.publicSiteUrl + route, { signal: AbortSignal.timeout(10000), redirect: 'error' });
        const text = await response.text();
        if (!response.ok || !/text\/html/.test(response.headers.get('content-type') || '') || !text.includes(expected)) throw Error();
      } catch { issues.push(`公開URLを確認できません: ${info.publicSiteUrl}${route}`); }
    }
  }
  return { info, issues };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { info, issues } = await checkPlayRelease({ online: process.argv.includes('--online') });
  console.log(JSON.stringify({ appId: info.appId, versionCode: info.versionCode, usageMode: 'personal-local', ready: !issues.length, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
}
