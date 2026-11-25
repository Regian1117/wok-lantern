export const CONTROL_DOCK_ID = 'controlDock';

import { FONT_UI, drawPlaque, drawBrassPullBar, drawBrassDrawerButton, registerHitbox } from './hudTheme.js';
import { drawSpeakerIcon, drawCheckIcon } from './vectorIcons.js';

function getHoldDescriptor(chef) {
  if (chef.cookedDish) return { text: `PLATED: ${chef.cookedDish.base.toUpperCase()}`, variant: 'jade', checked: true };
  if (chef.holding && chef.prepped) return { text: `CHOPPED: ${String(chef.holding).toUpperCase()}`, variant: 'gold', checked: true };
  if (chef.holding) return { text: `RAW: ${String(chef.holding).toUpperCase()}`, variant: 'gold', checked: false };
  return { text: 'EMPTY HANDS', variant: 'lacquer', checked: false };
}

function drawGroupedModesChip(ctx, state, x, y, w, h) {
  drawPlaque(ctx, x, y, w, h, '#4A0E0E', '#D49B35', 1.6, 6);
  drawBrassPullBar(ctx, x + w / 2, y, 36);
  const subs = [
    { id: 'dock_route', key: 'R', lbl: 'ROUTE' },
    { id: 'dock_pov', key: 'V', lbl: state.povMode === 'overhead' ? 'TOP' : '3/4' },
    { id: 'dock_finish', key: 'F', lbl: 'FINISH' },
  ];
  const sw = Math.floor((w - 16) / 3);
  ctx.save();
  ctx.font = `800 9px ${FONT_UI}`;
  subs.forEach((s, idx) => {
    const sx = x + 5 + idx * (sw + 3);
    drawPlaque(ctx, sx, y + 4, sw, h - 8, '#240707', '#D49B35', 1, 4);
    ctx.fillStyle = '#FCD34D';
    ctx.textAlign = 'center';
    ctx.fillText(`[${s.key}] ${s.lbl}`, sx + sw / 2, y + h / 2 + 3.2, sw - 4);
    registerHitbox(state, s.id, sx, y, sw, h);
  });
  ctx.restore();
}

export function drawControlDock(ctx, state, w, h) {
  if (state.mode === 'finish') return;

  const compact = w < 1120;
  const railH = 36;
  const dockY = h - 40;
  const bh = 26;
  const y = dockY + 5;
  const gap = compact ? 8 : 10;
  const hold = getHoldDescriptor(state.chef);

  drawPlaque(ctx, 8, dockY, w - 16, railH, '#2B0808', '#D49B35', 1.5, 8);

  const slots = [
    { kind: 'btn', id: 'dock_move', key: 'WASD/CLICK', label: 'MOVE', variant: 'lacquer', w: compact ? 156 : 172, hit: false },
    { kind: 'btn', id: 'dock_wok', key: 'E/SPACE', label: 'ACT · SERVE', variant: 'action', w: compact ? 168 : 184, hit: true },
    { kind: 'modes', w: compact ? 236 : 262 },
    { kind: 'sfx', id: 'dock_sfx', key: 'M', label: state.audioMuted ? 'SFX OFF' : 'SFX ON', variant: 'jade', w: compact ? 116 : 126, hit: true },
    { kind: 'hold', id: 'dock_hold', key: 'HOLD', label: hold.text, variant: hold.variant, w: compact ? 222 : 244, checked: hold.checked },
  ];

  const totalW = slots.reduce((s, p) => s + p.w, 0) + gap * (slots.length - 1);
  let curX = Math.round((w - totalW) / 2);
  const bounds = [];

  for (const sl of slots) {
    if (sl.kind === 'modes') {
      drawGroupedModesChip(ctx, state, curX, y, sl.w, bh);
    } else if (sl.kind === 'sfx') {
      drawBrassDrawerButton(ctx, curX, y, sl.w, bh, sl.key, sl.label, sl.variant, (c, ix, iy) =>
        drawSpeakerIcon(c, ix, iy, 11, state.audioMuted, state.audioMuted ? '#B91C1C' : '#14532D'),
      );
      registerHitbox(state, sl.id, curX, y, sl.w, bh);
    } else if (sl.kind === 'hold') {
      const iconFn = sl.checked ? (c, ix, iy) => drawCheckIcon(c, ix, iy, 9.5, '#15803D') : null;
      drawBrassDrawerButton(ctx, curX, y, sl.w, bh, sl.key, sl.label, sl.variant, iconFn);
    } else {
      drawBrassDrawerButton(ctx, curX, y, sl.w, bh, sl.key, sl.label, sl.variant);
      if (sl.hit) registerHitbox(state, sl.id, curX, y, sl.w, bh);
    }
    bounds.push({ id: sl.id || 'dock_modes', x: curX, y, w: sl.w, h: bh });
    curX += sl.w + gap;
  }

  state.hudBounds.dockPills = bounds;
}
