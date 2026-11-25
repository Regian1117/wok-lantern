export const NAV_VERSION = 1;

import { clamp, angleLerp, dist2D, resolveCircleAabb } from '../core/math.js';
import { KITCHEN_BOUNDS, COUNTER_AABBS } from './layout.js';

function segmentIntersectsBox(ax, az, bx, bz, box) {
  const steps = 10;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = ax + (bx - ax) * t;
    const z = az + (bz - az) * t;
    if (x >= box.minX - 0.36 && x <= box.maxX + 0.36 && z >= box.minZ - 0.36 && z <= box.maxZ + 0.36) {
      return true;
    }
  }
  return false;
}

export function moveChefWithCollision(chef, dirX, dirZ, dt) {
  const len = Math.hypot(dirX, dirZ);
  if (len < 1e-4) return;
  const nx = dirX / len;
  const nz = dirZ / len;
  let x = clamp(chef.x + nx * chef.moveSpeed * dt, KITCHEN_BOUNDS.minX, KITCHEN_BOUNDS.maxX);
  let z = clamp(chef.z + nz * chef.moveSpeed * dt, KITCHEN_BOUNDS.minZ, KITCHEN_BOUNDS.maxZ);
  for (const box of COUNTER_AABBS) {
    const res = resolveCircleAabb(x, z, KITCHEN_BOUNDS.chefRadius, box);
    x = res.x;
    z = res.z;
  }
  chef.x = clamp(x, KITCHEN_BOUNDS.minX, KITCHEN_BOUNDS.maxX);
  chef.z = clamp(z, KITCHEN_BOUNDS.minZ, KITCHEN_BOUNDS.maxZ);
  const targetYaw = Math.atan2(nx, nz);
  chef.yaw = angleLerp(chef.yaw, targetYaw, clamp(dt * 12, 0, 1));
  chef.walkPhase += dt * 11;
}

export function planChefPath(fromX, fromZ, toX, toZ) {
  const tx = clamp(toX, KITCHEN_BOUNDS.minX, KITCHEN_BOUNDS.maxX);
  const tz = clamp(toZ, KITCHEN_BOUNDS.minZ, KITCHEN_BOUNDS.maxZ);
  const island = COUNTER_AABBS.find((b) => b.id === 'center_island');
  if (!island || !segmentIntersectsBox(fromX, fromZ, tx, tz, island)) {
    return [{ x: tx, z: tz }];
  }
  const corners = [
    { x: -1.95, z: -1.35 },
    { x: 2.1, z: -1.35 },
    { x: -1.95, z: 1.5 },
    { x: 2.1, z: 1.5 },
  ];
  let best = corners[0];
  let bestCost = Infinity;
  for (const c of corners) {
    const cost = dist2D(fromX, fromZ, c.x, c.z) + dist2D(c.x, c.z, tx, tz);
    if (cost < bestCost) {
      bestCost = cost;
      best = c;
    }
  }
  return [best, { x: tx, z: tz }];
}
