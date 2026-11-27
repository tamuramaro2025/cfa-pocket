import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const apk = await readFile(new URL('android/app/build/outputs/apk/debug/app-debug.apk', root));
const output = new URL('dist/android/', root);
await mkdir(output, { recursive: true });
await writeFile(new URL('CFA-Pocket.apk', output), apk);

// Bind to a single private LAN address and serve only the download page and APK.
const addresses = Object.entries(networkInterfaces()).flatMap(([name, entries]) =>
  (entries || []).filter(a => a.family === 'IPv4' && !a.internal &&
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a.address))
    .map(a => ({ name, address: a.address })));
addresses.sort((a, b) => Number(b.name === 'en0') - Number(a.name === 'en0'));
const host = process.env.ANDROID_SHARE_HOST || addresses[0]?.address;
if (!addresses.some(a => a.address === host)) {
  throw new Error('Wi-Fiに接続してください。必要ならANDROID_SHARE_HOSTにMacのLANアドレスを指定してください。');
}
const port = Number(process.env.ANDROID_SHARE_PORT || 4174);
const page = Buffer.from(`<!doctype html>
<html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CFA Pocketをインストール</title>
<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:48px auto;padding:0 24px;line-height:1.8;background:#f7f8f3;color:#1b3330}a{display:block;padding:16px;background:#245c4f;color:white;text-align:center;border-radius:12px;text-decoration:none;font-weight:bold}li{margin:12px 0}small{color:#53645d}</style>
<h1>CFA Pocket</h1><p>自分のAndroidスマホで試すためのアプリです。教材を内蔵しているので、インストール後はオフラインでも学習できます。</p>
<a href="/CFA-Pocket.apk" download>Android版をダウンロード（${(apk.length / 1024 / 1024).toFixed(1)} MB）</a>
<ol><li>ダウンロードした「CFA-Pocket.apk」を開きます。</li><li>許可を求められたら「設定」で、今使っているブラウザまたはファイルアプリの「この提供元のアプリを許可」をオンにします。</li><li>「インストール」→「開く」で使えます。インストール後は上の許可を戻して構いません。</li></ol>
<p>すでにCFA Pocketを使っている場合は、アンインストールせず更新してください。学習記録はスマホ内に保存されます。設定からJSONバックアップも保存できます。</p>
<small>Android 7以降・WebView 100以降向けのテスト版です。実機での動作は未確認です。このダウンロードページはMacと同じWi-Fiで、配信中だけ開けます。</small></html>`);

const server = createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  const path = new URL(req.url, 'http://localhost').pathname;
  const file = path === '/CFA-Pocket.apk';
  if (path !== '/' && !file) {
    res.writeHead(404).end();
    return;
  }
  const body = file ? apk : page;
  res.setHeader('Content-Type', file ? 'application/vnd.android.package-archive' : 'text/html; charset=utf-8');
  res.setHeader('Content-Length', body.length);
  if (file) res.setHeader('Content-Disposition', 'attachment; filename="CFA-Pocket.apk"');
  res.writeHead(200);
  res.end(req.method === 'HEAD' ? undefined : body);
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, host, () => {
  console.log(`Androidスマホを同じWi-Fiに接続して開く: http://${host}:${port}/`);
  console.log('APK: dist/android/CFA-Pocket.apk\n配信停止: Ctrl+C（インストール後のアプリは配信停止後も利用できます）');
});
