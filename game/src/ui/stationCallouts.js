export const STATION_CALLOUTS_ID = 'stationCallouts';

import { THEME, FONT_UI, drawPlaque } from './hudTheme.js';
import { ROUTE_POINTS } from '../kitchen/layout.js';

function drawWorldPill(ctx, x, y, text, fill, stroke, textColor, fontPx = 11) {
  ctx.save();
  ctx.font = `bold ${fontPx}px ${FONT_UI}`;
  const tw = ctx.measureText(text).width;
  const pw = Math.ceil(tw + 18);
  const ph = 24;
  const rx = Math.round(x - pw / 2);
  const ry = Math.round(y - ph / 2);
  drawPlaque(ctx, rx, ry, pw, ph, fill, stroke, 1.6, 6);
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, ry + 16);
  ctx.restore();
  return { x: rx, y: ry, w: pw, h: ph };
}

function drawWokCalloutPill(ctx, x, y, wr) {
  ctx.save();
  ctx.font = `bold 11px ${FONT_UI}`;
  const tw = ctx.measureText(wr.callout).width;
  const pw = Math.max(146, Math.ceil(tw + 20));
  const ph = 38;
  const rx = Math.round(x - pw / 2);
  const ry = Math.round(y - ph / 2);
  drawPlaque(ctx, rx, ry, pw, ph, THEME.lacquer, THEME.brassBright, 1.7, 7);

  ctx.fillStyle = THEME.brassBright;
  ctx.textAlign = 'center';
  ctx.fillText(wr.callout, x, ry + 16);

  // Compact horizontal sweet-spot meter bar inside the pill
  const barX = rx + 12;
  const barY = ry + 24;
  const barW = pw - 24;
  const barH = 7;
  ctx.fillStyle = '#3B1E18';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(barX + barW * 0.34, barY, barW * 0.32, barH);
  const markerX = barX + Math.max(2, Math.min(barW - 5, wr.sweetPhase * barW - 2));
  ctx.fillStyle = THEME.brassBright;
  ctx.fillRect(markerX, barY - 1, 5, barH + 2);
  ctx.restore();
}

function drawRadialGauge(ctx, x, y, progress, label) {
  ctx.save();
  drawPlaque(ctx, x - 64, y - 22, 148, 44, THEME.ricePaper, THEME.brass, 1.5, 8);
  const cx = x - 40;
  const cy = y;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.strokeStyle = '#E5D5BE';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.strokeStyle = THEME.jade;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = THEME.ink;
  ctx.font = `bold 10px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy + 3.5);

  ctx.textAlign = 'left';
  ctx.font = `bold 11px ${FONT_UI}`;
  ctx.fillText(label, x - 20, cy + 4);
  ctx.restore();
}

export function drawStationCallouts(ctx, state, rendererApi, w, h) {
  if (!rendererApi || state.mode === 'finish') return;

  // In Route mode, suppress battle popups so 2. CHOP and 3. WOK stay 100% clear
  if (state.mode === 'route') {
    const pts = ROUTE_POINTS.map((rp) => ({
      ...rp,
      scr: rendererApi.projectWorldToScreen(rp.x, rp.y, rp.z, w, h),
    }));
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = THEME.brassBright;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    pts.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.scr.x, p.scr.y);
      else ctx.lineTo(p.scr.x, p.scr.y);
    });
    ctx.stroke();
    ctx.restore();
    for (const p of pts) {
      const py = Math.max(132, Math.min(h - 70, p.scr.y - 12));
      drawWorldPill(ctx, p.scr.x, py, `${p.step}. ${p.label}`, THEME.lacquer, THEME.brassBright, THEME.brassBright, 12);
    }
    return;
  }

  // Scorch alert strictly below y = 122
  if (state.stations.wokLeft.scorched) {
    const p = rendererApi.projectWorldToScreen(-3.05, 1.55, -3.15, w, h);
    const sy = Math.max(138, Math.min(h - 140, p.y));
    state.hudBounds.scorchPill = drawWorldPill(
      ctx,
      Math.max(96, p.x - 24),
      sy,
      'SCORCHED! -$20',
      THEME.crimsonSoft,
      THEME.crimson,
      THEME.crimson,
      11,
    );
  }

  // Right wok clean non-intersecting callout + embedded horizontal heat meter
  const wr = state.stations.wokRight;
  const pw = rendererApi.projectWorldToScreen(-1.75, 1.75, -3.15, w, h);
  const wy = Math.max(146, pw.y);
  drawWokCalloutPill(ctx, pw.x + 34, wy, wr);

  // Butcher stump chop flash
  if (state.stations.chop.flashTimer > 0) {
    const cp = rendererApi.projectWorldToScreen(-4.65, 1.55, 0.85, w, h);
    drawWorldPill(
      ctx,
      Math.max(95, cp.x),
      Math.max(144, cp.y),
      state.stations.chop.lastLabel,
      THEME.vipGold,
      THEME.brass,
      THEME.ink,
      11,
    );
  }

  // Center island unified radial progress gauge
  const isl = state.stations.island;
  const ip = rendererApi.projectWorldToScreen(0.45, 1.38, 0.12, w, h);
  drawRadialGauge(ctx, ip.x + 65, Math.max(145, ip.y - 26), isl.progress, isl.label);

  // Active NEXT crates
  const crateLabels = {
    crate_chili: { x: 3.9, y: 1.5, z: -3.15, text: 'CHILI (NEXT)' },
    crate_prawn: { x: 4.75, y: 1.5, z: -0.15, text: 'PRAWN (NEXT)' },
    crate_noodles: { x: 1.2, y: 1.5, z: -3.15, text: 'NOODLES (NEXT)' },
    crate_dumpling: { x: 4.75, y: 1.5, z: -1.6, text: 'DUMPLINGS (NEXT)' },
    crate_duck: { x: 4.75, y: 1.5, z: 1.3, text: 'DUCK (NEXT)' },
  };
  for (const cid of state.nextCrateIds) {
    const info = crateLabels[cid];
    if (!info) continue;
    const pt = rendererApi.projectWorldToScreen(info.x, info.y, info.z, w, h);
    drawWorldPill(ctx, Math.min(w - 80, pt.x), Math.max(138, pt.y), info.text, THEME.vipGold, THEME.brass, THEME.ink, 10);
  }

  // Front service pass callout anchored BELOW plated dishes with short brass stem
  if (state.mode === 'kitchen') {
    const passPt = rendererApi.projectWorldToScreen(0.0, 0.95, 3.35, w, h);
    const pillY = Math.min(h - 72, Math.max(passPt.y + 28, h - 84));
    const pillX = passPt.x;
    ctx.save();
    ctx.strokeStyle = THEME.brassBright;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pillX, pillY - 12);
    ctx.lineTo(pillX, pillY - 26);
    ctx.stroke();
    ctx.restore();
    state.hudBounds.readyPill = drawWorldPill(
      ctx,
      pillX,
      pillY,
      state.stations.pass.activeReadyLabel,
      THEME.jadeSoft,
      THEME.jade,
      THEME.jade,
      11,
    );
  }
}
