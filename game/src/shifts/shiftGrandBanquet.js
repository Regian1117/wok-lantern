export const SHIFT_GRAND_BANQUET = {
  index: 2,
  id: 'banquet',
  title: 'SHIFT 3 · BANQUET',
  subtitle: 'Imperial VIP Rush',
  status: 'NEXT',
  durationSec: 140,
  targetPay: 650,
  orderSpawnRate: 7,
  scorchRate: 1.25,
};

export const BANQUET_WAVES = [
  { id: 'royal_seating', startSec: 0, endSec: 45, label: 'Imperial Seating', doubleVip: false, paceScale: 1.15 },
  { id: 'twin_banquet', startSec: 45, endSec: 100, label: 'Double-VIP Banquet', doubleVip: true, paceScale: 1.35 },
  { id: 'emperor_toast', startSec: 100, endSec: 140, label: 'Grand Lantern Toast', doubleVip: true, paceScale: 1.5 },
];

export const HIGH_ROLLER_TIERS = [
  { id: 'imperial_duck', recipeId: 'vip_peking_duck', basePay: 74, tipBonus: 24 },
  { id: 'drunken_prawn', recipeId: 'chili_prawn', basePay: 46, tipBonus: 14 },
  { id: 'jade_dumpling', recipeId: 'xiaolongbao', basePay: 38, tipBonus: 12 },
];

export const MASTER_TARGETS = {
  oneStar: 420,
  twoStar: 560,
  threeStar: 720,
  zeroScorchBonus: 60,
};

export function getBanquetWaveState(elapsedSec) {
  const sec = Math.max(0, Number(elapsedSec) || 0);
  const activeWave =
    BANQUET_WAVES.find((w) => sec >= w.startSec && sec < w.endSec) || BANQUET_WAVES[BANQUET_WAVES.length - 1];
  const parallelSteamerBoost = activeWave.doubleVip ? 1.25 : 1.0;
  return {
    activeWave,
    parallelSteamerBoost,
    highRollerTiers: HIGH_ROLLER_TIERS,
    masterTargets: MASTER_TARGETS,
  };
}
