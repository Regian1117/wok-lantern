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
    return ['crate_chili', 'crate_prawn'];
  }
  const nextIds = [];
  for (const ord of state.orders || []) {
    const cid = INGREDIENT_TO_CRATE[ord.nextIng];
    if (cid && !nextIds.includes(cid)) nextIds.push(cid);
    if (nextIds.length >= 2) break;
  }
  if (!nextIds.includes('crate_prawn')) nextIds.unshift('crate_prawn');
  return nextIds.slice(0, 2);
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
