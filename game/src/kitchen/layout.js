export const KITCHEN_BOUNDS = {
  minX: -4.15,
  maxX: 4.05,
  minZ: -2.28,
  maxZ: 2.38,
  chefRadius: 0.4,
};

export const COUNTER_AABBS = [
  { id: 'left_wall', minX: -5.6, maxX: -4.18, minZ: -4.2, maxZ: 3.1 },
  { id: 'back_wall', minX: -5.6, maxX: 5.6, minZ: -4.4, maxZ: -2.55 },
  { id: 'right_larder', minX: 4.12, maxX: 5.6, minZ: -4.2, maxZ: 2.6 },
  { id: 'center_island', minX: -1.32, maxX: 1.48, minZ: -0.78, maxZ: 0.92 },
  { id: 'front_pass', minX: -3.55, maxX: 3.55, minZ: 2.72, maxZ: 3.9 },
];

export const ROUTE_POINTS = [
  { step: 1, label: 'LARDER', x: 1.2, y: 1.05, z: -3.15 },
  { step: 2, label: 'CHOP', x: -4.65, y: 1.05, z: 0.85 },
  { step: 3, label: 'WOK', x: -1.75, y: 1.05, z: -3.15 },
  { step: 4, label: 'SERVE', x: -0.4, y: 1.05, z: 3.15 },
];

export const COURTYARD_GRID = {
  tileWidth: 1.15,
  tileDepth: 0.95,
  mortarGap: 0.04,
  floorWidth: 11.6,
  floorDepth: 9.2,
};

export const STATION_ZONES = {
  wetPrep: { minX: -5.6, maxX: -4.15, minZ: -3.6, maxZ: 2.2 },
  hotLine: { minX: -4.1, maxX: 0.25, minZ: -4.3, maxZ: -2.5 },
  larder: { minX: 0.4, maxX: 5.5, minZ: -4.3, maxZ: 2.4 },
  island: { minX: -1.32, maxX: 1.48, minZ: -0.78, maxZ: 0.92 },
};

export const PASS_DROP_SLOTS = [
  { id: 'slot_ckt', x: -1.75, y: 0.99, z: 3.2 },
  { id: 'slot_duck', x: 0.0, y: 0.99, z: 3.22 },
  { id: 'slot_xlb', x: 1.65, y: 0.99, z: 3.2 },
];

export const CHEF_SPAWN_POINT = { x: -1.85, z: 1.35, yaw: 0.48 };

export function isInsideWalkableZone(x, z) {
  if (x < KITCHEN_BOUNDS.minX || x > KITCHEN_BOUNDS.maxX) return false;
  if (z < KITCHEN_BOUNDS.minZ || z > KITCHEN_BOUNDS.maxZ) return false;
  const r = KITCHEN_BOUNDS.chefRadius;
  return !COUNTER_AABBS.some(
    (b) => x >= b.minX - r && x <= b.maxX + r && z >= b.minZ - r && z <= b.maxZ + r,
  );
}
