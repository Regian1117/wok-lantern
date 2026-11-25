export const SHIFT_LEDGER_ID = 'shiftLedgerModal';

import { THEME, FONT_SERIF, FONT_UI, drawLacquerFrame, drawBrassDrawerButton, registerHitbox } from './hudTheme.js';
import { drawStarIcon, drawArrowIcon, drawCheckIcon } from './vectorIcons.js';

export function drawShiftLedgerModal(ctx, state, w, h) {
  if (state.mode !== 'ledger') return;

  ctx.save();
  ctx.fillStyle = 'rgba(18, 8, 6, 0.72)';
  ctx.fillRect(0, 0, w, h);

  const cw = 520;
  const ch = 436;
  const cx = Math.round((w - cw) / 2);
  const cy = Math.round((h - ch) / 2);

  drawLacquerFrame(ctx, cx, cy, cw, ch, THEME.ricePaper, '#F2C14E', 12, true);
  ctx.fillStyle = '#3A0A0A';
  ctx.fillRect(cx + 3, cy + 3, cw - 6, 68);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F7D070';
  ctx.font = `bold 21px ${FONT_SERIF}`;
  ctx.fillText('SHIFT 2 · LANTERN HALL COMPLETE', cx + cw / 2, cy + 32);

  for (let s = 0; s < 3; s++) {
    drawStarIcon(ctx, cx + cw / 2 + (s - 1) * 34, cy + 53, 11.5, s < state.ledger.stars ? '#F7D070' : '#52342B', THEME.ink);
  }

  const l = state.ledger;
  const rows = [
    { label: `DISHES SERVED (${l.dishesServed} x $${l.avgPrice})`, val: `+$${l.basePay}`, color: THEME.ink },
    { label: `WOK HEI COMBO x${l.heatCombo}`, val: `+$${l.heiBonus}`, color: THEME.jade },
    { label: 'GROSS SUBTOTAL', val: `$${l.grossSubtotal}`, color: THEME.ink, bold: true },
    { label: 'BURNT CHILI SCORCH', val: `-$${l.scorchPenalty}`, color: THEME.crimson },
  ];

  rows.forEach((r, idx) => {
    const ry = cy + 84 + idx * 42;
    drawLacquerFrame(ctx, cx + 20, ry, cw - 40, 35, idx === 2 ? '#FEF3C7' : '#FFF9EE', '#D49B35', 6, false);
    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.ink;
    ctx.font = `800 15px ${FONT_UI}`;
    ctx.fillText(r.label, cx + 32, ry + 23);
    ctx.textAlign = 'right';
    ctx.fillStyle = r.color;
    ctx.font = `900 17px ${FONT_UI}`;
    ctx.fillText(r.val, cx + cw - 32, ry + 24);
  });

  const ny = cy + 258;
  drawLacquerFrame(ctx, cx + 20, ny, cw - 40, 52, '#3A0A0A', '#F7D070', 8, true);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FEF3C7';
  ctx.font = `900 17px ${FONT_UI}`;
  ctx.fillText('NET SHIFT PAY', cx + 36, ny + 32);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#F7D070';
  ctx.font = `900 25px ${FONT_UI}`;
  ctx.fillText(`+$${l.netPay}`, cx + cw - 36, ny + 35);

  const uy = cy + 320;
  drawLacquerFrame(ctx, cx + 20, uy, cw - 40, 38, THEME.jadeSoft, THEME.jade, 6, false);
  drawCheckIcon(ctx, cx + 38, uy + 19, 13, THEME.jade);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#14532D';
  ctx.font = `800 14px ${FONT_UI}`;
  ctx.fillText('UNLOCKED: JET WOK BURNER (+35% SEAR)', cx + 56, uy + 24);

  const by = cy + 368;
  drawBrassDrawerButton(ctx, cx + 20, by, cw - 40, 50, 'SPACE', 'NEXT: SHIFT 3 · BANQUET', 'action', (c, ix, iy) =>
    drawArrowIcon(c, ix, iy, 13, '#FDE047'),
  );
  registerHitbox(state, 'ledger_next', cx + 20, by, cw - 40, 50);

  ctx.restore();
}
