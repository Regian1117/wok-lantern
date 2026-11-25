export const CABINETS_ID = 'sceneCabinets';

import * as THREE from '../../vendor/three.module.min.js';

function addCabinetRun(group, mats, oxbloodMat, x, z, w, d, drawers, faceAxis = 'x', faceSign = 1) {
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, 0.1, d - 0.04), mats.darkIronMat);
  plinth.position.set(x, 0.05, z);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, 0.78, d), oxbloodMat);
  body.position.set(x, 0.49, z);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(plinth, body);

  for (let i = 0; i < drawers; i++) {
    const t = (i + 0.5) / drawers - 0.5;
    for (const ry of [0.3, 0.68]) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(faceAxis === 'z' ? w / drawers - 0.08 : 0.03, 0.3, faceAxis === 'x' ? d / drawers - 0.08 : 0.03),
        oxbloodMat,
      );
      const pull = new THREE.Mesh(
        new THREE.BoxGeometry(faceAxis === 'z' ? 0.24 : 0.03, 0.025, faceAxis === 'x' ? 0.24 : 0.03),
        mats.brassMat,
      );
      const px = faceAxis === 'z' ? x + t * w : x + faceSign * (w * 0.5 + 0.015);
      const pz = faceAxis === 'x' ? z + t * d : z + faceSign * (d * 0.5 + 0.015);
      panel.position.set(px, ry, pz);
      pull.position.set(px + (faceAxis === 'x' ? faceSign * 0.025 : 0), ry + 0.06, pz + (faceAxis === 'z' ? faceSign * 0.025 : 0));
      group.add(panel, pull);
    }
  }
}

export function buildKitchenCabinetry(group, mats) {
  const oxbloodMat = new THREE.MeshStandardMaterial({ color: 0x5c1a15, roughness: 0.36, metalness: 0.1 });

  // Left wet/prep cabinet + oak butcher-block prep top
  addCabinetRun(group, mats, oxbloodMat, -4.9, -1.25, 1.3, 5.2, 4, 'x', 1);
  const leftOak = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.08, 3.35), mats.oakMat);
  leftOak.position.set(-4.88, 0.92, -0.55);
  leftOak.receiveShadow = true;
  group.add(leftOak);

  // Back-right & right larder oxblood cabinetry + oak tops
  addCabinetRun(group, mats, oxbloodMat, 2.8, -3.25, 4.8, 1.35, 4, 'z', 1);
  const backOak = new THREE.Mesh(new THREE.BoxGeometry(4.84, 0.08, 1.38), mats.oakMat);
  backOak.position.set(2.8, 0.92, -3.25);
  backOak.receiveShadow = true;
  addCabinetRun(group, mats, oxbloodMat, 4.85, -0.2, 1.3, 4.7, 4, 'x', -1);
  const rightOak = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.08, 4.74), mats.oakMat);
  rightOak.position.set(4.85, 0.92, -0.2);
  rightOak.receiveShadow = true;
  group.add(backOak, rightOak);

  // Center assembly island + oak top
  addCabinetRun(group, mats, oxbloodMat, 0.1, 0.08, 2.65, 1.55, 2, 'z', 1);
  const islandTop = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.08, 1.64), mats.oakMat);
  islandTop.position.set(0.1, 0.92, 0.08);
  islandTop.receiveShadow = true;
  group.add(islandTop);

  // Front marble Service Pass + brass bullnose
  addCabinetRun(group, mats, oxbloodMat, 0, 3.25, 6.9, 1.05, 4, 'z', -1);
  const passMarble = new THREE.Mesh(new THREE.BoxGeometry(7.05, 0.09, 1.15), mats.marbleMat);
  passMarble.position.set(0, 0.94, 3.25);
  passMarble.receiveShadow = true;
  const bullnose = new THREE.Mesh(new THREE.BoxGeometry(7.08, 0.04, 0.05), mats.brassMat);
  bullnose.position.set(0, 0.95, 2.68);
  group.add(passMarble, bullnose);

  // Perforated anti-fatigue rubber mats
  const matHot = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.025, 0.9), mats.rubberMat);
  matHot.position.set(-1.9, 0.015, -2.05);
  const matWet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 3.2), mats.rubberMat);
  matWet.position.set(-3.7, 0.015, -0.4);
  group.add(matHot, matWet);
}
