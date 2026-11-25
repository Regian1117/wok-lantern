export const DISH_ICONS_ID = 'dishIcons';

import { drawCheckIcon } from './vectorIcons.js';

export function drawDishThumbnail(ctx, base, cx, cy, r = 13) {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = base === 'Noodles' ? '#1D4ED8' : base === 'Duck' ? '#991B1B' : base === 'Prawn' ? '#45120D' : '#C9985A';
  ctx.fill(); ctx.strokeStyle = '#D99B26'; ctx.lineWidth = 1.6; ctx.stroke();

  if (base === 'Noodles') {
    ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.56, 0.2, Math.PI * 1.7); ctx.stroke();
    ctx.fillStyle = '#FB7185'; ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.18, r * 0.2, 0, Math.PI * 2); ctx.fill();
  } else if (base === 'Dumplings') {
    ctx.fillStyle = '#FEF3C7';
    for (const [dx, dy] of [[-0.3, -0.22], [0.3, -0.22], [0, 0.3]]) {
      ctx.beginPath(); ctx.arc(cx + dx * r, cy + dy * r, r * 0.25, 0, Math.PI * 2); ctx.fill();
    }
  } else if (base === 'Duck') {
    ctx.fillStyle = '#FAF3E6'; ctx.beginPath(); ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#B43B16';
    ctx.fillRect(cx - r * 0.45, cy - r * 0.28, r * 0.9, r * 0.22);
    ctx.fillRect(cx - r * 0.45, cy + r * 0.06, r * 0.9, r * 0.22);
  } else {
    ctx.strokeStyle = '#FB7185'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx - r * 0.1, cy, r * 0.44, -0.7, Math.PI * 0.95); ctx.stroke();
    ctx.fillStyle = '#EF4444'; ctx.beginPath(); ctx.arc(cx + r * 0.28, cy + r * 0.16, r * 0.16, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawTicketStepChips(ctx, x, y, w, order, chef, batchPrep) {
  const baseMatch = chef.holding && order.base.toLowerCase().startsWith(String(chef.holding).slice(0, 4));
  const cookedMatch = chef.cookedDish && chef.cookedDish.base === order.base && chef.cookedDish.stationPath === order.stationPath;
  const prepDone = Boolean((baseMatch && chef.prepped) || cookedMatch || (batchPrep && ((batchPrep.chili > 0 && order.base === 'Prawn') || (batchPrep.bokchoy > 0 && order.base === 'Noodles'))));
  const stLabel = order.stationPath === 'Bamboo Steam' ? 'STEAM' : order.stationPath === 'Island Carve' ? 'CARVE' : 'WOK';
  const cw = Math.floor((w - 8) / 3);
  ctx.font = '800 8.5px system-ui, sans-serif';
  [['PREP', prepDone], [stLabel, Boolean(cookedMatch)], ['PASS', false]].forEach(([label, done], idx) => {
    const cx = x + idx * (cw + 4);
    ctx.fillStyle = done ? '#DCFCE7' : '#EFE4D1';
    ctx.strokeStyle = done ? '#15803D' : '#CBB59B';
    ctx.lineWidth = 1;
    ctx.fillRect(cx, y, cw, 15); ctx.strokeRect(cx, y, cw, 15);
    if (done) drawCheckIcon(ctx, cx + 7, y + 7.5, 7, '#15803D');
    ctx.fillStyle = done ? '#15803D' : '#4A362C';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx + cw / 2 + (done ? 4 : 0), y + 10.5);
  });
}
