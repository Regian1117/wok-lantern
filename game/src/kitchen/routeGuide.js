export function computeLiveNextStep(state) {
  const ord = pickPriorityOrder(state);
  const chef = state.chef;
  let targetStationId = 'pass';
  let stepNumber = 4;
  let stepName = 'SERVE';
  let shortAction = '[E/SPACE] SERVE PASS';
  let prefix = 'NEXT 4/4: PASS';
  let keyHint = '[SPACE]';

  if (state.mode === 'finish') {
    const fin = buildFloorRoute(chef, 'pass');
    return { targetStationId: 'pass', stepNumber: 4, stepName: 'FINISH', bannerText: 'NEXT 4/4: GLAZE [1-4] · BELL [SPACE]', shortAction: '[SPACE] SERVE', walkSec: fin.walkSec, routeStops: fin.routeStops };
  }
  if (chef.cookedDish) {
    if (chef.cookedDish.base === 'Duck' && !chef.cookedDish.finished) {
      prefix = 'NEXT 4/4: GLAZE VIP';
      stepName = 'FINISH';
      shortAction = '[F] GLAZE VIP';
      keyHint = '[F]';
    }
  } else if (chef.holding && !chef.prepped) {
    targetStationId = 'chop';
    stepNumber = 2;
    stepName = 'CHOP';
    prefix = `NEXT 2/4: CHOP ${String(chef.holding).toUpperCase()}`;
    shortAction = '[E/SPACE] CHOP';
    keyHint = '[E]';
  } else if (chef.holding && chef.prepped) {
    const matchOrd = (state.orders || []).find((o) => o.base.toLowerCase().startsWith(String(chef.holding).slice(0, 4))) || ord;
    targetStationId = matchOrd ? (PATH_STATION_MAP[matchOrd.stationPath] || 'wok_right') : 'wok_right';
    stepNumber = 3;
    stepName = 'COOK';
    const stName = targetStationId === 'steamer' ? 'STEAMER' : targetStationId === 'island' ? 'ISLAND' : 'RIGHT WOK';
    prefix = `NEXT 3/4: ${stName}`;
    shortAction = `[E] COOK IN ${stName}`;
    keyHint = '[E]';
  } else {
    targetStationId = ord ? (BASE_CRATE_MAP[ord.base] || 'crate_prawn') : 'crate_prawn';
    const ingName = ord ? ord.base.toUpperCase() : 'PRAWN';
    stepNumber = 1;
    stepName = 'LARDER';
    prefix = `NEXT 1/4: ${ingName}`;
    shortAction = `[E] PICK ${ingName}`;
    keyHint = '[E]';
  }

  const { routeStops, walkSec } = buildFloorRoute(chef, targetStationId);
  return {
    targetStationId,
    stepNumber,
    stepName,
    walkSec,
    routeStops,
    bannerText: `${prefix} · ${walkSec}s WALK ${keyHint}`,
    shortAction,
  };
}

export const ROUTE_GUIDE_VERSION = 2;

const BASE_CRATE_MAP = { Noodles: 'crate_noodles', Dumplings: 'crate_dumpling', Prawn: 'crate_prawn', Duck: 'crate_duck' };
const PATH_STATION_MAP = { 'Wok Sear': 'wok_right', 'Bamboo Steam': 'steamer', 'Island Carve': 'island' };
const STATION_POS = {
  crate_noodles: [1.2, -2.08], crate_bokchoy: [2.55, -2.08], crate_chili: [3.7, -2.08],
  crate_dumpling: [3.75, -1.6], crate_prawn: [3.75, -0.15], crate_duck: [3.75, 1.3],
  chop: [-3.75, 0.85], wok_left: [-3.05, -2.08], wok_right: [-1.75, -2.08],
  steamer: [-0.45, -2.08], island: [0.1, 1.48], pass: [0.0, 2.25],
};

function hitsIsland(ax, az, bx, bz) {
  for (let i = 1; i < 10; i++) {
    const t = i / 10;
    const x = ax + (bx - ax) * t;
    const z = az + (bz - az) * t;
    if (x >= -1.45 && x <= 1.6 && z >= -0.9 && z <= 1.05) return true;
  }
  return false;
}

function appendFloorSegment(stops, ax, az, bx, bz, endLabel) {
  if (Math.hypot(bx - ax, bz - az) < 0.08) return;
  if (hitsIsland(ax, az, bx, bz)) {
    const lanes = [[[-1.95, -1.35], [-1.95, 1.5]], [[2.05, -1.35], [2.05, 1.5]]];
    let bestPts = [[2.05, az < 0 ? -1.35 : 1.5]];
    let bestLen = Infinity;
    for (const [cA, cB] of lanes) {
      for (const pts of [[cA], [cB], [cA, cB], [cB, cA]]) {
        const seq = [[ax, az], ...pts, [bx, bz]];
        let ok = true;
        let len = 0;
        for (let i = 0; i < seq.length - 1; i++) {
          if (hitsIsland(seq[i][0], seq[i][1], seq[i + 1][0], seq[i + 1][1])) { ok = false; break; }
          len += Math.hypot(seq[i + 1][0] - seq[i][0], seq[i + 1][1] - seq[i][1]);
        }
        if (ok && len < bestLen) { bestLen = len; bestPts = pts; }
      }
    }
    for (const [cx, cz] of bestPts) stops.push({ x: cx, y: 0.08, z: cz, label: 'TURN' });
  }
  stops.push({ x: bx, y: 0.08, z: bz, label: endLabel });
}

function buildFloorRoute(chef, targetId) {
  const tgt = STATION_POS[targetId] || STATION_POS.pass;
  const stops = [{ x: chef.x, y: 0.08, z: chef.z, label: 'CHEF' }];
  appendFloorSegment(stops, chef.x, chef.z, tgt[0], tgt[1], targetId.toUpperCase());
  if (targetId !== 'pass') appendFloorSegment(stops, tgt[0], tgt[1], STATION_POS.pass[0], STATION_POS.pass[1], 'PASS');
  let totalDist = 0;
  for (let i = 0; i < stops.length - 1; i++) totalDist += Math.hypot(stops[i + 1].x - stops[i].x, stops[i + 1].z - stops[i].z);
  const walkSec = totalDist < 0.08 ? 0 : Math.max(1, Math.round(totalDist / Math.max(1, chef.moveSpeed || 3.4)));
  return { routeStops: stops, walkSec };
}

export function pickPriorityOrder(state) {
  if (!state.orders || state.orders.length === 0) return null;
  let best = state.orders[0];
  for (let i = 1; i < state.orders.length; i++) {
    if (state.orders[i].timeLeft < best.timeLeft) best = state.orders[i];
  }
  return best;
}

export function getStationActionPrompt(state, station) {
  if (!station) return '';
  if (station.kind === 'crate') return `[E] PICK ${station.label}`;
  if (station.kind === 'chop') return state.chef.holding ? '[E/SPACE] CHOP' : 'BRING INGREDIENT';
  if (station.id === 'wok_left' && state.stations.wokLeft.scorched) return '[E] RESCUE WOK';
  if (station.kind === 'wok') return state.chef.prepped ? '[E] COOK IN WOK' : '[E] TOSS WOK';
  if (station.kind === 'steamer') return state.chef.prepped ? '[E] STEAM DISH' : '[E] CHECK STEAM';
  if (station.kind === 'island') return state.chef.prepped ? '[E] CARVE DISH' : '[E] PREP ISLAND';
  if (station.kind === 'pass') return state.chef.cookedDish ? '[E/SPACE] SERVE PASS' : 'CARRY COOKED DISH';
  return '';
}
