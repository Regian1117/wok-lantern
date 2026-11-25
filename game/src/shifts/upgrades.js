export function toggleUpgrade(state, upgradeId, audio) {
  if (!Object.hasOwn(state.upgrades, upgradeId)) return false;
  state.upgrades[upgradeId] = !state.upgrades[upgradeId];
  if (audio) audio.playPickup();
  return state.upgrades[upgradeId];
}

export const KITCHEN_UPGRADES = [
  {
    id: 'jet_wok',
    label: 'JET WOK (+35% SEAR)',
    fullName: 'JET WOK BURNER (+35% SEAR)',
    cost: 180,
    searMultiplier: 1.35,
    steamerExtra: 0,
    tipMultiplier: 1.0,
  },
  {
    id: 'triple_steamer',
    label: 'TRIPLE STEAMER (+2)',
    fullName: 'TRIPLE BAMBOO STEAMER (+2)',
    cost: 220,
    searMultiplier: 1.0,
    steamerExtra: 2,
    tipMultiplier: 1.0,
  },
  {
    id: 'silk_pass',
    label: 'SILK LANTERN PASS (+20% TIP)',
    fullName: 'SILK LANTERN PASS (+20% TIP)',
    cost: 260,
    searMultiplier: 1.0,
    steamerExtra: 0,
    tipMultiplier: 1.2,
  },
];

export function canAffordUpgrade(state, upgradeId) {
  const up = KITCHEN_UPGRADES.find((u) => u.id === upgradeId);
  if (!up || !state || !state.ledger) return false;
  return state.ledger.netPay >= up.cost;
}

export function getUpgradeMultipliers(state) {
  const flags = (state && state.upgrades) || {};
  return {
    searSpeed: flags.jet_wok ? 1.35 : 1.0,
    steamerCapacity: flags.triple_steamer ? 5 : 3,
    tipBonusFactor: flags.silk_pass ? 1.2 : 1.0,
  };
}

export function getUnlockedUpgradeSummary(state) {
  const flags = (state && state.upgrades) || {};
  return KITCHEN_UPGRADES.filter((u) => Boolean(flags[u.id])).map((u) => u.fullName);
}
