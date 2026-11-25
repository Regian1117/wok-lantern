export const CONTROL_DOCK_ID = 'controlDock';

import { THEME, FONT_UI, drawPlaque, registerHitbox } from './hudTheme.js';
import { drawSpeakerIcon } from './vectorIcons.js';

export function drawControlDock(ctx, state, w, h) {
  if (state.mode === 'finish') return;

  const compact = w < 1120;
  const dockH = 38;
  const y = h - dockH - 8;
  const gap = compact ? 8 : 10;
  const px = compact ? 8 : 10;

  const pills = [
    { id: 'dock_move', key: 'WASD/CLICK', label: 'MOVE', hit: false },
    { id: 'dock_wok', key: 'E', label: 'WOK', hit: true },
    { id: 'dock_serve', key: 'SPACE', label: 'SERVE', hit: true },
    { id: 'dock_route', key: '1-3', label: 'ROUTE', hit: true },
    { id: 'dock_pov', key: 'V', label: state.povMode === 'overhead' ? 'POV TOP' : 'POV 3/4', hit: true },
    { id: 'dock_finish', key: 'F', label: 'FINISH', hit: true },
    { id: 'dock_sfx', key: 'M', label: state.audioMuted ? 'SFX OFF' : 'SFX ON', hit: true, sfx: true },
    { id: 'dock_hold', key: 'HOLD', label: String(state.chef.holding || 'DUMPLINGS').toUpperCase(), hit: false, hold: true },
  ];

  ctx.save();
  const fontSize = compact ? 10 : 11;
  ctx.font = `800 ${fontSize}px ${FONT_UI}`;

  const measured = pills.map((p) => {
    const keyW = ctx.measureText(p.key).width + (compact ? 11 : 13);
    const sfxExtra = p.sfx ? 26 : 4;
    const lblW = ctx.measureText(p.label).width + sfxExtra;
    const pw = Math.ceil(px * 2 + keyW + lblW + 7);
    return { ...p, keyW, pw };
  });

  const totalW = measured.reduce((acc, p) => acc + p.pw, 0) + gap * (measured.length - 1);
  let curX = Math.round((w - totalW) / 2);
  const bounds = [];

  for (const p of measured) {
    const fill = p.hold ? THEME.vipGold : p.sfx && !state.audioMuted ? THEME.jadeSoft : THEME.lacquer;
    const stroke = p.hold ? THEME.brass : p.sfx && !state.audioMuted ? THEME.jade : THEME.brass;
    drawPlaque(ctx, curX, y, p.pw, dockH, fill, stroke, 1.5, 7);

    drawPlaque(ctx, curX + px, y + 7, p.keyW, 24, THEME.ricePaperWarm, THEME.brass, 1, 4);
    ctx.fillStyle = THEME.ink;
    ctx.textAlign = 'center';
    ctx.fillText(p.key, curX + px + p.keyW / 2, y + 23);

    const textX = curX + px + p.keyW + 8;
    if (p.sfx) {
      const iconCx = textX + 8;
      drawSpeakerIcon(ctx, iconCx, y + 19, 13, state.audioMuted, state.audioMuted ? THEME.crimson : THEME.jade);
      ctx.fillStyle = state.audioMuted ? THEME.crimson : THEME.jade;
      ctx.textAlign = 'left';
      ctx.fillText(p.label, iconCx + 14, y + 23);
    } else {
      ctx.fillStyle = p.hold ? THEME.ink : THEME.ricePaper;
      ctx.textAlign = 'left';
      ctx.fillText(p.label, textX, y + 23);
    }

    if (p.hit) registerHitbox(state, p.id, curX, y, p.pw, dockH);
    bounds.push({ id: p.id, x: curX, y, w: p.pw, h: dockH });
    curX += p.pw + gap;
  }

  state.hudBounds.dockPills = bounds;
  ctx.restore();
}
