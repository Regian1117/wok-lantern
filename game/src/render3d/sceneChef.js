export const CHEF_MESH_ID = 'sceneChef';

import * as THREE from '../../vendor/three.module.min.js';

export function buildChefMesh(mats) {
  const root = new THREE.Group();

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.62, 10);
  const leftLeg = new THREE.Mesh(legGeo, mats.indigoMat);
  leftLeg.position.set(-0.12, 0.31, 0);
  leftLeg.castShadow = true;
  const rightLeg = new THREE.Mesh(legGeo, mats.indigoMat);
  rightLeg.position.set(0.12, 0.31, 0);
  rightLeg.castShadow = true;
  root.add(leftLeg, rightLeg);

  // Mandarin crimson tunic + dark indigo apron
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.68, 14), mats.tunicMat);
  torso.position.set(0, 0.94, 0);
  torso.castShadow = true;
  root.add(torso);

  const apron = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.56, 0.14), mats.indigoMat);
  apron.position.set(0, 0.85, 0.18);
  apron.castShadow = true;
  root.add(apron);

  // Gold frog clasps
  for (let i = 0; i < 3; i++) {
    const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.03), mats.brassMat);
    clasp.position.set(0, 1.15 - i * 0.11, 0.25);
    root.add(clasp);
  }

  // Head + expressive eyes/catchlights + cheeks + mustache + top-knot + hachimaki
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 14), mats.skinMat);
  head.position.set(0, 1.46, 0);
  head.castShadow = true;
  root.add(head);

  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cheekMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.65 });
  for (const ex of [-0.07, 0.07]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), mats.hairMat);
    eye.position.set(ex, 1.47, 0.185);
    const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 6), eyeWhiteMat);
    catchlight.position.set(ex + 0.008, 1.478, 0.205);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), cheekMat);
    cheek.scale.set(1, 0.6, 0.5);
    cheek.position.set(ex * 1.45, 1.425, 0.175);
    root.add(eye, catchlight, cheek);
  }
  for (const mx of [-0.035, 0.035]) {
    const stache = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.02, 0.02), mats.hairMat);
    stache.position.set(mx, 1.405, 0.195);
    stache.rotation.z = mx < 0 ? 0.2 : -0.2;
    root.add(stache);
  }

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.hairMat);
  hair.position.set(0, 1.48, -0.01);
  root.add(hair);

  const topKnot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), mats.hairMat);
  topKnot.position.set(0, 1.71, -0.03);
  root.add(topKnot);

  const band = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.032, 8, 22), mats.crimsonVelvetMat);
  band.position.set(0, 1.54, 0);
  band.rotation.x = Math.PI / 2;
  root.add(band);

  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), mats.brassMat);
  knot.position.set(0, 1.54, -0.22);
  root.add(knot);

  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.015), mats.crimsonVelvetMat);
  tailL.position.set(-0.05, 1.43, -0.24);
  tailL.rotation.z = 0.25;
  const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.015), mats.brassMat);
  tailR.position.set(0.05, 1.43, -0.24);
  tailR.rotation.z = -0.25;
  root.add(tailL, tailR);

  // Left arm carrying Xiaolongbao lacquer serving tray
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.3, 1.15, 0.08);
  const lSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.42, 10), mats.tunicMat);
  lSleeve.position.set(0, -0.14, 0.14);
  lSleeve.rotation.x = Math.PI * 0.35;
  leftArm.add(lSleeve);
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.03, 12), mats.lacquerMat);
  tray.position.set(0.02, -0.22, 0.34);
  leftArm.add(tray);
  const steamerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 12), mats.bambooMat);
  steamerBase.position.set(0.02, -0.16, 0.34);
  leftArm.add(steamerBase);
  for (let d = 0; d < 3; d++) {
    const a = (d * Math.PI * 2) / 3;
    const dump = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), mats.dumplingMat);
    dump.position.set(0.02 + Math.cos(a) * 0.06, -0.11, 0.34 + Math.sin(a) * 0.06);
    leftArm.add(dump);
  }
  root.add(leftArm);

  // Right arm gripping brass wok ladle
  const rightArm = new THREE.Group();
  rightArm.position.set(0.3, 1.15, 0.06);
  const rSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.44, 10), mats.tunicMat);
  rSleeve.position.set(0, -0.16, 0.12);
  rSleeve.rotation.x = Math.PI * 0.3;
  rightArm.add(rSleeve);
  const ladleHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.48, 8), mats.brassMat);
  ladleHandle.position.set(0, -0.2, 0.38);
  ladleHandle.rotation.x = Math.PI * 0.42;
  rightArm.add(ladleHandle);
  const ladleCup = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), mats.brassMat);
  ladleCup.position.set(0, -0.14, 0.6);
  rightArm.add(ladleCup);
  root.add(rightArm);

  return {
    root,
    update(state, time) {
      root.position.set(state.chef.x, 0, state.chef.z);
      root.rotation.y = state.chef.yaw;
      const walk = Math.sin(state.chef.walkPhase);
      leftLeg.rotation.x = walk * 0.38;
      rightLeg.rotation.x = -walk * 0.38;
      const chopSwing = Math.sin(state.chef.chopAnim * Math.PI) * 1.15;
      const wokSwing = Math.sin(state.chef.wokAnim * Math.PI * 2) * 0.65;
      rightArm.rotation.x = -0.15 - chopSwing - wokSwing;
      leftArm.rotation.x = Math.sin(time * 2.2) * 0.04;
    },
  };
}
