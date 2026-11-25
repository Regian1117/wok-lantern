export const TEXTURE_MODULE = 'textures';

import * as THREE from '../../vendor/three.module.min.js';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d') };
}

function toTex(canvas, repeatX = 1, repeatY = 1, srgb = true) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function makeFlagstoneTextures() {
  const { c, ctx } = makeCanvas(512, 512);
  const { c: b, ctx: bctx } = makeCanvas(512, 512);
  ctx.fillStyle = '#4A362C';
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#202020';
  bctx.fillRect(0, 0, 512, 512);

  const palette = ['#C98C57', '#B87A48', '#A76B3D', '#9B6543', '#7E6556', '#B37E52'];
  const rows = 4;
  const rowH = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * 72;
    const widths = [148, 124, 136, 104];
    let x = -offset;
    let idx = 0;
    while (x < 512) {
      const w = widths[(r + idx) % widths.length];
      const col = palette[(r * 3 + idx * 5) % palette.length];
      ctx.fillStyle = col;
      ctx.fillRect(x + 4, r * rowH + 4, w - 8, rowH - 8);
      ctx.fillStyle = 'rgba(255,230,195,0.09)';
      ctx.fillRect(x + 7, r * rowH + 7, w - 14, 14);
      ctx.fillStyle = 'rgba(30,15,10,0.12)';
      ctx.fillRect(x + 7, r * rowH + rowH - 18, w - 14, 10);

      bctx.fillStyle = '#C8C8C8';
      bctx.fillRect(x + 5, r * rowH + 5, w - 10, rowH - 10);
      x += w;
      idx++;
    }
  }
  return { map: toTex(c, 3, 2.5, true), bumpMap: toTex(b, 3, 2.5, false) };
}

export function makeSubwayTileTextures() {
  const { c, ctx } = makeCanvas(512, 512);
  const { c: b, ctx: bctx } = makeCanvas(512, 512);
  ctx.fillStyle = '#3B1E18';
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#303030';
  bctx.fillRect(0, 0, 512, 512);
  const rows = 8;
  const cols = 4;
  const rh = 512 / rows;
  const cw = 512 / cols;
  for (let r = 0; r < rows; r++) {
    const ox = (r % 2) * (cw * 0.5);
    for (let col = -1; col <= cols; col++) {
      const x = col * cw + ox;
      const y = r * rh;
      const shade = (r + col) % 3 === 0 ? '#63231B' : (r + col) % 2 === 0 ? '#581F18' : '#4E1A14';
      ctx.fillStyle = shade;
      ctx.fillRect(x + 3, y + 3, cw - 6, rh - 6);
      ctx.fillStyle = 'rgba(255,220,195,0.08)';
      ctx.fillRect(x + 5, y + 5, cw - 10, 6);
      bctx.fillStyle = '#D8D8D8';
      bctx.fillRect(x + 3, y + 3, cw - 6, rh - 6);
    }
  }
  return { map: toTex(c, 3.2, 1.4, true), bumpMap: toTex(b, 3.2, 1.4, false) };
}

export function makeOakPlankTextures(tint = '#9E6538', dark = '#7C4B27') {
  const { c, ctx } = makeCanvas(512, 512);
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, 512, 512);
  const planks = 8;
  const ph = 512 / planks;
  for (let i = 0; i < planks; i++) {
    ctx.fillStyle = i % 2 === 0 ? tint : dark;
    ctx.fillRect(0, i * ph + 2, 512, ph - 3);
    ctx.fillStyle = 'rgba(40,18,8,0.16)';
    for (let g = 0; g < 6; g++) {
      ctx.fillRect(0, i * ph + 8 + g * 9, 512, 2);
    }
    ctx.fillStyle = '#3D2212';
    ctx.fillRect(0, i * ph, 512, 2);
  }
  return toTex(c, 1.6, 1.6, true);
}

export function makeMarbleTextures() {
  const { c, ctx } = makeCanvas(512, 512);
  ctx.fillStyle = '#F7EFE0';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = 'rgba(176,154,128,0.34)';
  ctx.lineWidth = 2.5;
  for (let v = 0; v < 14; v++) {
    ctx.beginPath();
    let y = (v * 38) % 512;
    ctx.moveTo(0, y);
    for (let x = 32; x <= 512; x += 32) {
      y += Math.sin(x * 0.03 + v) * 14;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return toTex(c, 1.5, 1, true);
}

export function makeBambooTexture() {
  const { c, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = '#C9985A';
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) {
    for (let x = 0; x < 256; x += 16) {
      ctx.fillStyle = ((x + y) / 16) % 2 === 0 ? '#D8A96B' : '#B58447';
      ctx.fillRect(x + 1, y + 1, 14, 14);
    }
  }
  return toTex(c, 2, 1, true);
}

export function makeCrestPlaqueTexture() {
  const { c, ctx } = makeCanvas(512, 256);
  ctx.fillStyle = '#2B0E0B';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = '#D99B26';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, 488, 232);
  ctx.strokeStyle = '#F7D070';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 464, 208);

  // Drawn lantern crest emblem on left
  ctx.fillStyle = '#B91C1C';
  ctx.beginPath();
  ctx.ellipse(92, 128, 30, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#F7D070';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#D99B26';
  ctx.fillRect(74, 82, 36, 8);
  ctx.fillRect(74, 166, 36, 8);
  ctx.fillRect(90, 174, 4, 20);

  ctx.fillStyle = '#FAF3E6';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('WOK & LANTERN', 145, 118);
  ctx.fillStyle = '#F7D070';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('NIGHT MARKET KITCHEN', 148, 158);
  ctx.fillStyle = '#D99B26';
  ctx.fillRect(148, 174, 290, 3);
  return toTex(c, 1, 1, true);
}

export function makeScrollTexture() {
  const { c, ctx } = makeCanvas(256, 512);
  ctx.fillStyle = '#F2E7D3';
  ctx.fillRect(0, 0, 256, 512);
  ctx.strokeStyle = '#9A6B2F';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 24, 232, 464);
  ctx.fillStyle = '#1E100B';
  ctx.beginPath();
  ctx.arc(128, 210, 46, 0, Math.PI * 2);
  ctx.fillStyle = '#B91C1C';
  ctx.fill();
  ctx.fillStyle = '#1E100B';
  ctx.fillRect(114, 120, 28, 16);
  ctx.fillRect(90, 300, 76, 10);
  ctx.fillRect(102, 330, 52, 8);
  ctx.fillRect(96, 360, 64, 8);
  return toTex(c, 1, 1, true);
}
