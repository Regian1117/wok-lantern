export const FINISHING_OVERLAY_ID = 'finishingPassOverlay';

import { THEME, FONT_SERIF, FONT_UI, drawLacquerFrame, drawBrassDrawerButton, drawHankoPriceSeal, registerHitbox } from './hudTheme.js';
import { drawCheckIcon, drawPlayTriangleIcon, drawHollowCircleIcon } from './vectorIcons.js';
import { SAUCES } from '../recipes/catalog.js';

export function drawFinishingPassOverlay(ctx, state, w, h) {
  if (state.mode !== 'finish') return;

  const fin = state.finishing;
  drawLacquerFrame(ctx, 16, 14, 244, 42, '#3A0A0A', '#F2C14E', 8, true);
  ctx.fillStyle = '#F7D070'; ctx.font = `bold 13px ${FONT_SERIF}`; ctx.textAlign = 'left';
  ctx.fillText('FINISHING PASS · MACRO', 30, 40);

  drawBrassDrawerButton(ctx, 270, 15, 96, 40, 'F', 'BACK', 'lacquer');
  registerHitbox(state, 'finish_back', 270, 15, 96, 40);

  const [cardW, cardH] = [296, 316];
  const [cx, cy] = [w - cardW - 18, Math.round((h - cardH) * 0.43)];
  drawLacquerFrame(ctx, cx, cy, cardW, cardH, THEME.ricePaper, '#D49B35', 10, true);
  ctx.fillStyle = '#3A0A0A'; ctx.fillRect(cx + 2, cy + 2, cardW - 4, 46);
  ctx.fillStyle = '#F7D070'; ctx.font = `900 18px ${FONT_SERIF}`; ctx.textAlign = 'left';
  ctx.fillText(`FINISH · $${fin.price}`, cx + 16, cy + 31);
  drawHankoPriceSeal(ctx, cx + cardW - 32, cy + 25, 'VIP', 38, 19);

  fin.steps.forEach((st, i) => {
    const ry = cy + 60 + i * 46;
    const [act, done] = [st.status === 'active', st.status === 'done'];
    drawLacquerFrame(ctx, cx + 14, ry, cardW - 28, 38, act ? '#FEF3C7' : done ? THEME.jadeSoft : '#EFE4D1', act ? '#D97706' : done ? THEME.jade : '#CBB59B', 6, false);
    if (done) drawCheckIcon(ctx, cx + 32, ry + 19, 14, THEME.jade);
    else if (act) drawPlayTriangleIcon(ctx, cx + 32, ry + 19, 13, '#D97706');
    else drawHollowCircleIcon(ctx, cx + 32, ry + 19, 14, THEME.subtleInk);
    ctx.textAlign = 'left'; ctx.fillStyle = done ? '#14532D' : THEME.ink; ctx.font = `800 14px ${FONT_UI}`;
    ctx.fillText(st.label, cx + 52, ry + 24);
  });

  const tipY = cy + 204;
  drawLacquerFrame(ctx, cx + 14, tipY, cardW - 28, 36, '#FEF3C7', '#D49B35', 6, false);
  ctx.textAlign = 'left'; ctx.fillStyle = THEME.subtleInk; ctx.font = `800 11px ${FONT_UI}`;
  ctx.fillText('GLAZE PRESENTATION', cx + 24, tipY + 22);
  ctx.textAlign = 'right'; ctx.fillStyle = THEME.jade; ctx.font = `900 15px ${FONT_UI}`;
  ctx.fillText(`TIP +$${fin.tipBonus}`, cx + cardW - 24, tipY + 23);

  drawBrassDrawerButton(ctx, cx + 14, cy + 252, cardW - 28, 48, 'SPACE', 'SERVE BELL', 'jade');
  registerHitbox(state, 'finish_serve_bell', cx + 14, cy + 252, cardW - 28, 48);

  const [slotW, slotH, gap] = [152, 48, 12];
  const totalW = SAUCES.length * slotW + (SAUCES.length - 1) * gap;
  const [startX, railY] = [Math.round((w - totalW) / 2), h - slotH - 14];
  drawLacquerFrame(ctx, startX - 14, railY - 8, totalW + 28, slotH + 16, '#2B0808', '#D49B35', 10, true);
  SAUCES.forEach((s, idx) => {
    const sx = startX + idx * (slotW + gap);
    drawBrassDrawerButton(ctx, sx, railY, slotW, slotH, String(idx + 1), s.label, fin.selectedSauce === s.id ? 'gold' : 'lacquer', (c, ix, iy) => {
      c.fillStyle = s.accent; c.beginPath(); c.arc(ix, iy, 6.5, 0, Math.PI * 2); c.fill();
    });
    registerHitbox(state, `sauce_${s.id}`, sx, railY, slotW, slotH);
  });
}
