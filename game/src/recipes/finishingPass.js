export const FINISHING_PASS_ID = 'finishingPass';

import { recomputeLedger } from '../service/scoringLedger.js';

export function enterFinishingPass(state) {
  state.mode = 'finish';
  const tipBonus = state.upgrades.silk_pass ? 20 : 16;
  state.finishing = {
    activeDishId: 'vip_peking_duck',
    title: 'VIP PEKING DUCK',
    price: 74,
    tipBonus,
    selectedSauce: 'plum',
    pourAnim: 1.0,
    drizzleProgress: 0.65,
    steps: [
      { id: 'duck', label: '1. CARVED DUCK', status: 'done' },
      { id: 'plum', label: '2. PLUM GLAZE', status: 'active' },
      { id: 'scallion', label: '3. SCALLION', status: 'pending' },
    ],
  };
}

export function applyFinishingSauce(state, sauceId, audio) {
  const fin = state.finishing;
  fin.selectedSauce = sauceId;
  fin.pourAnim = 0.05;
  fin.drizzleProgress = Math.min(1, fin.drizzleProgress + 0.35);
  if (audio) audio.playGlazePour();

  if (sauceId === 'plum') {
    fin.steps[1].status = 'done';
    if (fin.steps[2].status === 'pending') fin.steps[2].status = 'active';
  } else if (sauceId === 'scallion' || sauceId === 'chili' || sauceId === 'sesame') {
    fin.steps[1].status = 'done';
    fin.steps[2].status = 'done';
    fin.tipBonus = state.upgrades.silk_pass ? 22 : 18;
  }
}

export function completeFinishingPass(state, audio) {
  const fin = state.finishing;
  const totalDishPay = fin.price + fin.tipBonus;
  state.ledger.dishesServed += 1;
  state.ledger.basePay += totalDishPay;
  recomputeLedger(state);
  state.stations.island.step = 1;
  state.stations.island.progress = 1 / 3;
  state.stations.island.label = 'PEKING DUCK · 1/3';
  state.mode = 'kitchen';
  if (audio) audio.playBell();
  return totalDishPay;
}
