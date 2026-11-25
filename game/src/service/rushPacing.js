export const SHIFT_LIST = ['SHIFT 1 · ALLEY', 'SHIFT 2 · LANTERN HALL', 'SHIFT 3 · BANQUET'];

import { SHIFT_ALLEY_CART } from '../shifts/shiftAlleyCart.js';
import { SHIFT_LANTERN_HALL } from '../shifts/shiftLanternHall.js';
import { SHIFT_GRAND_BANQUET } from '../shifts/shiftGrandBanquet.js';
import { recordLateOrderPenalty } from './scoringLedger.js';

const SHIFTS = [SHIFT_ALLEY_CART, SHIFT_LANTERN_HALL, SHIFT_GRAND_BANQUET];

export function getActiveShift(state) {
  return SHIFTS[state.shiftIndex % SHIFTS.length];
}

export function getRushPressureMultiplier(state) {
  const shift = getActiveShift(state);
  const progress = 1 - Math.max(0, Math.min(1, state.clockSec / Math.max(1, shift.durationSec)));
  return Number((1.0 + progress * 0.45 * shift.scorchRate).toFixed(2));
}

export function getTicketUrgencyBand(timeLeft, maxTime) {
  const ratio = Math.max(0, Math.min(1, timeLeft / Math.max(1, maxTime)));
  if (timeLeft <= 8 || ratio <= 0.25) return 'red';
  if (timeLeft <= 16 || ratio <= 0.5) return 'amber';
  return 'green';
}

export function computeComboDecayRate(state) {
  const heat = state.stations?.wokRight?.heatCombo || 1;
  return heat >= 6 ? 0.14 : 0.08;
}

export function canSpawnVipTicket(state) {
  const existingVip = (state.orders || []).filter((o) => o.vip).length;
  return state.shiftIndex >= 1 && existingVip < 2;
}

export function applyLateOrderPenalty(state, audio) {
  recordLateOrderPenalty(state, 15);
  state.stations.wokRight.heatCombo = 1;
  state.stations.wokRight.callout = 'WOK HEI x1 · SEAR!';
  state.ledger.heatMult = 1;
  state.feedbackBanner = { text: 'LATE ORDER -$15', tone: 'crimson', timer: 1.8 };
  if (audio) audio.playScorchWarn();
}

export function stepShiftClock(state, dt, audio) {
  state.clockSec = Math.max(0, state.clockSec - dt);
  if (state.clockSec <= 0 && state.mode === 'kitchen') {
    state.mode = 'ledger';
    if (audio) audio.playShiftFanfare();
  }
}

export function advanceToNextShift(state, audio) {
  state.shiftIndex = (state.shiftIndex + 1) % SHIFTS.length;
  const shift = getActiveShift(state);
  state.clockSec = shift.durationSec;
  state.mode = 'kitchen';
  if (audio) audio.playBell();
}
