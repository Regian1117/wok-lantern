export const THEME = {
  lacquer: '#1D0D0A',
  lacquerHi: '#2E1612',
  crimsonLacquer: '#3A0A0A',
  brass: '#D99B26',
  brassBright: '#F7D070',
  ricePaper: '#FAF3E6',
  ricePaperWarm: '#F2E7D3',
  vipGold: '#FEF7D6',
  ink: '#1E100B',
  subtleInk: '#6E4A36',
  jade: '#15803D',
  jadeSoft: '#DCFCE7',
  crimson: '#B91C1C',
  crimsonSoft: '#FEE2E2',
};

export const FONT_SERIF = 'Georgia, serif';
export const FONT_UI = 'system-ui, -apple-system, sans-serif';

const DRAWER_VARIANTS = {
  lacquer: { fill: '#5C1111', border: '#D49B35', text: '#FEF3C7', keyBg: '#240707', keyText: '#FCD34D' },
  action: { fill: '#B91C1C', border: '#FDE047', text: '#FFFFFF', keyBg: '#580D0D', keyText: '#FEF08A' },
  jade: { fill: '#DCFCE7', border: '#15803D', text: '#14532D', keyBg: '#15803D', keyText: '#FFFFFF' },
  gold: { fill: '#FEF3C7', border: '#D97706', text: '#1E100B', keyBg: '#92400E', keyText: '#FEF3C7' },
};

export function roundRectPath(ctx, x, y, w, h, r = 6) {
  const rad = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function drawPlaque(ctx, x, y, w, h, fill, stroke = THEME.brass, lineWidth = 1.5, radius = 7) {
  ctx.save();
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawLacquerFrame(ctx, x, y, w, h, fill, border = '#D49B35', radius = 7, innerGold = true) {
  drawPlaque(ctx, x, y, w, h, fill, border, 1.8, radius);
  if (innerGold && w > 14 && h > 14) {
    drawPlaque(ctx, x + 3.5, y + 3.5, w - 7, h - 7, 'rgba(0,0,0,0)', 'rgba(247, 208, 112, 0.45)', 1, Math.max(3, radius - 3));
  }
}

export function drawBrassPullBar(ctx, cx, topY, barW = 32) {
  drawPlaque(ctx, Math.round(cx - barW / 2), topY - 2, barW, 4.5, '#F7D070', '#854D0E', 1, 2);
}

export function drawBrassDrawerButton(ctx, x, y, w, h, keyText, labelText, variant = 'lacquer', iconFn = null) {
  const v = DRAWER_VARIANTS[variant] || DRAWER_VARIANTS.lacquer;
  drawPlaque(ctx, x, y, w, h, v.fill, v.border, 1.6, 6);
  drawBrassPullBar(ctx, x + w / 2, y, Math.min(32, Math.max(18, w * 0.28)));
  ctx.save();
  ctx.font = `800 ${h <= 28 ? 9.5 : 10.5}px ${FONT_UI}`;
  const kw = keyText ? Math.ceil(ctx.measureText(keyText).width + 10) : 0;
  const kh = Math.min(22, Math.max(16, h - 8));
  const kx = x + 6;
  if (keyText) {
    drawPlaque(ctx, kx, y + Math.round((h - kh) / 2) + 1, kw, kh, v.keyBg, v.border, 1, 4);
    ctx.fillStyle = v.keyText;
    ctx.textAlign = 'center';
    ctx.fillText(keyText, kx + kw / 2, y + h / 2 + 3.8);
  }
  const remX = keyText ? kx + kw + 5 : x + 7;
  const remW = x + w - 5 - remX;
  if (iconFn) {
    iconFn(ctx, remX + 7, y + h / 2 + 1);
    ctx.fillStyle = v.text;
    ctx.textAlign = 'left';
    ctx.fillText(labelText, remX + 16, y + h / 2 + 3.8, Math.max(20, remW - 16));
  } else {
    ctx.fillStyle = v.text;
    ctx.textAlign = 'center';
    ctx.fillText(labelText, remX + remW / 2, y + h / 2 + 3.8, Math.max(20, remW));
  }
  ctx.restore();
}

export function drawHankoPriceSeal(ctx, cx, cy, text, w = 30, h = 17) {
  drawPlaque(ctx, Math.round(cx - w / 2), Math.round(cy - h / 2), w, h, '#B91C1C', '#FDE68A', 1.2, 3);
  ctx.save();
  ctx.fillStyle = '#FEF3C7';
  ctx.font = `900 10.5px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(text, cx, cy + 3.8);
  ctx.restore();
}

export function clearHitboxes(state) {
  state.hudRects = [];
}

export function registerHitbox(state, id, x, y, w, h) {
  state.hudRects.push({ id, x, y, w, h });
}

export function hitTestHud(rects, x, y) {
  if (!rects) return null;
  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r;
  }
  return null;
}
