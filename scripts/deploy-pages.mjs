import { execFileSync } from 'node:child_process';
import { mkdtemp, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildMobile } from './build-mobile.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const branch = process.env.CFA_PAGES_BRANCH || 'gh-pages';

function git(args, cwd = root) {
  return execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
}

const remoteUrl = git(['remote', 'get-url', 'origin']);
if (!remoteUrl) {
  throw new Error('git remote "origin" が設定されていません。');
}

const buildResult = await buildMobile();
const tempDir = await mkdtemp(path.join(tmpdir(), 'cfa-pocket-pages-'));

try {
  await cp(buildResult.directory, tempDir, { recursive: true });
  git(['init'], tempDir);
  git(['checkout', '-B', branch], tempDir);
  git(['config', 'user.name', 'CFA Pocket Deploy'], tempDir);
  git(['config', 'user.email', 'deploy@cfapocket.local'], tempDir);
  git(['add', '-A'], tempDir);
  git(['commit', '-m', `Deploy CFA Pocket (${buildResult.version})`], tempDir);
  execFileSync('git', ['push', '--force', remoteUrl, `HEAD:${branch}`], { cwd: tempDir, stdio: 'inherit' });

  const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);
  const pagesUrl = match ? `https://${match[1]}.github.io/${match[2]}/` : '';
  console.log(`\n✓ GitHub Pages (${branch} ブランチ) へ配信ファイルを送信しました（バージョン: ${buildResult.version}）。`);
  if (pagesUrl) {
    console.log(`スマホ・PCで開くURL: ${pagesUrl}`);
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
