export const RECIPE_MODAL_ID = 'recipeRouteModal';

import { THEME, FONT_UI, drawLacquerFrame, drawBrassDrawerButton, drawHankoPriceSeal, registerHitbox } from './hudTheme.js';
import { KITCHEN_UPGRADES } from '../shifts/upgrades.js';

const BASE_CARDS = [
  ['NOODLES', '$34', 'Char Kway Teow · Lo Mein · Dan Dan', '#EAB308', 0],
  ['DUMPLINGS', '$38', 'Xiaolongbao · Gyoza · Jade Wonton', '#D97706', 0],
  ['PEKING DUCK', '$74', 'VIP Carve · Wok Duck · Tea-Smoked', '#991B1B', 1],
  ['CHILI PRAWN', '$46', 'Tiger Prawn · Garlic Steam · Trio', '#E11D48', 0],
];

export function drawRecipeRouteModal(ctx, state, w, h) {
  if (state.mode !== 'route') return;

  const compact = w < 1120;
  const [modalW, modalH] = [Math.min(480, Math.round(w * 0.465)), Math.min(448, h - 162)];
  const [mx, my] = [w - modalW - 12, 104];

  drawLacquerFrame(ctx, mx, my, modalW, modalH, THEME.ricePaper, '#D49B35', 10, true);
  ctx.fillStyle = '#3A0A0A';
  ctx.fillRect(mx + 2, my + 2, modalW - 4, 52);

  ctx.save();
  ctx.fillStyle = '#F7D070'; ctx.font = `900 ${compact ? 23 : 26}px ${FONT_UI}`; ctx.textAlign = 'left';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.2px';
  ctx.fillText('12 DISHES · 3 SHIFTS', mx + 16, my + 37);
  ctx.restore();

  drawBrassDrawerButton(ctx, mx + modalW - 92, my + 12, 78, 32, '', 'CLOSE', 'lacquer');
  registerHitbox(state, 'route_close', mx + modalW - 92, my + 12, 78, 32);

  const sw = Math.floor((modalW - 40) / 3);
  const sy = my + 66;
  ['SHIFT 1 · ALLEY', 'SHIFT 2 · HALL', 'SHIFT 3 · BANQUET'].forEach((lbl, i) => {
    const sx = mx + 14 + i * (sw + 6);
    drawBrassDrawerButton(ctx, sx, sy, sw, 36, '', lbl, state.shiftIndex === i ? 'gold' : i === 0 ? 'jade' : 'lacquer');
    registerHitbox(state, `route_shift_${i}`, sx, sy, sw, 36);
  });

  const subY = sy + 52;
  ctx.textAlign = 'left'; ctx.fillStyle = THEME.ink; ctx.font = `800 ${compact ? 10.5 : 11.5}px ${FONT_UI}`;
  ctx.fillText('4 BASES x 3 PATHS = 12 RECIPES · BATCH: CHILI/GREENS +$10', mx + 14, subY);

  const [gridY, cw, ch] = [subY + 12, Math.floor((modalW - 38) / 2), Math.floor((modalH - 238) / 2)];
  BASE_CARDS.forEach(([title, price, paths, accent, vip], i) => {
    const cx = mx + 14 + (i % 2) * (cw + 10);
    const cy = gridY + Math.floor(i / 2) * (ch + 10);
    drawLacquerFrame(ctx, cx, cy, cw, ch, vip ? '#FEF3C7' : '#FFF9EE', vip ? '#D97706' : '#C9B190', 8, false);
    ctx.fillStyle = accent; ctx.fillRect(cx + 2, cy + 2, 7, ch - 4);
    ctx.textAlign = 'left'; ctx.fillStyle = '#1E100B'; ctx.font = `900 15.5px ${FONT_UI}`;
    ctx.fillText(title, cx + 14, cy + 29);
    drawHankoPriceSeal(ctx, cx + cw - 24, cy + 25, price, 34, 20);
    ctx.textAlign = 'left'; ctx.fillStyle = THEME.subtleInk; ctx.font = `700 10.5px ${FONT_UI}`;
    ctx.fillText(paths, cx + 14, cy + ch - 15, cw - 20);
  });

  const uy = gridY + 2 * (ch + 10) + 10;
  ctx.fillStyle = THEME.subtleInk; ctx.font = `800 11px ${FONT_UI}`;
  ctx.fillText('KITCHEN UPGRADES', mx + 16, uy);
  KITCHEN_UPGRADES.slice(0, 2).forEach((up, idx) => {
    const ux = mx + 14 + idx * (cw + 10);
    const active = Boolean(state.upgrades[up.id]);
    drawBrassDrawerButton(ctx, ux, uy + 8, cw, 44, active ? 'ON' : 'BUY', up.label, active ? 'jade' : 'lacquer');
    registerHitbox(state, `upgrade_${up.id}`, ux, uy + 8, cw, 44);
  });
}
