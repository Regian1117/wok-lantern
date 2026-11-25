export const ORDER_BOARD_MAX = 4;

import { TWELVE_COMBINATIONS } from '../recipes/combinations.js';
import { rngPick } from '../core/rng.js';
import { recomputeLedger, recordDishServe, recordWokHeiBonus } from './scoringLedger.js';
import { applyLateOrderPenalty } from './rushPacing.js';
import { assignPatronToOrder, computePatronMood, getPatronTipMultiplier } from './guestMoods.js';
import { consumeBatchPrepForDish } from '../recipes/batchPrep.js';

export function spawnNextOrder(state) {
  const unlockedBases =
    state.shiftIndex === 0 ? ['Noodles', 'Dumplings', 'Prawn'] : ['Noodles', 'Dumplings', 'Duck', 'Prawn'];
  const pool = TWELVE_COMBINATIONS.filter((c) => unlockedBases.includes(c.base));
  const pick = rngPick(state.rng, pool) || TWELVE_COMBINATIONS[0];
  const isVip = pick.id === 'vip_peking_duck' || pick.price >= 68;
  const maxTime = isVip ? 44 : 32;
  const ord = {
    id: `ord_${Math.floor(state.time * 100)}_${Math.floor(state.rng() * 999)}`,
    recipeId: pick.id,
    title: pick.title.toUpperCase(),
    base: pick.base,
    stationPath: pick.path,
    sauce: pick.sauce,
    price: pick.price,
    stepLabel: `${pick.path}: ${pick.base}`,
    nextIng: pick.base,
    timeLeft: maxTime,
    maxTime,
    vip: isVip,
    urgent: false,
  };
  ord.patron = assignPatronToOrder(ord, state.rng, state.shiftIndex);
  return ord;
}

export function stepOrderTimers(state, dt, audio) {
  if (state.stations.pass.servedTimer > 0) {
    state.stations.pass.servedTimer = Math.max(0, state.stations.pass.servedTimer - dt);
  }
  for (let i = 0; i < state.orders.length; i++) {
    const ord = state.orders[i];
    const rate = ord.patron ? ord.patron.speedScale : 1;
    ord.timeLeft = Math.max(0, ord.timeLeft - dt * rate);
    ord.urgent = ord.timeLeft <= 10;
    const mInfo = computePatronMood(ord);
    if (ord.patron) {
      ord.patron.mood = mInfo.mood;
      ord.patron.color = mInfo.color;
    }
    if (ord.urgent) ord.stepLabel = `Next: ${ord.nextIng} (0:${String(Math.ceil(ord.timeLeft)).padStart(2, '0')})`;
    if (ord.timeLeft <= 0) {
      applyLateOrderPenalty(state, audio);
      state.orders[i] = spawnNextOrder(state);
    }
  }
}

export function serveBestOrder(state, audio, explicitPlate = null) {
  if (!state.orders || state.orders.length === 0) return 0;
  const plate = explicitPlate || state.chef.cookedDish;
  if (!plate || !plate.prepared) {
    state.feedbackBanner = { text: state.chef.holding ? 'NEEDS CHOP & COOK' : 'CARRY A COOKED DISH', tone: 'crimson', timer: 1.6 };
    if (audio) audio.playScorchWarn();
    return 0;
  }

  const matchIdx = state.orders.findIndex((o) => o.base === plate.base && o.stationPath === plate.stationPath);
  if (matchIdx === -1) {
    const baseIdx = state.orders.findIndex((o) => o.base === plate.base);
    const salvage = baseIdx !== -1 ? Math.round(state.orders[baseIdx].price * 0.25) : 8;
    state.feedbackBanner = { text: baseIdx !== -1 ? 'WRONG STATION' : 'WRONG DISH', tone: 'crimson', timer: 1.6 };
    state.stations.wokRight.heatCombo = 1;
    state.stations.wokRight.callout = 'WOK HEI x1 · SEAR!';
    recordDishServe(state, salvage, 0);
    state.chef.cookedDish = null;
    if (baseIdx !== -1) state.orders[baseIdx] = spawnNextOrder(state);
    if (audio) audio.playScorchWarn();
    return salvage;
  }

  const served = state.orders[matchIdx];
  if (served.vip && !plate.finished) {
    state.feedbackBanner = { text: 'NEEDS FINISH [F]', tone: 'amber', timer: 1.6 };
    if (audio) audio.playScorchWarn();
    return 0;
  }

  const batch = consumeBatchPrepForDish(state, served);
  const moodMult = getPatronTipMultiplier(served.patron?.mood || 'HAPPY', served.vip);
  const baseTip = plate.glazeTip || Math.round((served.vip && state.upgrades.silk_pass ? 16 : 6) * moodMult);
  const earned = served.price + baseTip + batch.bonusTip;
  recordDishServe(state, served.price, baseTip + batch.bonusTip);
  recordWokHeiBonus(state, state.stations.wokRight.heatCombo, 5);
  recomputeLedger(state);
  state.chef.cookedDish = null;
  state.stations.pass.servedDisplay = plate;
  state.stations.pass.servedTimer = 3.0;
  state.feedbackBanner = { text: batch.consumed ? `SERVED +$${earned} (+$${batch.bonusTip} ${batch.label})` : `SERVED +$${earned}`, tone: 'jade', timer: 1.6 };
  state.orders[matchIdx] = spawnNextOrder(state);
  if (audio) audio.playBell();
  return earned;
}
