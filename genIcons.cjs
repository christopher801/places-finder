/**
 * genIcons.js — PlacesFinder PWA Icon Generator
 * Mete fichye sa a nan RASIN pwojè a (bò package.json)
 * Usage: node genIcons.js
 */

const { createCanvas } = require('canvas');
const fs   = require('fs');
const path = require('path');

const SIZES   = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT_DIR = path.join(__dirname, 'public', 'icons');

// Kreye dosye a si li pa egziste
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('✓ Kreye: public/icons/');
}

const BG    = '#00D4A8';
const EMOJI = '📍';

SIZES.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx    = canvas.getContext('2d');
  const r      = size * 0.22; // border-radius

  // ── Background ak rounded corners ──
  ctx.fillStyle = BG;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // ── Emoji centré ──
  const fontSize = Math.round(size * 0.54);
  ctx.font         = `${fontSize}px serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(EMOJI, size / 2, size / 2 + size * 0.03);

  // ── Sove PNG ──
  const out  = path.join(OUT_DIR, `icon-${size}.png`);
  const buf  = canvas.toBuffer('image/png');
  fs.writeFileSync(out, buf);
  console.log(`✓ icon-${size}.png`);
});

// Kopi 192 kòm maskable
const src = path.join(OUT_DIR, 'icon-192.png');
const dst = path.join(OUT_DIR, 'icon-maskable.png');
fs.copyFileSync(src, dst);
console.log('✓ icon-maskable.png');

console.log('\n✅ Tout icons kreye nan public/icons/');