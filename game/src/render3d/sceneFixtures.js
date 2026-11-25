export const FIXTURES_ID = 'sceneFixtures';

import * as THREE from '../../vendor/three.module.min.js';
import { buildKitchenCabinetry } from './sceneCabinets.js';
import { buildKitchenSpiceAndWallProps } from './sceneSpiceWall.js';

function addWallLantern(group, mats, wallX, y, z, dirX = 1, dirZ = 0) {
  const g = new THREE.Group();
  g.position.set(wallX, y, z);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(dirX ? 0.45 : 0.04, 0.04, dirZ ? 0.45 : 0.04), mats.darkIronMat);
  arm.position.set(dirX * 0.22, 0.28, dirZ * 0.22);
  g.add(arm);
  const lx = dirX * 0.42;
  const lz = dirZ * 0.42;
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 14), mats.silkLanternMat);
  body.scale.set(1, 1.28, 1);
  body.position.set(lx, 0, lz);
  g.add(body);
  for (const ry of [-0.26, 0.26]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 14), mats.brassMat);
    cap.position.set(lx, ry, lz);
    g.add(cap);
  }
  const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.04, 0.2, 8), mats.brassMat);
  tassel.position.set(lx, -0.38, lz);
  g.add(tassel);
  group.add(g);
}

function addWallShellAndCrest(group, mats) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 9.2), mats.flagstoneMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(11.6, 4.4, 0.2), mats.tileMat);
  backWall.position.set(0, 2.2, -4.45);
  backWall.receiveShadow = true;
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 9.0), mats.tileMat);
  leftWall.position.set(-5.65, 2.2, -0.05);
  leftWall.receiveShadow = true;
  group.add(backWall, leftWall);

  const backRail = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.06, 0.06), mats.brassMat);
  backRail.position.set(0, 1.65, -4.34);
  const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 8.8), mats.brassMat);
  leftRail.position.set(-5.53, 1.65, -0.05);
  group.add(backRail, leftRail);

  for (const cx of [-5.5, 0.2, 5.5]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.26, 4.4, 0.28), mats.walnutMat);
    col.position.set(cx, 2.2, -4.32);
    group.add(col);
  }

  const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 1.85), mats.crestMat);
  plaque.position.set(-5.5, 2.55, 0.2);
  const lampBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 10), mats.brassMat);
  lampBar.rotation.x = Math.PI / 2;
  lampBar.position.set(-5.25, 3.12, 0.2);
  group.add(plaque, lampBar);

  addWallLantern(group, mats, -5.52, 2.55, -2.9, 1, 0);
  addWallLantern(group, mats, -5.52, 2.55, 1.95, 1, 0);
  addWallLantern(group, mats, 4.95, 2.75, -4.32, 0, 1);
}

function addWetPrepAndPassProps(group, mats) {
  const sinkTop = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.06, 1.8), mats.steelMat);
  sinkTop.position.set(-4.88, 0.94, -1.75);
  group.add(sinkTop);

  const waterMeshes = [];
  for (const wz of [-2.12, -1.38]) {
    const basin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.58), mats.darkIronMat);
    basin.position.set(-4.88, 0.96, wz);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.52), mats.waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-4.88, 0.985, wz);
    group.add(basin, water);
    waterMeshes.push(water);
  }
  const faucet = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 16, Math.PI), mats.steelMat);
  faucet.position.set(-5.22, 1.15, -1.75);
  faucet.rotation.y = Math.PI / 2;
  const soap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 10), mats.ceramicMat);
  soap.position.set(-5.2, 1.04, -1.05);
  const sponge = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.045, 0.07), mats.noodleMat);
  sponge.position.set(-4.52, 0.99, -1.05);
  group.add(faucet, soap, sponge);

  const rack = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.8), mats.steelMat);
  rack.position.set(-4.85, 0.96, -0.45);
  group.add(rack);
  for (let p = 0; p < 5; p++) {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.022, 16), mats.ceramicMat);
    plate.rotation.z = Math.PI / 2;
    plate.position.set(-4.85, 1.14, -0.72 + p * 0.13);
    group.add(plate);
  }

  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.56, 0.94, 20), mats.walnutMat);
  stump.position.set(-4.65, 0.47, 0.85);
  stump.castShadow = true;
  const stumpTop = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 20), mats.butcherEndMat);
  stumpTop.position.set(-4.65, 0.95, 0.85);
  const cleaverBlade = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.015, 0.15), mats.steelMat);
  cleaverBlade.position.set(-4.58, 1.03, 0.88);
  cleaverBlade.rotation.y = 0.42;
  const cleaverHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8), mats.walnutMat);
  cleaverHandle.rotation.z = Math.PI / 2;
  cleaverHandle.rotation.y = 0.42;
  cleaverHandle.position.set(-4.42, 1.03, 0.96);
  const chopRing = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.46, 24), mats.goldHighlightMat);
  chopRing.rotation.x = -Math.PI / 2;
  chopRing.position.set(-4.65, 1.005, 0.85);
  group.add(stump, stumpTop, cleaverBlade, cleaverHandle, chopRing);

  // Twin wok range + 3-tier steamer + cruet + service bell + caddy
  const range = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.92, 1.4), mats.steelMat);
  range.position.set(-2.2, 0.46, -3.25);
  range.castShadow = true;
  group.add(range);
  for (let d = 0; d < 4; d++) {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12), mats.brassMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(-3.4 + d * 0.72, 0.72, -2.53);
    group.add(dial);
  }
  for (const wx of [-3.05, -1.75]) {
    const wok = new THREE.Mesh(
      new THREE.SphereGeometry(0.46, 18, 12, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55),
      mats.darkIronMat,
    );
    wok.position.set(wx, 1.05, -3.15);
    wok.material.side = THREE.DoubleSide;
    group.add(wok);
  }
  for (let t = 0; t < 3; t++) {
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.19, 16), mats.bambooMat);
    tier.position.set(-0.45, 1.02 + t * 0.2, -3.15);
    group.add(tier);
  }
  const lid = new THREE.Mesh(new THREE.ConeGeometry(0.33, 0.14, 16), mats.bambooMat);
  lid.position.set(-0.45, 1.58, -3.15);
  const oilCruet = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.24, 12), mats.copperMat);
  oilCruet.position.set(-0.78, 1.08, -0.2);
  const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.04, 16), mats.darkIronMat);
  bellBase.position.set(2.65, 1.0, 3.15);
  const bellDome = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.brassMat);
  bellDome.position.set(2.65, 1.02, 3.15);
  const caddy = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.22), mats.lacquerMat);
  caddy.position.set(-2.85, 1.08, 3.18);
  group.add(lid, oilCruet, bellBase, bellDome, caddy);
  return { waterMeshes, chopRing };
}

export function buildKitchenFixtures(mats) {
  const group = new THREE.Group();
  addWallShellAndCrest(group, mats);
  buildKitchenCabinetry(group, mats);
  buildKitchenSpiceAndWallProps(group, mats);
  const wetRefs = addWetPrepAndPassProps(group, mats);
  return { group, ...wetRefs };
}
