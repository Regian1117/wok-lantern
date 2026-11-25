export const VECTOR_ICONS_ID = 'vectorIcons';

export function drawCheckIcon(ctx, cx, cy, sz, color = '#15803D') {
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, sz * 0.22);
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.42, cy + sz * 0.04);
  ctx.lineTo(cx - sz * 0.1, cy + sz * 0.36);
  ctx.lineTo(cx + sz * 0.45, cy - sz * 0.34);
  ctx.stroke();
}

export function drawPlayTriangleIcon(ctx, cx, cy, sz, color = '#D99B26') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.32, cy - sz * 0.4);
  ctx.lineTo(cx + sz * 0.44, cy);
  ctx.lineTo(cx - sz * 0.32, cy + sz * 0.4);
  ctx.closePath(); ctx.fill();
}

export function drawHollowCircleIcon(ctx, cx, cy, sz, color = '#6E4A36') {
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(1.5, sz * 0.16);
  ctx.beginPath(); ctx.arc(cx, cy, sz * 0.36, 0, Math.PI * 2); ctx.stroke();
}

export function drawStarIcon(ctx, cx, cy, r, fill = '#D99B26', stroke = '#1E100B') {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.46;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

export function drawClockIcon(ctx, cx, cy, r, color = '#F7D070') {
  ctx.strokeStyle = color; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.58); ctx.lineTo(cx, cy); ctx.lineTo(cx + r * 0.45, cy + r * 0.15);
  ctx.stroke();
}

export function drawSpeakerIcon(ctx, cx, cy, sz, muted = false, color = '#F7D070') {
  ctx.fillStyle = ctx.strokeStyle = color; ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (const [i, x, y] of [[0, -0.45, -0.22], [1, -0.18, -0.22], [1, 0.12, -0.45], [1, 0.12, 0.45], [1, -0.18, 0.22], [1, -0.45, 0.22]]) {
    ctx[i ? 'lineTo' : 'moveTo'](cx + sz * x, cy + sz * y);
  }
  ctx.closePath(); ctx.fill();
  if (!muted) {
    for (const f of [0.34, 0.56]) { ctx.beginPath(); ctx.arc(cx + sz * 0.14, cy, sz * f, -0.7, 0.7); ctx.stroke(); }
  } else {
    ctx.strokeStyle = '#EF4444'; ctx.beginPath();
    ctx.moveTo(cx + sz * 0.22, cy - sz * 0.28); ctx.lineTo(cx + sz * 0.58, cy + sz * 0.28);
    ctx.moveTo(cx + sz * 0.58, cy - sz * 0.28); ctx.lineTo(cx + sz * 0.22, cy + sz * 0.28);
    ctx.stroke();
  }
}

export function drawArrowIcon(ctx, cx, cy, sz, color = '#1E100B') {
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - sz * 0.4, cy); ctx.lineTo(cx + sz * 0.38, cy);
  ctx.moveTo(cx + sz * 0.1, cy - sz * 0.32); ctx.lineTo(cx + sz * 0.4, cy); ctx.lineTo(cx + sz * 0.1, cy + sz * 0.32);
  ctx.stroke();
}

export function drawFlameIcon(ctx, cx, cy, r, color = '#15803D') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + r * 0.85, cy - r * 0.1, cx + r * 0.55, cy + r * 0.65);
  ctx.quadraticCurveTo(cx, cy + r, cx - r * 0.55, cy + r * 0.65);
  ctx.quadraticCurveTo(cx - r * 0.85, cy - r * 0.1, cx, cy - r);
  ctx.fill();
}
