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
  if (actions.KeyV && state.mode !== 'finish') state.povMode = state.povMode === 'diagonal' ? 'overhead' : 'diagonal';
  if (actions.Escape && state.mode !== 'kitchen') { state.mode = 'kitchen'; return; }
  if (state.mode === 'finish') {
    for (let i = 0; i < 4; i++) if (actions[`Digit${i + 1}`]) applyFinishingSauce(state, SAUCE_KEYS[i], audio);
    if (actions.Space) completeFinishingPass(state, audio);
    if (actions.KeyF) state.mode = 'kitchen';
    return;
  }
  if (state.mode === 'ledger') { if (actions.Space || actions.Enter) advanceToNextShift(state, audio); return; }
  if (actions.KeyR || actions.Tab) { state.mode = state.mode === 'route' ? 'kitchen' : 'route'; return; }
  if (state.mode === 'route') {
    for (let i = 0; i < 3; i++) if (actions[`Digit${i + 1}`]) state.shiftIndex = i;
    return;
  }
  if (actions.KeyF) { enterFinishingPass(state); return; }

  const near = state.chef.nearestStation;
  if (actions.KeyE) {
    if (near) interactWithStation(state, near.id, audio);
    else state.feedbackBanner = { text: 'MOVE OR CLICK A STATION', tone: 'amber', timer: 1.2 };
  }
  if (actions.Space) {
    if (near && ['chop', 'wok_left', 'wok_right', 'pass'].includes(near.id)) interactWithStation(state, near.id, audio);
    else if (near && near.id === 'island') {
      if (state.stations.island.step >= state.stations.island.maxSteps) enterFinishingPass(state);
      else interactWithStation(state, 'island', audio);
    } else if (state.chef.cookedDish && near && near.id === 'pass') serveBestOrder(state, audio);
    else if (state.stations.island.step >= state.stations.island.maxSteps) enterFinishingPass(state);
    else state.feedbackBanner = { text: 'WALK TO PASS TO SERVE', tone: 'amber', timer: 1.2 };
  }
}

export function stepSimulation(state, rawDt, input, audio) {
  const dt = clamp(rawDt, 0.001, MAX_SIM_DT);
  state.time += dt;
  handleModeInputs(state, input ? input.consumeActions() : {}, audio);

  if (state.shotMode) { stepParticles(state, dt * 0.5); return; }
  if (state.mode === 'kitchen') {
    const mv = input ? input.getMoveVector() : { x: 0, z: 0 };
    if (Math.abs(mv.x) > 0.01 || Math.abs(mv.z) > 0.01) {
      state.chef.waypoints = [];
      state.chef.targetStation = null;
      moveChefWithCollision(state.chef, mv.x, mv.z, dt);
    } else if (state.chef.waypoints.length > 0) {
      const wp = state.chef.waypoints[0];
      const [dx, dz] = [wp.x - state.chef.x, wp.z - state.chef.z];
      const dist = Math.hypot(dx, dz);
      if (dist < 0.16) {
        state.chef.waypoints.shift();
        if (state.chef.waypoints.length === 0 && state.chef.targetStation) {
          interactWithStation(state, state.chef.targetStation, audio);
          state.chef.targetStation = null;
        }
      } else moveChefWithCollision(state.chef, dx / dist, dz / dist, dt);
    }
    state.chef.nearestStation = findNearestStation(state.chef.x, state.chef.z, 1.55);
    stepOrderTimers(state, dt, audio);
    stepShiftClock(state, dt, audio);
  } else if (state.mode === 'finish') {
    state.finishing.pourAnim = (state.finishing.pourAnim + dt * 0.85) % 1.0;
  }

  stepChopFeel(state, dt);
  stepWokFeel(state, dt, audio);
  computeActiveRoute(state);

  if (state.rng() < dt * 8) spawnSteam(state, -0.45, 1.45, -3.15);
  if (state.rng() < dt * 10) spawnFlame(state, -1.75, 1.05, -3.15);
  const wl = state.stations.wokLeft.stage;
  if (state.stations.wokLeft.active && (wl === 'smoke' || wl === 'scorched') && state.rng() < dt * 9) {
    spawnSmoke(state, -3.05, 1.2, -3.15);
  }
  stepParticles(state, dt);
}
