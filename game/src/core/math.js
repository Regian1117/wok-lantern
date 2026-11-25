export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

export const lerp = (a, b, t) => a + (b - a) * t;

export const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const dist2D = (ax, az, bx, bz) => Math.hypot(bx - ax, bz - az);

export const angleLerp = (a, b, t) => {
  let diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
};

export const rectHit = (px, py, rect) =>
  px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;

export function resolveCircleAabb(cx, cz, radius, box) {
  const nearX = clamp(cx, box.minX, box.maxX);
  const nearZ = clamp(cz, box.minZ, box.maxZ);
  const dx = cx - nearX;
  const dz = cz - nearZ;
  const d2 = dx * dx + dz * dz;
  if (d2 >= radius * radius) return { x: cx, z: cz, hit: false };
  if (d2 > 1e-6) {
    const d = Math.sqrt(d2);
    const push = radius - d;
    return { x: cx + (dx / d) * push, z: cz + (dz / d) * push, hit: true };
  }
  const left = Math.abs(cx - box.minX);
  const right = Math.abs(box.maxX - cx);
  const top = Math.abs(cz - box.minZ);
  const bot = Math.abs(box.maxZ - cz);
  const minPen = Math.min(left, right, top, bot);
  if (minPen === left) return { x: box.minX - radius, z: cz, hit: true };
  if (minPen === right) return { x: box.maxX + radius, z: cz, hit: true };
  if (minPen === top) return { x: cx, z: box.minZ - radius, hit: true };
  return { x: cx, z: box.maxZ + radius, hit: true };
}
