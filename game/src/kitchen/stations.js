export const KITCHEN_STATIONS = [
  ['sink', 'sink', 'DOUBLE SINK', -4.85, -1.75, -3.85, -1.75],
  ['chop', 'chop', 'BUTCHER STUMP', -4.65, 0.85, -3.75, 0.85],
  ['wok_left', 'wok', 'LEFT WOK', -3.05, -3.15, -3.05, -2.08],
  ['wok_right', 'wok', 'RIGHT WOK', -1.75, -3.15, -1.75, -2.08],
  ['steamer', 'steamer', 'BAMBOO STEAMER', -0.45, -3.15, -0.45, -2.08],
  ['crate_noodles', 'crate', 'NOODLES', 1.2, -3.15, 1.2, -2.08, 'noodles'],
  ['crate_bokchoy', 'crate', 'BOK CHOY', 2.55, -3.15, 2.55, -2.08, 'bokchoy'],
  ['crate_chili', 'crate', 'CHILI', 3.9, -3.15, 3.7, -2.08, 'chili'],
  ['crate_dumpling', 'crate', 'DUMPLINGS', 4.75, -1.6, 3.75, -1.6, 'dumplings'],
  ['crate_prawn', 'crate', 'PRAWN', 4.75, -0.15, 3.75, -0.15, 'prawn'],
  ['crate_duck', 'crate', 'DUCK', 4.75, 1.3, 3.75, 1.3, 'duck'],
  ['island', 'island', 'ASSEMBLY ISLAND', 0.1, 0.08, 0.1, 1.48],
  ['pass', 'pass', 'SERVICE PASS', 0.0, 3.22, 0.0, 2.25],
].map(([id, kind, label, x, z, interactX, interactZ, item]) => ({ id, kind, label, x, z, interactX, interactZ, item }));

import { dist2D } from '../core/math.js';
import { triggerChopFeel } from '../feel/choppingFeel.js';
import { triggerWokToss } from '../feel/wokTossFeel.js';
import { enterFinishingPass } from '../recipes/finishingPass.js';
import { serveBestOrder } from '../service/orderBoard.js';
import { spawnSteam } from '../feel/particles.js';

const ITEM_TO_BASE = { noodles: 'Noodles', dumplings: 'Dumplings', duck: 'Duck', prawn: 'Prawn', chili: 'Prawn', bokchoy: 'Noodles' };

function cookHeldDish(state, stationPath, sauce) {
  if (!state.chef.holding || !state.chef.prepped) {
    state.feedbackBanner = { text: state.chef.holding ? 'NEEDS CHOP' : 'PICK AN INGREDIENT', tone: 'crimson', timer: 1.5 };
    return null;
  }
  const base = ITEM_TO_BASE[state.chef.holding] || 'Noodles';
  const dish = { base, stationPath, sauce, prepared: true, finished: stationPath !== 'Island Carve' || base !== 'Duck' };
  state.chef.cookedDish = dish;
  state.chef.holding = null;
  state.chef.prepped = false;
  state.feedbackBanner = { text: `CARRY ${base.toUpperCase()} TO PASS`, tone: 'jade', timer: 1.6 };
  return dish;
}

export function findNearestStation(x, z, maxDist = 1.65) {
  let [best, bestDist] = [null, maxDist];
  for (const st of KITCHEN_STATIONS) {
    const d = dist2D(x, z, st.x, st.z);
    if (d < bestDist) { bestDist = d; best = st; }
  }
  return best;
}

export function interactWithStation(state, stationId, audio) {
  const st = KITCHEN_STATIONS.find((s) => s.id === stationId);
  if (!st) return false;
  if (st.kind === 'crate') {
    state.chef.holding = st.item;
    state.chef.prepped = false;
    state.chef.cookedDish = null;
    state.feedbackBanner = { text: `PICKED ${st.label}`, tone: 'jade', timer: 1.1 };
    if (audio) audio.playPickup();
    return true;
  }
  if (st.kind === 'chop') return Boolean(triggerChopFeel(state, audio));
  if (st.id === 'wok_left') {
    if (triggerWokToss(state, 'wok_left', audio) && state.chef.holding && state.chef.prepped) cookHeldDish(state, 'Wok Sear', 'Chili Crisp');
    return true;
  }
  if (st.id === 'wok_right') {
    triggerWokToss(state, 'wok_right', audio);
    if (state.chef.holding) cookHeldDish(state, 'Wok Sear', 'Chili Crisp');
    return true;
  }
  if (st.kind === 'steamer') {
    state.stations.steamer.active = true;
    state.stations.steamer.progress = Math.min(1, state.stations.steamer.progress + 0.35);
    spawnSteam(state, -0.45, 1.55, -3.15);
    cookHeldDish(state, 'Bamboo Steam', 'Black Vinegar');
    if (audio) audio.playSteam();
    return true;
  }
  if (st.kind === 'island') {
    const isl = state.stations.island;
    isl.step = Math.min(isl.maxSteps, isl.step + 1);
    isl.progress = isl.step / isl.maxSteps;
    isl.label = `PEKING DUCK · ${isl.step}/${isl.maxSteps}`;
    cookHeldDish(state, 'Island Carve', 'Plum Glaze');
    if (audio) audio.playChop();
    if (isl.step >= isl.maxSteps) enterFinishingPass(state);
    return true;
  }
  return st.kind === 'pass' ? serveBestOrder(state, audio) > 0 : false;
}
