export const FINISHING_OVERLAY_ID = 'finishingPassOverlay';

import { THEME, FONT_SERIF, FONT_UI, drawPlaque, registerHitbox } from './hudTheme.js';
import { drawCheckIcon, drawPlayTriangleIcon, drawHollowCircleIcon } from './vectorIcons.js';
import { SAUCES } from '../recipes/catalog.js';

export function drawFinishingPassOverlay(ctx, state, w, h) {
  if (state.mode !== 'finish') return;

  const fin = state.finishing;
  // Top-left subtle mode badge + back button
  drawPlaque(ctx, 16, 14, 240, 40, THEME.lacquer, THEME.brass, 1.5, 8);
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `bold 13px ${FONT_SERIF}`;
  ctx.textAlign = 'left';
  ctx.fillText('FINISHING PASS · MACRO', 28, 39);

  drawPlaque(ctx, 266, 14, 88, 40, THEME.ricePaper, THEME.brass, 1.5, 8);
  ctx.fillStyle = THEME.ink;
  ctx.font = `bold 11px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('BACK [F]', 310, 38);
  registerHitbox(state, 'finish_back', 266, 14, 88, 40);

  // Right-side Checklist Card
  const cardW = 286;
  const cardH = 304;
  const cx = w - cardW - 18;
  const cy = Math.round((h - cardH) * 0.44);
  drawPlaque(ctx, cx, cy, cardW, cardH, THEME.ricePaper, THEME.brass, 2, 10);

  ctx.fillStyle = THEME.lacquer;
  ctx.fillRect(cx + 2, cy + 2, cardW - 4, 42);
  ctx.fillStyle = THEME.vipGold;
  ctx.font = `bold 17px ${FONT_SERIF}`;
  ctx.textAlign = 'left';
  ctx.fillText(`FINISH · $${fin.price}`, cx + 16, cy + 29);

  ctx.textAlign = 'right';
  ctx.fillStyle = THEME.brassBright;
  ctx.font = `bold 12px ${FONT_UI}`;
  ctx.fillText('VIP PLATING', cx + cardW - 16, cy + 29);

  // 3 checklist rows with vector icons only
  for (let i = 0; i < fin.steps.length; i++) {
    const st = fin.steps[i];
    const ry = cy + 58 + i * 44;
    const isAct = st.status === 'active';
    const isDone = st.status === 'done';
    drawPlaque(
      ctx,
      cx + 14,
      ry,
      cardW - 28,
      36,
      isAct ? THEME.vipGold : isDone ? THEME.jadeSoft : '#EFE4D1',
      isAct ? THEME.brass : isDone ? THEME.jade : '#CBB59B',
      1.5,
      6,
    );

    if (isDone) drawCheckIcon(ctx, cx + 32, ry + 18, 13, THEME.jade);
    else if (isAct) drawPlayTriangleIcon(ctx, cx + 32, ry + 18, 12, THEME.brass);
    else drawHollowCircleIcon(ctx, cx + 32, ry + 18, 13, THEME.subtleInk);

    ctx.textAlign = 'left';
    ctx.fillStyle = isDone ? THEME.jade : THEME.ink;
    ctx.font = `bold 12px ${FONT_UI}`;
    ctx.fillText(st.label, cx + 50, ry + 22);
  }

  // Tip badge
  const tipY = cy + 196;
  drawPlaque(ctx, cx + 14, tipY, cardW - 28, 34, THEME.vipGold, THEME.brass, 1.4, 6);
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.subtleInk;
  ctx.font = `bold 11px ${FONT_UI}`;
  ctx.fillText('GLAZE PRESENTATION BONUS', cx + 26, tipY + 21);
  ctx.textAlign = 'right';
  ctx.fillStyle = THEME.jade;
  ctx.font = `bold 14px ${FONT_UI}`;
  ctx.fillText(`TIP +$${fin.tipBonus}`, cx + cardW - 24, tipY + 22);

  // Serve Bell Button
  const btnY = cy + 242;
  drawPlaque(ctx, cx + 14, btnY, cardW - 28, 46, THEME.jade, '#86EFAC', 2, 8);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 14px ${FONT_UI}`;
  ctx.fillText('[SPACE] SERVE BELL', cx + cardW / 2, btnY + 28);
  registerHitbox(state, 'finish_serve_bell', cx + 14, btnY, cardW - 28, 46);

  // Bottom 4-slot Lacquer/Brass Sauce Rail
  const slotW = 148;
  const slotH = 50;
  const gap = 12;
  const totalW = SAUCES.length * slotW + (SAUCES.length - 1) * gap;
  const startX = Math.round((w - totalW) / 2);
  const railY = h - slotH - 16;

  drawPlaque(ctx, startX - 14, railY - 8, totalW + 28, slotH + 16, THEME.lacquer, THEME.brass, 2, 10);
  SAUCES.forEach((s, idx) => {
    const sx = startX + idx * (slotW + gap);
    const selected = fin.selectedSauce === s.id;
    drawPlaque(ctx, sx, railY, slotW, slotH, selected ? THEME.vipGold : THEME.lacquerHi, selected ? THEME.brassBright : THEME.brass, selected ? 2.2 : 1.2, 7);

    ctx.fillStyle = s.accent;
    ctx.beginPath();
    ctx.arc(sx + 24, railY + 25, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = selected ? THEME.ink : THEME.ricePaper;
    ctx.font = `bold 12px ${FONT_UI}`;
    ctx.fillText(s.label, sx + 42, railY + 24);

    ctx.fillStyle = selected ? THEME.subtleInk : THEME.brassBright;
    ctx.font = `bold 10px ${FONT_UI}`;
    ctx.fillText(`KEY ${idx + 1}`, sx + 42, railY + 39);

    registerHitbox(state, `sauce_${s.id}`, sx, railY, slotW, slotH);
  });
}
