export const SPICE_WALL_ID = 'sceneSpiceWall';

import * as THREE from '../../vendor/three.module.min.js';

export function buildKitchenSpiceAndWallProps(group, mats) {
  // Back-left riveted overhead exhaust hood + warm under-hood light strip + utensil rail
  const hood = new THREE.Mesh(new THREE.BoxGeometry(3.95, 0.68, 1.52), mats.steelMat);
  hood.position.set(-2.2, 2.86, -3.25);
  const hoodLip = new THREE.Mesh(new THREE.BoxGeometry(3.98, 0.06, 1.55), mats.brassMat);
  hoodLip.position.set(-2.2, 2.52, -3.25);
  const taskStrip = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.04, 0.12), mats.goldHighlightMat);
  taskStrip.position.set(-2.2, 2.5, -2.95);
  const utensilRail = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 3.2, 8), mats.brassMat);
  utensilRail.rotation.z = Math.PI / 2;
  utensilRail.position.set(-2.2, 2.25, -4.18);
  group.add(hood, hoodLip, taskStrip, utensilRail);

  for (let u = 0; u < 5; u++) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 6), mats.brassMat);
    stem.position.set(-3.4 + u * 0.6, 2.07, -4.18);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 10), u % 2 === 0 ? mats.copperMat : mats.steelMat);
    bowl.rotation.x = Math.PI / 2;
    bowl.position.set(-3.4 + u * 0.6, 1.88, -4.18);
    group.add(stem, bowl);
  }

  // Back-right 2-tier walnut & brass spice shelf with 16 colorful bottles + crocks + mortar
  for (const sy of [1.95, 2.48]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.05, 0.38), mats.walnutMat);
    shelf.position.set(2.85, sy, -4.18);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(4.12, 0.025, 0.03), mats.brassMat);
    trim.position.set(2.85, sy, -3.99);
    group.add(shelf, trim);
  }
  const bottleMats = [mats.lacquerMat, mats.chiliMat, mats.cobaltCeramicMat, mats.noodleMat];
  for (let i = 0; i < 16; i++) {
    const tierY = i < 8 ? 2.1 : 2.63;
    const bx = 1.05 + (i % 8) * 0.5;
    const btl = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.24, 10), bottleMats[i % 4]);
    btl.position.set(bx, tierY, -4.15);
    const lbl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 10), mats.ceramicMat);
    lbl.position.set(bx, tierY - 0.01, -4.15);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.05, 8), mats.brassMat);
    cap.position.set(bx, tierY + 0.14, -4.15);
    group.add(btl, lbl, cap);
  }
  const mortar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.14, 12), mats.darkIronMat);
  mortar.position.set(4.55, 1.03, -3.55);
  const pestle = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.034, 0.22, 8), mats.walnutMat);
  pestle.position.set(4.58, 1.14, -3.55);
  pestle.rotation.z = 0.45;
  group.add(mortar, pestle);

  // Left-wall magnetic knife strip (4 knives), herb/tea shelf (3 pots + teal caddy), brass skillet rail
  const knifeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 1.2), mats.walnutMat);
  knifeStrip.position.set(-5.5, 1.82, 0.85);
  group.add(knifeStrip);
  for (let k = 0; k < 4; k++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.26 - k * 0.02, 0.08 - k * 0.01), mats.steelMat);
    blade.position.set(-5.46, 1.72, 0.42 + k * 0.28);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.11, 0.03), mats.walnutMat);
    grip.position.set(-5.46, 1.9, 0.42 + k * 0.28);
    group.add(blade, grip);
  }

  const herbShelf = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 1.65), mats.walnutMat);
  herbShelf.position.set(-5.34, 2.1, -1.75);
  group.add(herbShelf);
  for (const hz of [-2.22, -1.82, -1.42]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.16, 10), mats.copperMat);
    pot.position.set(-5.32, 2.21, hz);
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), mats.bokChoyMat);
    leaves.position.set(-5.32, 2.35, hz);
    group.add(pot, leaves);
  }
  const caddy = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.19, 12), mats.cobaltCeramicMat);
  caddy.position.set(-5.32, 2.22, -1.04);
  group.add(caddy);

  const skilletRail = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2, 8), mats.brassMat);
  skilletRail.rotation.x = Math.PI / 2;
  skilletRail.position.set(-5.46, 1.56, -0.55);
  group.add(skilletRail);
  for (let p = 0; p < 2; p++) {
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.04, 14), p === 0 ? mats.copperMat : mats.darkIronMat);
    pan.rotation.z = Math.PI / 2;
    pan.position.set(-5.42, 1.32, -0.8 + p * 0.48);
    group.add(pan);
  }
}
