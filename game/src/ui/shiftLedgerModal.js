export const SHIFT_LEDGER_ID = 'shiftLedgerModal';

import { THEME, FONT_SERIF, FONT_UI, drawPlaque, registerHitbox } from './hudTheme.js';
import { drawStarIcon, drawArrowIcon, drawCheckIcon } from './vectorIcons.js';

export function drawShiftLedgerModal(ctx, state, w, h) {
  if (state.mode !== 'ledger') return;

  ctx.save();
  ctx.fillStyle = 'rgba(18, 8, 6, 0.68)';
  ctx.fillRect(0, 0, w, h);

  const cw = 480;
  const ch = 418;
  const cx = Math.round((w - cw) / 2);
  const cy = Math.round((h - ch) / 2);

  drawPlaque(ctx, cx, cy, cw, ch, THEME.ricePaper, THEME.brass, 2.5, 12);

  // Header
  ctx.fillStyle = THEME.lacquer;
  ctx.fillRect(cx + 2, cy + 2, cw - 4, 64);
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `bold 20px ${FONT_SERIF}`;
  ctx.fillText('SHIFT 2 · LANTERN HALL COMPLETE', cx + cw / 2, cy + 30);

  // 3 drawn gold stars
  for (let s = 0; s < 3; s++) {
    const filled = s < state.ledger.stars;
    drawStarIcon(ctx, cx + cw / 2 + (s - 1) * 32, cy + 50, 11, filled ? THEME.brassBright : '#52342B', THEME.ink);
  }

  // Ledger rows
  const l = state.ledger;
  const rows = [
    { label: `DISHES SERVED (${l.dishesServed} x $${l.avgPrice})`, val: `+$${l.basePay}`, color: THEME.ink },
    { label: `WOK HEI COMBO x${l.heatCombo}`, val: `+$${l.heiBonus}`, color: THEME.jade },
    { label: 'GROSS SUBTOTAL', val: `$${l.grossSubtotal}`, color: THEME.ink, bold: true },
    { label: 'BURNT CHILI', val: `-$${l.scorchPenalty}`, color: THEME.crimson },
  ];

  rows.forEach((r, idx) => {
    const ry = cy + 84 + idx * 38;
    drawPlaque(ctx, cx + 22, ry, cw - 44, 32, idx === 2 ? THEME.vipGold : '#FFF9EE', '#D8C3A5', 1, 6);
    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.ink;
    ctx.font = `${r.bold ? 'bold' : '600'} 12px ${FONT_UI}`;
    ctx.fillText(r.label, cx + 34, ry + 20);
    ctx.textAlign = 'right';
    ctx.fillStyle = r.color;
    ctx.font = `bold 13px ${FONT_UI}`;
    ctx.fillText(r.val, cx + cw - 34, ry + 21);
  });

  // Net shift pay box
  const ny = cy + 244;
  drawPlaque(ctx, cx + 22, ny, cw - 44, 46, THEME.lacquer, THEME.brassBright, 2, 8);
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.ricePaperWarm;
  ctx.font = `bold 13px ${FONT_UI}`;
  ctx.fillText('NET SHIFT PAY', cx + 36, ny + 28);
  ctx.textAlign = 'right';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `bold 20px ${FONT_UI}`;
  ctx.fillText(`+$${l.netPay}`, cx + cw - 36, ny + 30);

  // Unlocked upgrade
  const uy = cy + 300;
  drawPlaque(ctx, cx + 22, uy, cw - 44, 36, THEME.jadeSoft, THEME.jade, 1.5, 6);
  drawCheckIcon(ctx, cx + 38, uy + 18, 12, THEME.jade);
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.jade;
  ctx.font = `bold 12px ${FONT_UI}`;
  ctx.fillText('UNLOCKED: JET WOK BURNER (+35% SEAR)', cx + 54, uy + 22);

  // Next shift CTA
  const by = cy + 348;
  drawPlaque(ctx, cx + 22, by, cw - 44, 48, THEME.brass, THEME.ink, 2, 8);
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.ink;
  ctx.font = `bold 15px ${FONT_UI}`;
  ctx.fillText('NEXT: SHIFT 3 · BANQUET', cx + cw / 2 - 12, by + 30);
  drawArrowIcon(ctx, cx + cw / 2 + 106, by + 24, 15, THEME.ink);
  registerHitbox(state, 'ledger_next', cx + 22, by, cw - 44, 48);

  ctx.restore();
}
