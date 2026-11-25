export const ORDER_BOARD_MAX = 4;

import { HERO_RECIPES } from '../recipes/catalog.js';
import { rngPick } from '../core/rng.js';
import { recomputeLedger } from './scoringLedger.js';

const RECIPE_LIST = Object.values(HERO_RECIPES);

export function spawnNextOrder(state) {
  const pick = rngPick(state.rng, RECIPE_LIST) || HERO_RECIPES.char_kway_teow;
  return {
    id: `ord_${Math.floor(state.time * 100)}_${Math.floor(state.rng() * 999)}`,
    recipeId: pick.id,
    title: pick.title,
    price: pick.price,
    stepLabel: pick.stepLabel,
    nextIng: pick.nextIng,
    timeLeft: pick.vip ? 46 : 34,
    maxTime: pick.vip ? 46 : 34,
    vip: pick.vip,
    urgent: false,
  };
}

export function stepOrderTimers(state, dt, audio) {
  for (let i = 0; i < state.orders.length; i++) {
    const ord = state.orders[i];
    ord.timeLeft = Math.max(0, ord.timeLeft - dt);
    ord.urgent = ord.timeLeft <= 10;
    if (ord.urgent && ord.recipeId === 'chili_prawn') {
      const sec = Math.ceil(ord.timeLeft);
      ord.stepLabel = `Next: Prawn (0:${String(sec).padStart(2, '0')})`;
    }
    if (ord.timeLeft <= 0) {
      state.ledger.scorchCount += 1;
      state.ledger.scorchPenalty += 20;
      recomputeLedger(state);
      if (audio) audio.playScorchWarn();
      state.orders[i] = spawnNextOrder(state);
    }
  }
}

export function serveBestOrder(state, audio) {
  if (!state.orders || state.orders.length === 0) return 0;
  let bestIdx = 0;
  for (let i = 1; i < state.orders.length; i++) {
    if (state.orders[i].timeLeft < state.orders[bestIdx].timeLeft) bestIdx = i;
  }
  const served = state.orders[bestIdx];
  const tip = served.vip && state.upgrades.silk_pass ? 16 : 6;
  const earned = served.price + tip;
  state.ledger.dishesServed += 1;
  state.ledger.basePay += earned;
  state.ledger.heiBonus += state.stations.wokRight.heatCombo * 5;
  recomputeLedger(state);
  state.orders[bestIdx] = spawnNextOrder(state);
  if (audio) audio.playBell();
  return earned;
}
