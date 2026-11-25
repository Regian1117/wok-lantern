export function recordDishServe(state, dishPrice, tipAmount = 0) {
  const l = state.ledger;
  l.dishesServed += 1;
  l.basePay += Math.max(0, Math.round(dishPrice + tipAmount));
  return recomputeLedger(state);
}

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
  l.latePenaltyTotal = Math.max(0, Math.round(l.latePenaltyTotal || 0));
  l.heatMult = state.stations?.wokRight?.heatCombo || l.heatMult || 1;
  l.grossSubtotal = l.basePay + l.heiBonus;
  l.netPay = l.grossSubtotal - l.scorchPenalty - l.latePenaltyTotal;
  l.avgPrice = l.dishesServed > 0 ? Math.round(l.basePay / l.dishesServed) : 50;
  l.stars = calculateStarRating(l.netPay, 450);
  return l;
}

export function recordWokHeiBonus(state, comboLevel, baseBonus = 5) {
  const l = state.ledger;
  const mult = Math.max(1, Number(comboLevel) || 1);
  l.heatCombo = Math.max(l.heatCombo, mult);
  l.heatMult = mult;
  l.heiBonus += Math.round(mult * baseBonus);
  return recomputeLedger(state);
}

export function recordScorchPenalty(state, amount = 20) {
  const l = state.ledger;
  l.scorchCount += 1;
  l.scorchPenalty += Math.max(0, Math.round(amount));
  return recomputeLedger(state);
}

export function recordLateOrderPenalty(state, amount = 15) {
  const l = state.ledger;
  l.lateOrderCount = (l.lateOrderCount || 0) + 1;
  l.latePenaltyTotal = (l.latePenaltyTotal || 0) + Math.max(0, Math.round(amount));
  return recomputeLedger(state);
}

export function formatLedgerStrip(ledger) {
  const extraLate = ledger.latePenaltyTotal > 0 ? ` − $${ledger.latePenaltyTotal} LATE` : '';
  return `$${ledger.basePay} + $${ledger.heiBonus} WOK HEI − $${ledger.scorchPenalty} SCORCH${extraLate} = $${ledger.netPay}`;
}

export function buildShiftSummaryRows(ledger) {
  const rows = [
    { label: `DISHES SERVED (${ledger.dishesServed} x $${ledger.avgPrice})`, val: `+$${ledger.basePay}`, tone: 'ink' },
    { label: `WOK HEI COMBO x${ledger.heatCombo}`, val: `+$${ledger.heiBonus}`, tone: 'jade' },
    { label: 'GROSS SUBTOTAL', val: `$${ledger.grossSubtotal}`, tone: 'vip', bold: true },
    { label: 'BURNT CHILI', val: `-$${ledger.scorchPenalty}`, tone: 'crimson' },
  ];
  if (ledger.latePenaltyTotal > 0) {
    rows.push({ label: `LATE ORDERS (${ledger.lateOrderCount})`, val: `-$${ledger.latePenaltyTotal}`, tone: 'crimson' });
  }
  return rows;
}
