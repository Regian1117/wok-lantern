export const RENDERER_ID = 'renderer';

import * as THREE from '../../vendor/three.module.min.js';
import { createMaterialLibrary } from './materials.js';
import { buildStudioEnvironment, setupKitchenLighting } from './environment.js';
import { buildKitchenFixtures } from './sceneFixtures.js';
import { buildKitchenFood } from './sceneFood.js';
import { buildChefMesh } from './sceneChef.js';
import { buildFinishHallScene } from './sceneHall.js';
import { ROUTE_POINTS } from '../kitchen/layout.js';

export function createWorldRenderer(glCanvas) {
  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x160a08);
  scene.environment = buildStudioEnvironment(renderer);

  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 60);
  const mats = createMaterialLibrary();
  const lights = setupKitchenLighting(scene);

  const kitchenGroup = new THREE.Group();
  const fixtures = buildKitchenFixtures(mats);
  const food = buildKitchenFood(mats);
  const chef = buildChefMesh(mats);
  kitchenGroup.add(fixtures.group, food.group, chef.root);
  scene.add(kitchenGroup);

  // Dashed golden route line in 3D for route mode
  const routeCurvePts = ROUTE_POINTS.map((p) => new THREE.Vector3(p.x, 1.05, p.z));
  const routeCurve = new THREE.CatmullRomCurve3(routeCurvePts);
  const routeTube = new THREE.Mesh(
    new THREE.TubeGeometry(routeCurve, 40, 0.045, 8, false),
    mats.goldHighlightMat,
  );
  routeTube.visible = false;
  kitchenGroup.add(routeTube);

  // Reusable particle pool
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

  function applyCameraForMode(mode) {
    if (mode === 'finish') {
      camera.fov = 42;
      camera.position.set(0.0, 1.82, 2.95);
      camera.lookAt(0.0, 0.36, -1.45);
    } else if (mode === 'route') {
      camera.fov = 45;
      camera.position.set(3.4, 8.8, 8.4);
      camera.lookAt(1.6, 0.4, -0.1);
    } else {
      camera.fov = 42;
      camera.position.set(0.0, 8.35, 8.15);
      camera.lookAt(0.0, 0.45, 0.15);
    }
    camera.updateProjectionMatrix();
  }

  function renderFrame(state) {
    const isFinish = state.mode === 'finish';
    kitchenGroup.visible = !isFinish;
    finishHall.group.visible = isFinish;
    applyCameraForMode(state.mode);

    if (!isFinish) {
      chef.update(state, state.time);
      routeTube.visible = false;
      const pulse = 0.5 + 0.5 * Math.sin(state.time * 5.2);
      for (const [id, rim] of Object.entries(food.crateRims)) {
        rim.visible = state.nextCrateIds.includes(id);
        if (rim.visible) rim.scale.setScalar(1 + pulse * 0.04);
      }
      fixtures.chopRing.visible = state.stations.chop.flashTimer > 0;
      fixtures.chopRing.scale.setScalar(1 + Math.sin(state.time * 12) * 0.08);
      for (const wm of fixtures.waterMeshes) {
        wm.position.y = 0.985 + Math.sin(state.time * 4) * 0.004;
      }
      food.flameCone.scale.set(1, 0.85 + Math.sin(state.time * 16) * 0.25, 1);
      food.emberRing.visible = state.stations.wokLeft.scorched;
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
      const sway = Math.sin(state.time * 3.0) * 0.04;
      finishHall.pourGrp.position.x = sway;
      finishHall.drizzleRing.scale.setScalar(1 + Math.sin(state.time * 4) * 0.03);
    }

    renderer.render(scene, camera);
  }

  function projectWorldToScreen(x, y, z, width, height) {
    const v = new THREE.Vector3(x, y, z).project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * width,
      y: (-v.y * 0.5 + 0.5) * height,
      visible: v.z >= -1 && v.z <= 1,
    };
  }

  function raycastFloor(ndcX, ndcY) {
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const out = new THREE.Vector3();
    return raycaster.ray.intersectPlane(floorPlane, out) ? { x: out.x, z: out.z } : null;
  }

  return { resize, renderFrame, projectWorldToScreen, raycastFloor };
}
