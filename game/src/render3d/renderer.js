export const RENDERER_ID = 'renderer';

import * as THREE from '../../vendor/three.module.min.js';
import { createMaterialLibrary } from './materials.js';
import { buildStudioEnvironment, setupKitchenLighting } from './environment.js';
import { buildKitchenFixtures } from './sceneFixtures.js';
import { buildKitchenFood } from './sceneFood.js';
import { buildChefMesh } from './sceneChef.js';
import { buildFinishHallScene } from './sceneHall.js';
import { ROUTE_POINTS } from '../kitchen/layout.js';
import { KITCHEN_STATIONS } from '../kitchen/stations.js';
import { computeLiveNextStep } from '../kitchen/routeGuide.js';

export function createWorldRenderer(glCanvas) {
  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x160a08);
  scene.environment = buildStudioEnvironment(renderer);

  const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 60);
  const mats = createMaterialLibrary();
  const lights = setupKitchenLighting(scene);

  const kitchenGroup = new THREE.Group();
  const fixtures = buildKitchenFixtures(mats);
  const food = buildKitchenFood(mats);
  const chef = buildChefMesh(mats);
  kitchenGroup.add(fixtures.group, food.group, chef.root);
  scene.add(kitchenGroup);

  const targetBeaconRing = new THREE.Mesh(
    new THREE.RingGeometry(0.45, 0.62, 28),
    new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
  );
  targetBeaconRing.rotation.x = -Math.PI / 2;
  targetBeaconRing.position.set(0, 0.03, 0);
  targetBeaconRing.visible = false;
  kitchenGroup.add(targetBeaconRing);

  const routeTube = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ROUTE_POINTS.map((p) => new THREE.Vector3(p.x, 1.05, p.z))), 40, 0.04, 8, false),
    mats.goldHighlightMat,
  );
  routeTube.visible = false;
  kitchenGroup.add(routeTube);

  const particlePool = [];
  const pGeo = new THREE.SphereGeometry(1, 8, 6);
  const pMats = {
    steam: new THREE.MeshBasicMaterial({ color: 0xfef3c7, transparent: true, opacity: 0.45 }),
    smoke: new THREE.MeshBasicMaterial({ color: 0x374151, transparent: true, opacity: 0.55 }),
    flame: new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.8 }),
    spark: new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.9 }),
  };
  for (let i = 0; i < 64; i++) {
    const m = new THREE.Mesh(pGeo, pMats.steam);
    m.visible = false;
    kitchenGroup.add(m);
    particlePool.push(m);
  }

  const finishHall = buildFinishHallScene(mats);
  scene.add(finishHall.group);

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const raycaster = new THREE.Raycaster();

  function resize(w, h) {
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  function applyCameraForMode(state) {
    if (state.mode === 'finish') {
      camera.fov = 34;
      camera.position.set(0.16, 2.95, 3.35);
      camera.lookAt(0.32, 1.04, -0.35);
    } else if (state.mode === 'route') {
      camera.fov = 38;
      camera.position.set(10.2, 9.8, 10.6);
      camera.lookAt(3.1, 0.35, 0.1);
    } else if (state.povMode === 'overhead') {
      camera.fov = 42;
      camera.position.set(0.0, 10.6, 7.2);
      camera.lookAt(0.0, 0.4, 0.2);
    } else {
      camera.fov = 36;
      camera.position.set(6.9, 7.0, 7.8);
      camera.lookAt(0.0, 0.92, 0.08);
    }
    camera.updateProjectionMatrix();
  }

  function renderFrame(state) {
    const isFinish = state.mode === 'finish';
    kitchenGroup.visible = !isFinish;
    finishHall.group.visible = isFinish;
    applyCameraForMode(state);

    if (!isFinish) {
      chef.update(state, state.time);
      routeTube.visible = false;
      const pulse = 0.5 + 0.5 * Math.sin(state.time * 5.2);
      for (const [id, rim] of Object.entries(food.crateRims)) {
        rim.visible = state.nextCrateIds.includes(id);
        if (rim.visible) rim.scale.setScalar(1 + pulse * 0.04);
      }

      if (!state.shotMode && state.mode === 'kitchen') {
        const nextGuide = computeLiveNextStep(state);
        const st = KITCHEN_STATIONS.find((s) => s.id === nextGuide.targetStationId);
        if (st) {
          targetBeaconRing.visible = true;
          targetBeaconRing.position.set(st.interactX ?? st.x, 0.03, st.interactZ ?? st.z);
          targetBeaconRing.scale.setScalar(0.92 + pulse * 0.22);
        } else {
          targetBeaconRing.visible = false;
        }
      } else {
        targetBeaconRing.visible = false;
      }

      food.passShowcase.visible = Boolean(state.shotMode || state.stations.pass.servedTimer > 0);
      food.islandPlate.visible = Boolean(state.shotMode || state.stations.island.step > 0);
      fixtures.chopRing.visible = state.stations.chop.flashTimer > 0;
      fixtures.chopRing.scale.setScalar(1 + Math.sin(state.time * 12) * 0.08);
      for (const wm of fixtures.waterMeshes) wm.position.y = 0.985 + Math.sin(state.time * 4) * 0.004;
      food.flameCone.scale.set(1, 0.85 + Math.sin(state.time * 16) * 0.25, 1);
      food.emberRing.visible = state.stations.wokLeft.stage !== 'cool' || state.stations.wokLeft.scorched;
      lights.wokFlameLight.intensity = 2.2 + Math.sin(state.time * 14) * 0.6;

      for (let i = 0; i < particlePool.length; i++) {
        const mesh = particlePool[i];
        const p = state.particles[i];
        if (!p) {
          mesh.visible = false;
          continue;
        }
        mesh.visible = true;
        mesh.position.set(p.x, p.y, p.z);
        const fade = 1 - p.age / p.life;
        mesh.scale.setScalar(Math.max(0.01, p.size * (0.6 + (1 - fade) * 0.9)));
        mesh.material = pMats[p.kind] || pMats.steam;
      }
    } else {
      finishHall.pourGrp.position.x = Math.sin(state.time * 3.0) * 0.04;
      finishHall.drizzleRing.scale.setScalar(1 + Math.sin(state.time * 4) * 0.03);
    }

    renderer.render(scene, camera);
  }

  function projectWorldToScreen(x, y, z, width, height) {
    const v = new THREE.Vector3(x, y, z).project(camera);
    return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height, visible: v.z >= -1 && v.z <= 1 };
  }

  function raycastFloor(ndcX, ndcY) {
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const out = new THREE.Vector3();
    return raycaster.ray.intersectPlane(floorPlane, out) ? { x: out.x, z: out.z } : null;
  }

  return { resize, renderFrame, projectWorldToScreen, raycastFloor };
}
