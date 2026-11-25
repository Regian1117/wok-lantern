export const STATION_CALLOUTS_ID = 'stationCallouts';

import { THEME, FONT_UI, drawLacquerFrame } from './hudTheme.js';
import { ROUTE_POINTS } from '../kitchen/layout.js';
import { computeLiveNextStep, getStationActionPrompt } from '../kitchen/routeGuide.js';
import { getBatchSummaryLabel } from '../recipes/batchPrep.js';

function drawBrassPointer(ctx, x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = THEME.brassBright;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = THEME.brassBright;
  ctx.beginPath();
  ctx.arc(x2, y2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWorldPill(ctx, x, y, text, fill, stroke, textColor, fontPx = 11, maxRight = null) {
  ctx.save();
  ctx.font = `800 ${fontPx}px ${FONT_UI}`;
  const pw = Math.ceil(ctx.measureText(text).width + 18);
  const ph = 24;
  let rx = Math.round(x - pw / 2);
  if (maxRight !== null && rx + pw > maxRight) rx = Math.round(maxRight - pw);
  rx = Math.max(8, rx);
  const ry = Math.round(y - ph / 2);
  drawLacquerFrame(ctx, rx, ry, pw, ph, fill, stroke, 6, false);
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(text, rx + pw / 2, ry + 16);
  ctx.restore();
  return { x: rx, y: ry, w: pw, h: ph };
}

function drawMeterPill(ctx, x, y, label, phase, fill, stroke, textColor, winStart, winWidth) {
  ctx.save();
  ctx.font = `800 11px ${FONT_UI}`;
  const pw = Math.max(134, Math.ceil(ctx.measureText(label).width + 22));
  const ph = 38;
  const rx = Math.round(x - pw / 2);
  const ry = Math.round(y - ph / 2);
  drawLacquerFrame(ctx, rx, ry, pw, ph, fill, stroke, 7, false);
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(label, x, ry + 15);
  const barX = rx + 12;
  const barY = ry + 24;
  const barW = pw - 24;
  ctx.fillStyle = '#3B1E18';
  ctx.fillRect(barX, barY, barW, 7);
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(barX + barW * winStart, barY, barW * winWidth, 7);
  const nx = barX + Math.max(2, Math.min(barW - 5, phase * barW - 2));
  ctx.fillStyle = THEME.brassBright;
  ctx.fillRect(nx, barY - 1, 5, 9);
  ctx.restore();
}

function drawRadialGauge(ctx, x, y, progress, label) {
  ctx.save();
  drawLacquerFrame(ctx, x - 64, y - 22, 162, 44, '#3A0A0A', '#F2C14E', 8, true);
  const cx = x - 40;
  ctx.beginPath();
  ctx.arc(cx, y, 14, 0, Math.PI * 2);
  ctx.strokeStyle = '#5C1111';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, y, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.strokeStyle = '#4ADE80';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = THEME.ricePaper;
  ctx.font = `900 10px ${FONT_UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(progress * 100)}%`, cx, y + 3.5);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#F7D070';
  ctx.font = `800 11px ${FONT_UI}`;
  ctx.fillText(label, x - 20, y + 4);
  ctx.restore();
}

function drawNextGuidanceBar(ctx, state, w, h) {
  if (state.mode !== 'kitchen') return;
  const guide = computeLiveNextStep(state);
  const batchText = getBatchSummaryLabel(state);
  const barH = 26;
  const barY = h - 84;
  ctx.save();
  ctx.font = `800 11px ${FONT_UI}`;
  const mainW = Math.ceil(ctx.measureText(guide.bannerText).width + 24);
  const batchW = batchText ? Math.ceil(ctx.measureText(batchText).width + 20) : 0;
  const totalW = mainW + (batchW ? batchW + 8 : 0);
  const sx = Math.round((w - totalW) / 2);

  drawLacquerFrame(ctx, sx, barY, mainW, barH, '#3A0A0A', '#D49B35', 6, false);
  ctx.fillStyle = '#F7D070';
  ctx.textAlign = 'center';
  ctx.fillText(guide.bannerText, sx + mainW / 2, barY + 17);

  if (batchW > 0) {
    const bx = sx + mainW + 8;
    drawLacquerFrame(ctx, bx, barY, batchW, barH, THEME.jadeSoft, THEME.jade, 6, false);
    ctx.fillStyle = '#14532D';
    ctx.fillText(batchText, bx + batchW / 2, barY + 17);
  }
  state.hudBounds.nextBar = { x: sx, y: barY, w: totalW, h: barH };
  ctx.restore();
}

export function drawStationCallouts(ctx, state, rendererApi, w, h) {
  if (!rendererApi || state.mode === 'finish') return;

  if (state.mode === 'route') {
    const modalW = Math.min(480, Math.round(w * 0.465));
    const maxRight = w - modalW - 26;
    const pts = ROUTE_POINTS.map((rp) => ({ ...rp, scr: rendererApi.projectWorldToScreen(rp.x, rp.y, rp.z, w, h) }));
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = THEME.brassBright;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(Math.min(maxRight - 30, p.scr.x), p.scr.y) : ctx.lineTo(Math.min(maxRight - 30, p.scr.x), p.scr.y)));
    ctx.stroke();
    ctx.restore();
    state.hudBounds.routePills = pts.map((p) =>
      drawWorldPill(ctx, p.scr.x, Math.max(132, Math.min(h - 70, p.scr.y - 14)), `${p.step}. ${p.label}`, '#3A0A0A', '#F7D070', '#F7D070', 12, maxRight),
    );
    return;
  }

  if (state.stations.wokLeft.scorched) {
    const rim = rendererApi.projectWorldToScreen(-3.05, 1.25, -3.15, w, h);
    const py = Math.max(134, rim.y - 58);
    const px = Math.max(82, rim.x - 48);
    drawBrassPointer(ctx, px, py + 12, rim.x, rim.y);
    state.hudBounds.scorchPill = drawWorldPill(ctx, px, py, 'SCORCHED! -$20', '#5C1111', '#FDE047', '#FEE2E2', 11);
  }

  if (state.shotMode || state.stations.wokRight.active) {
    const wr = state.stations.wokRight;
    const wRim = rendererApi.projectWorldToScreen(-1.75, 1.35, -3.15, w, h);
    const wy = Math.max(146, wRim.y - 52);
    const wx = wRim.x + 30;
    drawBrassPointer(ctx, wx, wy + 19, wRim.x, wRim.y);
    drawMeterPill(ctx, wx, wy, wr.callout, wr.sweetPhase, '#3A0A0A', '#F7D070', '#F7D070', 0.34, 0.32);
  }

  if (state.shotMode || state.stations.chop.flashTimer > 0 || (state.chef.holding && !state.chef.prepped)) {
    const cRim = rendererApi.projectWorldToScreen(-4.65, 1.15, 0.85, w, h);
    const cy = Math.max(146, cRim.y - 44);
    const cx = Math.max(88, cRim.x + 6);
    drawBrassPointer(ctx, cx, cy + 19, cRim.x, cRim.y);
    drawMeterPill(ctx, cx, cy, state.stations.chop.lastLabel, state.chopMeter ?? 0.52, THEME.vipGold, '#D49B35', THEME.ink, 0.36, 0.28);
  }

  if (!state.shotMode && state.chef.nearestStation) {
    const prompt = getStationActionPrompt(state, state.chef.nearestStation);
    if (prompt) {
      const sp = rendererApi.projectWorldToScreen(state.chef.nearestStation.x, 1.45, state.chef.nearestStation.z, w, h);
      drawWorldPill(ctx, Math.max(95, Math.min(w - 95, sp.x)), Math.max(134, Math.min(h - 118, sp.y - 24)), prompt, '#FEF3C7', '#D97706', THEME.ink, 11);
    }
  }

  if (state.feedbackBanner && state.feedbackBanner.timer > 0) {
    const fb = state.feedbackBanner;
    const fill = fb.tone === 'crimson' ? '#7F1D1D' : fb.tone === 'amber' ? '#FEF3C7' : THEME.jadeSoft;
    const stroke = fb.tone === 'crimson' ? '#FDE047' : fb.tone === 'amber' ? '#D97706' : THEME.jade;
    const txt = fb.tone === 'crimson' ? '#FFFFFF' : fb.tone === 'amber' ? THEME.ink : '#14532D';
    drawWorldPill(ctx, w * 0.5, 114, fb.text, fill, stroke, txt, 12);
  }

  if (state.shotMode || state.stations.island.step > 0) {
    const isl = state.stations.island;
    const ip = rendererApi.projectWorldToScreen(0.38, 1.15, 0.12, w, h);
    const gx = ip.x + 62;
    const gy = Math.max(146, ip.y - 46);
    drawBrassPointer(ctx, gx - 24, gy + 22, ip.x, ip.y);
    drawRadialGauge(ctx, gx, gy, isl.progress, isl.label);
  }

  const crateCoords = {
    crate_chili: { x: 3.9, y: 1.35, z: -3.15, name: 'CHILI' },
    crate_prawn: { x: 4.75, y: 1.35, z: -0.15, name: 'PRAWN' },
    crate_noodles: { x: 1.2, y: 1.35, z: -3.15, name: 'NOODLES' },
    crate_dumpling: { x: 4.75, y: 1.35, z: -1.6, name: 'DUMPLINGS' },
    crate_duck: { x: 4.75, y: 1.35, z: 1.3, name: 'DUCK' },
  };
  const nextId = (state.nextCrateIds || [])[0];
  if (nextId && crateCoords[nextId]) {
    const info = crateCoords[nextId];
    const pt = rendererApi.projectWorldToScreen(info.x, info.y, info.z, w, h);
    const cy = Math.max(136, pt.y - 30);
    const cx = Math.min(w - 78, pt.x);
    drawBrassPointer(ctx, cx, cy + 12, pt.x, pt.y);
    drawWorldPill(ctx, cx, cy, `${info.name} (NEXT)`, '#FEF3C7', '#D97706', THEME.ink, 10);
  }
  if (state.batchCrateId && crateCoords[state.batchCrateId] && state.batchCrateId !== nextId) {
    const bInfo = crateCoords[state.batchCrateId];
    const bpt = rendererApi.projectWorldToScreen(bInfo.x, bInfo.y, bInfo.z, w, h);
    const bcy = Math.max(136, bpt.y - 30);
    const bcx = Math.min(w - 84, bpt.x);
    drawBrassPointer(ctx, bcx, bcy + 12, bpt.x, bpt.y);
    drawWorldPill(ctx, bcx, bcy, `${bInfo.name} (BATCH +$10)`, THEME.jadeSoft, THEME.jade, '#14532D', 10);
  }

  if (state.mode === 'kitchen' && (state.shotMode || state.chef.cookedDish)) {
    const passPt = rendererApi.projectWorldToScreen(0.0, 0.95, 3.35, w, h);
    const pillY = Math.min(h - 110, Math.max(passPt.y + 18, h - 118));
    drawBrassPointer(ctx, passPt.x, pillY - 12, passPt.x, pillY - 24);
    state.hudBounds.readyPill = drawWorldPill(ctx, passPt.x, pillY, state.stations.pass.activeReadyLabel, THEME.jadeSoft, THEME.jade, '#14532D', 11);
  }

  drawNextGuidanceBar(ctx, state, w, h);
}
