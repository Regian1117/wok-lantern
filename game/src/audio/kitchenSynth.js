export function createKitchenSynth() {
  let ctx = null;
  let muted = false;

  function ensureContext() {
    if (muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      try {
        ctx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function tone(freq, endFreq, dur, type = 'triangle', gainPeak = 0.12, delay = 0) {
    const ac = ensureContext();
    if (!ac) return;
    const now = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + dur);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  function noiseBurst(dur, filterFreq, gainPeak = 0.08) {
    const ac = ensureContext();
    if (!ac) return;
    const len = Math.max(256, Math.floor(ac.sampleRate * dur));
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    const gain = ac.createGain();
    const now = ac.currentTime;
    gain.gain.setValueAtTime(gainPeak, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    src.start(now);
  }

  return {
    unlock: () => ensureContext(),
    setMuted: (m) => {
      muted = Boolean(m);
    },
    isMuted: () => muted,
    playChop: () => {
      tone(220, 75, 0.08, 'triangle', 0.16);
      noiseBurst(0.05, 1600, 0.09);
    },
    playWokSear: (combo = 1) => {
      noiseBurst(0.22, 2400 + combo * 180, 0.1);
      tone(340 + combo * 40, 520 + combo * 50, 0.12, 'sawtooth', 0.06);
    },
    playSteam: () => noiseBurst(0.28, 3200, 0.06),
    playGlazePour: () => tone(290, 480, 0.22, 'sine', 0.09),
    playBell: () => {
      tone(1046, 1046, 0.55, 'sine', 0.14);
      tone(1568, 1568, 0.42, 'sine', 0.07, 0.01);
    },
    playScorchWarn: () => {
      tone(190, 140, 0.18, 'sawtooth', 0.1);
      tone(155, 120, 0.2, 'sawtooth', 0.09, 0.15);
    },
    playPickup: () => tone(420, 620, 0.09, 'triangle', 0.08),
    playShiftFanfare: () => {
      tone(523, 523, 0.18, 'triangle', 0.11, 0);
      tone(659, 659, 0.18, 'triangle', 0.11, 0.11);
      tone(784, 784, 0.22, 'triangle', 0.12, 0.22);
      tone(1046, 1046, 0.42, 'sine', 0.14, 0.34);
    },
  };
}
