export const INITIAL_SHIFT_CLOCK = 100;

import { createRng } from './rng.js';
import { TWELVE_COMBINATIONS } from '../recipes/combinations.js';
import { assignPatronToOrder } from '../service/guestMoods.js';
import { createBatchPrepState } from '../recipes/batchPrep.js';

export function createFreshStartOrders(rng, shiftIndex = 0) {
  const unlockedBases = shiftIndex === 0 ? ['Noodles', 'Dumplings', 'Prawn'] : ['Noodles', 'Dumplings', 'Duck', 'Prawn'];
  const pool = TWELVE_COMBINATIONS.filter((c) => unlockedBases.includes(c.base));
  const picks = [pool[0], pool[4 % pool.length], pool[9 % pool.length] || pool[1], pool[2 % pool.length]];
  return picks.map((pick, i) => {
    const maxTime = pick.price >= 68 ? 46 : 32 + i * 3;
    const ord = {
      id: `ord_start_${i + 1}`,
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
      vip: pick.price >= 68,
      urgent: false,
    };
    ord.patron = assignPatronToOrder(ord, rng, shiftIndex);
    return ord;
  });
}

export function createGameState(seed = 1) {
  const rng = createRng(seed);
  return {
    seed: Number(seed) || 1,
    rng,
    mode: 'kitchen',
    shiftIndex: 0,
    clockSec: INITIAL_SHIFT_CLOCK,
    time: 0,
    paused: false,
    shotMode: null,
    povMode: 'diagonal',
    audioMuted: false,
    chopMeter: 0.52,
    chopDir: 1,
    feedbackBanner: null,
    batchPrep: createBatchPrepState(),
    chef: {
      x: -1.85,
      z: 1.35,
      yaw: 0.48,
      walkPhase: 0,
      chopAnim: 0,
      wokAnim: 0,
      holding: null,
      prepped: false,
      cookedDish: null,
      waypoints: [],
      targetStation: null,
      nearestStation: null,
      moveSpeed: 3.4,
    },
    stations: {
      wokLeft: { scorched: false, active: false, stage: 'cool', heat: 0, timer: 5.0, item: null },
      wokRight: {
        active: false,
        item: null,
        progress: 0,
        sweetPhase: 0.52,
        sweetCenter: 0.5,
        sweetWidth: 0.22,
        heatCombo: 1,
        flashTimer: 0,
        callout: 'WOK HEI x1 · SEAR!',
      },
      steamer: { active: false, item: null, progress: 0, tiers: 3 },
      chop: { flashTimer: 0, hitstop: 0, lastLabel: 'CHOP! READY', choppedItem: null },
      island: { dishId: 'vip_peking_duck', label: 'PEKING DUCK · 0/3', step: 0, maxSteps: 3, progress: 0 },
      pass: { readyCount: 0, activeReadyLabel: 'READY TO SERVE · [SPACE]', platedDish: null, showcasePlates: false, servedDisplay: null, servedTimer: 0 },
    },
    orders: createFreshStartOrders(rng, 0),
    ledger: {
      dishesServed: 0,
      avgPrice: 0,
      basePay: 0,
      heatCombo: 1,
      heatMult: 1,
      heiBonus: 0,
      scorchCount: 0,
      scorchPenalty: 0,
      lateOrderCount: 0,
      latePenaltyTotal: 0,
      grossSubtotal: 0,
      netPay: 0,
      stars: 0,
      unlockedUpgrade: 'jet_wok',
    },
    finishing: {
      activeDishId: 'vip_peking_duck',
      title: 'VIP PEKING DUCK',
      price: 74,
      tipBonus: 16,
      selectedSauce: 'plum',
      pourAnim: 1.0,
      drizzleProgress: 0.65,
      steps: [
        { id: 'duck', label: '1. CARVED DUCK', status: 'done' },
        { id: 'plum', label: '2. PLUM GLAZE', status: 'active' },
        { id: 'scallion', label: '3. SCALLION', status: 'pending' },
      ],
    },
    upgrades: { jet_wok: true, triple_steamer: false, silk_pass: false },
    nextCrateIds: ['crate_noodles'],
    particles: [],
    hudRects: [],
    hudBounds: {},
    toast: null,
  };
}
