export const STATION_CALLOUTS_ID = 'stationCallouts';

import { THEME, FONT_UI, drawLacquerFrame } from './hudTheme.js';
import { ROUTE_POINTS } from '../kitchen/layout.js';
import { computeLiveNextStep, getStationActionPrompt } from '../kitchen/routeGuide.js';
import { getBatchSummaryLabel } from '../recipes/batchPrep.js';

function drawPtr(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = ctx.fillStyle = THEME.brassBright;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x2, y2, 3, 0, Math.PI * 2); ctx.fill();
}

function drawPill(ctx, x, y, text, fill, stroke, tc, fp = 11, maxR = null) {
  ctx.font = `800 ${fp}px ${FONT_UI}`;
  const pw = Math.ceil(ctx.measureText(text).width + 18);
  let rx = Math.round(x - pw / 2);
  if (maxR !== null && rx + pw > maxR) rx = Math.round(maxR - pw);
  rx = Math.max(8, rx);
  const ry = Math.round(y - 12);
  drawLacquerFrame(ctx, rx, ry, pw, 24, fill, stroke, 6, false);
  ctx.fillStyle = tc; ctx.textAlign = 'center';
  ctx.fillText(text, rx + pw / 2, ry + 16);
  return { x: rx, y: ry, w: pw, h: 24 };
}

function drawMeter(ctx, x, y, label, phase, fill, stroke, tc, ws, ww, danger = false) {
  ctx.font = `${danger ? 900 : 800} 11px ${FONT_UI}`;
  const pw = Math.max(132, Math.ceil(ctx.measureText(label).width + 22));
  const [rx, ry, bx, by, bw] = [Math.round(x - pw / 2), Math.round(y - 19), Math.round(x - pw / 2) + 11, Math.round(y - 19) + 24, pw - 22];
  drawLacquerFrame(ctx, rx, ry, pw, 38, fill, stroke, 7, false);
  ctx.fillStyle = tc; ctx.textAlign = 'center';
  ctx.fillText(label, x, ry + 15);
  if (danger) {
    ctx.fillStyle = '#DC2626'; ctx.fillRect(bx, by, bw, 7);
    ctx.fillStyle = '#F59E0B'; ctx.fillRect(bx + Math.round(bw * 0.62 * phase), by, Math.round(bw * 0.38), 7);
  } else {
    ctx.fillStyle = '#3B1E18'; ctx.fillRect(bx, by, bw, 7);
    ctx.fillStyle = '#22C55E'; ctx.fillRect(bx + bw * ws, by, bw * ww, 7);
    ctx.fillStyle = THEME.brassBright; ctx.fillRect(bx + Math.max(2, Math.min(bw - 5, phase * bw - 2)), by - 1, 5, 9);
  }
  return { x: rx, y: ry, w: pw, h: 38 };
}

function drawFloorRoute(ctx, guide, api, w, h) {
  const pts = (guide.routeStops || []).map((st) => api.projectWorldToScreen(st.x, st.y, st.z, w, h));
  if (pts.length < 2) return pts;
  ctx.save(); ctx.lineCap = ctx.lineJoin = 'round'; ctx.setLineDash([9, 6]);
  for (const [stroke, lw, blur] of [['rgba(29,13,10,0.55)', 5.2, 0], ['#F7D070', 2.8, 6]]) {
    ctx.strokeStyle = stroke; ctx.lineWidth = lw;
    ctx.shadowColor = blur ? 'rgba(247,208,112,0.55)' : 'transparent'; ctx.shadowBlur = blur;
    ctx.beginPath(); pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p.x, p.y)); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.shadowBlur = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [dx, dy] = [pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y];
    if (Math.hypot(dx, dy) < 28) continue;
    ctx.save();
    ctx.translate((pts[i].x + pts[i + 1].x) * 0.5, (pts[i].y + pts[i + 1].y) * 0.5);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -4.5); ctx.lineTo(-2, 0); ctx.lineTo(-4, 4.5); ctx.closePath();
    ctx.fillStyle = '#F7D070'; ctx.fill(); ctx.strokeStyle = '#1D0D0A'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  return pts;
}

function drawCrateTag(ctx, x, y, text, w, h, occ) {
  ctx.font = `800 8.5px ${FONT_UI}`;
  const pw = Math.ceil(ctx.measureText(text).width + 14);
  const rx = Math.max(8, Math.min(w - pw - 8, Math.round(x - pw / 2)));
  let ry = Math.max(96, Math.min(h - 86, Math.round(y - 8)));
  for (const r of occ) if (rx < r.x + r.w + 4 && rx + pw + 4 > r.x && ry < r.y + r.h + 3 && ry + 19 > r.y) ry = Math.max(96, Math.min(h - 86, r.y + r.h + 4));
  drawLacquerFrame(ctx, rx, ry, pw, 16, '#2E0909', '#D49B35', 4, false);
  ctx.fillStyle = '#FAF3E6'; ctx.textAlign = 'center'; ctx.fillText(text, rx + pw / 2, ry + 11.2);
  const rect = { x: rx, y: ry, w: pw, h: 16 };
  occ.push(rect);
  return rect;
}

function drawRadialGauge(ctx, x, y, progress, label) {
  drawLacquerFrame(ctx, x - 64, y - 22, 162, 44, '#3A0A0A', '#F2C14E', 8, true);
  const cx = x - 40;
  for (const [end, col] of [[Math.PI * 2, '#5C1111'], [-Math.PI / 2 + Math.PI * 2 * progress, '#4ADE80']]) {
    ctx.beginPath(); ctx.arc(cx, y, 14, col === '#5C1111' ? 0 : -Math.PI / 2, end);
    ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke();
  }
  ctx.fillStyle = THEME.ricePaper; ctx.font = `900 10px ${FONT_UI}`; ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(progress * 100)}%`, cx, y + 3.5);
  ctx.textAlign = 'left'; ctx.fillStyle = '#F7D070'; ctx.font = `800 11px ${FONT_UI}`;
  ctx.fillText(label, x - 20, y + 4);
}

function drawNextBar(ctx, guide, state, w, h) {
  const bt = getBatchSummaryLabel(state);
  const barY = h - 68;
  ctx.font = `800 10.5px ${FONT_UI}`;
  const mw = Math.ceil(ctx.measureText(guide.bannerText).width + 22);
  const bw = bt ? Math.ceil(ctx.measureText(bt).width + 18) : 0;
  const totalW = mw + (bw ? bw + 8 : 0);
  const sx = Math.round((w - totalW) / 2);
  drawLacquerFrame(ctx, sx, barY, mw, 22, '#3A0A0A', '#D49B35', 6, false);
  ctx.fillStyle = '#F7D070'; ctx.textAlign = 'center'; ctx.fillText(guide.bannerText, sx + mw / 2, barY + 14.8);
  if (bw > 0) {
    drawLacquerFrame(ctx, sx + mw + 8, barY, bw, 22, THEME.jadeSoft, THEME.jade, 6, false);
    ctx.fillStyle = '#14532D'; ctx.fillText(bt, sx + mw + 8 + bw / 2, barY + 14.8);
  }
  state.hudBounds.nextBar = { x: sx, y: barY, w: totalW, h: 22 };
}

export function drawStationCallouts(ctx, state, api, w, h) {
  if (!api || state.mode === 'finish') return;

  if (state.mode === 'route') {
    const maxR = w - Math.min(480, Math.round(w * 0.465)) - 26;
    const pts = ROUTE_POINTS.map((rp) => ({ ...rp, scr: api.projectWorldToScreen(rp.x, rp.y, rp.z, w, h) }));
    ctx.save(); ctx.setLineDash([8, 6]); ctx.strokeStyle = THEME.brassBright; ctx.lineWidth = 3.2; ctx.beginPath();
    pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](Math.min(maxR - 30, p.scr.x), p.scr.y)); ctx.stroke(); ctx.restore();
    state.hudBounds.routePills = pts.map((p) => drawPill(ctx, p.scr.x, Math.max(122, Math.min(h - 60, p.scr.y - 14)), `${p.step}. ${p.label}`, '#3A0A0A', '#F7D070', '#F7D070', 12, maxR));
    return;
  }

  const guide = computeLiveNextStep(state);
  if (state.mode === 'kitchen') state.hudBounds.floorRoutePoints = drawFloorRoute(ctx, guide, api, w, h);

  if (state.stations.wokLeft.scorched) {
    const rim = api.projectWorldToScreen(-3.05, 1.25, -3.15, w, h);
    const [px, py] = [Math.max(88, rim.x - 50), Math.max(118, rim.y - 58)];
    drawPtr(ctx, px, py + 19, rim.x, rim.y);
    state.hudBounds.scorchPill = drawMeter(ctx, px, py, 'SCORCHED! -$20', 0.5 + 0.5 * Math.sin(state.time * 8), '#5C1111', '#FDE047', '#FEE2E2', 0, 1, true);
  }
  if (state.shotMode || state.stations.wokRight.active) {
    const wr = state.stations.wokRight;
    const rim = api.projectWorldToScreen(-1.75, 1.35, -3.15, w, h);
    const [wx, wy] = [rim.x + 30, Math.max(132, rim.y - 52)];
    drawPtr(ctx, wx, wy + 19, rim.x, rim.y);
    drawMeter(ctx, wx, wy, wr.callout, wr.sweetPhase, '#3A0A0A', '#F7D070', '#F7D070', 0.34, 0.32);
  }
  if (state.shotMode || state.stations.chop.flashTimer > 0 || (state.chef.holding && !state.chef.prepped)) {
    const rim = api.projectWorldToScreen(-4.65, 1.15, 0.85, w, h);
    const [cx, cy] = [Math.max(88, rim.x + 6), Math.max(132, rim.y - 44)];
    drawPtr(ctx, cx, cy + 19, rim.x, rim.y);
    drawMeter(ctx, cx, cy, state.stations.chop.lastLabel, state.chopMeter ?? 0.52, THEME.vipGold, '#D49B35', THEME.ink, 0.36, 0.28);
  }
  if (!state.shotMode && state.chef.nearestStation) {
    const prompt = getStationActionPrompt(state, state.chef.nearestStation);
    if (prompt) {
      const sp = api.projectWorldToScreen(state.chef.nearestStation.x, 1.45, state.chef.nearestStation.z, w, h);
      drawPill(ctx, Math.max(95, Math.min(w - 95, sp.x)), Math.max(120, Math.min(h - 102, sp.y - 24)), prompt, '#FEF3C7', '#D97706', THEME.ink);
    }
  }
  if (state.feedbackBanner && state.feedbackBanner.timer > 0) {
    const fb = state.feedbackBanner;
    const tones = { crimson: ['#7F1D1D', '#FDE047', '#FFF'], amber: ['#FEF3C7', '#D97706', THEME.ink], jade: [THEME.jadeSoft, THEME.jade, '#14532D'] };
    drawPill(ctx, w * 0.5, 102, fb.text, ...(tones[fb.tone] || tones.jade), 12);
  }
  if (state.shotMode || state.stations.island.step > 0) {
    const isl = state.stations.island;
    const ip = api.projectWorldToScreen(0.38, 1.15, 0.12, w, h);
    const [gx, gy] = [ip.x + 62, Math.max(132, ip.y - 46)];
    drawPtr(ctx, gx - 24, gy + 22, ip.x, ip.y);
    drawRadialGauge(ctx, gx, gy, isl.progress, isl.label);
  }

  const crates = [
    ['crate_noodles', 'NOODLES', 1.2, 1.0, -2.75], ['crate_bokchoy', 'GREENS', 2.55, 1.0, -2.75],
    ['crate_chili', 'CHILI', 3.9, 1.35, -3.15], ['crate_dumpling', 'DUMPLINGS', 4.35, 1.0, -1.6],
    ['crate_prawn', 'PRAWN', 4.75, 1.35, -0.15], ['crate_duck', 'DUCK', 4.35, 1.0, 1.3],
  ];
  const [nextId, batchId, occ] = [(state.nextCrateIds || [])[0], state.batchCrateId, []];
  for (const [id, name, x, y, z] of crates) {
    if (id !== nextId && id !== batchId) continue;
    const pt = api.projectWorldToScreen(x, y, z, w, h);
    const [cx, cy] = [Math.min(w - 86, pt.x), Math.max(122, pt.y - 28)];
    drawPtr(ctx, cx, cy + 12, pt.x, pt.y);
    const n = id === nextId;
    occ.push(drawPill(ctx, cx, cy, n ? `${name} (NEXT)` : `${name} (BATCH +$10)`, n ? '#FEF3C7' : THEME.jadeSoft, n ? '#D97706' : THEME.jade, n ? THEME.ink : '#14532D', 10));
  }
  state.hudBounds.crateTags = crates.filter(([id]) => id !== nextId && id !== batchId).map(([id, name, x, y, z]) => {
    const pt = api.projectWorldToScreen(x, y, z, w, h);
    return { id, ...drawCrateTag(ctx, pt.x, pt.y, name, w, h, occ) };
  });

  if (state.mode === 'kitchen' && (state.shotMode || state.chef.cookedDish)) {
    const passPt = api.projectWorldToScreen(0.0, 0.95, 3.35, w, h);
    const pillY = Math.min(h - 94, Math.max(passPt.y + 16, h - 102));
    drawPtr(ctx, passPt.x, pillY - 12, passPt.x, pillY - 22);
    state.hudBounds.readyPill = drawPill(ctx, passPt.x, pillY, state.stations.pass.activeReadyLabel, THEME.jadeSoft, THEME.jade, '#14532D');
  }
  drawNextBar(ctx, guide, state, w, h);
}
