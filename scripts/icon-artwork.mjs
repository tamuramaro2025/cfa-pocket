import { deflateSync } from 'node:zlib';

// Shared 108-unit artwork for SVG, Android vectors and installable PNGs.
// The mark fits Android's central 66-unit adaptive-icon safe area.
const background = '#174b3c';
const gold = '#ebc576';
const ink = '#174b3c';
const shapes = [
  { circle: [40, 66, 13], color: gold },
  { circle: [40, 66, 9.3], color: '#c69c4e' },
  { circle: [40, 66, 8], color: gold },
  { points: [[36.5, 62], [40, 66], [43.5, 62]], width: 1.8, color: ink },
  { points: [[40, 66], [40, 71]], width: 1.8, color: ink },
  { points: [[36.5, 67.5], [43.5, 67.5]], width: 1.8, color: ink },
  { points: [[31, 49], [44, 39], [55, 46], [74, 32]], width: 6, color: '#f1f4df' },
  { points: [[62, 32], [74, 32], [74, 44]], width: 6, color: '#f1f4df' }
];
const linePath = points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
const circlePath = ([x, y, r]) => `M${x-r},${y} a${r},${r} 0,1 0,${r*2},0 a${r},${r} 0,1 0,-${r*2},0`;

export function iconSvg() {
  const artwork = shapes.map(shape => shape.circle
    ? `<circle cx="${shape.circle[0]}" cy="${shape.circle[1]}" r="${shape.circle[2]}" fill="${shape.color}"/>`
    : `<path d="${linePath(shape.points)}" fill="none" stroke="${shape.color}" stroke-width="${shape.width}" stroke-linecap="round" stroke-linejoin="round"/>`).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 108 108">\n  <title>CFA Pocket — investment and growth</title>\n  <rect width="108" height="108" rx="24" fill="${background}"/>\n  ${artwork}\n</svg>\n`;
}

export function androidIcon({ foreground = false } = {}) {
  const artwork = shapes.map(shape => shape.circle
    ? `    <path android:fillColor="${shape.color}" android:pathData="${circlePath(shape.circle)}"/>`
    : `    <path android:fillColor="#00000000" android:strokeColor="${shape.color}" android:strokeWidth="${shape.width}" android:strokeLineCap="round" android:strokeLineJoin="round" android:pathData="${linePath(shape.points)}"/>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>\n<vector xmlns:android="http://schemas.android.com/apk/res/android"\n    android:width="108dp" android:height="108dp"\n    android:viewportWidth="108" android:viewportHeight="108">\n${foreground ? '' : `    <path android:fillColor="${background}" android:pathData="M0,0h108v108h-108z"/>\n`}${artwork}\n</vector>\n`;
}

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ -1) >>> 0;
}
function chunk(type, bytes) {
  const name = Buffer.from(type), length = Buffer.alloc(4), crc = Buffer.alloc(4);
  length.writeUInt32BE(bytes.length);
  crc.writeUInt32BE(crc32(Buffer.concat([name, bytes])));
  return Buffer.concat([length, name, bytes, crc]);
}
const rgb = hex => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
const prepared = shapes.map(shape => ({ ...shape, rgb: rgb(shape.color) }));
function contains(shape, x, y) {
  if (shape.circle) {
    const [cx, cy, r] = shape.circle;
    return (x-cx)**2 + (y-cy)**2 <= r*r;
  }
  for (let i = 1; i < shape.points.length; i++) {
    const [ax, ay] = shape.points[i-1], [bx, by] = shape.points[i];
    const dx = bx-ax, dy = by-ay;
    const t = Math.max(0, Math.min(1, ((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    if ((x-ax-t*dx)**2 + (y-ay-t*dy)**2 <= (shape.width/2)**2) return true;
  }
  return false;
}

export function iconPng(size, { foreground = false } = {}) {
  const pixels = Buffer.alloc(size * (size*4+1));
  const base = foreground ? [0, 0, 0, 0] : [...rgb(background), 255];
  // Four samples per pixel keep curves and diagonal strokes smooth at small sizes.
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const sum = [0, 0, 0, 0];
    for (const sy of [.25, .75]) for (const sx of [.25, .75]) {
      const px = (x+sx)*108/size, py = (y+sy)*108/size;
      let color = base;
      for (const shape of prepared) if (contains(shape, px, py)) color = [...shape.rgb, 255];
      for (let c = 0; c < 3; c++) sum[c] += color[c]*color[3]/255;
      sum[3] += color[3];
    }
    const index = y*(size*4+1)+1+x*4;
    for (let c = 0; c < 3; c++) pixels[index+c] = sum[3] ? Math.round(sum[c]*255/sum[3]) : 0;
    pixels[index+3] = Math.round(sum[3]/4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
}
