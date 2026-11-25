export const ROUTE_SCHEMA = 'kitchen-route-v1';

import { ROUTE_POINTS } from './layout.js';

const INGREDIENT_TO_CRATE = {
  Noodles: 'crate_noodles',
  'Bok Choy': 'crate_bokchoy',
  Chili: 'crate_chili',
  Dumplings: 'crate_dumpling',
  Prawn: 'crate_prawn',
  Duck: 'crate_duck',
};

export function buildCriticalPath() {
  return ROUTE_POINTS.map((pt) => ({
    step: pt.step,
    label: pt.label,
    tag: `${pt.step}. ${pt.label}`,
    x: pt.x,
    y: pt.y,
    z: pt.z,
  }));
}

export function getHighlightedCrates(state) {
  if (state.shotMode === 'hero' || state.shotMode === 'route') {
    state.batchCrateId = 'crate_chili';
    return ['crate_prawn'];
  }
  state.batchCrateId = state.batchPrep && (state.batchPrep.chili > 0 || state.shiftIndex >= 0) ? 'crate_chili' : null;
  let urgentOrd = null;
  for (const ord of state.orders || []) {
    if (!urgentOrd || ord.timeLeft < urgentOrd.timeLeft) urgentOrd = ord;
  }
  const cid = urgentOrd ? INGREDIENT_TO_CRATE[urgentOrd.nextIng] : 'crate_prawn';
  return [cid || 'crate_prawn'];
}

export function resolveNextStationForOrder(order) {
  if (!order) return 'pass';
  if (order.recipeId === 'xiaolongbao') return 'steamer';
  if (order.recipeId === 'vip_peking_duck') return 'island';
  return 'wok_right';
}

export function computeActiveRoute(state) {
  state.nextCrateIds = getHighlightedCrates(state);
  return ROUTE_POINTS;
}
