export const HALL_SCENE_ID = 'sceneHall';

import * as THREE from '../../vendor/three.module.min.js';
import { makeMesh } from './materials.js';
import { buildPekingDuckPlatter, buildCharKwayTeowBowl, buildXiaolongbaoSteamer } from './sceneFood.js';

const boxG = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cylG = (rt, rb, h, s = 12) => new THREE.CylinderGeometry(rt, rb, h, s);
const sphG = (r, w = 10, h = 8) => new THREE.SphereGeometry(r, w, h);

function addDiningHallBackdrop(group, mats) {
  makeMesh(group, new THREE.PlaneGeometry(18, 14), mats.diningFloorMat, [0, 0, -3.5], [-Math.PI / 2, 0, 0], null, true);
  makeMesh(group, boxG(18, 6.2, 0.25), mats.lacquerMat, [0, 3.0, -7.8]);

  const winGlowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
  const winArchMat = new THREE.MeshBasicMaterial({ color: 0xfde68a });
  for (const wx of [-2.4, 2.4]) {
    makeMesh(group, boxG(1.9, 1.9, 0.1), mats.walnutMat, [wx, 0.98, -7.62]);
    makeMesh(group, new THREE.PlaneGeometry(1.66, 1.65), winGlowMat, [wx, 0.98, -7.55]);
    makeMesh(group, new THREE.CircleGeometry(0.83, 18, 0, Math.PI), winArchMat, [wx, 1.8, -7.54]);
    for (let m = -1; m <= 1; m++) makeMesh(group, boxG(0.055, 1.65, 0.06), mats.walnutMat, [wx + m * 0.42, 0.98, -7.52]);
    makeMesh(group, boxG(1.68, 0.055, 0.06), mats.walnutMat, [wx, 0.98, -7.52]);
  }
  for (const sx of [0, -4.4, 4.4]) makeMesh(group, new THREE.PlaneGeometry(0.88, 1.7), mats.scrollMat, [sx, 1.15, -7.58]);

  for (const px of [-3.9, 3.9]) {
    makeMesh(group, cylG(0.26, 0.2, 0.44, 14), mats.cobaltCeramicMat, [px, 0.22, -6.2]);
    for (let b = -1; b <= 1; b++) {
      makeMesh(group, cylG(0.028, 0.034, 2.1, 8), mats.scallionMat, [px + b * 0.08, 1.4, -6.2]);
      makeMesh(group, new THREE.DodecahedronGeometry(0.24, 0), mats.bokChoyMat, [px + b * 0.13, 2.38 + (b % 2) * 0.16, -6.15]);
    }
  }

  for (const rz of [-6.0, -4.8, -3.5]) makeMesh(group, boxG(16, 0.18, 0.2), mats.walnutMat, [0, 2.45, rz]);
  const lMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0xea580c, emissiveIntensity: 1.2, roughness: 0.4 });
  for (const lx of [-2.6, -0.85, 0.85, 2.6]) {
    makeMesh(group, cylG(0.014, 0.014, 0.85, 6), mats.darkIronMat, [lx, 2.02, -4.8]);
    makeMesh(group, sphG(0.26, 16, 14), lMat, [lx, 1.48, -4.8], null, [1, 1.24, 1]);
    makeMesh(group, cylG(0.15, 0.15, 0.045, 12), mats.brassMat, [lx, 1.79, -4.8]);
    makeMesh(group, cylG(0.13, 0.13, 0.045, 12), mats.brassMat, [lx, 1.17, -4.8]);
    makeMesh(group, cylG(0.018, 0.04, 0.18, 8), mats.brassMat, [lx, 1.06, -4.8]);
  }
  for (const lx of [-1.8, 1.8]) {
    const l = new THREE.PointLight(0xff9b3d, 3.6, 14);
    l.position.set(lx, 1.7, -4.5);
    group.add(l);
  }

  const flameMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
  for (const [tx, tz] of [[-3.3, -5.9], [0, -6.1], [3.3, -5.9], [-2.2, -3.5], [2.3, -3.5]]) {
    makeMesh(group, boxG(1.75, 0.09, 1.1), mats.walnutMat, [tx, 0.72, tz]);
    makeMesh(group, boxG(1.78, 0.02, 0.38), mats.crimsonVelvetMat, [tx, 0.77, tz]);
    makeMesh(group, cylG(0.055, 0.055, 0.13, 10), mats.silkLanternMat, [tx, 0.84, tz]);
    makeMesh(group, sphG(0.05, 8, 8), flameMat, [tx, 0.93, tz]);
    makeMesh(group, sphG(0.1, 12, 10), mats.cobaltCeramicMat, [tx + 0.32, 0.85, tz + 0.14]);
    makeMesh(group, cylG(0.04, 0.032, 0.055, 10), mats.ceramicMat, [tx - 0.32, 0.8, tz + 0.16]);
    for (const cx of [-0.58, 0.58]) {
      makeMesh(group, boxG(0.42, 0.055, 0.42), mats.crimsonVelvetMat, [tx + cx, 0.44, tz + 0.68]);
      makeMesh(group, boxG(0.42, 0.52, 0.045), mats.walnutMat, [tx + cx, 0.7, tz + 0.88]);
    }
  }
}

function buildGlazeBottleAndPour(mats) {
  const pourGrp = new THREE.Group();
  pourGrp.position.set(-0.08, 0.96, 0.14);
  const bottleGrp = new THREE.Group();
  bottleGrp.position.set(-0.28, 0.42, -0.14);
  bottleGrp.rotation.set(0.32, 0.15, -2.35);
  makeMesh(bottleGrp, cylG(0.08, 0.08, 0.32, 16), mats.glazeMat);
  makeMesh(bottleGrp, cylG(0.055, 0.08, 0.055, 14), mats.brassMat, [0, 0.18, 0]);
  makeMesh(bottleGrp, new THREE.ConeGeometry(0.032, 0.11, 12), mats.glazeMat, [0, 0.26, 0]);
  bottleGrp.updateMatrix();

  const tipPos = new THREE.Vector3(0, 0.315, 0).applyMatrix4(bottleGrp.matrix);
  const landPos = new THREE.Vector3(-0.02, 0.065, -0.01);
  const midPos = new THREE.Vector3((tipPos.x + landPos.x) * 0.5 + 0.02, (tipPos.y + landPos.y) * 0.52, (tipPos.z + landPos.z) * 0.5);
  const stream = makeMesh(pourGrp, new THREE.TubeGeometry(new THREE.CatmullRomCurve3([tipPos, midPos, landPos]), 18, 0.016, 10, false), mats.glazeMat);
  makeMesh(pourGrp, cylG(0.11, 0.13, 0.014, 16), mats.glazeMat, [landPos.x, 0.06, landPos.z]);
  pourGrp.add(bottleGrp);
  return { pourGrp, bottleGrp, stream };
}

export function buildFinishHallScene(mats) {
  const group = new THREE.Group();
  group.visible = false;
  addDiningHallBackdrop(group, mats);

  const hallLight = new THREE.PointLight(0xffb86c, 3.2, 14);
  hallLight.position.set(0.2, 2.9, 0.5);
  group.add(hallLight);

  makeMesh(group, boxG(5.6, 0.94, 2.4), mats.marbleMat, [0, 0.47, 0.1], null, null, true);
  makeMesh(group, boxG(5.64, 0.055, 0.08), mats.brassMat, [0, 0.9, 1.32]);

  const duckPlatter = buildPekingDuckPlatter(mats, 1.48);
  duckPlatter.position.set(-0.08, 0.96, 0.14);
  const drizzleRing = makeMesh(group, new THREE.RingGeometry(0.58, 0.63, 32), mats.goldHighlightMat, [-0.08, 0.952, 0.14], [-Math.PI / 2, 0, 0]);
  group.add(duckPlatter);

  const { pourGrp, bottleGrp, stream } = buildGlazeBottleAndPour(mats);
  group.add(pourGrp);

  const sideCkt = buildCharKwayTeowBowl(mats, 1.18);
  sideCkt.position.set(-1.15, 0.95, 0.24);
  const sideXlb = buildXiaolongbaoSteamer(mats, 1.15);
  sideXlb.position.set(0.98, 0.95, -0.18);
  group.add(sideCkt, sideXlb);

  for (const [x, z, mat] of [[-0.78, -0.48, mats.scallionMat], [-0.35, -0.58, mats.noodleMat], [0.08, -0.54, mats.chiliMat]]) {
    makeMesh(group, cylG(0.14, 0.11, 0.08, 16), mats.brassMat, [x, 0.98, z]);
    makeMesh(group, sphG(0.1, 12, 8), mat, [x, 1.01, z], null, [1, 0.45, 1]);
  }
  makeMesh(group, cylG(0.08, 0.12, 0.3, 14), mats.copperMat, [0.55, 1.1, -0.45]);
  makeMesh(group, cylG(0.16, 0.18, 0.045, 18), mats.darkIronMat, [0.76, 0.96, 0.44]);
  makeMesh(group, new THREE.SphereGeometry(0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.brassMat, [0.76, 0.98, 0.44]);

  return { group, pourGrp, bottleGrp, stream, drizzleRing };
}
