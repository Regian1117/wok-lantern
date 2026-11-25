export const CABINETS_ID = 'sceneCabinets';
export const CABINET_HEIGHT = 0.78;

import * as THREE from '../../vendor/three.module.min.js';
import { makeMesh } from './materials.js';

const boxG = (w, h, d) => new THREE.BoxGeometry(w, h, d);

function addCabinetRun(group, mats, x, z, w, d, drawers, axis = 'x', sign = 1) {
  makeMesh(group, boxG(w - 0.04, 0.1, d - 0.04), mats.darkIronMat, [x, 0.05, z]);
  makeMesh(group, boxG(w, CABINET_HEIGHT, d), mats.oxbloodMat, [x, 0.49, z], null, null, true);
  const pw = axis === 'z' ? w / drawers - 0.08 : 0.03;
  const pd = axis === 'x' ? d / drawers - 0.08 : 0.03;
  const pGeo = boxG(pw, 0.3, pd);
  const pullGeo = boxG(axis === 'z' ? 0.24 : 0.03, 0.025, axis === 'x' ? 0.24 : 0.03);

  for (let i = 0; i < drawers; i++) {
    const t = (i + 0.5) / drawers - 0.5;
    const px = axis === 'z' ? x + t * w : x + sign * (w * 0.5 + 0.015);
    const pz = axis === 'x' ? z + t * d : z + sign * (d * 0.5 + 0.015);
    for (const ry of [0.3, 0.68]) {
      makeMesh(group, pGeo, mats.oxbloodMat, [px, ry, pz]);
      makeMesh(group, pullGeo, mats.brassMat, [px + (axis === 'x' ? sign * 0.025 : 0), ry + 0.06, pz + (axis === 'z' ? sign * 0.025 : 0)]);
    }
  }
}

export function buildKitchenCabinetry(group, mats) {
  // Left wet/prep counter + oak top
  addCabinetRun(group, mats, -4.9, -1.25, 1.3, 5.2, 4, 'x', 1);
  makeMesh(group, boxG(1.34, 0.08, 3.35), mats.oakMat, [-4.88, 0.92, -0.55], null, null, true);

  // Back-right & right larder counters + oak tops
  addCabinetRun(group, mats, 2.8, -3.25, 4.8, 1.35, 4, 'z', 1);
  makeMesh(group, boxG(4.84, 0.08, 1.38), mats.oakMat, [2.8, 0.92, -3.25], null, null, true);
  addCabinetRun(group, mats, 4.85, -0.2, 1.3, 4.7, 4, 'x', -1);
  makeMesh(group, boxG(1.34, 0.08, 4.74), mats.oakMat, [4.85, 0.92, -0.2], null, null, true);

  // Center assembly island + front marble service pass + rubber floor mats
  addCabinetRun(group, mats, 0.1, 0.08, 2.65, 1.55, 2, 'z', 1);
  makeMesh(group, boxG(2.74, 0.08, 1.64), mats.oakMat, [0.1, 0.92, 0.08], null, null, true);
  addCabinetRun(group, mats, 0, 3.25, 6.9, 1.05, 4, 'z', -1);
  makeMesh(group, boxG(7.05, 0.09, 1.15), mats.marbleMat, [0, 0.94, 3.25], null, null, true);
  makeMesh(group, boxG(7.08, 0.04, 0.05), mats.brassMat, [0, 0.95, 2.68]);
  makeMesh(group, boxG(4.1, 0.025, 0.9), mats.rubberMat, [-1.9, 0.015, -2.05]);
  makeMesh(group, boxG(0.9, 0.025, 3.2), mats.rubberMat, [-3.7, 0.015, -0.4]);
}
