export const ORDER_HUD_ID = 'orderBoardHud';

import { THEME, FONT_SERIF, FONT_UI, drawLacquerFrame, drawHankoPriceSeal } from './hudTheme.js';
import { drawClockIcon, drawFlameIcon } from './vectorIcons.js';
import { drawDishThumbnail, drawTicketStepChips } from './dishIcons.js';
import { formatLedgerStrip } from '../service/scoringLedger.js';
import { getActiveShift } from '../service/rushPacing.js';

function formatClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function drawOrderBoardHud(ctx, state, w) {
  const compact = w < 1120;
  ctx.fillStyle = '#330808';
  ctx.fillRect(0, 0, w, 6);
  ctx.fillStyle = '#D49B35';
  ctx.fillRect(0, 5.5, w, 1.5);

  const topY = 6;
  const barH = 80;
  const sidePad = 12;
  const scoreW = compact ? 352 : 402;
  const gap = 8;
  const ticketW = Math.floor((w - sidePad * 2 - scoreW - 10 - gap * 3) / 4);
  const pulse = 0.5 + 0.5 * Math.sin(state.time * 7);

  for (let i = 0; i < Math.min(4, state.orders.length); i++) {
    const ord = state.orders[i];
    const tx = sidePad + i * (ticketW + gap);
    const fill = ord.vip ? '#FEF3C7' : THEME.ricePaper;
    const stroke = ord.urgent ? (pulse > 0.45 ? '#DC2626' : '#EF4444') : ord.vip ? '#D49B35' : '#9A6B2F';
    drawLacquerFrame(ctx, tx, topY, ticketW, barH, fill, stroke, 7, true);

    ctx.fillStyle = ord.vip ? '#B45309' : ord.urgent ? '#991B1B' : '#3A0A0A';
    ctx.fillRect(tx + 2, topY + 2, ticketW - 4, 19);
    ctx.fillStyle = THEME.ricePaper;
    ctx.font = `800 ${compact ? 9.5 : 10.5}px ${FONT_UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(ord.title, tx + 7, topY + 14.5, ticketW - 44);
    drawHankoPriceSeal(ctx, tx + ticketW - 19, topY + 11.5, `$${ord.price}`, 28, 15);

    drawDishThumbnail(ctx, ord.base, tx + 18, topY + 37, compact ? 10 : 11);
    const patron = ord.patron || { name: 'GUEST', role: 'REGULAR', color: THEME.jade };
    ctx.fillStyle = patron.color;
    ctx.beginPath();
    ctx.arc(tx + 36, topY + 30, 3.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.subtleInk;
    ctx.font = `800 8.5px ${FONT_UI}`;
    const shortRole = patron.role === 'REGULAR' ? 'REG' : patron.role === 'VIP CRITIC' ? 'VIP' : patron.role;
    ctx.fillText(compact ? patron.name : `${patron.name} · ${shortRole}`, tx + 42, topY + 33, Math.max(40, ticketW - 76));

    ctx.textAlign = 'right';
    ctx.fillStyle = ord.urgent ? THEME.crimson : THEME.ink;
    ctx.font = `900 10px ${FONT_UI}`;
    ctx.fillText(`${Math.ceil(ord.timeLeft)}s`, tx + ticketW - 7, topY + 33);

    ctx.textAlign = 'left';
    ctx.fillStyle = ord.urgent ? THEME.crimson : THEME.ink;
    ctx.font = `800 ${compact ? 9.5 : 10.5}px ${FONT_UI}`;
    ctx.fillText(ord.stepLabel, tx + 35, topY + 46, ticketW - 41);

    drawTicketStepChips(ctx, tx + 6, topY + 52, ticketW - 12, ord, state.chef, state.batchPrep);
    const ratio = Math.max(0, Math.min(1, ord.timeLeft / Math.max(1, ord.maxTime)));
    ctx.fillStyle = '#E5D5BE';
    ctx.fillRect(tx + 6, topY + 71, ticketW - 12, 4.5);
    ctx.fillStyle = ord.urgent ? '#DC2626' : ord.vip ? '#D97706' : THEME.jade;
    ctx.fillRect(tx + 6, topY + 71, (ticketW - 12) * ratio, 4.5);
  }

  const sx = w - sidePad - scoreW;
  drawLacquerFrame(ctx, sx, topY, scoreW, barH, '#3A0A0A', '#F2C14E', 8, true);
  const shift = getActiveShift(state);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#F7D070';
  ctx.font = `bold ${compact ? 10 : 11}px ${FONT_SERIF}`;
  ctx.fillText(`WOK & LANTERN · ${shift.title}`, sx + 10, topY + 17);

  drawLacquerFrame(ctx, sx + 10, topY + 22, 84, 29, '#240707', '#D49B35', 5, false);
  drawClockIcon(ctx, sx + 23, topY + 36.5, 6.5, '#F7D070');
  ctx.fillStyle = THEME.ricePaper;
  ctx.font = `900 14.5px ${FONT_UI}`;
  ctx.fillText(formatClock(state.clockSec), sx + 35, topY + 41.5);

  const hx = sx + 100;
  drawLacquerFrame(ctx, hx, topY + 22, 114, 29, THEME.jadeSoft, THEME.jade, 5, false);
  drawFlameIcon(ctx, hx + 13, topY + 36.5, 6.5, THEME.jade);
  ctx.fillStyle = '#14532D';
  ctx.font = `900 12.5px ${FONT_UI}`;
  ctx.fillText(`x${state.stations.wokRight.heatCombo} WOK HEI`, hx + 23, topY + 41);

  const nx = sx + 220;
  const nw = scoreW - 230;
  drawLacquerFrame(ctx, nx, topY + 22, nw, 29, '#FEF3C7', '#F2C14E', 5, false);
  ctx.fillStyle = THEME.ink;
  ctx.font = `900 ${compact ? 14 : 15.5}px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(`NET $${state.ledger.netPay}`, nx + nw / 2, topY + 41.5);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FCD34D';
  ctx.font = `800 ${compact ? 9.5 : 10.5}px ${FONT_UI}`;
  const strip = !state.shotMode && state.ledger.dishesServed === 0 && state.ledger.scorchPenalty === 0 ? '0 SERVED · BUILD WOK HEI COMBO' : formatLedgerStrip(state.ledger);
  ctx.fillText(strip, sx + 10, topY + 69, scoreW - 20);

  state.hudBounds.topBar = { x: sidePad, y: topY, w: w - sidePad * 2, h: barH };
}
