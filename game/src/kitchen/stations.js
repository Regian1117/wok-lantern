export const KITCHEN_STATIONS = [
  { id: 'sink', kind: 'sink', label: 'DOUBLE SINK', x: -4.85, z: -1.75, interactX: -3.85, interactZ: -1.75 },
  { id: 'chop', kind: 'chop', label: 'BUTCHER STUMP', x: -4.65, z: 0.85, interactX: -3.75, interactZ: 0.85 },
  { id: 'wok_left', kind: 'wok', label: 'LEFT WOK', x: -3.05, z: -3.15, interactX: -3.05, interactZ: -2.08 },
  { id: 'wok_right', kind: 'wok', label: 'RIGHT WOK', x: -1.75, z: -3.15, interactX: -1.75, interactZ: -2.08 },
  { id: 'steamer', kind: 'steamer', label: 'BAMBOO STEAMER', x: -0.45, z: -3.15, interactX: -0.45, interactZ: -2.08 },
  { id: 'crate_noodles', kind: 'crate', item: 'noodles', label: 'NOODLES', x: 1.2, z: -3.15, interactX: 1.2, interactZ: -2.08 },
  { id: 'crate_bokchoy', kind: 'crate', item: 'bokchoy', label: 'BOK CHOY', x: 2.55, z: -3.15, interactX: 2.55, interactZ: -2.08 },
  { id: 'crate_chili', kind: 'crate', item: 'chili', label: 'CHILI', x: 3.9, z: -3.15, interactX: 3.7, interactZ: -2.08 },
  { id: 'crate_dumpling', kind: 'crate', item: 'dumplings', label: 'DUMPLINGS', x: 4.75, z: -1.6, interactX: 3.75, interactZ: -1.6 },
  { id: 'crate_prawn', kind: 'crate', item: 'prawn', label: 'PRAWN', x: 4.75, z: -0.15, interactX: 3.75, interactZ: -0.15 },
  { id: 'crate_duck', kind: 'crate', item: 'duck', label: 'DUCK', x: 4.75, z: 1.3, interactX: 3.75, interactZ: 1.3 },
  { id: 'island', kind: 'island', label: 'ASSEMBLY ISLAND', x: 0.1, z: 0.08, interactX: 0.1, interactZ: 1.48 },
  { id: 'pass', kind: 'pass', label: 'SERVICE PASS', x: 0.0, z: 3.22, interactX: 0.0, interactZ: 2.25 },
];

import { dist2D } from '../core/math.js';
import { triggerChopFeel } from '../feel/choppingFeel.js';
import { triggerWokToss } from '../feel/wokTossFeel.js';
import { enterFinishingPass } from '../recipes/finishingPass.js';
import { serveBestOrder } from '../service/orderBoard.js';
import { spawnSteam } from '../feel/particles.js';

const ITEM_TO_BASE = {
  noodles: 'Noodles',
  dumplings: 'Dumplings',
  duck: 'Duck',
  prawn: 'Prawn',
  chili: 'Prawn',
  bokchoy: 'Noodles',
};

function cookHeldDish(state, stationPath, sauce) {
  if (!state.chef.holding || !state.chef.prepped) {
    state.feedbackBanner = { text: 'NEEDS CHOP', tone: 'crimson', timer: 1.5 };
    return null;
  }
  const base = ITEM_TO_BASE[state.chef.holding] || 'Noodles';
  const dish = {
    base,
    stationPath,
    sauce,
    prepared: true,
    finished: stationPath !== 'Island Carve' || base !== 'Duck',
  };
  state.chef.cookedDish = dish;
  state.stations.pass.platedDish = dish;
  state.feedbackBanner = { text: `PLATED ${base.toUpperCase()} (${stationPath.toUpperCase()})`, tone: 'jade', timer: 1.4 };
  return dish;
}

export function findNearestStation(x, z, maxDist = 1.65) {
  let best = null;
  let bestDist = maxDist;
  for (const st of KITCHEN_STATIONS) {
    const d = dist2D(x, z, st.x, st.z);
    if (d < bestDist) {
      bestDist = d;
      best = st;
    }
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
  if (st.kind === 'chop') {
    return Boolean(triggerChopFeel(state, audio));
  }
  if (st.id === 'wok_left') {
    return triggerWokToss(state, st.id, audio);
  }
  if (st.id === 'wok_right') {
    triggerWokToss(state, st.id, audio);
    cookHeldDish(state, 'Wok Sear', 'Chili Crisp');
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
  if (st.kind === 'pass') {
    serveBestOrder(state, audio);
    return true;
  }
  return false;
}
