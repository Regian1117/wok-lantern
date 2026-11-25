export const FOOD_SCENE_ID = 'sceneFood';

import * as THREE from '../../vendor/three.module.min.js';
import { makeMesh } from './materials.js';

const boxG = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cylG = (rt, rb, h, s = 12) => new THREE.CylinderGeometry(rt, rb, h, s);
const sphG = (r, w = 10, h = 8) => new THREE.SphereGeometry(r, w, h);
const torG = (r, t, rs = 7, ts = 14, arc = Math.PI * 2) => new THREE.TorusGeometry(r, t, rs, ts, arc);

function populateCrate(grp, kind, mats) {
  const add = (g, m, p, r, s) => makeMesh(grp, g, m, p, r, s);
  if (kind === 'noodles') for (let i = 0; i < 4; i++) add(torG(0.125, 0.045, 8, 16), mats.noodleMat, [-0.19 + (i % 2) * 0.36, 0.305, -0.14 + Math.floor(i / 2) * 0.28], [Math.PI / 2, 0, 0]);
  else if (kind === 'bokchoy') for (let i = 0; i < 4; i++) add(new THREE.ConeGeometry(0.115, 0.24, 7), mats.bokChoyMat, [-0.19 + (i % 2) * 0.36, 0.34, -0.14 + Math.floor(i / 2) * 0.28], [0, 0, (i % 2 ? -1 : 1) * 0.35]);
  else if (kind === 'chili') for (let i = 0; i < 7; i++) add(new THREE.CapsuleGeometry(0.032, 0.18, 4, 8), mats.chiliMat, [-0.2 + (i % 3) * 0.2, 0.31, -0.14 + Math.floor(i / 3) * 0.19], [0, i * 0.85, Math.PI * 0.42]);
  else if (kind === 'dumplings') {
    add(cylG(0.3, 0.3, 0.08, 16), mats.bambooMat, [0, 0.29, 0]);
    for (let i = 0; i < 6; i++) { const a = (i * Math.PI * 2) / 6; add(sphG(0.064), mats.dumplingMat, [Math.cos(a) * 0.16, 0.355, Math.sin(a) * 0.16], null, [1, 0.78, 1]); }
  } else if (kind === 'prawn') {
    add(boxG(0.76, 0.05, 0.58), mats.iceMat, [0, 0.285, 0]);
    for (let i = 0; i < 5; i++) add(torG(0.105, 0.036, 7, 12, Math.PI * 1.35), mats.prawnMat, [-0.2 + (i % 3) * 0.2, 0.335, -0.11 + Math.floor(i / 3) * 0.22], [Math.PI / 2, 0, i * 0.9]);
  } else if (kind === 'duck') {
    for (let i = 0; i < 2; i++) add(new THREE.CapsuleGeometry(0.115, 0.23, 6, 10), mats.duckMat, [-0.17 + i * 0.34, 0.335, 0], [0, 0, Math.PI / 2]);
    add(cylG(0.025, 0.025, 0.44, 8), mats.scallionMat, [0, 0.34, 0.2], [0, 0, Math.PI / 2]);
  }
}

export function buildPekingDuckPlatter(mats, scale = 1, midAssembly = false) {
  const g = new THREE.Group();
  const add = (geo, m, p, r, s, sh) => makeMesh(g, geo, m, p, r, s, sh);
  add(cylG(0.45, 0.4, 0.055, 8), mats.tunicMat, null, null, null, true);
  add(torG(0.43, 0.018, 8, 8), mats.brassMat, [0, 0.032, 0], [Math.PI / 2, 0, Math.PI / 8]);
  add(cylG(0.38, 0.38, 0.014, 8), mats.ceramicMat, [0, 0.028, 0]);
  const cols = midAssembly ? 2 : 4;
  for (let i = 0; i < cols * 2; i++) add(boxG(0.14, 0.036, 0.058), mats.duckMat, [-0.18 + (i % cols) * 0.1, 0.054, -0.09 + Math.floor(i / cols) * 0.085], [0, 0.22, 0]);
  if (midAssembly) add(torG(0.085, 0.012, 6, 16), mats.brassMat, [0.12, 0.04, -0.05], [Math.PI / 2, 0, 0]);
  for (let d = 0; d < (midAssembly ? 4 : 6); d++) add(cylG(0.038, 0.038, 0.016, 10), mats.bokChoyMat, [-0.26 + d * 0.052, 0.048, 0.12 + (d % 2) * 0.045]);
  for (let c = 0; c < (midAssembly ? 2 : 3); c++) add(cylG(0.11, 0.11, 0.014, 12), mats.dumplingMat, [0.17, 0.042 + c * 0.015, 0.14]);
  add(cylG(0.07, 0.06, 0.05, 12), mats.ceramicMat, [-0.16, 0.055, 0.2]);
  add(cylG(0.055, 0.055, 0.012, 12), mats.glazeMat, [-0.16, 0.082, 0.2]);
  g.scale.setScalar(scale);
  return g;
}

export function buildCharKwayTeowBowl(mats, scale = 1) {
  const g = new THREE.Group();
  const add = (geo, m, p, r, s, sh) => makeMesh(g, geo, m, p, r, s, sh);
  add(cylG(0.34, 0.2, 0.17, 20), mats.cobaltCeramicMat, [0, 0.085, 0], null, null, true);
  add(cylG(0.285, 0.26, 0.03, 18), mats.lacquerMat, [0, 0.155, 0]);
  for (let n = 0; n < 6; n++) { const a = (n * Math.PI) / 3; add(torG(0.115 + (n % 2) * 0.045, 0.032, 7, 16), n % 2 === 0 ? mats.noodleMat : mats.brassMat, [Math.cos(a) * 0.055, 0.178 + (n % 3) * 0.015, Math.sin(a) * 0.055], [Math.PI / 2 + (n % 2 ? -0.14 : 0.14), a, 0]); }
  for (let i = 0; i < 5; i++) { const a = (i * Math.PI * 2) / 5 + 0.25; add(torG(0.068, 0.024, 7, 12, Math.PI * 1.38), mats.prawnMat, [Math.cos(a) * 0.135, 0.228, Math.sin(a) * 0.135], [Math.PI / 2, 0, a]); }
  for (let s = 0; s < 4; s++) { const a = (s * Math.PI) / 2 + 0.6; add(cylG(0.042, 0.042, 0.018, 12), mats.chiliMat, [Math.cos(a) * 0.095, 0.224, Math.sin(a) * 0.095], [0, a, 0.32]); }
  for (let c = 0; c < 8; c++) { const a = (c * Math.PI * 2) / 8; add(boxG(0.085, 0.012, 0.015), mats.scallionMat, [Math.cos(a) * 0.075, 0.242, Math.sin(a) * 0.075], [0, a + 0.4, 0]); }
  add(new THREE.CylinderGeometry(0.068, 0.068, 0.032, 12, 1, false, 0, Math.PI), mats.bokChoyMat, [0.24, 0.195, 0.13], [0, 0, 0.45]);
  g.scale.setScalar(scale);
  return g;
}

export function buildXiaolongbaoSteamer(mats, scale = 1) {
  const g = new THREE.Group();
  makeMesh(g, cylG(0.3, 0.3, 0.14, 18), mats.bambooMat, [0, 0.07, 0]);
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI * 2) / 6; makeMesh(g, sphG(0.065, 12, 10), mats.dumplingMat, [Math.cos(a) * 0.14, 0.15, Math.sin(a) * 0.14], null, [1, 0.8, 1]); }
  makeMesh(g, cylG(0.09, 0.07, 0.025, 12), mats.ceramicMat, [0.36, 0.015, 0.05]);
  g.scale.setScalar(scale);
  return g;
}

export function buildKitchenFood(mats) {
  const group = new THREE.Group();
  const crateRims = {};
  for (const [id, kind, x, z, rot] of [
    ['crate_noodles', 'noodles', 1.2, -3.15, 0], ['crate_bokchoy', 'bokchoy', 2.55, -3.15, 0],
    ['crate_chili', 'chili', 3.9, -3.15, 0], ['crate_dumpling', 'dumplings', 4.75, -1.6, -Math.PI / 2],
    ['crate_prawn', 'prawn', 4.75, -0.15, -Math.PI / 2], ['crate_duck', 'duck', 4.75, 1.3, -Math.PI / 2],
  ]) {
    const grp = new THREE.Group();
    grp.position.set(x, 0.94, z); grp.rotation.y = rot;
    makeMesh(grp, boxG(0.95, 0.26, 0.78), mats.oakMat, [0, 0.13, 0], null, null, true);
    makeMesh(grp, boxG(0.97, 0.024, 0.8), mats.brassMat, [0, 0.254, 0]);
    makeMesh(grp, boxG(0.88, 0.032, 0.71), mats.ceramicMat, [0, 0.264, 0]);
    const rim = makeMesh(grp, boxG(1.02, 0.04, 0.85), mats.goldHighlightMat, [0, 0.278, 0]);
    rim.visible = false;
    populateCrate(grp, kind, mats);
    group.add(grp);
    crateRims[id] = rim;
  }

  makeMesh(group, torG(0.18, 0.07, 8, 14), mats.noodleMat, [-1.75, 1.0, -3.15], [Math.PI / 2, 0, 0]);
  const flameCone = makeMesh(group, new THREE.ConeGeometry(0.32, 0.44, 12), new THREE.MeshBasicMaterial({ color: 0xff7b1a, transparent: true, opacity: 0.72 }), [-1.75, 0.92, -3.15]);
  makeMesh(group, new THREE.ConeGeometry(0.18, 0.25, 10), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }), [-1.75, 0.86, -3.15]);
  const emberRing = makeMesh(group, torG(0.24, 0.04, 8, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }), [-3.05, 0.98, -3.15], [Math.PI / 2, 0, 0]);

  const islandPlate = buildPekingDuckPlatter(mats, 1.24, true);
  islandPlate.position.set(0.38, 0.99, 0.12);
  const passShowcase = new THREE.Group();
  const [b1, b2, b3] = [buildCharKwayTeowBowl(mats, 1.35), buildPekingDuckPlatter(mats, 1.38), buildXiaolongbaoSteamer(mats, 1.35)];
  b1.position.set(-1.75, 0.99, 3.2); b2.position.set(0, 0.99, 3.22); b3.position.set(1.65, 0.99, 3.2);
  passShowcase.add(b1, b2, b3); group.add(islandPlate, passShowcase);
  return { group, crateRims, flameCone, emberRing, islandPlate, passShowcase };
}
