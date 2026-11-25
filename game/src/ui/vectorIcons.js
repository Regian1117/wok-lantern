export const VECTOR_ICONS_ID = 'vectorIcons';

export function drawCheckIcon(ctx, cx, cy, size, color = '#15803D') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.22);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.42, cy + size * 0.04);
  ctx.lineTo(cx - size * 0.1, cy + size * 0.36);
  ctx.lineTo(cx + size * 0.45, cy - size * 0.34);
  ctx.stroke();
  ctx.restore();
}

export function drawPlayTriangleIcon(ctx, cx, cy, size, color = '#D99B26') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.32, cy - size * 0.4);
  ctx.lineTo(cx + size * 0.44, cy);
  ctx.lineTo(cx - size * 0.32, cy + size * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawHollowCircleIcon(ctx, cx, cy, size, color = '#6E4A36') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.16);
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawStarIcon(ctx, cx, cy, r, fill = '#D99B26', stroke = '#1E100B') {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.46;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawClockIcon(ctx, cx, cy, r, color = '#F7D070') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.58);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.45, cy + r * 0.15);
  ctx.stroke();
  ctx.restore();
}

export function drawSpeakerIcon(ctx, cx, cy, size, muted = false, color = '#F7D070') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.45, cy - size * 0.22);
  ctx.lineTo(cx - size * 0.18, cy - size * 0.22);
  ctx.lineTo(cx + size * 0.12, cy - size * 0.45);
  ctx.lineTo(cx + size * 0.12, cy + size * 0.45);
  ctx.lineTo(cx - size * 0.18, cy + size * 0.22);
  ctx.lineTo(cx - size * 0.45, cy + size * 0.22);
  ctx.closePath();
  ctx.fill();
  if (!muted) {
    ctx.beginPath();
    ctx.arc(cx + size * 0.14, cy, size * 0.34, -0.7, 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + size * 0.14, cy, size * 0.56, -0.7, 0.7);
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(cx + size * 0.22, cy - size * 0.28);
    ctx.lineTo(cx + size * 0.58, cy + size * 0.28);
    ctx.moveTo(cx + size * 0.58, cy - size * 0.28);
    ctx.lineTo(cx + size * 0.22, cy + size * 0.28);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawArrowIcon(ctx, cx, cy, size, color = '#1E100B') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.4, cy);
  ctx.lineTo(cx + size * 0.38, cy);
  ctx.moveTo(cx + size * 0.1, cy - size * 0.32);
  ctx.lineTo(cx + size * 0.4, cy);
  ctx.lineTo(cx + size * 0.1, cy + size * 0.32);
  ctx.stroke();
  ctx.restore();
}

export function drawFlameIcon(ctx, cx, cy, r, color = '#15803D') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + r * 0.85, cy - r * 0.1, cx + r * 0.55, cy + r * 0.65);
  ctx.quadraticCurveTo(cx, cy + r, cx - r * 0.55, cy + r * 0.65);
  ctx.quadraticCurveTo(cx - r * 0.85, cy - r * 0.1, cx, cy - r);
  ctx.fill();
  ctx.restore();
}
