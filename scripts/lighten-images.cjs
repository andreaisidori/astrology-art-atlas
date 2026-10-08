#!/usr/bin/env node
/*
 * Alleggerisce public/data/atlas.json (macOS: usa `sips`).
 *
 * 1. Le immagini base64 (caricate dal Curator Studio) diventano file in public/artworks/:
 *    immagine max 1200px JPEG q80, miniatura max 320px JPEG q75.
 * 2. Le opere con immagine locale ma miniatura mancante, identica all'immagine o
 *    segnaposto ricevono una miniatura propria generata dall'immagine.
 *
 * Modifica solo i campi `immagine` e `miniatura`. Uso:
 *   node scripts/lighten-images.cjs            (anteprima, non scrive nulla)
 *   node scripts/lighten-images.cjs --write
 * Poi: deploy Vercel PRIMA del push su GitHub (vedi KNOWLEDGE_TRANSFER.md).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ATLAS = path.join(ROOT, 'public', 'data', 'atlas.json');
const OUT_DIR = path.join(ROOT, 'public', 'artworks');
// Stock image shared by all placeholder artworks in public/thumbnails/
const PLACEHOLDER_THUMB_MD5 = '464a0c40421a75e07686738e75045ac9';

const write = process.argv.includes('--write');
const md5 = buf => crypto.createHash('md5').update(buf).digest('hex');
const sha8 = buf => crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aaa-lighten-'));

// Downscale only (never enlarge); keep the original JPEG if re-encoding would not make it lighter
function resizeJpeg(srcBuf, maxDim, quality) {
  const src = path.join(tmpDir, `src-${sha8(srcBuf)}`);
  const dst = path.join(tmpDir, `dst-${sha8(srcBuf)}-${maxDim}.jpg`);
  fs.writeFileSync(src, srcBuf);
  const info = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', '-g', 'format', src]).toString();
  const num = key => Number((info.match(new RegExp(`${key}: (\\d+)`)) || [])[1]);
  const isJpeg = /format: jpeg/.test(info);
  const needsResize = Math.max(num('pixelWidth'), num('pixelHeight')) > maxDim;
  const args = needsResize ? ['-Z', String(maxDim)] : [];
  execFileSync('sips', [...args, '-s', 'format', 'jpeg', '-s', 'formatOptions', String(quality), src, '--out', dst], { stdio: 'ignore' });
  const out = fs.readFileSync(dst);
  return !needsResize && isJpeg && out.length >= srcBuf.length ? srcBuf : out;
}

function saveFile(name, buf) {
  if (write) fs.writeFileSync(path.join(OUT_DIR, name), buf);
  return `/artworks/${name}`;
}

const localFile = url => (url && url.startsWith('/') ? path.join(ROOT, 'public', url.split('?')[0]) : null);
const isPlaceholderThumb = url => {
  const f = localFile(url);
  return f && fs.existsSync(f) && md5(fs.readFileSync(f)) === PLACEHOLDER_THUMB_MD5;
};

const raw = fs.readFileSync(ATLAS, 'utf-8');
const atlas = JSON.parse(raw);
const before = Buffer.byteLength(raw);
fs.mkdirSync(OUT_DIR, { recursive: true });
const changes = [];

for (const art of atlas.opere) {
  const old = { immagine: art.immagine, miniatura: art.miniatura };

  if (typeof art.immagine === 'string' && art.immagine.startsWith('data:')) {
    const original = Buffer.from(art.immagine.split(',', 2)[1], 'base64');
    const full = resizeJpeg(original, 1200, 80);
    const thumb = resizeJpeg(original, 320, 75);
    art.immagine = saveFile(`${art.id}-${sha8(full)}.jpg`, full);
    art.miniatura = saveFile(`${art.id}-${sha8(full)}-thumb.jpg`, thumb);
  } else {
    const imgFile = localFile(art.immagine);
    const needsThumb =
      !art.miniatura ||
      art.miniatura === art.immagine ||
      art.miniatura.startsWith('data:') ||
      isPlaceholderThumb(art.miniatura);
    if (imgFile && fs.existsSync(imgFile) && needsThumb) {
      const img = fs.readFileSync(imgFile);
      art.miniatura = saveFile(`${art.id}-${sha8(img)}-thumb.jpg`, resizeJpeg(img, 320, 75));
    }
  }

  if (old.immagine !== art.immagine || old.miniatura !== art.miniatura) {
    changes.push({ id: art.id, titolo: art.titolo, old, now: { immagine: art.immagine, miniatura: art.miniatura } });
  }
}

const out = JSON.stringify(atlas, null, 2);
const short = v => (v || '(vuoto)').slice(0, 60);
for (const c of changes) {
  console.log(`- ${c.id} (${c.titolo || 'senza titolo'})`);
  for (const k of ['immagine', 'miniatura']) {
    if (c.old[k] !== c.now[k]) console.log(`    ${k}: ${short(c.old[k])} -> ${c.now[k]}`);
  }
}
console.log(`\n${changes.length} opere modificate; atlas.json ${(before / 1024).toFixed(0)} KB -> ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB`);
if (write) {
  fs.writeFileSync(ATLAS, out, 'utf-8');
  console.log('Scritto public/data/atlas.json e public/artworks/.');
} else {
  console.log('Anteprima: nessun file scritto. Usa --write per applicare.');
}
fs.rmSync(tmpDir, { recursive: true, force: true });
