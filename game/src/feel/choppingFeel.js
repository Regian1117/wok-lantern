export function triggerChopFeel(state, audio) {
  if (!state.chef.holding) {
    state.feedbackBanner = { text: 'NEED INGREDIENT', tone: 'crimson', timer: 1.4 };
    if (audio) audio.playScorchWarn();
    return null;
  }
  const evalRes = evaluateChopWindow(state.chopMeter);
  const item = state.chef.holding;
  state.chef.chopAnim = 1.0;
  state.stations.chop.flashTimer = CHOP_FLASH_DURATION;
  state.stations.chop.hitstop = 0.05;
  state.stations.chop.lastLabel = evalRes.label;
  state.stations.chop.choppedItem = item;

  if (isSharedBatchItem(item)) {
    stockBatchPrep(state, item, evalRes.bonus);
    state.chef.holding = null;
    state.chef.prepped = false;
    state.feedbackBanner = { text: `${evalRes.label} · ${getBatchSummaryLabel(state)}`, tone: 'jade', timer: 1.5 };
  } else {
    state.chef.prepped = true;
    state.feedbackBanner = { text: `${evalRes.label} (${String(item).toUpperCase()})`, tone: 'jade', timer: 1.2 };
    if (item === 'duck') {
      const isl = state.stations.island;
      if (isl.step < isl.maxSteps) {
        isl.step += 1;
        isl.progress = isl.step / isl.maxSteps;
        isl.label = `PEKING DUCK · ${isl.step}/${isl.maxSteps}`;
      }
    }
  }
  emitChopBurst(state);
  if (audio) audio.playChop();
  return evalRes;
}

import { spawnSparks } from './particles.js';
import { isSharedBatchItem, stockBatchPrep, getBatchSummaryLabel } from '../recipes/batchPrep.js';

export const CHOP_FLASH_DURATION = 0.65;

export function evaluateChopWindow(chopMeter = 0.5) {
  const dist = Math.abs((Number(chopMeter) || 0) - 0.5);
  if (dist <= 0.14) return { grade: 'PERFECT', label: 'CHOP! PERFECT', bonus: 6 };
  if (dist <= 0.28) return { grade: 'GOOD', label: 'CHOP! GOOD', bonus: 3 };
  return { grade: 'ROUGH', label: 'CHOP! ROUGH', bonus: 0 };
}

export function stepChopMeter(state, dt) {
  if (state.shotMode) return;
  let next = (state.chopMeter ?? 0.5) + (state.chopDir ?? 1) * 1.45 * dt;
  if (next >= 1) {
    next = 1;
    state.chopDir = -1;
  } else if (next <= 0) {
    next = 0;
    state.chopDir = 1;
  }
  state.chopMeter = next;
}

export function emitChopBurst(state) {
  spawnSparks(state, -4.65, 1.12, 0.85, 8);
}

export function getChopRingPulse(state) {
  const timer = state.stations?.chop?.flashTimer || 0;
  if (timer <= 0) return { active: false, scale: 1 };
  return { active: true, scale: 1.0 + (1 - timer / CHOP_FLASH_DURATION) * 0.25 };
}

export function getCleaverSwingAngle(chopAnim) {
  return Math.sin(Math.max(0, Math.min(1, chopAnim)) * Math.PI) * 1.15;
}

export function stepChopFeel(state, dt) {
  stepChopMeter(state, dt);
  if (state.chef.chopAnim > 0) state.chef.chopAnim = Math.max(0, state.chef.chopAnim - dt * 3.2);
  if (state.stations.chop.flashTimer > 0) state.stations.chop.flashTimer = Math.max(0, state.stations.chop.flashTimer - dt);
  if (state.stations.chop.hitstop > 0) state.stations.chop.hitstop = Math.max(0, state.stations.chop.hitstop - dt);
  if (state.feedbackBanner) {
    state.feedbackBanner.timer -= dt;
    if (state.feedbackBanner.timer <= 0) state.feedbackBanner = null;
  }
}
