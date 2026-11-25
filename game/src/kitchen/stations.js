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
import { spawnSparks, spawnSteam } from '../feel/particles.js';

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
    if (audio) audio.playPickup();
    return true;
  }
  if (st.kind === 'chop') {
    triggerChopFeel(state, audio);
    spawnSparks(state, -4.65, 1.15, 0.85, 8);
    return true;
  }
  if (st.id === 'wok_left' || st.id === 'wok_right') {
    triggerWokToss(state, st.id, audio);
    return true;
  }
  if (st.kind === 'steamer') {
    state.stations.steamer.active = true;
    state.stations.steamer.progress = Math.min(1, state.stations.steamer.progress + 0.35);
    spawnSteam(state, -0.45, 1.55, -3.15);
    if (audio) audio.playSteam();
    return true;
  }
  if (st.kind === 'island') {
    const isl = state.stations.island;
    isl.step = Math.min(isl.maxSteps, isl.step + 1);
    isl.progress = isl.step / isl.maxSteps;
    isl.label = `PEKING DUCK · ${isl.step}/${isl.maxSteps}`;
    if (audio) audio.playChop();
    if (isl.step >= isl.maxSteps) {
      enterFinishingPass(state);
    }
    return true;
  }
  if (st.kind === 'pass') {
    serveBestOrder(state, audio);
    return true;
  }
  return false;
}
