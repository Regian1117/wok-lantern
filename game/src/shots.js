export const SHOTS_VERSION = 1;

import { spawnFlame, spawnSmoke, spawnSteam } from './feel/particles.js';
import { assignPatronToOrder } from './service/guestMoods.js';

function applyHeroShowcaseData(state) {
  state.shiftIndex = 1; state.clockSec = 100;
  state.chef.holding = 'dumplings'; state.chef.prepped = true;
  state.batchPrep = { chili: 2, bokchoy: 0, prepStreak: 2, totalBatches: 2 };
  state.nextCrateIds = ['crate_prawn']; state.batchCrateId = 'crate_chili';
  state.stations.chop = { flashTimer: 0.85, hitstop: 0, lastLabel: 'CHOP! PERFECT', choppedItem: 'scallion' };
  state.stations.wokLeft = { scorched: true, active: true, stage: 'scorched', heat: 1.0, timer: 0, item: 'chili' };
  state.stations.wokRight = { active: true, item: 'noodles', progress: 0.72, sweetPhase: 0.5, sweetCenter: 0.5, sweetWidth: 0.22, heatCombo: 6, flashTimer: 0.8, callout: 'WOK HEI x6 · SEAR!' };
  state.stations.island = { dishId: 'vip_peking_duck', label: 'PEKING DUCK · 2/3', step: 2, maxSteps: 3, progress: 0.67 };
  state.stations.pass.showcasePlates = true;
  state.stations.pass.platedDish = { recipeId: 'char_kway_teow', base: 'Noodles', stationPath: 'Wok Sear', sauce: 'Chili Crisp', prepared: true, finished: true };

  const spec = [
    ['ord_1', 'char_kway_teow', 'CHAR KWAY TEOW', 'Noodles', 'Wok Sear', 'Chili Crisp', 34, 'Wok Sear: Noodles', 28, 40, 0, 0, 'AH-FONG', 'REGULAR', 'HAPPY', '#15803D'],
    ['ord_2', 'xiaolongbao', 'XIAOLONGBAO', 'Dumplings', 'Bamboo Steam', 'Black Vinegar', 38, 'Steam: Dumplings', 22, 36, 0, 0, 'SINGER YAN', 'REGULAR', 'WAITING', '#D99B26'],
    ['ord_3', 'vip_peking_duck', 'VIP PEKING DUCK', 'Duck', 'Island Carve', 'Plum Glaze', 74, 'Carve 2/3 -> Glaze', 32, 48, 1, 0, 'CRITIC MEI', 'VIP CRITIC', 'HAPPY', '#15803D'],
    ['ord_4', 'chili_prawn', 'CHILI PRAWN', 'Prawn', 'Wok Sear', 'Chili Crisp', 46, 'Next: Prawn (0:04)', 4, 30, 0, 1, 'COURIER BO', 'HURRY', 'FURIOUS', '#B91C1C'],
  ];
  state.orders = spec.map(([id, recipeId, title, base, stationPath, sauce, price, stepLabel, timeLeft, maxTime, vip, urgent, pname, prole, mood, color]) => {
    const o = { id, recipeId, title, base, stationPath, sauce, price, stepLabel, nextIng: base, timeLeft, maxTime, vip: Boolean(vip), urgent: Boolean(urgent) };
    o.patron = { ...assignPatronToOrder(o, state.rng, 1), name: pname, role: prole, mood, color };
    return o;
  });

  state.ledger = { dishesServed: 8, avgPrice: 50, basePay: 400, heatCombo: 6, heatMult: 6, heiBonus: 100, scorchCount: 1, scorchPenalty: 20, lateOrderCount: 0, latePenaltyTotal: 0, grossSubtotal: 500, netPay: 480, stars: 3, unlockedUpgrade: 'jet_wok' };
}

export function applyShotMode(state, searchString) {
  const shot = new URLSearchParams(searchString || '').get('shot');
  if (!shot) return null;
  state.shotMode = shot; state.time = 2.4;
  applyHeroShowcaseData(state);

  if (shot === 'hero') {
    state.mode = 'kitchen';
    for (let i = 0; i < 6; i++) {
      spawnSmoke(state, -3.05, 1.2 + i * 0.14, -3.15);
      spawnFlame(state, -1.75, 1.05 + i * 0.08, -3.15);
      spawnSteam(state, -0.45, 1.55 + i * 0.12, -3.15);
    }
  } else if (shot === 'finish') {
    state.mode = 'finish'; state.finishing.selectedSauce = 'plum'; state.finishing.pourAnim = 0.55;
  } else if (shot === 'route' || shot === 'ledger') {
    state.mode = shot;
  }
  return shot;
}
