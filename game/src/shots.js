export const SHOTS_VERSION = 1;

import { spawnFlame, spawnSmoke, spawnSteam } from './feel/particles.js';
import { assignPatronToOrder } from './service/guestMoods.js';

function applyHeroShowcaseData(state) {
  state.shiftIndex = 1;
  state.clockSec = 100;
  state.chef.holding = 'dumplings';
  state.chef.prepped = true;
  state.batchPrep = { chili: 2, bokchoy: 0, prepStreak: 2, totalBatches: 2 };
  state.nextCrateIds = ['crate_chili', 'crate_prawn'];
  state.stations.chop = { flashTimer: 0.85, hitstop: 0, lastLabel: 'CHOP! PERFECT', choppedItem: 'scallion' };
  state.stations.wokLeft = { scorched: true, active: true, stage: 'scorched', heat: 1.0, timer: 0, item: 'chili' };
  state.stations.wokRight = { active: true, item: 'noodles', progress: 0.72, sweetPhase: 0.5, sweetCenter: 0.5, sweetWidth: 0.22, heatCombo: 6, flashTimer: 0.8, callout: 'WOK HEI x6 · SEAR!' };
  state.stations.island = { dishId: 'vip_peking_duck', label: 'PEKING DUCK · 2/3', step: 2, maxSteps: 3, progress: 0.67 };
  state.stations.pass.showcasePlates = true;
  state.stations.pass.platedDish = { recipeId: 'char_kway_teow', base: 'Noodles', stationPath: 'Wok Sear', sauce: 'Chili Crisp', prepared: true, finished: true };

  state.orders = [
    { id: 'ord_1', recipeId: 'char_kway_teow', title: 'CHAR KWAY TEOW', base: 'Noodles', stationPath: 'Wok Sear', sauce: 'Chili Crisp', price: 34, stepLabel: 'Wok Sear: Noodles', nextIng: 'Noodles', timeLeft: 28, maxTime: 40, vip: false, urgent: false },
    { id: 'ord_2', recipeId: 'xiaolongbao', title: 'XIAOLONGBAO', base: 'Dumplings', stationPath: 'Bamboo Steam', sauce: 'Black Vinegar', price: 38, stepLabel: 'Steam: Dumplings', nextIng: 'Dumplings', timeLeft: 22, maxTime: 36, vip: false, urgent: false },
    { id: 'ord_3', recipeId: 'vip_peking_duck', title: 'VIP PEKING DUCK', base: 'Duck', stationPath: 'Island Carve', sauce: 'Plum Glaze', price: 74, stepLabel: 'Carve 2/3 -> Glaze', nextIng: 'Duck', timeLeft: 32, maxTime: 48, vip: true, urgent: false },
    { id: 'ord_4', recipeId: 'chili_prawn', title: 'CHILI PRAWN', base: 'Prawn', stationPath: 'Wok Sear', sauce: 'Chili Crisp', price: 46, stepLabel: 'Next: Prawn (0:04)', nextIng: 'Prawn', timeLeft: 4, maxTime: 30, vip: false, urgent: true },
  ];
  state.orders[0].patron = { ...assignPatronToOrder(state.orders[0], state.rng, 1), name: 'AH-FONG', role: 'REGULAR', mood: 'HAPPY', color: '#15803D' };
  state.orders[1].patron = { ...assignPatronToOrder(state.orders[1], state.rng, 1), name: 'SINGER YAN', role: 'REGULAR', mood: 'WAITING', color: '#D99B26' };
  state.orders[2].patron = { ...assignPatronToOrder(state.orders[2], state.rng, 1), name: 'CRITIC MEI', role: 'VIP CRITIC', mood: 'HAPPY', color: '#15803D' };
  state.orders[3].patron = { ...assignPatronToOrder(state.orders[3], state.rng, 1), name: 'COURIER BO', role: 'HURRY', mood: 'FURIOUS', color: '#B91C1C' };

  state.ledger = { dishesServed: 8, avgPrice: 50, basePay: 400, heatCombo: 6, heatMult: 6, heiBonus: 100, scorchCount: 1, scorchPenalty: 20, lateOrderCount: 0, latePenaltyTotal: 0, grossSubtotal: 500, netPay: 480, stars: 3, unlockedUpgrade: 'jet_wok' };
}

export function applyShotMode(state, searchString) {
  const shot = new URLSearchParams(searchString || '').get('shot');
  if (!shot) return null;
  state.shotMode = shot;
  state.time = 2.4;
  applyHeroShowcaseData(state);

  if (shot === 'hero') {
    state.mode = 'kitchen';
    for (let i = 0; i < 6; i++) {
      spawnSmoke(state, -3.05, 1.2 + i * 0.14, -3.15);
      spawnFlame(state, -1.75, 1.05 + i * 0.08, -3.15);
      spawnSteam(state, -0.45, 1.55 + i * 0.12, -3.15);
    }
  } else if (shot === 'finish') {
    state.mode = 'finish';
    state.finishing.selectedSauce = 'plum';
    state.finishing.pourAnim = 0.55;
  } else if (shot === 'route') {
    state.mode = 'route';
  } else if (shot === 'ledger') {
    state.mode = 'ledger';
  }
  return shot;
}
