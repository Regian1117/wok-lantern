export const GAME_TITLE = 'Wok & Lantern';

import { createGameState } from './core/state.js';
import { stepSimulation } from './core/loop.js';
import { createKitchenSynth } from './audio/kitchenSynth.js';
import { createKeyboardInput } from './input/keyboard.js';
import { attachPointerInput } from './input/pointerClickMove.js';
import { createWorldRenderer } from './render3d/renderer.js';
import { clearHitboxes } from './ui/hudTheme.js';
import { drawOrderBoardHud } from './ui/orderBoardHud.js';
import { drawStationCallouts } from './ui/stationCallouts.js';
import { drawControlDock } from './ui/controlDock.js';
import { drawFinishingPassOverlay } from './ui/finishingPassOverlay.js';
import { drawRecipeRouteModal } from './ui/recipeRouteModal.js';
import { drawShiftLedgerModal } from './ui/shiftLedgerModal.js';
import { applyShotMode } from './shots.js';

function boot() {
  const glCanvas = document.getElementById('gl');
  const hudCanvas = document.getElementById('hud');
  const hudCtx = hudCanvas.getContext('2d');

  const params = new URLSearchParams(window.location.search);
  const seed = Number(params.get('seed')) || 1;
  const state = createGameState(seed);
  applyShotMode(state, window.location.search);

  const audio = createKitchenSynth();
  const keyboard = createKeyboardInput();
  const rendererApi = createWorldRenderer(glCanvas);
  attachPointerInput(hudCanvas, rendererApi, state, audio);

  let cssW = 1280;
  let cssH = 720;

  function syncSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW = Math.max(320, window.innerWidth);
    cssH = Math.max(240, window.innerHeight);
    hudCanvas.width = Math.round(cssW * dpr);
    hudCanvas.height = Math.round(cssH * dpr);
    hudCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rendererApi.resize(cssW, cssH);
  }

  syncSize();
  window.addEventListener('resize', syncSize);

  function drawHud() {
    hudCtx.clearRect(0, 0, cssW, cssH);
    clearHitboxes(state);
    state.hudBounds = {};

    if (state.mode !== 'finish') {
      drawOrderBoardHud(hudCtx, state, cssW);
      drawStationCallouts(hudCtx, state, rendererApi, cssW, cssH);
      drawControlDock(hudCtx, state, cssW, cssH);
      drawRecipeRouteModal(hudCtx, state, cssW, cssH);
      drawShiftLedgerModal(hudCtx, state, cssW, cssH);
    } else {
      drawFinishingPassOverlay(hudCtx, state, cssW, cssH);
    }
    window.__HUD_BOUNDS = state.hudBounds;
  }

  window.__GAME = { state, audio, rendererApi };

  let lastTs = performance.now();
  function frame(now) {
    const dt = (now - lastTs) / 1000;
    lastTs = now;
    stepSimulation(state, dt, keyboard, audio);
    rendererApi.renderFrame(state);
    drawHud();
    window.__RENDER_OK = true;
    requestAnimationFrame(frame);
  }

  rendererApi.renderFrame(state);
  drawHud();
  window.__RENDER_OK = true;
  requestAnimationFrame(frame);
}

boot();
