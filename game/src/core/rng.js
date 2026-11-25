export function createRng(seed = 1) {
  let a = (Number(seed) >>> 0) || 1;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const nextRange = (rng, lo, hi) => lo + (hi - lo) * rng();

export const rngRange = nextRange;

export function nextInt(rng, minVal, maxInclusive) {
  const lo = Math.ceil(minVal);
  const hi = Math.floor(maxInclusive);
  if (hi <= lo) return lo;
  return lo + Math.floor(rng() * (hi - lo + 1));
}

export function chance(rng, probability = 0.5) {
  return rng() < probability;
}

export function pickOne(rng, list) {
  if (!list || list.length === 0) return null;
  return list[Math.floor(rng() * list.length)];
}

export const rngPick = pickOne;

export function shuffleCopy(rng, list) {
  const arr = Array.isArray(list) ? list.slice() : [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
