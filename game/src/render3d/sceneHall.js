export const HALL_SCENE_ID = 'sceneHall';

import * as THREE from '../../vendor/three.module.min.js';
import { buildPekingDuckPlatter, buildCharKwayTeowBowl, buildXiaolongbaoSteamer } from './sceneFood.js';

function addDiningHallBackdrop(group, mats) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 14), mats.diningFloorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.0, -3.5);
  floor.receiveShadow = true;
  group.add(floor);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 6.2, 0.25), mats.lacquerMat);
  backWall.position.set(0, 3.0, -7.8);
  group.add(backWall);

  // 2 warm golden arched night-market lattice wall windows + scrolls
  const winGlowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
  const winArchMat = new THREE.MeshBasicMaterial({ color: 0xfde68a });
  for (const wx of [-2.4, 2.4]) {
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.9, 0.1), mats.walnutMat);
    winFrame.position.set(wx, 0.98, -7.62);
    const amberPane = new THREE.Mesh(new THREE.PlaneGeometry(1.66, 1.65), winGlowMat);
    amberPane.position.set(wx, 0.98, -7.55);
    const archCap = new THREE.Mesh(new THREE.CircleGeometry(0.83, 18, 0, Math.PI), winArchMat);
    archCap.position.set(wx, 1.8, -7.54);
    group.add(winFrame, amberPane, archCap);
    for (let m = -1; m <= 1; m++) {
      const barV = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1.65, 0.06), mats.walnutMat);
      barV.position.set(wx + m * 0.42, 0.98, -7.52);
      group.add(barV);
    }
    const barH = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.055, 0.06), mats.walnutMat);
    barH.position.set(wx, 0.98, -7.52);
    group.add(barH);
  }
  for (const sx of [0, -4.4, 4.4]) {
    const scroll = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 1.7), mats.scrollMat);
    scroll.position.set(sx, 1.15, -7.58);
    group.add(scroll);
  }

  // Blue porcelain bamboo planters along wall columns
  for (const px of [-3.9, 3.9]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.44, 14), mats.cobaltCeramicMat);
    pot.position.set(px, 0.22, -6.2);
    group.add(pot);
    for (let b = -1; b <= 1; b++) {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 2.1, 8), mats.scallionMat);
      stalk.position.set(px + b * 0.08, 1.4, -6.2);
      const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), mats.bokChoyMat);
      canopy.position.set(px + b * 0.13, 2.38 + (b % 2) * 0.16, -6.15);
      group.add(stalk, canopy);
    }
  }

  // Exposed ceiling rafters + 4 hanging ribbed silk palace lanterns
  for (const rz of [-6.0, -4.8, -3.5]) {
    const rafter = new THREE.Mesh(new THREE.BoxGeometry(16, 0.18, 0.2), mats.walnutMat);
    rafter.position.set(0, 2.45, rz);
    group.add(rafter);
  }
  const lanternSilkMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    emissive: 0xea580c,
    emissiveIntensity: 1.2,
    roughness: 0.4,
  });
  for (const lx of [-2.6, -0.85, 0.85, 2.6]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.85, 6), mats.darkIronMat);
    cord.position.set(lx, 2.02, -4.8);
    const lBody = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), lanternSilkMat);
    lBody.scale.set(1, 1.24, 1);
    lBody.position.set(lx, 1.48, -4.8);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.045, 12), mats.brassMat);
    capTop.position.set(lx, 1.79, -4.8);
    const capBot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.045, 12), mats.brassMat);
    capBot.position.set(lx, 1.17, -4.8);
    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.04, 0.18, 8), mats.brassMat);
    tassel.position.set(lx, 1.06, -4.8);
    group.add(cord, lBody, capTop, capBot, tassel);
  }
  const lanternGlowL = new THREE.PointLight(0xff9b3d, 3.6, 14);
  lanternGlowL.position.set(-1.8, 1.7, -4.5);
  const lanternGlowR = new THREE.PointLight(0xff9b3d, 3.6, 14);
  lanternGlowR.position.set(1.8, 1.7, -4.5);
  group.add(lanternGlowL, lanternGlowR);

  // 5 walnut dining tables with crimson runners, glowing candles, teapots & cups
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
  const tables = [
    [-3.3, -5.9],
    [0, -6.1],
    [3.3, -5.9],
    [-2.2, -3.5],
    [2.3, -3.5],
  ];
  for (const [tx, tz] of tables) {
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.09, 1.1), mats.walnutMat);
    top.position.set(tx, 0.72, tz);
    const runner = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.02, 0.38), mats.crimsonVelvetMat);
    runner.position.set(tx, 0.77, tz);
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.13, 10), mats.silkLanternMat);
    candle.position.set(tx, 0.84, tz);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), flameMat);
    flame.position.set(tx, 0.93, tz);
    const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), mats.cobaltCeramicMat);
    teapot.position.set(tx + 0.32, 0.85, tz + 0.14);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.032, 0.055, 10), mats.ceramicMat);
    cup.position.set(tx - 0.32, 0.8, tz + 0.16);
    group.add(top, runner, candle, flame, teapot, cup);
    for (const cx of [-0.58, 0.58]) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.055, 0.42), mats.crimsonVelvetMat);
      seat.position.set(tx + cx, 0.44, tz + 0.68);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.045), mats.walnutMat);
      back.position.set(tx + cx, 0.7, tz + 0.88);
      group.add(seat, back);
    }
  }
}

function buildGlazeBottleAndPour(mats) {
  const pourGrp = new THREE.Group();
  pourGrp.position.set(-0.08, 0.96, 0.14);

  const bottleGrp = new THREE.Group();
  bottleGrp.position.set(-0.28, 0.42, -0.14);
  bottleGrp.rotation.set(0.32, 0.15, -2.35);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.32, 16), mats.glazeMat);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 0.055, 14), mats.brassMat);
  collar.position.y = 0.18;
  const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.11, 12), mats.glazeMat);
  nozzle.position.y = 0.26;
  bottleGrp.add(body, collar, nozzle);
  bottleGrp.updateMatrix();

  const tipLocal = new THREE.Vector3(0, 0.315, 0);
  const tipPos = tipLocal.clone().applyMatrix4(bottleGrp.matrix);
  const landPos = new THREE.Vector3(-0.02, 0.065, -0.01);
  const midPos = new THREE.Vector3((tipPos.x + landPos.x) * 0.5 + 0.02, (tipPos.y + landPos.y) * 0.52, (tipPos.z + landPos.z) * 0.5);
  const stream = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([tipPos, midPos, landPos]), 18, 0.016, 10, false), mats.glazeMat);
  const puddle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.014, 16), mats.glazeMat);
  puddle.position.set(landPos.x, 0.06, landPos.z);

  pourGrp.add(bottleGrp, stream, puddle);
  return { pourGrp, bottleGrp, stream };
}

export function buildFinishHallScene(mats) {
  const group = new THREE.Group();
  group.visible = false;
  addDiningHallBackdrop(group, mats);

  const hallLight = new THREE.PointLight(0xffb86c, 3.2, 14);
  hallLight.position.set(0.2, 2.9, 0.5);
  group.add(hallLight);

  // Macro Marble Workbench (top at y = 0.94, matching F4_OVERHEAD_MACRO)
  const bench = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.94, 2.4), mats.marbleMat);
  bench.position.set(0, 0.47, 0.1);
  bench.receiveShadow = true;
  const trim = new THREE.Mesh(new THREE.BoxGeometry(5.64, 0.055, 0.08), mats.brassMat);
  trim.position.set(0, 0.9, 1.32);
  group.add(bench, trim);

  const duckPlatter = buildPekingDuckPlatter(mats, 1.48);
  duckPlatter.position.set(-0.08, 0.96, 0.14);
  const drizzleRing = new THREE.Mesh(new THREE.RingGeometry(0.58, 0.63, 32), mats.goldHighlightMat);
  drizzleRing.rotation.x = -Math.PI / 2;
  drizzleRing.position.set(-0.08, 0.952, 0.14);
  group.add(duckPlatter, drizzleRing);

  const { pourGrp, bottleGrp, stream } = buildGlazeBottleAndPour(mats);
  group.add(pourGrp);

  const sideCkt = buildCharKwayTeowBowl(mats, 1.18);
  sideCkt.position.set(-1.15, 0.95, 0.24);
  const sideXlb = buildXiaolongbaoSteamer(mats, 1.15);
  sideXlb.position.set(0.98, 0.95, -0.18);
  group.add(sideCkt, sideXlb);

  for (const ps of [
    { x: -0.78, z: -0.48, mat: mats.scallionMat },
    { x: -0.35, z: -0.58, mat: mats.noodleMat },
    { x: 0.08, z: -0.54, mat: mats.chiliMat },
  ]) {
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.08, 16), mats.brassMat);
    rim.position.set(ps.x, 0.98, ps.z);
    const fill = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), ps.mat);
    fill.scale.set(1, 0.45, 1);
    fill.position.set(ps.x, 1.01, ps.z);
    group.add(rim, fill);
  }

  const cruet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.3, 14), mats.copperMat);
  cruet.position.set(0.55, 1.1, -0.45);
  const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.045, 18), mats.darkIronMat);
  bellBase.position.set(0.76, 0.96, 0.44);
  const bellDome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.brassMat);
  bellDome.position.set(0.76, 0.98, 0.44);
  group.add(cruet, bellBase, bellDome);

  return { group, pourGrp, bottleGrp, stream, drizzleRing };
}
