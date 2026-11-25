export const ORDER_HUD_ID = 'orderBoardHud';

import { THEME, FONT_SERIF, FONT_UI, drawPlaque } from './hudTheme.js';
import { drawClockIcon, drawFlameIcon } from './vectorIcons.js';
import { formatLedgerStrip } from '../service/scoringLedger.js';
import { getActiveShift } from '../service/rushPacing.js';

function formatClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function drawOrderBoardHud(ctx, state, w) {
  const compact = w < 1120;
  const topY = 8;
  const barH = 88;
  const sidePad = 12;
  const scoreW = compact ? 356 : 404;
  const gap = 8;
  const ticketsAreaW = w - sidePad * 2 - scoreW - 10;
  const ticketW = Math.floor((ticketsAreaW - gap * 3) / 4);

  const pulse = 0.5 + 0.5 * Math.sin(state.time * 7);
  for (let i = 0; i < Math.min(4, state.orders.length); i++) {
    const ord = state.orders[i];
    const tx = sidePad + i * (ticketW + gap);
    const fill = ord.vip ? THEME.vipGold : THEME.ricePaper;
    const stroke = ord.urgent
      ? (pulse > 0.45 ? THEME.crimson : '#EF4444')
      : ord.vip
        ? THEME.brass
        : '#B0895A';
    drawPlaque(ctx, tx, topY, ticketW, barH, fill, stroke, ord.urgent ? 2.6 : 1.5, 7);

    ctx.fillStyle = ord.vip ? THEME.brass : ord.urgent ? THEME.crimson : THEME.lacquer;
    ctx.fillRect(tx + 1, topY + 1, ticketW - 2, 24);

    ctx.fillStyle = ord.vip ? THEME.ink : THEME.ricePaper;
    ctx.font = `800 ${compact ? 10 : 11.5}px ${FONT_UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(ord.title, tx + 7, topY + 17);

    ctx.textAlign = 'right';
    ctx.fillStyle = ord.vip ? THEME.ink : THEME.brassBright;
    ctx.font = `900 ${compact ? 12 : 13}px ${FONT_UI}`;
    ctx.fillText(`$${ord.price}`, tx + ticketW - 7, topY + 17);

    // Highlighted step / red urgency strip
    if (ord.urgent) {
      ctx.fillStyle = THEME.crimsonSoft;
      ctx.fillRect(tx + 4, topY + 28, ticketW - 8, 22);
    }
    ctx.textAlign = 'left';
    ctx.fillStyle = ord.urgent ? THEME.crimson : THEME.ink;
    ctx.font = `${ord.urgent ? '900' : '800'} ${compact ? 11.5 : 12.5}px ${FONT_UI}`;
    ctx.fillText(ord.stepLabel, tx + 8, topY + 44);

    ctx.fillStyle = THEME.subtleInk;
    ctx.font = `700 10px ${FONT_UI}`;
    ctx.fillText(`ING: ${ord.nextIng.toUpperCase()}`, tx + 8, topY + 64);

    const ratio = Math.max(0, Math.min(1, ord.timeLeft / Math.max(1, ord.maxTime)));
    ctx.fillStyle = '#E5D5BE';
    ctx.fillRect(tx + 8, topY + 73, ticketW - 16, 7);
    ctx.fillStyle = ord.urgent ? THEME.crimson : ord.vip ? THEME.brass : THEME.jade;
    ctx.fillRect(tx + 8, topY + 73, (ticketW - 16) * ratio, 7);
  }

  // Right-side roll-up scoreboard with high-OCR bold figures
  const sx = w - sidePad - scoreW;
  drawPlaque(ctx, sx, topY, scoreW, barH, THEME.lacquer, THEME.brass, 2, 8);

  const shift = getActiveShift(state);
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `bold ${compact ? 10.5 : 11.5}px ${FONT_SERIF}`;
  ctx.fillText(`WOK & LANTERN · ${shift.title}`, sx + 10, topY + 19);

  drawPlaque(ctx, sx + 10, topY + 26, 92, 32, THEME.lacquerHi, THEME.brassBright, 1.5, 6);
  drawClockIcon(ctx, sx + 25, topY + 42, 7.5, THEME.brassBright);
  ctx.fillStyle = THEME.ricePaper;
  ctx.font = `900 16px ${FONT_UI}`;
  ctx.fillText(formatClock(state.clockSec), sx + 38, topY + 48);

  const hx = sx + 108;
  drawPlaque(ctx, hx, topY + 26, 96, 32, THEME.jadeSoft, THEME.jade, 1.6, 6);
  drawFlameIcon(ctx, hx + 14, topY + 42, 7.5, THEME.jade);
  ctx.fillStyle = THEME.jade;
  ctx.font = `900 14.5px ${FONT_UI}`;
  ctx.fillText(`x${state.stations.wokRight.heatCombo} HEAT`, hx + 25, topY + 48);

  const nx = sx + 210;
  const nw = scoreW - 220;
  drawPlaque(ctx, nx, topY + 26, nw, 32, THEME.vipGold, THEME.brassBright, 1.8, 6);
  ctx.fillStyle = THEME.ink;
  ctx.font = `900 ${compact ? 15 : 16.5}px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(`NET $${state.ledger.netPay}`, nx + nw / 2, topY + 48);

  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `800 ${compact ? 11.5 : 12.5}px ${FONT_UI}`;
  ctx.fillText(formatLedgerStrip(state.ledger), sx + 10, topY + 77);

  state.hudBounds.topBar = { x: sidePad, y: topY, w: w - sidePad * 2, h: barH };
}
