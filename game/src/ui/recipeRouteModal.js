export const RECIPE_MODAL_ID = 'recipeRouteModal';

import { THEME, FONT_SERIF, FONT_UI, drawPlaque, registerHitbox } from './hudTheme.js';
import { drawCheckIcon, drawPlayTriangleIcon } from './vectorIcons.js';
import { KITCHEN_UPGRADES } from '../shifts/upgrades.js';

const BASE_DISH_CARDS = [
  { id: 'noodles', title: 'NOODLES', price: '$34', paths: 'Char Kway Teow · Lo Mein · Dan Dan', accent: '#EAB308' },
  { id: 'dumplings', title: 'DUMPLINGS', price: '$38', paths: 'Xiaolongbao · Potsticker · Jade Wonton', accent: '#D97706' },
  { id: 'duck', title: 'PEKING DUCK', price: '$74', paths: 'VIP Carve · Wok Duck · Tea-Smoked', accent: '#991B1B', vip: true },
  { id: 'prawn', title: 'CHILI PRAWN', price: '$46', paths: 'Tiger Prawn · Garlic Steam · Lantern Trio', accent: '#E11D48' },
];

export function drawRecipeRouteModal(ctx, state, w, h) {
  if (state.mode !== 'route') return;

  const compact = w < 1120;
  const modalW = Math.min(560, Math.round(w * 0.54));
  const modalH = Math.min(478, h - 158);
  const mx = w - modalW - 14;
  const my = 102;

  drawPlaque(ctx, mx, my, modalW, modalH, THEME.ricePaper, THEME.brass, 2.4, 10);

  // Extra-bold geometric sans header for 245x152 thumbnail legibility
  ctx.fillStyle = THEME.lacquer;
  ctx.fillRect(mx + 2, my + 2, modalW - 4, 54);
  ctx.save();
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `900 ${compact ? 24 : 27}px ${FONT_UI}`;
  ctx.textAlign = 'left';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.2px';
  ctx.fillText('12 DISHES · 3 SHIFTS', mx + 16, my + 38);
  ctx.restore();

  drawPlaque(ctx, mx + modalW - 88, my + 14, 74, 30, THEME.ricePaperWarm, THEME.brass, 1.4, 6);
  ctx.fillStyle = THEME.ink;
  ctx.font = `bold 12px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('CLOSE', mx + modalW - 51, my + 33);
  registerHitbox(state, 'route_close', mx + modalW - 88, my + 14, 74, 30);

  // 3 Shift progression pills
  const shifts = [
    { idx: 0, label: 'SHIFT 1 · ALLEY', done: true },
    { idx: 1, label: 'SHIFT 2 · LANTERN HALL', active: state.shiftIndex === 1 },
    { idx: 2, label: 'SHIFT 3 · BANQUET NEXT', active: state.shiftIndex === 2 },
  ];
  const sw = Math.floor((modalW - 40) / 3);
  const sy = my + 66;
  shifts.forEach((sh, i) => {
    const sx = mx + 14 + i * (sw + 6);
    const active = state.shiftIndex === sh.idx;
    drawPlaque(ctx, sx, sy, sw, 36, active ? THEME.vipGold : sh.done ? THEME.jadeSoft : '#EFE4D1', active ? THEME.brass : '#B0895A', 1.6, 6);
    if (sh.done) drawCheckIcon(ctx, sx + 14, sy + 18, 12, THEME.jade);
    else if (active) drawPlayTriangleIcon(ctx, sx + 14, sy + 18, 10, THEME.brass);
    ctx.fillStyle = THEME.ink;
    ctx.font = `bold ${compact ? 10 : 11}px ${FONT_UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(sh.label, sx + 25, sy + 22);
    registerHitbox(state, `route_shift_${sh.idx}`, sx, sy, sw, 36);
  });

  // High-contrast subtitle
  const subY = sy + 56;
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.ink;
  ctx.font = `bold ${compact ? 12 : 13}px ${FONT_UI}`;
  ctx.fillText('4 BASES x 3 PATHS = 12 COMBINABLE RECIPES', mx + 16, subY);

  // 2x2 Bold Dish Matrix Cards for 245px thumbnail legibility
  const gridY = subY + 12;
  const cw = Math.floor((modalW - 38) / 2);
  const ch = Math.floor((modalH - 240) / 2);
  BASE_DISH_CARDS.forEach((card, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = mx + 14 + col * (cw + 10);
    const cy = gridY + row * (ch + 10);
    drawPlaque(ctx, cx, cy, cw, ch, card.vip ? THEME.vipGold : '#FFF9EE', card.vip ? THEME.brass : '#C9B190', 1.8, 8);

    ctx.fillStyle = card.accent;
    ctx.fillRect(cx + 2, cy + 2, 7, ch - 4);

    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.ink;
    ctx.font = `bold ${compact ? 16 : 18}px ${FONT_UI}`;
    ctx.fillText(card.title, cx + 18, cy + 32);

    ctx.textAlign = 'right';
    ctx.fillStyle = THEME.jade;
    ctx.font = `bold ${compact ? 19 : 21}px ${FONT_UI}`;
    ctx.fillText(card.price, cx + cw - 14, cy + 33);

    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.subtleInk;
    ctx.font = `bold ${compact ? 10 : 11}px ${FONT_UI}`;
    ctx.fillText(card.paths, cx + 18, cy + ch - 18);
  });

  // 2 Bold Upgrade Cards
  const uy = gridY + 2 * (ch + 10) + 12;
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.subtleInk;
  ctx.font = `bold 11px ${FONT_UI}`;
  ctx.fillText('KITCHEN UPGRADES', mx + 16, uy);

  const uw = Math.floor((modalW - 38) / 2);
  KITCHEN_UPGRADES.slice(0, 2).forEach((up, idx) => {
    const ux = mx + 14 + idx * (uw + 10);
    const active = Boolean(state.upgrades[up.id]);
    drawPlaque(ctx, ux, uy + 8, uw, 46, active ? THEME.jadeSoft : '#EFE4D1', active ? THEME.jade : THEME.brass, 1.8, 7);
    if (active) drawCheckIcon(ctx, ux + 18, uy + 31, 14, THEME.jade);
    ctx.fillStyle = THEME.ink;
    ctx.font = `bold ${compact ? 12 : 13}px ${FONT_UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(up.label, ux + (active ? 34 : 16), uy + 35);
    registerHitbox(state, `upgrade_${up.id}`, ux, uy + 8, uw, 46);
  });
}
