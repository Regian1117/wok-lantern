export const HALL_SCENE_ID = 'sceneHall';

import * as THREE from '../../vendor/three.module.min.js';
import { buildPekingDuckPlatter, buildCharKwayTeowBowl, buildXiaolongbaoSteamer } from './sceneFood.js';

function addDiningHallBackdrop(group, mats) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 16), mats.diningFloorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.2, -3.5);
  floor.receiveShadow = true;
  group.add(floor);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 6.2, 0.25), mats.lacquerMat);
  backWall.position.set(0, 1.9, -9.8);
  group.add(backWall);

  // 2 warm golden arched night-market lattice wall windows + glowing panes
  const winGlowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
  const winArchMat = new THREE.MeshBasicMaterial({ color: 0xfde68a });
  for (const wx of [-2.85, 2.85]) {
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.4, 0.1), mats.walnutMat);
    winFrame.position.set(wx, 1.35, -9.62);
    const amberPane = new THREE.Mesh(new THREE.PlaneGeometry(1.82, 2.05), winGlowMat);
    amberPane.position.set(wx, 1.35, -9.55);
    const archCap = new THREE.Mesh(new THREE.CircleGeometry(0.91, 18, 0, Math.PI), winArchMat);
    archCap.position.set(wx, 2.35, -9.54);
    group.add(winFrame, amberPane, archCap);
    for (let m = -1; m <= 1; m++) {
      const barV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.05, 0.06), mats.walnutMat);
      barV.position.set(wx + m * 0.45, 1.35, -9.52);
      group.add(barV);
    }
    const barH = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.06, 0.06), mats.walnutMat);
    barH.position.set(wx, 1.35, -9.52);
    group.add(barH);
  }

  for (const sx of [0, -5.2, 5.2]) {
    const scroll = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 2.1), mats.scrollMat);
    scroll.position.set(sx, 1.45, -9.58);
    group.add(scroll);
  }

  // Blue porcelain bamboo planters along columns
  for (const px of [-4.6, 4.6]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.48, 14), mats.cobaltCeramicMat);
    pot.position.set(px, -0.95, -7.2);
    group.add(pot);
    for (let b = -1; b <= 1; b++) {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.036, 2.3, 8), mats.scallionMat);
      stalk.position.set(px + b * 0.08, 0.35, -7.2);
      const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(0.26, 0), mats.bokChoyMat);
      canopy.position.set(px + b * 0.14, 1.42 + (b % 2) * 0.18, -7.15);
      group.add(stalk, canopy);
    }
  }

  // Exposed ceiling rafters & 4 glowing amber/crimson ribbed silk palace lanterns
  for (const rz of [-7.2, -5.6, -3.8]) {
    const rafter = new THREE.Mesh(new THREE.BoxGeometry(17, 0.2, 0.22), mats.walnutMat);
    rafter.position.set(0, 3.05, rz);
    group.add(rafter);
  }
  const lanternSilkMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    emissive: 0xea580c,
    emissiveIntensity: 1.15,
    roughness: 0.42,
  });
  for (const lx of [-3.3, -1.1, 1.1, 3.3]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.35, 6), mats.darkIronMat);
    cord.position.set(lx, 2.38, -5.6);
    const lBody = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 14), lanternSilkMat);
    lBody.scale.set(1, 1.24, 1);
    lBody.position.set(lx, 1.68, -5.6);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 12), mats.brassMat);
    capTop.position.set(lx, 2.06, -5.6);
    const capBot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 12), mats.brassMat);
    capBot.position.set(lx, 1.3, -5.6);
    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.22, 8), mats.brassMat);
    tassel.position.set(lx, 1.16, -5.6);
    group.add(cord, lBody, capTop, capBot, tassel);
  }

  const lanternGlowL = new THREE.PointLight(0xff9b3d, 3.6, 14);
  lanternGlowL.position.set(-2.2, 1.6, -5.2);
  const lanternGlowR = new THREE.PointLight(0xff9b3d, 3.6, 14);
  lanternGlowR.position.set(2.2, 1.6, -5.2);
  group.add(lanternGlowL, lanternGlowR);

  // 5 walnut dining tables with crimson silk runners, glowing candles, teapots & cups
  const flameHaloMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
  const tableCoords = [
    [-3.9, -7.5],
    [0, -7.8],
    [3.9, -7.5],
    [-2.7, -4.6],
    [2.7, -4.6],
  ];
  for (const [tx, tz] of tableCoords) {
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.1, 1.2), mats.walnutMat);
    top.position.set(tx, -0.32, tz);
    const runner = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.02, 0.42), mats.crimsonVelvetMat);
    runner.position.set(tx, -0.26, tz);
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 10), mats.silkLanternMat);
    candle.position.set(tx, -0.18, tz);
    const candleFlame = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), flameHaloMat);
    candleFlame.position.set(tx, -0.09, tz);
    const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), mats.cobaltCeramicMat);
    teapot.position.set(tx + 0.35, -0.18, tz + 0.15);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.06, 10), mats.ceramicMat);
    cup.position.set(tx - 0.34, -0.23, tz + 0.18);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.02, 12), mats.ceramicMat);
    plate.position.set(tx - 0.55, -0.24, tz - 0.14);
    group.add(top, runner, candle, candleFlame, teapot, cup, plate);

    for (const cx of [-0.65, 0.65]) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, 0.45), mats.crimsonVelvetMat);
      seat.position.set(tx + cx, -0.62, tz + 0.72);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 0.05), mats.walnutMat);
      back.position.set(tx + cx, -0.35, tz + 0.94);
      group.add(seat, back);
    }
  }
}

function buildGlazeBottleAndPour(mats) {
  const pourGrp = new THREE.Group();

  // Tilted squeeze bottle above VIP Peking Duck platter
  const bottleGrp = new THREE.Group();
  bottleGrp.position.set(-0.34, 0.46, -0.16);
  bottleGrp.rotation.set(0.32, 0.15, -2.35);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.34, 16), mats.glazeMat);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.06, 14), mats.brassMat);
  collar.position.y = 0.2;
  const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.12, 12), mats.glazeMat);
  nozzle.position.y = 0.28;
  bottleGrp.add(body, collar, nozzle);
  bottleGrp.updateMatrix();

  // Compute exact nozzle tip in pourGrp coordinates -> 0-gap glaze tube!
  const tipLocal = new THREE.Vector3(0, 0.34, 0);
  const tipPos = tipLocal.clone().applyMatrix4(bottleGrp.matrix);
  const landPos = new THREE.Vector3(-0.02, 0.08, -0.02);
  const midPos = new THREE.Vector3(
    (tipPos.x + landPos.x) * 0.5 + 0.02,
    (tipPos.y + landPos.y) * 0.52,
    (tipPos.z + landPos.z) * 0.5,
  );
  const curve = new THREE.CatmullRomCurve3([tipPos, midPos, landPos]);
  const streamGeo = new THREE.TubeGeometry(curve, 18, 0.017, 10, false);
  const stream = new THREE.Mesh(streamGeo, mats.glazeMat);

  const puddle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.014, 16), mats.glazeMat);
  puddle.position.set(landPos.x, 0.072, landPos.z);

  pourGrp.add(bottleGrp, stream, puddle);
  return { pourGrp, bottleGrp, stream };
}

export function buildFinishHallScene(mats) {
  const group = new THREE.Group();
  group.visible = false;
  addDiningHallBackdrop(group, mats);

  const hallLight = new THREE.PointLight(0xffb86c, 3.0, 14);
  hallLight.position.set(0, 2.2, -1.5);
  group.add(hallLight);

  // Macro Marble Workbench (cream veined marble on top, sleek brass front bullnose below)
  const bench = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.5, 2.6), mats.marbleMat);
  bench.position.set(0, -0.25, 0);
  bench.receiveShadow = true;
  const trim = new THREE.Mesh(new THREE.BoxGeometry(5.64, 0.06, 0.08), mats.brassMat);
  trim.position.set(0, -0.04, 1.32);
  group.add(bench, trim);

  // Hero center octagonal VIP Peking Duck platter + golden drizzle sweet-spot ring
  const duckPlatter = buildPekingDuckPlatter(mats, 1.75);
  duckPlatter.position.set(0, 0.03, 0.05);
  group.add(duckPlatter);

  const drizzleRing = new THREE.Mesh(new THREE.RingGeometry(0.56, 0.62, 32), mats.goldHighlightMat);
  drizzleRing.rotation.x = -Math.PI / 2;
  drizzleRing.position.set(0, 0.02, 0.05);
  group.add(drizzleRing);

  const { pourGrp, bottleGrp, stream } = buildGlazeBottleAndPour(mats);
  group.add(pourGrp);

  // Flanking macro dishes + 3 mise-en-place pinch bowls + cruet + bell
  const sideCkt = buildCharKwayTeowBowl(mats, 1.35);
  sideCkt.position.set(-1.55, 0.02, 0.12);
  const sideXlb = buildXiaolongbaoSteamer(mats, 1.3);
  sideXlb.position.set(1.52, 0.02, 0.14);
  group.add(sideCkt, sideXlb);

  const pinchSpecs = [
    { x: -0.92, z: -0.68, mat: mats.scallionMat },
    { x: -0.45, z: -0.78, mat: mats.noodleMat },
    { x: 0.02, z: -0.74, mat: mats.chiliMat },
  ];
  for (const ps of pinchSpecs) {
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.09, 16), mats.brassMat);
    rim.position.set(ps.x, 0.045, ps.z);
    const fill = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), ps.mat);
    fill.scale.set(1, 0.45, 1);
    fill.position.set(ps.x, 0.075, ps.z);
    group.add(rim, fill);
  }

  const cruet = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.34, 14), mats.copperMat);
  cruet.position.set(1.15, 0.17, -0.65);
  const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.05, 18), mats.darkIronMat);
  bellBase.position.set(1.9, 0.025, -0.48);
  const bellDome = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.brassMat);
  bellDome.position.set(1.9, 0.05, -0.48);
  group.add(cruet, bellBase, bellDome);

  return { group, pourGrp, bottleGrp, stream, drizzleRing };
}
