// Release QA only. This never targets a connected phone or clears app data.
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import path from 'node:path';

const serial = process.argv[2];
if (!/^emulator-\d+$/.test(serial || '')) throw Error('Usage: node scripts/play-screenshots.mjs emulator-NNNN');
const adb = process.env.ADB || path.join(process.env.HOME, 'Library/Android/sdk/platform-tools/adb');
const run = (...args) => execFileSync(adb, ['-s', serial, ...args], { timeout: 30000, maxBuffer: 16*1024*1024 });
const out = path.resolve('dist/google-play/screenshots');
await mkdir(out, { recursive: true });

// Accessibility can be ready while the compositor still shows the launch icon.
// Decode the captured PNG and wait for the light app surface before exporting it.
function lightFraction(png) {
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  const channels = png[25] === 6 ? 4 : png[25] === 2 ? 3 : 0;
  if (!channels || png[24] !== 8) throw Error('Unexpected screenshot PNG format');
  const chunks = [];
  for (let offset = 8; offset < png.length;) {
    const size = png.readUInt32BE(offset);
    if (png.toString('ascii', offset+4, offset+8) === 'IDAT') chunks.push(png.subarray(offset+8, offset+8+size));
    offset += size+12;
  }
  const bytes = inflateSync(Buffer.concat(chunks)), stride = width*channels;
  let previous = Buffer.alloc(stride), bright = 0;
  const paeth = (a,b,c) => { const p=a+b-c, x=Math.abs(p-a), y=Math.abs(p-b), z=Math.abs(p-c); return x<=y && x<=z ? a : y<=z ? b : c; };
  for (let y=0;y<height;y++) {
    const row = Buffer.from(bytes.subarray(y*(stride+1)+1, (y+1)*(stride+1)));
    const filter = bytes[y*(stride+1)];
    for (let x=0;x<stride;x++) {
      const left=x>=channels?row[x-channels]:0, up=previous[x], corner=x>=channels?previous[x-channels]:0;
      const predictor = [0,left,up,Math.floor((left+up)/2),paeth(left,up,corner)][filter];
      if (predictor === undefined) throw Error('Unexpected PNG filter');
      row[x] = (row[x]+predictor)&255;
    }
    for (let x=0;x<width;x++) if (row[x*channels]>210 && row[x*channels+1]>210 && row[x*channels+2]>210) bright++;
    previous = row;
  }
  return bright/(width*height);
}
async function capture(name, expected) {
  for (let i=0;i<15;i++) {
    try {
      run('shell','uiautomator','dump','/sdcard/cfa-play-window.xml');
      const tree = run('shell','cat','/sdcard/cfa-play-window.xml').toString();
      if (tree.includes(expected) && !tree.includes("isn&apos;t responding")) {
        const png=run('exec-out','screencap','-p');
        if (lightFraction(png)>.3) {
          const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
          if (height>width*2 || width<320) throw Error('Set the emulator display to 1080x1920 before capture.');
          await writeFile(path.join(out,name),png);
          console.log(JSON.stringify({file:name,width,height,source:'Android release UI'}));return;
        }
      }
    } catch(error) { if (i===14) throw error; }
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
  throw Error('Android did not reach the requested rendered screen: '+expected);
}
run('shell','wm','size','1080x1920');
run('shell','am','force-stop','jp.cfapocket.study');
run('shell','am','start','-n','jp.cfapocket.study/.MainActivity');
await capture('phone-01-home.png','MAKE A LITTLE PROGRESS');
// Use the current accessibility bounds rather than a guessed screen coordinate.
const xml = run('shell','cat','/sdcard/cfa-play-window.xml').toString();
const bounds = xml.match(/content-desc="☷ ガイド"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
if (!bounds) throw Error('Guide navigation is missing from the Android accessibility tree.');
run('shell','input','tap',String(Math.round((Number(bounds[1])+Number(bounds[3]))/2)),String(Math.round((Number(bounds[2])+Number(bounds[4]))/2)));
await capture('phone-02-guide.png','LEARN THE BIG PICTURE');
