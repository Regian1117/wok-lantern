export function computeLiveNextStep(state) {
  const ord = pickPriorityOrder(state);
  const chef = state.chef;
  if (state.mode === 'finish') {
    return { targetStationId: 'pass', stepNumber: 4, stepName: 'FINISH', bannerText: 'NEXT 4/4: Glaze [1-4] & Ring Bell [SPACE]', shortAction: '[SPACE] SERVE' };
  }
  if (chef.cookedDish) {
    if (chef.cookedDish.base === 'Duck' && !chef.cookedDish.finished) {
      return { targetStationId: 'pass', stepNumber: 4, stepName: 'FINISH', bannerText: 'NEXT 4/4: Press [F] to Glaze VIP Duck or Serve', shortAction: '[F] GLAZE VIP' };
    }
    return { targetStationId: 'pass', stepNumber: 4, stepName: 'SERVE', bannerText: 'NEXT 4/4: Deliver Dish to SERVICE PASS [E or SPACE]', shortAction: '[E/SPACE] SERVE PASS' };
  }
  if (chef.holding && !chef.prepped) {
    return { targetStationId: 'chop', stepNumber: 2, stepName: 'CHOP', bannerText: `NEXT 2/4: Prep ${String(chef.holding).toUpperCase()} at Butcher Stump [E or SPACE]`, shortAction: '[E/SPACE] CHOP' };
  }
  if (chef.holding && chef.prepped) {
    const matchOrd = (state.orders || []).find((o) => o.base.toLowerCase().startsWith(String(chef.holding).slice(0, 4))) || ord;
    const stId = matchOrd ? (PATH_STATION_MAP[matchOrd.stationPath] || 'wok_right') : 'wok_right';
    const stName = stId === 'steamer' ? 'STEAMER' : stId === 'island' ? 'ISLAND' : 'RIGHT WOK';
    return { targetStationId: stId, stepNumber: 3, stepName: 'COOK', bannerText: `NEXT 3/4: Cook at ${stName} [E or SPACE]`, shortAction: `[E] COOK IN ${stName}` };
  }
  const crateId = ord ? (BASE_CRATE_MAP[ord.base] || 'crate_prawn') : 'crate_prawn';
  const ingName = ord ? ord.base.toUpperCase() : 'PRAWN';
  return { targetStationId: crateId, stepNumber: 1, stepName: 'LARDER', bannerText: `NEXT 1/4: Pick ${ingName} at Crate [E]`, shortAction: `[E] PICK ${ingName}` };
}

export const ROUTE_GUIDE_VERSION = 1;

const BASE_CRATE_MAP = {
  Noodles: 'crate_noodles',
  Dumplings: 'crate_dumpling',
  Prawn: 'crate_prawn',
  Duck: 'crate_duck',
};

const PATH_STATION_MAP = {
  'Wok Sear': 'wok_right',
  'Bamboo Steam': 'steamer',
  'Island Carve': 'island',
};

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
