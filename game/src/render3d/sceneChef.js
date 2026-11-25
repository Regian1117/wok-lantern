export const CHEF_MESH_ID = 'sceneChef';

import * as THREE from '../../vendor/three.module.min.js';
import { makeMesh } from './materials.js';

export function buildChefMesh(mats) {
  const root = new THREE.Group();

  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.62, 10);
  const leftLeg = makeMesh(root, legGeo, mats.indigoMat, [-0.12, 0.31, 0], null, null, true);
  const rightLeg = makeMesh(root, legGeo, mats.indigoMat, [0.12, 0.31, 0], null, null, true);

  // Mandarin-collar crimson silk jacket + 3 gold frog clasps + crisp ivory apron
  makeMesh(root, new THREE.CylinderGeometry(0.24, 0.27, 0.68, 14), mats.tunicMat, [0, 0.94, 0], null, null, true);
  makeMesh(root, new THREE.CylinderGeometry(0.17, 0.18, 0.08, 14), mats.tunicMat, [0, 1.29, 0]);
  makeMesh(root, new THREE.BoxGeometry(0.39, 0.56, 0.15), mats.ivoryApronMat, [0, 0.84, 0.18], null, null, true);
  for (let i = 0; i < 3; i++) makeMesh(root, new THREE.BoxGeometry(0.09, 0.025, 0.03), mats.brassMat, [0, 1.19 - i * 0.1, 0.255]);

  // Head + expressive eyes/brows/catchlights/mustache
  makeMesh(root, new THREE.SphereGeometry(0.2, 16, 14), mats.skinMat, [0, 1.47, 0], null, null, true);
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cheekMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.65 });
  for (const ex of [-0.07, 0.07]) {
    makeMesh(root, new THREE.SphereGeometry(0.025, 8, 8), mats.hairMat, [ex, 1.48, 0.185]);
    makeMesh(root, new THREE.SphereGeometry(0.009, 6, 6), eyeWhiteMat, [ex + 0.008, 1.488, 0.205]);
    makeMesh(root, new THREE.BoxGeometry(0.06, 0.015, 0.02), mats.hairMat, [ex, 1.535, 0.185]);
    makeMesh(root, new THREE.SphereGeometry(0.028, 8, 8), cheekMat, [ex * 1.45, 1.435, 0.175], null, [1, 0.6, 0.5]);
    makeMesh(root, new THREE.BoxGeometry(0.06, 0.018, 0.02), mats.hairMat, [ex * 0.5, 1.415, 0.195], [0, 0, ex < 0 ? 0.2 : -0.2]);
  }

  // Sleek dark sculpted hair + top-knot + knotted crimson-and-gold hachimaki with trailing ties
  makeMesh(root, new THREE.SphereGeometry(0.212, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.hairMat, [0, 1.49, -0.01]);
  makeMesh(root, new THREE.SphereGeometry(0.088, 10, 10), mats.hairMat, [0, 1.72, -0.03]);
  makeMesh(root, new THREE.TorusGeometry(0.208, 0.034, 8, 22), mats.crimsonVelvetMat, [0, 1.56, 0], [Math.PI / 2, 0, 0]);
  makeMesh(root, new THREE.TorusGeometry(0.212, 0.012, 6, 22), mats.brassMat, [0, 1.56, 0], [Math.PI / 2, 0, 0]);
  makeMesh(root, new THREE.SphereGeometry(0.044, 8, 8), mats.brassMat, [0, 1.56, -0.22]);
  makeMesh(root, new THREE.BoxGeometry(0.045, 0.24, 0.016), mats.crimsonVelvetMat, [-0.055, 1.43, -0.24], [0.22, 0, 0.24]);
  makeMesh(root, new THREE.BoxGeometry(0.045, 0.24, 0.016), mats.brassMat, [0.055, 1.43, -0.24], [0.22, 0, -0.24]);

  // Left arm + dynamic held tray (raw/chopped/plated visibility)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.28, 1.15, 0.08);
  makeMesh(leftArm, new THREE.CylinderGeometry(0.075, 0.07, 0.42, 10), mats.tunicMat, [0, -0.14, 0.14], [Math.PI * 0.35, 0, 0]);
  const tray = makeMesh(leftArm, new THREE.CylinderGeometry(0.24, 0.21, 0.032, 12), mats.lacquerMat, [0.06, -0.22, 0.36]);
  const rawCarry = makeMesh(leftArm, new THREE.BoxGeometry(0.2, 0.12, 0.2), mats.prawnMat, [0.06, -0.14, 0.36]);
  const choppedCarry = makeMesh(leftArm, new THREE.CylinderGeometry(0.14, 0.14, 0.07, 12), mats.bokChoyMat, [0.06, -0.16, 0.36]);
  const platedCarry = makeMesh(leftArm, new THREE.CylinderGeometry(0.19, 0.15, 0.09, 12), mats.ceramicMat, [0.06, -0.16, 0.36]);
  makeMesh(platedCarry, new THREE.SphereGeometry(0.1, 10, 8), mats.duckMat, [0, 0.05, 0], null, [1.2, 0.55, 1]);
  root.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.3, 1.15, 0.06);
  makeMesh(rightArm, new THREE.CylinderGeometry(0.075, 0.07, 0.44, 10), mats.tunicMat, [0, -0.16, 0.12], [Math.PI * 0.3, 0, 0]);
  makeMesh(rightArm, new THREE.CylinderGeometry(0.015, 0.015, 0.48, 8), mats.brassMat, [0, -0.2, 0.38], [Math.PI * 0.42, 0, 0]);
  makeMesh(rightArm, new THREE.SphereGeometry(0.065, 10, 8, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), mats.brassMat, [0, -0.14, 0.6]);
  root.add(rightArm);

  return {
    root,
    update(state, time) {
      root.position.set(state.chef.x, 0, state.chef.z);
      root.rotation.y = state.chef.yaw;
      const walk = Math.sin(state.chef.walkPhase);
      leftLeg.rotation.x = walk * 0.38;
      rightLeg.rotation.x = -walk * 0.38;
      rightArm.rotation.x = -0.15 - Math.sin(state.chef.chopAnim * Math.PI) * 1.15 - Math.sin(state.chef.wokAnim * Math.PI * 2) * 0.65;
      leftArm.rotation.x = Math.sin(time * 2.2) * 0.04;

      const hasCooked = Boolean(state.chef.cookedDish);
      const hasRaw = Boolean(state.chef.holding) && !state.chef.prepped && !hasCooked;
      const hasPrepped = Boolean(state.chef.holding) && state.chef.prepped && !hasCooked;
      tray.visible = hasCooked || hasRaw || hasPrepped;
      rawCarry.visible = hasRaw;
      choppedCarry.visible = hasPrepped;
      platedCarry.visible = hasCooked;
    },
  };
}
