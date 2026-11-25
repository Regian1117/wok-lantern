export const PATRON_ROSTER = [
  { id: 'mei', name: 'CRITIC MEI', role: 'VIP CRITIC', tipBonus: 0.25, speedScale: 0.9, vipOnly: true, quote: 'Crisp glaze only!' },
  { id: 'wu', name: 'BROKER WU', role: 'VIP', tipBonus: 0.2, speedScale: 0.95, vipOnly: true, quote: 'Worth top silver.' },
  { id: 'bo', name: 'COURIER BO', role: 'HURRY', tipBonus: 0.1, speedScale: 1.3, vipOnly: false, quote: 'Cycle waiting!' },
  { id: 'fong', name: 'AH-FONG', role: 'REGULAR', tipBonus: 0.08, speedScale: 1.0, vipOnly: false, quote: 'Extra wok hei!' },
  { id: 'yan', name: 'SINGER YAN', role: 'REGULAR', tipBonus: 0.12, speedScale: 0.95, vipOnly: false, quote: 'Warm broth please.' },
  { id: 'chen', name: 'MASTER CHEN', role: 'CRITIC', tipBonus: 0.18, speedScale: 1.05, vipOnly: false, quote: 'Mind the sear.' },
];

export function assignPatronToOrder(order, rng, shiftIndex = 0) {
  const isVip = Boolean(order && (order.vip || order.price >= 68));
  const pool = isVip
    ? PATRON_ROSTER.filter((p) => p.vipOnly || p.role === 'CRITIC')
    : PATRON_ROSTER.filter((p) => !p.vipOnly || shiftIndex >= 1);
  const idx = Math.floor((typeof rng === 'function' ? rng() : 0.25) * pool.length) % pool.length;
  const p = pool[idx] || PATRON_ROSTER[3];
  const moodInfo = computePatronMood(order);
  return {
    id: p.id,
    name: p.name,
    role: p.role,
    tipBonus: p.tipBonus,
    speedScale: p.speedScale,
    mood: moodInfo.mood,
    color: moodInfo.color,
    quote: p.quote,
  };
}

export function computePatronMood(order) {
  const ratio = order && order.maxTime > 0 ? Math.max(0, Math.min(1, order.timeLeft / order.maxTime)) : 1;
  if (ratio >= 0.62) return { mood: 'HAPPY', color: '#15803D', ratio, bark: 'Savoring aroma' };
  if (ratio >= 0.34) return { mood: 'WAITING', color: '#D99B26', ratio, bark: 'Checking watch' };
  if (ratio >= 0.16) return { mood: 'IMPATIENT', color: '#EA580C', ratio, bark: 'Hungry hurry!' };
  return { mood: 'FURIOUS', color: '#B91C1C', ratio, bark: 'Almost walking!' };
}

export function getPatronTipMultiplier(mood, isVip = false) {
  let mult = 1.0;
  if (mood === 'HAPPY') mult = 1.25;
  else if (mood === 'WAITING') mult = 1.05;
  else if (mood === 'IMPATIENT') mult = 0.85;
  else if (mood === 'FURIOUS') mult = 0.65;
  return Number((mult + (isVip ? 0.15 : 0)).toFixed(2));
}
