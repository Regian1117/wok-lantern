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
  const barH = 86;
  const sidePad = 12;
  const scoreW = compact ? 344 : 386;
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
    const lw = ord.urgent ? 2.5 : 1.5;
    drawPlaque(ctx, tx, topY, ticketW, barH, fill, stroke, lw, 7);

    // Header strip
    ctx.fillStyle = ord.vip ? THEME.brass : ord.urgent ? THEME.crimson : THEME.lacquer;
    ctx.fillRect(tx + 1, topY + 1, ticketW - 2, 23);

    ctx.fillStyle = ord.vip ? THEME.ink : THEME.ricePaper;
    ctx.font = `bold ${compact ? 10 : 11}px ${FONT_UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(ord.title, tx + 8, topY + 16);

    ctx.textAlign = 'right';
    ctx.fillStyle = ord.vip ? THEME.ink : THEME.brassBright;
    ctx.font = `bold ${compact ? 11 : 12}px ${FONT_UI}`;
    ctx.fillText(`$${ord.price}`, tx + ticketW - 8, topY + 16);

    // Step label
    ctx.textAlign = 'left';
    ctx.fillStyle = ord.urgent ? THEME.crimson : THEME.ink;
    ctx.font = `bold ${compact ? 11 : 12}px ${FONT_UI}`;
    ctx.fillText(ord.stepLabel, tx + 8, topY + 45);

    ctx.fillStyle = THEME.subtleInk;
    ctx.font = `600 10px ${FONT_UI}`;
    ctx.fillText(`ING: ${ord.nextIng.toUpperCase()}`, tx + 8, topY + 62);

    // Countdown progress bar
    const ratio = Math.max(0, Math.min(1, ord.timeLeft / Math.max(1, ord.maxTime)));
    ctx.fillStyle = '#E5D5BE';
    ctx.fillRect(tx + 8, topY + 71, ticketW - 16, 7);
    ctx.fillStyle = ord.urgent ? THEME.crimson : ord.vip ? THEME.brass : THEME.jade;
    ctx.fillRect(tx + 8, topY + 71, (ticketW - 16) * ratio, 7);
  }

  // Right-side unified roll-up scoreboard
  const sx = w - sidePad - scoreW;
  drawPlaque(ctx, sx, topY, scoreW, barH, THEME.lacquer, THEME.brass, 2, 8);

  const shift = getActiveShift(state);
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `bold ${compact ? 10 : 11}px ${FONT_SERIF}`;
  ctx.fillText(`WOK & LANTERN · ${shift.title}`, sx + 10, topY + 18);

  // Clock bezel
  drawPlaque(ctx, sx + 10, topY + 26, 84, 30, THEME.lacquerHi, THEME.brass, 1.3, 6);
  drawClockIcon(ctx, sx + 25, topY + 41, 7, THEME.brassBright);
  ctx.fillStyle = THEME.ricePaper;
  ctx.font = `bold 15px ${FONT_UI}`;
  ctx.fillText(formatClock(state.clockSec), sx + 38, topY + 46);

  // Heat multiplier badge
  const hx = sx + 101;
  drawPlaque(ctx, hx, topY + 26, 90, 30, THEME.jadeSoft, THEME.jade, 1.4, 6);
  drawFlameIcon(ctx, hx + 14, topY + 41, 7, THEME.jade);
  ctx.fillStyle = THEME.jade;
  ctx.font = `bold 13px ${FONT_UI}`;
  ctx.fillText(`x${state.stations.wokRight.heatCombo} HEAT`, hx + 25, topY + 46);

  // Net pay badge
  const nx = sx + 198;
  const nw = scoreW - 208;
  drawPlaque(ctx, nx, topY + 26, nw, 30, THEME.vipGold, THEME.brass, 1.5, 6);
  ctx.fillStyle = THEME.ink;
  ctx.font = `bold ${compact ? 13 : 14}px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(`NET $${state.ledger.netPay}`, nx + nw / 2, topY + 46);

  // Breakdown strip
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.ricePaperWarm;
  ctx.font = `bold ${compact ? 10 : 11}px ${FONT_UI}`;
  ctx.fillText(formatLedgerStrip(state.ledger), sx + 10, topY + 75);

  state.hudBounds.topBar = { x: sidePad, y: topY, w: w - sidePad * 2, h: barH };
}
