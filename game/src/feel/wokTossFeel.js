export const WOK_SWEET_CENTER = 0.5;

import { spawnFlame, spawnSparks } from './particles.js';
import { recomputeLedger, recordScorchPenalty } from '../service/scoringLedger.js';

export function triggerWokToss(state, stationId, audio) {
  state.chef.wokAnim = 1.0;
  if (stationId === 'wok_left') {
    const wl = state.stations.wokLeft;
    const wasScorched = wl.scorched;
    wl.scorched = false;
    wl.active = true;
    wl.stage = 'cool';
    wl.timer = 5.0;
    state.feedbackBanner = { text: wasScorched ? 'WOK RESCUED (5s)' : 'LEFT WOK SEARING!', tone: 'jade', timer: 1.2 };
    if (audio) audio.playWokSear(2);
    spawnFlame(state, -3.05, 1.1, -3.15);
    spawnSparks(state, -3.05, 1.15, -3.15, 6);
    return !wasScorched;
  }
  const wr = state.stations.wokRight;
  wr.active = true;
  const distFromCenter = Math.abs(wr.sweetPhase - wr.sweetCenter);
  const inSweet = distFromCenter <= wr.sweetWidth * 0.7;
  if (inSweet) {
    wr.heatCombo = Math.min(9, wr.heatCombo + 1);
    state.ledger.heiBonus += 15;
    recomputeLedger(state);
  } else {
    wr.heatCombo = Math.max(1, wr.heatCombo);
  }
  wr.callout = `WOK HEI x${wr.heatCombo} · SEAR!`;
  const boost = state.upgrades.jet_wok ? 0.35 : 0.25;
  wr.progress = (wr.progress + boost) % 1.0;
  wr.flashTimer = 0.75;
  spawnFlame(state, -1.75, 1.1, -3.15);
  spawnSparks(state, -1.75, 1.15, -3.15, 7);
  if (audio) audio.playWokSear(wr.heatCombo);
  return inSweet;
}

export function stepWokFeel(state, dt, audio) {
  if (state.chef.wokAnim > 0) state.chef.wokAnim = Math.max(0, state.chef.wokAnim - dt * 2.8);
  const wr = state.stations.wokRight;
  wr.sweetPhase = 0.5 + 0.45 * Math.sin(state.time * 2.6);
  if (wr.flashTimer > 0) wr.flashTimer = Math.max(0, wr.flashTimer - dt);

  const wl = state.stations.wokLeft;
  if (wl.active && wl.stage !== 'scorched') {
    wl.timer -= dt;
    if (wl.timer <= 0) {
      if (wl.stage === 'cool') {
        wl.stage = 'ember';
        wl.timer = 2.5;
      } else if (wl.stage === 'ember') {
        wl.stage = 'smoke';
        wl.timer = 2.5;
      } else {
        wl.stage = 'scorched';
        wl.scorched = true;
        wl.timer = 0;
        recordScorchPenalty(state, 20);
        wr.heatCombo = 1;
        wr.callout = 'WOK HEI x1 · SEAR!';
        state.ledger.heatMult = 1;
        state.feedbackBanner = { text: 'SCORCHED! -$20', tone: 'crimson', timer: 1.8 };
        if (audio) audio.playScorchWarn();
      }
    }
  }
}
