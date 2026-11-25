export const SHIFT_LANTERN_HALL = {
  index: 1,
  id: 'lantern_hall',
  title: 'SHIFT 2 · LANTERN HALL',
  subtitle: 'Courtyard Wok Kitchen',
  status: 'ACTIVE',
  durationSec: 120,
  targetPay: 450,
  orderSpawnRate: 9,
  scorchRate: 1.0,
};

export const LANTERN_WAVES = [
  { id: 'opening_tables', startSec: 0, endSec: 40, label: 'Hall Opening', pressure: 1.0, vipChance: 0.25 },
  { id: 'peak_courtyard', startSec: 40, endSec: 85, label: 'Lantern Peak Rush', pressure: 1.25, vipChance: 0.45 },
  { id: 'vip_finale', startSec: 85, endSec: 120, label: 'VIP Duck Finale', pressure: 1.4, vipChance: 0.6 },
];

export const VIP_DUCK_SCHEDULE = [24, 58, 92];

export const HEI_BONUS_TIERS = [
  { minCombo: 1, bonusPerDish: 5, label: 'Warm Wok' },
  { minCombo: 3, bonusPerDish: 12, label: 'Blazing Sear' },
  { minCombo: 6, bonusPerDish: 25, label: 'Master Wok Hei' },
];

export const LANTERN_STAR_TARGETS = {
  oneStar: 280,
  twoStar: 390,
  threeStar: 470,
};

export function getLanternHallPhase(elapsedSec) {
  const sec = Math.max(0, Number(elapsedSec) || 0);
  const wave = LANTERN_WAVES.find((w) => sec >= w.startSec && sec < w.endSec) || LANTERN_WAVES[LANTERN_WAVES.length - 1];
  const scorchRisk = 0.85 + Math.min(0.65, (sec / SHIFT_LANTERN_HALL.durationSec) * 0.55);
  const nextVipSec = VIP_DUCK_SCHEDULE.find((t) => t > sec) ?? null;
  return {
    wave,
    scorchRisk: Number(scorchRisk.toFixed(2)),
    nextVipSec,
    starTargets: LANTERN_STAR_TARGETS,
  };
}
