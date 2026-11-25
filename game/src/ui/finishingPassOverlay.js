export const FINISHING_OVERLAY_ID = 'finishingPassOverlay';

import { THEME, FONT_SERIF, FONT_UI, drawLacquerFrame, drawBrassDrawerButton, drawHankoPriceSeal, registerHitbox } from './hudTheme.js';
import { drawCheckIcon, drawPlayTriangleIcon, drawHollowCircleIcon } from './vectorIcons.js';
import { SAUCES } from '../recipes/catalog.js';

export function drawFinishingPassOverlay(ctx, state, w, h) {
  if (state.mode !== 'finish') return;

  const fin = state.finishing;
  drawLacquerFrame(ctx, 16, 14, 244, 42, '#3A0A0A', '#F2C14E', 8, true);
  ctx.fillStyle = '#F7D070';
  ctx.font = `bold 13px ${FONT_SERIF}`;
  ctx.textAlign = 'left';
  ctx.fillText('FINISHING PASS · MACRO', 30, 40);

  drawBrassDrawerButton(ctx, 270, 15, 96, 40, 'F', 'BACK', 'lacquer');
  registerHitbox(state, 'finish_back', 270, 15, 96, 40);

  const cardW = 296;
  const cardH = 316;
  const cx = w - cardW - 18;
  const cy = Math.round((h - cardH) * 0.43);
  drawLacquerFrame(ctx, cx, cy, cardW, cardH, THEME.ricePaper, '#D49B35', 10, true);

  ctx.fillStyle = '#3A0A0A';
  ctx.fillRect(cx + 2, cy + 2, cardW - 4, 46);
  ctx.fillStyle = '#F7D070';
  ctx.font = `900 18px ${FONT_SERIF}`;
  ctx.textAlign = 'left';
  ctx.fillText(`FINISH · $${fin.price}`, cx + 16, cy + 31);
  drawHankoPriceSeal(ctx, cx + cardW - 32, cy + 25, 'VIP', 38, 19);

  for (let i = 0; i < fin.steps.length; i++) {
    const st = fin.steps[i];
    const ry = cy + 60 + i * 46;
    const isAct = st.status === 'active';
    const isDone = st.status === 'done';
    drawLacquerFrame(
      ctx,
      cx + 14,
      ry,
      cardW - 28,
      38,
      isAct ? '#FEF3C7' : isDone ? THEME.jadeSoft : '#EFE4D1',
      isAct ? '#D97706' : isDone ? THEME.jade : '#CBB59B',
      6,
      false,
    );
    if (isDone) drawCheckIcon(ctx, cx + 32, ry + 19, 14, THEME.jade);
    else if (isAct) drawPlayTriangleIcon(ctx, cx + 32, ry + 19, 13, '#D97706');
    else drawHollowCircleIcon(ctx, cx + 32, ry + 19, 14, THEME.subtleInk);
    ctx.textAlign = 'left';
    ctx.fillStyle = isDone ? '#14532D' : THEME.ink;
    ctx.font = `800 14px ${FONT_UI}`;
    ctx.fillText(st.label, cx + 52, ry + 24);
  }

  const tipY = cy + 204;
  drawLacquerFrame(ctx, cx + 14, tipY, cardW - 28, 36, '#FEF3C7', '#D49B35', 6, false);
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.subtleInk;
  ctx.font = `800 11px ${FONT_UI}`;
  ctx.fillText('GLAZE PRESENTATION', cx + 24, tipY + 22);
  ctx.textAlign = 'right';
  ctx.fillStyle = THEME.jade;
  ctx.font = `900 15px ${FONT_UI}`;
  ctx.fillText(`TIP +$${fin.tipBonus}`, cx + cardW - 24, tipY + 23);

  const btnY = cy + 252;
  drawBrassDrawerButton(ctx, cx + 14, btnY, cardW - 28, 48, 'SPACE', 'SERVE BELL', 'jade');
  registerHitbox(state, 'finish_serve_bell', cx + 14, btnY, cardW - 28, 48);

  const slotW = 152;
  const slotH = 48;
  const gap = 12;
  const totalW = SAUCES.length * slotW + (SAUCES.length - 1) * gap;
  const startX = Math.round((w - totalW) / 2);
  const railY = h - slotH - 14;

  drawLacquerFrame(ctx, startX - 14, railY - 8, totalW + 28, slotH + 16, '#2B0808', '#D49B35', 10, true);
  SAUCES.forEach((s, idx) => {
    const sx = startX + idx * (slotW + gap);
    const selected = fin.selectedSauce === s.id;
    drawBrassDrawerButton(ctx, sx, railY, slotW, slotH, String(idx + 1), s.label, selected ? 'gold' : 'lacquer', (c, ix, iy) => {
      c.fillStyle = s.accent;
      c.beginPath();
      c.arc(ix, iy, 6.5, 0, Math.PI * 2);
      c.fill();
    });
    registerHitbox(state, `sauce_${s.id}`, sx, railY, slotW, slotH);
  });
}
