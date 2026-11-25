export const SHARED_BATCH_ITEMS = {
  chili: { id: 'chili', title: 'Chili Crisp Batch', short: 'CHILI', chargesPerChop: 2, bonusTip: 10, bases: ['Prawn', 'Noodles'] },
  bokchoy: { id: 'bokchoy', title: 'Scallion-Bokchoy Prep', short: 'GREENS', chargesPerChop: 2, bonusTip: 10, bases: ['Noodles', 'Dumplings', 'Duck'] },
};

export function createBatchPrepState() {
  return {
    chili: 0,
    bokchoy: 0,
    prepStreak: 0,
    totalBatches: 0,
  };
}

export function isSharedBatchItem(itemId) {
  return Boolean(itemId && Object.hasOwn(SHARED_BATCH_ITEMS, itemId));
}

export function stockBatchPrep(state, itemId, chopBonus = 0) {
  const spec = SHARED_BATCH_ITEMS[itemId];
  if (!spec) return 0;
  if (!state.batchPrep) state.batchPrep = createBatchPrepState();
  const extra = chopBonus >= 6 ? 1 : 0;
  state.batchPrep[itemId] = Math.min(6, (state.batchPrep[itemId] || 0) + spec.chargesPerChop + extra);
  state.batchPrep.prepStreak = (state.batchPrep.prepStreak || 0) + 1;
  state.batchPrep.totalBatches = (state.batchPrep.totalBatches || 0) + 1;
  return state.batchPrep[itemId];
}

export function consumeBatchPrepForDish(state, recipe) {
  const bp = state.batchPrep;
  if (!bp || !recipe) return { consumed: false, bonusTip: 0, label: '' };
  const base = recipe.base || '';
  for (const key of ['chili', 'bokchoy']) {
    const spec = SHARED_BATCH_ITEMS[key];
    if ((bp[key] || 0) > 0 && spec.bases.includes(base)) {
      bp[key] -= 1;
      return { consumed: true, bonusTip: spec.bonusTip, label: spec.short };
    }
  }
  return { consumed: false, bonusTip: 0, label: '' };
}

export function getBatchSummaryLabel(state) {
  const bp = state?.batchPrep;
  if (!bp) return '';
  const parts = [];
  if (bp.chili > 0) parts.push(`CHILI x${bp.chili}`);
  if (bp.bokchoy > 0) parts.push(`GREENS x${bp.bokchoy}`);
  return parts.length > 0 ? `BATCH: ${parts.join(' · ')}` : '';
}
