export const POINTER_INPUT_ID = 'pointerClickMove';

import { hitTestHud } from '../ui/hudTheme.js';
import { planChefPath } from '../kitchen/navigation.js';
import { findNearestStation, interactWithStation } from '../kitchen/stations.js';
import { applyFinishingSauce, completeFinishingPass, enterFinishingPass } from '../recipes/finishingPass.js';
import { toggleUpgrade } from '../shifts/upgrades.js';
import { advanceToNextShift, getActiveShift } from '../service/rushPacing.js';
import { serveBestOrder } from '../service/orderBoard.js';
import { createFreshStartOrders } from '../core/state.js';

function switchShiftFromModal(state, idx, audio) {
  state.shiftIndex = idx;
  state.clockSec = getActiveShift(state).durationSec;
  state.orders = createFreshStartOrders(state.rng, idx);
  state.mode = 'kitchen';
  if (audio) audio.playPickup();
}

function handleHudAction(hit, state, audio) {
  const id = hit.id;
  if (id === 'dock_sfx') { state.audioMuted = !state.audioMuted; if (audio) audio.setMuted(state.audioMuted); }
  else if (id === 'dock_route') state.mode = state.mode === 'route' ? 'kitchen' : 'route';
  else if (id === 'dock_pov') state.povMode = state.povMode === 'diagonal' ? 'overhead' : 'diagonal';
  else if (id === 'dock_finish') enterFinishingPass(state);
  else if (id === 'dock_serve') serveBestOrder(state, audio);
  else if (id === 'dock_wok') {
    if (state.chef.nearestStation) interactWithStation(state, state.chef.nearestStation.id, audio);
    else state.feedbackBanner = { text: 'WALK TO A STATION FIRST', tone: 'amber', timer: 1.2 };
  }
  else if (id.startsWith('sauce_')) applyFinishingSauce(state, id.slice(6), audio);
  else if (id === 'finish_serve_bell') completeFinishingPass(state, audio);
  else if (id === 'finish_back' || id === 'route_close') state.mode = 'kitchen';
  else if (id.startsWith('route_shift_')) switchShiftFromModal(state, Number(id.slice(12)) || 0, audio);
  else if (id.startsWith('upgrade_')) toggleUpgrade(state, id.slice(8), audio);
  else if (id === 'ledger_next') advanceToNextShift(state, audio);
}

export function attachPointerInput(hudCanvas, rendererApi, state, audio) {
  function onPointerDown(e) {
    if (audio) audio.unlock();
    const rect = hudCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = hitTestHud(state.hudRects, x, y);
    if (hit) { handleHudAction(hit, state, audio); return; }
    if (state.mode !== 'kitchen' || !rendererApi) return;
    const wp = rendererApi.raycastFloor((x / Math.max(1, rect.width)) * 2 - 1, -((y / Math.max(1, rect.height)) * 2 - 1));
    if (!wp) return;
    const st = findNearestStation(wp.x, wp.z, 1.45);
    state.chef.targetStation = st ? st.id : null;
    state.chef.waypoints = planChefPath(state.chef.x, state.chef.z, st ? st.interactX : wp.x, st ? st.interactZ : wp.z);
  }
  hudCanvas.addEventListener('pointerdown', onPointerDown);
  return () => hudCanvas.removeEventListener('pointerdown', onPointerDown);
}
