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

import { serveBestOrder } from '../service/orderBoard.js';
import { recordDishServe } from '../service/scoringLedger.js';

export const FINISHING_PASS_ID = 'finishingPass';

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
  const plate = {
    recipeId: 'vip_peking_duck',
    base: 'Duck',
    stationPath: 'Island Carve',
    sauce: 'Plum Glaze',
    prepared: true,
    finished: true,
    glazeTip: fin.tipBonus,
  };
  let earned = 0;
  const hasVipOrder = (state.orders || []).some((o) => o.base === 'Duck' && o.stationPath === 'Island Carve');
  if (hasVipOrder) {
    earned = serveBestOrder(state, audio, plate);
  } else {
    earned = fin.price + fin.tipBonus;
    recordDishServe(state, fin.price, fin.tipBonus);
    if (audio) audio.playBell();
  }
  state.stations.island.step = 1;
  state.stations.island.progress = 1 / 3;
  state.stations.island.label = 'PEKING DUCK · 1/3';
  state.mode = 'kitchen';
  return earned;
}
