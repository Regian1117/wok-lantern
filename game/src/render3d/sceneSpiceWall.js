export const SPICE_WALL_ID = 'sceneSpiceWall';

import * as THREE from '../../vendor/three.module.min.js';
import { makeMesh } from './materials.js';

const boxG = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cylG = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s);

export function buildKitchenSpiceAndWallProps(group, mats) {
  const add = (g, m, p, r) => makeMesh(group, g, m, p, r);
  for (const [w, h, d, m, p] of [
    [3.95, 0.68, 1.52, mats.steelMat, [-2.2, 2.86, -3.25]],
    [3.98, 0.06, 1.55, mats.brassMat, [-2.2, 2.52, -3.25]],
    [3.5, 0.04, 0.12, mats.goldHighlightMat, [-2.2, 2.5, -2.95]],
    [0.05, 0.08, 1.2, mats.walnutMat, [-5.5, 1.82, 0.85]],
    [0.42, 0.05, 1.65, mats.walnutMat, [-5.34, 2.1, -1.75]],
  ]) add(boxG(w, h, d), m, p);

  add(cylG(0.018, 0.018, 3.2, 8), mats.brassMat, [-2.2, 2.25, -4.18], [0, 0, Math.PI / 2]);
  const [uStem, uBowl] = [cylG(0.012, 0.012, 0.36, 6), cylG(0.07, 0.07, 0.02, 10)];
  for (let u = 0; u < 5; u++) {
    add(uStem, mats.brassMat, [-3.4 + u * 0.6, 2.07, -4.18]);
    add(uBowl, u % 2 ? mats.steelMat : mats.copperMat, [-3.4 + u * 0.6, 1.88, -4.18], [Math.PI / 2, 0, 0]);
  }
  for (const sy of [1.95, 2.48]) {
    add(boxG(4.1, 0.05, 0.38), mats.walnutMat, [2.85, sy, -4.18]);
    add(boxG(4.12, 0.025, 0.03), mats.brassMat, [2.85, sy, -3.99]);
  }
  const bMats = [mats.lacquerMat, mats.chiliMat, mats.cobaltCeramicMat, mats.noodleMat];
  const [bGeo, lGeo, cGeo] = [cylG(0.055, 0.065, 0.24), cylG(0.06, 0.06, 0.1), cylG(0.028, 0.028, 0.05, 8)];
  for (let i = 0; i < 16; i++) {
    const [bx, ty] = [1.05 + (i % 8) * 0.5, i < 8 ? 2.1 : 2.63];
    add(bGeo, bMats[i % 4], [bx, ty, -4.15]);
    add(lGeo, mats.ceramicMat, [bx, ty - 0.01, -4.15]);
    add(cGeo, mats.brassMat, [bx, ty + 0.14, -4.15]);
  }
  add(cylG(0.14, 0.1, 0.14, 12), mats.darkIronMat, [4.55, 1.03, -3.55]);
  add(cylG(0.026, 0.034, 0.22, 8), mats.walnutMat, [4.58, 1.14, -3.55], [0, 0, 0.45]);
  for (let k = 0; k < 4; k++) {
    add(boxG(0.02, 0.26 - k * 0.02, 0.08 - k * 0.01), mats.steelMat, [-5.46, 1.72, 0.42 + k * 0.28]);
    add(boxG(0.03, 0.11, 0.03), mats.walnutMat, [-5.46, 1.9, 0.42 + k * 0.28]);
  }
  for (const hz of [-2.22, -1.82, -1.42]) {
    add(cylG(0.11, 0.08, 0.16), mats.copperMat, [-5.32, 2.21, hz]);
    add(new THREE.DodecahedronGeometry(0.14, 0), mats.bokChoyMat, [-5.32, 2.35, hz]);
  }
  add(cylG(0.09, 0.09, 0.19, 12), mats.cobaltCeramicMat, [-5.32, 2.22, -1.04]);
  add(cylG(0.018, 0.018, 1.2, 8), mats.brassMat, [-5.46, 1.56, -0.55], [Math.PI / 2, 0, 0]);
  for (let p = 0; p < 2; p++) add(cylG(0.16, 0.14, 0.04, 14), p ? mats.darkIronMat : mats.copperMat, [-5.42, 1.32, -0.8 + p * 0.48], [0, 0, Math.PI / 2]);
}
