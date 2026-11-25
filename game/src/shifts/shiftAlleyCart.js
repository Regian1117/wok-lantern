export const SHIFT_ALLEY_CART = {
  index: 0,
  id: 'alley',
  title: 'SHIFT 1 · ALLEY',
  subtitle: 'Night Market Cart',
  status: 'COMPLETE',
  durationSec: 90,
  targetPay: 300,
  orderSpawnRate: 12,
  scorchRate: 0.7,
};

export const ALLEY_WAVES = [
  { id: 'warm_up', startSec: 0, endSec: 30, label: 'Early Lantern Crowd', spawnMultiplier: 0.85, maxConcurrent: 3 },
  { id: 'snack_rush', startSec: 30, endSec: 65, label: 'Alley Noodle Surge', spawnMultiplier: 1.05, maxConcurrent: 4 },
  { id: 'last_call', startSec: 65, endSec: 90, label: 'Last Call Sizzle', spawnMultiplier: 1.2, maxConcurrent: 4 },
];

export const ALLEY_STAR_THRESHOLDS = {
  oneStar: 180,
  twoStar: 260,
  threeStar: 340,
};

export const ALLEY_STARTER_POOL = ['char_kway_teow', 'xiaolongbao', 'chili_prawn'];

export const ALLEY_HINTS = [
  'Grab Noodles or Dumplings from the right larder crates first.',
  'Press [E] on the sweet spot at the wok to build Wok Hei bonus.',
  'Rescue smoking left woks quickly before scorch penalties stack.',
  'Ring [SPACE] at the marble service pass as soon as dishes plate.',
];

export function evaluateAlleyWave(elapsedSec) {
  const sec = Math.max(0, Number(elapsedSec) || 0);
  for (const wave of ALLEY_WAVES) {
    if (sec >= wave.startSec && sec < wave.endSec) {
      return {
        ...wave,
        hint: ALLEY_HINTS[ALLEY_WAVES.indexOf(wave)] || ALLEY_HINTS[0],
        starterPool: ALLEY_STARTER_POOL,
      };
    }
  }
  const last = ALLEY_WAVES[ALLEY_WAVES.length - 1];
  return { ...last, hint: ALLEY_HINTS[ALLEY_HINTS.length - 1], starterPool: ALLEY_STARTER_POOL };
}
