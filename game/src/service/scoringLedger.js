export const LEDGER_VERSION = 1;

export function calculateStarRating(netPay, targetPay = 450) {
  if (netPay >= targetPay) return 3;
  if (netPay >= Math.round(targetPay * 0.62)) return 2;
  return 1;
}

export function recomputeLedger(state) {
  const l = state.ledger;
  l.basePay = Math.max(0, Math.round(l.basePay));
  l.heiBonus = Math.max(0, Math.round(l.heiBonus));
  l.scorchPenalty = Math.max(0, Math.round(l.scorchPenalty));
  l.grossSubtotal = l.basePay + l.heiBonus;
  l.netPay = l.grossSubtotal - l.scorchPenalty;
  l.avgPrice = l.dishesServed > 0 ? Math.round(l.basePay / l.dishesServed) : 50;
  l.stars = calculateStarRating(l.netPay, 450);
  return l;
}

export function recordDishServe(state, dishPrice, tipAmount = 0) {
  const l = state.ledger;
  l.dishesServed += 1;
  l.basePay += Math.max(0, Math.round(dishPrice + tipAmount));
  return recomputeLedger(state);
}

export function recordWokHeiBonus(state, comboLevel, baseBonus = 5) {
  const l = state.ledger;
  const mult = Math.max(1, Number(comboLevel) || 1);
  l.heatCombo = Math.max(l.heatCombo, mult);
  l.heiBonus += Math.round(mult * baseBonus);
  return recomputeLedger(state);
}

export function recordScorchPenalty(state, amount = 20) {
  const l = state.ledger;
  l.scorchCount += 1;
  l.scorchPenalty += Math.max(0, Math.round(amount));
  return recomputeLedger(state);
}

export function formatLedgerStrip(ledger) {
  return `$${ledger.basePay} + $${ledger.heiBonus} HEI − $${ledger.scorchPenalty} SCORCH = $${ledger.netPay}`;
}

export function buildShiftSummaryRows(ledger) {
  return [
    { label: `DISHES SERVED (${ledger.dishesServed} x $${ledger.avgPrice})`, val: `+$${ledger.basePay}`, tone: 'ink' },
    { label: `WOK HEI COMBO x${ledger.heatCombo}`, val: `+$${ledger.heiBonus}`, tone: 'jade' },
    { label: 'GROSS SUBTOTAL', val: `$${ledger.grossSubtotal}`, tone: 'vip', bold: true },
    { label: 'BURNT CHILI', val: `-$${ledger.scorchPenalty}`, tone: 'crimson' },
  ];
}
