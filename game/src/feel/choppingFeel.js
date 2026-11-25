export const CHOP_FLASH_DURATION = 0.65;

import { spawnSparks } from './particles.js';

export function evaluateChopWindow(timeSec) {
  const phase = Math.abs(Math.sin((Number(timeSec) || 0) * 3.4));
  if (phase >= 0.45) return { grade: 'PERFECT', label: 'CHOP! PERFECT', bonus: 6 };
  return { grade: 'GOOD', label: 'CHOP! CLEAN', bonus: 3 };
}

export function emitChopBurst(state) {
  spawnSparks(state, -4.65, 1.12, 0.85, 8);
}

export function triggerChopFeel(state, audio) {
  const evalRes = evaluateChopWindow(state.time);
  state.chef.chopAnim = 1.0;
  state.stations.chop.flashTimer = CHOP_FLASH_DURATION;
  state.stations.chop.hitstop = 0.05;
  state.stations.chop.lastLabel = evalRes.label;

  const isl = state.stations.island;
  if (isl.step < isl.maxSteps) {
    isl.step += 1;
    isl.progress = isl.step / isl.maxSteps;
    isl.label = `PEKING DUCK · ${isl.step}/${isl.maxSteps}`;
  }
  emitChopBurst(state);
  if (audio) audio.playChop();
  return evalRes;
}

export function getChopRingPulse(state) {
  const timer = state.stations?.chop?.flashTimer || 0;
  if (timer <= 0) return { active: false, scale: 1 };
  const t = timer / CHOP_FLASH_DURATION;
  return { active: true, scale: 1.0 + (1 - t) * 0.25 };
}

export function getCleaverSwingAngle(chopAnim) {
  return Math.sin(Math.max(0, Math.min(1, chopAnim)) * Math.PI) * 1.15;
}

export function stepChopFeel(state, dt) {
  if (state.chef.chopAnim > 0) {
    state.chef.chopAnim = Math.max(0, state.chef.chopAnim - dt * 3.2);
  }
  if (state.stations.chop.flashTimer > 0) {
    state.stations.chop.flashTimer = Math.max(0, state.stations.chop.flashTimer - dt);
  }
  if (state.stations.chop.hitstop > 0) {
    state.stations.chop.hitstop = Math.max(0, state.stations.chop.hitstop - dt);
  }
}
