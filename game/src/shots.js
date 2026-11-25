export const SHOTS_VERSION = 1;

import { spawnFlame, spawnSmoke, spawnSteam } from './feel/particles.js';

export function applyShotMode(state, searchString) {
  const params = new URLSearchParams(searchString || '');
  const shot = params.get('shot');
  if (!shot) return null;

  state.shotMode = shot;
  state.time = 2.4;

  if (shot === 'hero') {
    state.mode = 'kitchen';
    state.clockSec = 100;
    state.nextCrateIds = ['crate_chili', 'crate_prawn'];
    state.stations.chop.flashTimer = 0.85;
    state.stations.wokLeft.scorched = true;
    state.stations.wokRight.heatCombo = 6;
    state.stations.wokRight.sweetPhase = 0.5;
    state.stations.island.step = 2;
    state.stations.island.progress = 0.67;
    state.stations.island.label = 'PEKING DUCK · 2/3';
    for (let i = 0; i < 6; i++) {
      spawnSmoke(state, -3.05, 1.2 + i * 0.14, -3.15);
      spawnFlame(state, -1.75, 1.05 + i * 0.08, -3.15);
      spawnSteam(state, -0.45, 1.55 + i * 0.12, -3.15);
    }
    return shot;
  }

  if (shot === 'finish') {
    state.mode = 'finish';
    state.finishing.selectedSauce = 'plum';
    state.finishing.pourAnim = 0.55;
    return shot;
  }

  if (shot === 'route') {
    state.mode = 'route';
    state.shiftIndex = 1;
    state.nextCrateIds = ['crate_chili', 'crate_prawn'];
    return shot;
  }

  if (shot === 'ledger') {
    state.mode = 'ledger';
    state.ledger.dishesServed = 8;
    state.ledger.avgPrice = 50;
    state.ledger.basePay = 400;
    state.ledger.heatCombo = 6;
    state.ledger.heiBonus = 100;
    state.ledger.scorchPenalty = 20;
    state.ledger.grossSubtotal = 500;
    state.ledger.netPay = 480;
    state.ledger.stars = 3;
    return shot;
  }

  return null;
}
