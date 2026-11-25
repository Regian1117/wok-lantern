export const THEME = {
  lacquer: '#1D0D0A',
  lacquerHi: '#2E1612',
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
