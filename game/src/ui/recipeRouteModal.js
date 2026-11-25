export const RECIPE_MODAL_ID = 'recipeRouteModal';

import { THEME, FONT_UI, drawLacquerFrame, drawBrassDrawerButton, drawHankoPriceSeal, registerHitbox } from './hudTheme.js';
import { KITCHEN_UPGRADES } from '../shifts/upgrades.js';

const BASE_DISH_CARDS = [
  { id: 'noodles', title: 'NOODLES', price: '$34', paths: 'Char Kway Teow · Lo Mein · Dan Dan', accent: '#EAB308' },
  { id: 'dumplings', title: 'DUMPLINGS', price: '$38', paths: 'Xiaolongbao · Potsticker · Wonton', accent: '#D97706' },
  { id: 'duck', title: 'PEKING DUCK', price: '$74', paths: 'VIP Carve · Wok Duck · Tea-Smoked', accent: '#991B1B', vip: true },
  { id: 'prawn', title: 'CHILI PRAWN', price: '$46', paths: 'Tiger Prawn · Garlic Steam · Trio', accent: '#E11D48' },
];

export function drawRecipeRouteModal(ctx, state, w, h) {
  if (state.mode !== 'route') return;

  const compact = w < 1120;
  const modalW = Math.min(480, Math.round(w * 0.465));
  const modalH = Math.min(448, h - 162);
  const mx = w - modalW - 12;
  const my = 104;

  drawLacquerFrame(ctx, mx, my, modalW, modalH, THEME.ricePaper, '#D49B35', 10, true);
  ctx.fillStyle = '#3A0A0A';
  ctx.fillRect(mx + 2, my + 2, modalW - 4, 52);

  ctx.save();
  ctx.fillStyle = '#F7D070';
  ctx.font = `900 ${compact ? 23 : 26}px ${FONT_UI}`;
  ctx.textAlign = 'left';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.2px';
  ctx.fillText('12 DISHES · 3 SHIFTS', mx + 16, my + 37);
  ctx.restore();

  drawBrassDrawerButton(ctx, mx + modalW - 92, my + 12, 78, 32, '', 'CLOSE', 'lacquer');
  registerHitbox(state, 'route_close', mx + modalW - 92, my + 12, 78, 32);

  const shifts = [
    { idx: 0, label: 'SHIFT 1 · ALLEY' },
    { idx: 1, label: 'SHIFT 2 · HALL' },
    { idx: 2, label: 'SHIFT 3 · BANQUET' },
  ];
  const sw = Math.floor((modalW - 40) / 3);
  const sy = my + 66;
  shifts.forEach((sh, i) => {
    const sx = mx + 14 + i * (sw + 6);
    const active = state.shiftIndex === sh.idx;
    drawBrassDrawerButton(ctx, sx, sy, sw, 36, '', sh.label, active ? 'gold' : i === 0 ? 'jade' : 'lacquer');
    registerHitbox(state, `route_shift_${sh.idx}`, sx, sy, sw, 36);
  });

  const subY = sy + 52;
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.ink;
  ctx.font = `800 ${compact ? 10.5 : 11.5}px ${FONT_UI}`;
  ctx.fillText('4 BASES x 3 PATHS = 12 RECIPES · BATCH: CHILI/GREENS +$10', mx + 14, subY);

  const gridY = subY + 12;
  const cw = Math.floor((modalW - 38) / 2);
  const ch = Math.floor((modalH - 238) / 2);
  BASE_DISH_CARDS.forEach((card, i) => {
    const cx = mx + 14 + (i % 2) * (cw + 10);
    const cy = gridY + Math.floor(i / 2) * (ch + 10);
    drawLacquerFrame(ctx, cx, cy, cw, ch, card.vip ? '#FEF3C7' : '#FFF9EE', card.vip ? '#D97706' : '#C9B190', 8, false);
    ctx.fillStyle = card.accent;
    ctx.fillRect(cx + 2, cy + 2, 7, ch - 4);
    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.ink;
    ctx.font = `900 ${compact ? 14.5 : 16}px ${FONT_UI}`;
    ctx.fillText(card.title, cx + 16, cy + 30);
    drawHankoPriceSeal(ctx, cx + cw - 24, cy + 25, card.price, 34, 20);
    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.subtleInk;
    ctx.font = `700 10px ${FONT_UI}`;
    ctx.fillText(card.paths, cx + 16, cy + ch - 16, cw - 24);
  });

  const uy = gridY + 2 * (ch + 10) + 10;
  ctx.fillStyle = THEME.subtleInk;
  ctx.font = `800 11px ${FONT_UI}`;
  ctx.fillText('KITCHEN UPGRADES', mx + 16, uy);
  const uw = Math.floor((modalW - 38) / 2);
  KITCHEN_UPGRADES.slice(0, 2).forEach((up, idx) => {
    const ux = mx + 14 + idx * (uw + 10);
    const active = Boolean(state.upgrades[up.id]);
    drawBrassDrawerButton(ctx, ux, uy + 8, uw, 44, active ? 'ON' : 'BUY', up.label, active ? 'jade' : 'lacquer');
    registerHitbox(state, `upgrade_${up.id}`, ux, uy + 8, uw, 44);
  });
}
