import { spawn } from 'node:child_process';
import { mkdir, open } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { setTimeout } from 'node:timers/promises';
import { buildMobile } from './scripts/build-mobile.mjs';

const root = fileURLToPath(new URL('./', import.meta.url));
const url = 'http://127.0.0.1:4173';
async function healthy() {
  try {
    const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(700) });
    return response.ok && (await response.json()).app === 'cfa-pocket';
  } catch { return false; }
}

try {
  await buildMobile();
  if (!await healthy()) {
    await mkdir(new URL('./.local/', import.meta.url), { recursive: true });
    const log = await open(new URL('./.local/server.log', import.meta.url), 'a');
    const child = spawn(process.execPath, [fileURLToPath(new URL('./server.mjs', import.meta.url))], {
      cwd: root, detached: true, stdio: ['ignore', log.fd, log.fd], env: { ...process.env, PORT: '4173' }
    });
    await new Promise((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject); });
    child.unref();
    await log.close();
    let ready = false;
    for (let i = 0; i < 40; i++) {
      if (await healthy()) { ready = true; break; }
      await setTimeout(150);
    }
    if (!ready) throw new Error('起動できませんでした。ポート4173の競合や .local/server.log を確認してください。');
  }
  const browser = spawn('open', [url], { stdio: 'ignore' });
  await new Promise((resolve, reject) => {
    browser.once('error', reject);
    browser.once('exit', code => code === 0 ? resolve() : reject(new Error('ブラウザを開けませんでした。下のURLを直接開いてください。')));
  });
  console.log(`CFA Pocket を開きました：${url}\nこのウィンドウを閉じても、サーバーは動作を続けます。`);
} catch (error) {
  console.error(`${error.message}\nアプリのURL：${url}`);
  process.exitCode = 1;
}
