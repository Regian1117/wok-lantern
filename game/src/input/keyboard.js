export function createKeyboardInput() {
  const held = new Set();
  const queued = {};
  const ACTION_CODES = new Set([
    'KeyE',
    'Space',
    'KeyF',
    'KeyR',
    'Tab',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'KeyM',
    'Escape',
    'Enter',
  ]);

  function onKeyDown(e) {
    if (ACTION_CODES.has(e.code) || e.code.startsWith('Arrow')) {
      e.preventDefault();
    }
    if (!held.has(e.code) && ACTION_CODES.has(e.code)) {
      queued[e.code] = true;
    }
    held.add(e.code);
  }

  function onKeyUp(e) {
    held.delete(e.code);
  }

  function onBlur() {
    held.clear();
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  return {
    getMoveVector() {
      let x = 0;
      let z = 0;
      if (held.has('KeyA') || held.has('ArrowLeft')) x -= 1;
      if (held.has('KeyD') || held.has('ArrowRight')) x += 1;
      if (held.has('KeyW') || held.has('ArrowUp')) z -= 1;
      if (held.has('KeyS') || held.has('ArrowDown')) z += 1;
      const len = Math.hypot(x, z);
      return len > 1 ? { x: x / len, z: z / len } : { x, z };
    },
    consumeActions() {
      const out = { ...queued };
      for (const k of Object.keys(queued)) delete queued[k];
      return out;
    },
    dispose() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    },
  };
}
