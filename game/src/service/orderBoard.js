export const ORDER_BOARD_MAX = 4;

import { TWELVE_COMBINATIONS } from '../recipes/combinations.js';
import { rngPick } from '../core/rng.js';
import { recomputeLedger, recordDishServe, recordWokHeiBonus } from './scoringLedger.js';
import { applyLateOrderPenalty } from './rushPacing.js';

const BASE_TO_ING = {
  Noodles: 'Noodles',
  Dumplings: 'Dumplings',
  Duck: 'Duck',
  Prawn: 'Prawn',
};

export function spawnNextOrder(state) {
  const unlockedBases =
    state.shiftIndex === 0 ? ['Noodles', 'Dumplings', 'Prawn'] : ['Noodles', 'Dumplings', 'Duck', 'Prawn'];
  const pool = TWELVE_COMBINATIONS.filter((c) => unlockedBases.includes(c.base));
  const pick = rngPick(state.rng, pool) || TWELVE_COMBINATIONS[0];
  const isVip = pick.id === 'vip_peking_duck' || pick.price >= 68;
  const maxTime = isVip ? 44 : 32;
  return {
    id: `ord_${Math.floor(state.time * 100)}_${Math.floor(state.rng() * 999)}`,
    recipeId: pick.id,
    title: pick.title.toUpperCase(),
    base: pick.base,
    stationPath: pick.path,
    sauce: pick.sauce,
    price: pick.price,
    stepLabel: `${pick.path}: ${pick.base}`,
    nextIng: BASE_TO_ING[pick.base] || pick.base,
    timeLeft: maxTime,
    maxTime,
    vip: isVip,
    urgent: false,
  };
}

export function stepOrderTimers(state, dt, audio) {
  for (let i = 0; i < state.orders.length; i++) {
    const ord = state.orders[i];
    ord.timeLeft = Math.max(0, ord.timeLeft - dt);
    ord.urgent = ord.timeLeft <= 10;
    if (ord.urgent) {
      const sec = Math.ceil(ord.timeLeft);
      ord.stepLabel = `Next: ${ord.nextIng} (0:${String(sec).padStart(2, '0')})`;
    }
    if (ord.timeLeft <= 0) {
      applyLateOrderPenalty(state, audio);
      state.orders[i] = spawnNextOrder(state);
    }
  }
}

export function serveBestOrder(state, audio, explicitPlate = null) {
  if (!state.orders || state.orders.length === 0) return 0;
  const plate = explicitPlate || state.chef.cookedDish || state.stations.pass.platedDish;
  if (!plate || !plate.prepared) {
    state.feedbackBanner = { text: 'NEEDS CHOP', tone: 'crimson', timer: 1.6 };
    if (audio) audio.playScorchWarn();
    return 0;
  }

  let matchIdx = state.orders.findIndex(
    (o) => o.base === plate.base && o.stationPath === plate.stationPath,
  );
  if (matchIdx === -1) {
    const baseIdx = state.orders.findIndex((o) => o.base === plate.base);
    if (baseIdx !== -1) {
      const salvage = Math.round(state.orders[baseIdx].price * 0.25);
      state.feedbackBanner = { text: 'WRONG STATION', tone: 'crimson', timer: 1.6 };
      state.stations.wokRight.heatCombo = 1;
      state.stations.wokRight.callout = 'WOK HEI x1 · SEAR!';
      recordDishServe(state, salvage, 0);
      state.chef.cookedDish = null;
      state.stations.pass.platedDish = null;
      state.orders[baseIdx] = spawnNextOrder(state);
      if (audio) audio.playScorchWarn();
      return salvage;
    }
    state.feedbackBanner = { text: 'WRONG DISH', tone: 'crimson', timer: 1.6 };
    recordDishServe(state, 8, 0);
    state.chef.cookedDish = null;
    state.stations.pass.platedDish = null;
    if (audio) audio.playScorchWarn();
    return 8;
  }

  const served = state.orders[matchIdx];
  if (served.vip && !plate.finished) {
    state.feedbackBanner = { text: 'NEEDS FINISH', tone: 'amber', timer: 1.6 };
    if (audio) audio.playScorchWarn();
    return 0;
  }

  const glazeTip = plate.glazeTip || (served.vip && state.upgrades.silk_pass ? 16 : 6);
  const earned = served.price + glazeTip;
  recordDishServe(state, served.price, glazeTip);
  recordWokHeiBonus(state, state.stations.wokRight.heatCombo, 5);
  recomputeLedger(state);
  state.chef.cookedDish = null;
  state.stations.pass.platedDish = null;
  state.feedbackBanner = { text: `SERVED +$${earned}`, tone: 'jade', timer: 1.4 };
  state.orders[matchIdx] = spawnNextOrder(state);
  if (audio) audio.playBell();
  return earned;
}
