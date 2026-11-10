import { build } from 'esbuild';
import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'www');
await mkdir(out, { recursive: true });
await build({ absWorkingDir: root, entryPoints: ['native/entry.js'], outfile: path.join(out, 'app.js'), bundle: true, format: 'esm', target: 'chrome100', minify: false, sourcemap: false, legalComments: 'eof' });
let html = await readFile(path.join(root, 'public/index.html'), 'utf8');
html = html.replace(/\s*<link rel="manifest"[^>]+>/, '');
await writeFile(path.join(out, 'index.html'), html);
for (const name of ['style.css', 'icon.svg', 'icons']) await cp(path.join(root, 'public', name), path.join(out, name), { recursive: true });
console.log('Android assets built locally in www (no server, credentials, or publication).');
