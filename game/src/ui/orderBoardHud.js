export const ORDER_HUD_ID = 'orderBoardHud';

import { THEME, FONT_SERIF, FONT_UI, drawPlaque } from './hudTheme.js';
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
  const topY = 8;
  const barH = 90;
  const sidePad = 12;
  const scoreW = compact ? 348 : 398;
  const gap = 8;
  const ticketsAreaW = w - sidePad * 2 - scoreW - 10;
  const ticketW = Math.floor((ticketsAreaW - gap * 3) / 4);
  const pulse = 0.5 + 0.5 * Math.sin(state.time * 7);

  for (let i = 0; i < Math.min(4, state.orders.length); i++) {
    const ord = state.orders[i];
    const tx = sidePad + i * (ticketW + gap);
    const fill = ord.vip ? THEME.vipGold : THEME.ricePaper;
    const stroke = ord.urgent ? (pulse > 0.45 ? THEME.crimson : '#EF4444') : ord.vip ? THEME.brass : '#B0895A';
    drawPlaque(ctx, tx, topY, ticketW, barH, fill, stroke, ord.urgent ? 2.5 : 1.5, 7);

    ctx.fillStyle = ord.vip ? THEME.brass : ord.urgent ? THEME.crimson : THEME.lacquer;
    ctx.fillRect(tx + 1, topY + 1, ticketW - 2, 22);
    ctx.fillStyle = ord.vip ? THEME.ink : THEME.ricePaper;
    ctx.font = `800 ${compact ? 9.5 : 11}px ${FONT_UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(ord.title, tx + 6, topY + 15.5);

    ctx.textAlign = 'right';
    ctx.fillStyle = ord.vip ? THEME.ink : THEME.brassBright;
    ctx.font = `900 ${compact ? 11.5 : 12.5}px ${FONT_UI}`;
    ctx.fillText(`$${ord.price}`, tx + ticketW - 6, topY + 15.5);

    drawDishThumbnail(ctx, ord.base, tx + 19, topY + 42, compact ? 11 : 12.5);

    const patron = ord.patron || { name: 'GUEST', role: 'REGULAR', color: THEME.jade };
    ctx.fillStyle = patron.color;
    ctx.beginPath();
    ctx.arc(tx + 38, topY + 34, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.subtleInk;
    ctx.font = `800 8.5px ${FONT_UI}`;
    const shortRole = patron.role === 'REGULAR' ? 'REG' : patron.role === 'VIP CRITIC' ? 'VIP' : patron.role;
    const patronTxt = compact ? patron.name : `${patron.name} · ${shortRole}`;
    const maxW = Math.max(40, ticketW - 76);
    ctx.fillText(patronTxt, tx + 44, topY + 37, maxW);

    ctx.textAlign = 'right';
    ctx.fillStyle = ord.urgent ? THEME.crimson : THEME.ink;
    ctx.font = `900 10px ${FONT_UI}`;
    ctx.fillText(`${Math.ceil(ord.timeLeft)}s`, tx + ticketW - 6, topY + 37);

    ctx.textAlign = 'left';
    ctx.fillStyle = ord.urgent ? THEME.crimson : THEME.ink;
    ctx.font = `800 ${compact ? 10 : 11}px ${FONT_UI}`;
    ctx.fillText(ord.stepLabel, tx + 36, topY + 52);

    drawTicketStepChips(ctx, tx + 6, topY + 60, ticketW - 12, ord, state.chef, state.batchPrep);

    const ratio = Math.max(0, Math.min(1, ord.timeLeft / Math.max(1, ord.maxTime)));
    ctx.fillStyle = '#E5D5BE';
    ctx.fillRect(tx + 6, topY + 79, ticketW - 12, 5);
    ctx.fillStyle = ord.urgent ? THEME.crimson : ord.vip ? THEME.brass : THEME.jade;
    ctx.fillRect(tx + 6, topY + 79, (ticketW - 12) * ratio, 5);
  }

  const sx = w - sidePad - scoreW;
  drawPlaque(ctx, sx, topY, scoreW, barH, THEME.lacquer, THEME.brass, 2, 8);
  const shift = getActiveShift(state);
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `bold ${compact ? 10.5 : 11.5}px ${FONT_SERIF}`;
  ctx.fillText(`WOK & LANTERN · ${shift.title}`, sx + 10, topY + 19);

  drawPlaque(ctx, sx + 10, topY + 26, 90, 32, THEME.lacquerHi, THEME.brassBright, 1.5, 6);
  drawClockIcon(ctx, sx + 25, topY + 42, 7.5, THEME.brassBright);
  ctx.fillStyle = THEME.ricePaper;
  ctx.font = `900 16px ${FONT_UI}`;
  ctx.fillText(formatClock(state.clockSec), sx + 38, topY + 48);

  const hx = sx + 106;
  drawPlaque(ctx, hx, topY + 26, 94, 32, THEME.jadeSoft, THEME.jade, 1.6, 6);
  drawFlameIcon(ctx, hx + 14, topY + 42, 7.5, THEME.jade);
  ctx.fillStyle = THEME.jade;
  ctx.font = `900 14px ${FONT_UI}`;
  ctx.fillText(`x${state.stations.wokRight.heatCombo} HEAT`, hx + 25, topY + 48);

  const nx = sx + 206;
  const nw = scoreW - 216;
  drawPlaque(ctx, nx, topY + 26, nw, 32, THEME.vipGold, THEME.brassBright, 1.8, 6);
  ctx.fillStyle = THEME.ink;
  ctx.font = `900 ${compact ? 15 : 16.5}px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(`NET $${state.ledger.netPay}`, nx + nw / 2, topY + 48);

  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `800 ${compact ? 11 : 12}px ${FONT_UI}`;
  const strip =
    !state.shotMode && state.ledger.dishesServed === 0 && state.ledger.scorchPenalty === 0
      ? '0 SERVED · BUILD WOK HEI COMBO'
      : formatLedgerStrip(state.ledger);
  ctx.fillText(strip, sx + 10, topY + 78);

  state.hudBounds.topBar = { x: sidePad, y: topY, w: w - sidePad * 2, h: barH };
}
