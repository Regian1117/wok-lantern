export const FIXTURES_ID = 'sceneFixtures';

import * as THREE from '../../vendor/three.module.min.js';
import { makeMesh } from './materials.js';
import { buildKitchenCabinetry } from './sceneCabinets.js';
import { buildKitchenSpiceAndWallProps } from './sceneSpiceWall.js';

const boxG = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cylG = (rt, rb, h, s = 12) => new THREE.CylinderGeometry(rt, rb, h, s);

function addWallLantern(group, mats, wallX, y, z, dirX = 1, dirZ = 0) {
  const g = new THREE.Group();
  g.position.set(wallX, y, z);
  makeMesh(g, boxG(dirX ? 0.45 : 0.04, 0.04, dirZ ? 0.45 : 0.04), mats.darkIronMat, [dirX * 0.22, 0.28, dirZ * 0.22]);
  const lx = dirX * 0.42;
  const lz = dirZ * 0.42;
  makeMesh(g, new THREE.SphereGeometry(0.22, 16, 14), mats.silkLanternMat, [lx, 0, lz], null, [1, 1.28, 1]);
  for (const ry of [-0.26, 0.26]) makeMesh(g, cylG(0.12, 0.12, 0.04, 14), mats.brassMat, [lx, ry, lz]);
  makeMesh(g, cylG(0.015, 0.04, 0.2, 8), mats.brassMat, [lx, -0.38, lz]);
  group.add(g);
}

export function buildKitchenFixtures(mats) {
  const group = new THREE.Group();
  makeMesh(group, new THREE.PlaneGeometry(11.6, 9.2), mats.flagstoneMat, [0, 0, 0], [-Math.PI / 2, 0, 0], null, true);
  makeMesh(group, boxG(11.6, 4.4, 0.2), mats.tileMat, [0, 2.2, -4.45], null, null, true);
  makeMesh(group, boxG(0.2, 4.4, 9.0), mats.tileMat, [-5.65, 2.2, -0.05], null, null, true);
  makeMesh(group, boxG(11.4, 0.06, 0.06), mats.brassMat, [0, 1.65, -4.34]);
  makeMesh(group, boxG(0.06, 0.06, 8.8), mats.brassMat, [-5.53, 1.65, -0.05]);
  for (const cx of [-5.5, 0.2, 5.5]) makeMesh(group, boxG(0.26, 4.4, 0.28), mats.walnutMat, [cx, 2.2, -4.32]);

  makeMesh(group, boxG(0.06, 0.95, 1.85), mats.crestMat, [-5.5, 2.55, 0.2]);
  makeMesh(group, cylG(0.03, 0.03, 0.72, 10), mats.brassMat, [-5.25, 3.12, 0.2], [Math.PI / 2, 0, 0]);
  addWallLantern(group, mats, -5.52, 2.55, -2.9, 1, 0);
  addWallLantern(group, mats, -5.52, 2.55, 1.95, 1, 0);
  addWallLantern(group, mats, 4.95, 2.75, -4.32, 0, 1);

  buildKitchenCabinetry(group, mats);
  buildKitchenSpiceAndWallProps(group, mats);

  makeMesh(group, boxG(1.22, 0.06, 1.8), mats.steelMat, [-4.88, 0.94, -1.75]);
  const waterMeshes = [];
  for (const wz of [-2.12, -1.38]) {
    makeMesh(group, boxG(0.85, 0.04, 0.58), mats.darkIronMat, [-4.88, 0.96, wz]);
    waterMeshes.push(makeMesh(group, new THREE.PlaneGeometry(0.78, 0.52), mats.waterMat, [-4.88, 0.985, wz], [-Math.PI / 2, 0, 0]));
  }
  makeMesh(group, new THREE.TorusGeometry(0.18, 0.025, 8, 16, Math.PI), mats.steelMat, [-5.22, 1.15, -1.75], [0, Math.PI / 2, 0]);
  makeMesh(group, cylG(0.05, 0.05, 0.16, 10), mats.ceramicMat, [-5.2, 1.04, -1.05]);
  makeMesh(group, boxG(0.11, 0.045, 0.07), mats.noodleMat, [-4.52, 0.99, -1.05]);

  makeMesh(group, boxG(0.65, 0.06, 0.8), mats.steelMat, [-4.85, 0.96, -0.45]);
  for (let p = 0; p < 5; p++) makeMesh(group, cylG(0.18, 0.18, 0.022, 16), mats.ceramicMat, [-4.85, 1.14, -0.72 + p * 0.13], [0, 0, Math.PI / 2]);

  makeMesh(group, cylG(0.54, 0.56, 0.94, 20), mats.walnutMat, [-4.65, 0.47, 0.85], null, null, true);
  makeMesh(group, cylG(0.52, 0.52, 0.08, 20), mats.butcherEndMat, [-4.65, 0.95, 0.85]);
  makeMesh(group, boxG(0.28, 0.015, 0.15), mats.steelMat, [-4.58, 1.03, 0.88], [0, 0.42, 0]);
  makeMesh(group, cylG(0.025, 0.025, 0.18, 8), mats.walnutMat, [-4.42, 1.03, 0.96], [0, 0.42, Math.PI / 2]);
  const chopRing = makeMesh(group, new THREE.RingGeometry(0.32, 0.46, 24), mats.goldHighlightMat, [-4.65, 1.005, 0.85], [-Math.PI / 2, 0, 0]);

  makeMesh(group, boxG(3.8, 0.92, 1.4), mats.steelMat, [-2.2, 0.46, -3.25], null, null, true);
  for (let d = 0; d < 4; d++) makeMesh(group, cylG(0.06, 0.06, 0.04), mats.brassMat, [-3.4 + d * 0.72, 0.72, -2.53], [Math.PI / 2, 0, 0]);
  for (const wx of [-3.05, -1.75]) {
    const wok = makeMesh(group, new THREE.SphereGeometry(0.46, 18, 12, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), mats.darkIronMat, [wx, 1.05, -3.15]);
    wok.material.side = THREE.DoubleSide;
  }
  for (let t = 0; t < 3; t++) makeMesh(group, cylG(0.32, 0.32, 0.19, 16), mats.bambooMat, [-0.45, 1.02 + t * 0.2, -3.15]);
  makeMesh(group, new THREE.ConeGeometry(0.33, 0.14, 16), mats.bambooMat, [-0.45, 1.58, -3.15]);
  makeMesh(group, cylG(0.07, 0.1, 0.24), mats.copperMat, [-0.78, 1.08, -0.2]);
  makeMesh(group, cylG(0.14, 0.16, 0.04, 16), mats.darkIronMat, [2.65, 1.0, 3.15]);
  makeMesh(group, new THREE.SphereGeometry(0.11, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.brassMat, [2.65, 1.02, 3.15]);
  makeMesh(group, boxG(0.28, 0.18, 0.22), mats.lacquerMat, [-2.85, 1.08, 3.18]);

  return { group, waterMeshes, chopRing };
}
