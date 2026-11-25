export const MAX_SIM_DT = 0.05;

import { clamp } from './math.js';
import { moveChefWithCollision } from '../kitchen/navigation.js';
import { findNearestStation, interactWithStation } from '../kitchen/stations.js';
import { computeActiveRoute } from '../kitchen/routing.js';
import { stepChopFeel } from '../feel/choppingFeel.js';
import { stepWokFeel } from '../feel/wokTossFeel.js';
import { stepParticles, spawnSteam, spawnSmoke, spawnFlame } from '../feel/particles.js';
import { stepOrderTimers, serveBestOrder } from '../service/orderBoard.js';
import { stepShiftClock, advanceToNextShift } from '../service/rushPacing.js';
import { applyFinishingSauce, completeFinishingPass, enterFinishingPass } from '../recipes/finishingPass.js';

const SAUCE_KEYS = ['plum', 'chili', 'scallion', 'sesame'];

function handleModeInputs(state, actions, audio) {
  if (actions.KeyM) {
    state.audioMuted = !state.audioMuted;
    if (audio) audio.setMuted(state.audioMuted);
  }
  if (actions.Escape && state.mode !== 'kitchen') {
    state.mode = 'kitchen';
    return;
  }
  if (state.mode === 'finish') {
    if (actions.Digit1) applyFinishingSauce(state, SAUCE_KEYS[0], audio);
    if (actions.Digit2) applyFinishingSauce(state, SAUCE_KEYS[1], audio);
    if (actions.Digit3) applyFinishingSauce(state, SAUCE_KEYS[2], audio);
    if (actions.Digit4) applyFinishingSauce(state, SAUCE_KEYS[3], audio);
    if (actions.Space) completeFinishingPass(state, audio);
    if (actions.KeyF) state.mode = 'kitchen';
    return;
  }
  if (state.mode === 'ledger') {
    if (actions.Space || actions.Enter) advanceToNextShift(state, audio);
    return;
  }
  if (actions.KeyR || actions.Tab || actions.Digit1 || actions.Digit2 || actions.Digit3) {
    if (state.mode === 'route') {
      if (actions.Digit1) state.shiftIndex = 0;
      else if (actions.Digit2) state.shiftIndex = 1;
      else if (actions.Digit3) state.shiftIndex = 2;
      else state.mode = 'kitchen';
    } else {
      state.mode = 'route';
    }
    return;
  }
  if (actions.KeyF) {
    enterFinishingPass(state);
    return;
  }
  if (actions.KeyE) {
    const targetId = state.chef.nearestStation ? state.chef.nearestStation.id : 'wok_right';
    interactWithStation(state, targetId, audio);
  }
  if (actions.Space) {
    if (state.stations.island.step >= state.stations.island.maxSteps) {
      enterFinishingPass(state);
    } else {
      serveBestOrder(state, audio);
    }
  }
}

export function stepSimulation(state, rawDt, input, audio) {
  const dt = clamp(rawDt, 0.001, MAX_SIM_DT);
  state.time += dt;
  const actions = input ? input.consumeActions() : {};
  handleModeInputs(state, actions, audio);

  if (state.shotMode) {
    stepParticles(state, dt * 0.5);
    return;
  }

  if (state.mode === 'kitchen') {
    const moveVec = input ? input.getMoveVector() : { x: 0, z: 0 };
    if (Math.abs(moveVec.x) > 0.01 || Math.abs(moveVec.z) > 0.01) {
      state.chef.waypoints = [];
      state.chef.targetStation = null;
      moveChefWithCollision(state.chef, moveVec.x, moveVec.z, dt);
    } else if (state.chef.waypoints.length > 0) {
      const wp = state.chef.waypoints[0];
      const dx = wp.x - state.chef.x;
      const dz = wp.z - state.chef.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.16) {
        state.chef.waypoints.shift();
        if (state.chef.waypoints.length === 0 && state.chef.targetStation) {
          interactWithStation(state, state.chef.targetStation, audio);
          state.chef.targetStation = null;
        }
      } else {
        moveChefWithCollision(state.chef, dx / dist, dz / dist, dt);
      }
    }
    state.chef.nearestStation = findNearestStation(state.chef.x, state.chef.z, 1.55);
    stepOrderTimers(state, dt, audio);
    stepShiftClock(state, dt, audio);
  } else if (state.mode === 'finish') {
    state.finishing.pourAnim = (state.finishing.pourAnim + dt * 0.85) % 1.0;
  }

  stepChopFeel(state, dt);
  stepWokFeel(state, dt);
  computeActiveRoute(state);

  if (state.rng() < dt * 8) spawnSteam(state, -0.45, 1.45, -3.15);
  if (state.rng() < dt * 10) spawnFlame(state, -1.75, 1.05, -3.15);
  if (state.stations.wokLeft.scorched && state.rng() < dt * 9) {
    spawnSmoke(state, -3.05, 1.2, -3.15);
  }
  stepParticles(state, dt);
}
