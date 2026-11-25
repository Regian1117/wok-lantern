export const POINTER_INPUT_ID = 'pointerClickMove';

import { hitTestHud } from '../ui/hudTheme.js';
import { planChefPath } from '../kitchen/navigation.js';
import { findNearestStation, interactWithStation } from '../kitchen/stations.js';
import { applyFinishingSauce, completeFinishingPass, enterFinishingPass } from '../recipes/finishingPass.js';
import { toggleUpgrade } from '../shifts/upgrades.js';
import { advanceToNextShift } from '../service/rushPacing.js';
import { serveBestOrder } from '../service/orderBoard.js';

function handleHudAction(hit, state, audio) {
  const id = hit.id;
  if (id === 'dock_sfx') {
    state.audioMuted = !state.audioMuted;
    if (audio) audio.setMuted(state.audioMuted);
  } else if (id === 'dock_route') {
    state.mode = state.mode === 'route' ? 'kitchen' : 'route';
  } else if (id === 'dock_finish') {
    enterFinishingPass(state);
  } else if (id === 'dock_serve') {
    serveBestOrder(state, audio);
  } else if (id === 'dock_wok') {
    interactWithStation(state, 'wok_right', audio);
  } else if (id.startsWith('sauce_')) {
    applyFinishingSauce(state, id.slice(6), audio);
  } else if (id === 'finish_serve_bell') {
    completeFinishingPass(state, audio);
  } else if (id === 'finish_back' || id === 'route_close') {
    state.mode = 'kitchen';
  } else if (id.startsWith('route_shift_')) {
    state.shiftIndex = Number(id.slice(12)) || 0;
  } else if (id.startsWith('upgrade_')) {
    toggleUpgrade(state, id.slice(8), audio);
  } else if (id === 'ledger_next') {
    advanceToNextShift(state, audio);
  }
}

export function attachPointerInput(hudCanvas, rendererApi, state, audio) {
  function toCanvasCoords(e) {
    const rect = hudCanvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / Math.max(1, rect.width)) * rect.width,
      y: ((e.clientY - rect.top) / Math.max(1, rect.height)) * rect.height,
      ndcX: ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
      ndcY: -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1),
    };
  }

  function onPointerDown(e) {
    if (audio) audio.unlock();
    const pt = toCanvasCoords(e);
    const hit = hitTestHud(state.hudRects, pt.x, pt.y);
    if (hit) {
      handleHudAction(hit, state, audio);
      return;
    }
    if (state.mode !== 'kitchen' || !rendererApi) return;
    const worldPt = rendererApi.raycastFloor(pt.ndcX, pt.ndcY);
    if (!worldPt) return;
    const station = findNearestStation(worldPt.x, worldPt.z, 1.45);
    const destX = station ? station.interactX : worldPt.x;
    const destZ = station ? station.interactZ : worldPt.z;
    state.chef.targetStation = station ? station.id : null;
    state.chef.waypoints = planChefPath(state.chef.x, state.chef.z, destX, destZ);
  }

  hudCanvas.addEventListener('pointerdown', onPointerDown);
  return () => hudCanvas.removeEventListener('pointerdown', onPointerDown);
}
