export const ENV_LIGHTING_ID = 'environment';

import * as THREE from '../../vendor/three.module.min.js';

export function buildStudioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x281611);

  const panels = [
    { w: 14, h: 10, col: 0xffe4b8, pos: [0, 7, 0], rot: [Math.PI / 2, 0, 0] },
    { w: 10, h: 6, col: 0xf59e0b, pos: [-7, 2, 0], rot: [0, Math.PI / 2, 0] },
    { w: 10, h: 6, col: 0x93c5fd, pos: [7, 2, 2], rot: [0, -Math.PI / 2, 0] },
  ];
  for (const p of panels) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(p.w, p.h),
      new THREE.MeshBasicMaterial({ color: p.col, side: THREE.DoubleSide }),
    );
    m.position.set(...p.pos);
    m.rotation.set(...p.rot);
    envScene.add(m);
  }
  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return rt.texture;
}

export function setupKitchenLighting(scene) {
  scene.add(new THREE.HemisphereLight(0xffe9cc, 0x3b1c12, 1.08));

  const keyDir = new THREE.DirectionalLight(0xfff1dc, 2.25);
  keyDir.position.set(5.5, 9.5, 6.2);
  keyDir.castShadow = true;
  keyDir.shadow.mapSize.set(2048, 2048);
  keyDir.shadow.camera.near = 1;
  keyDir.shadow.camera.far = 26;
  Object.assign(keyDir.shadow.camera, { left: -7.5, right: 7.5, top: 7.5, bottom: -7.5 });
  keyDir.shadow.bias = -0.0005;
  scene.add(keyDir);

  const pts = [
    [0xfff2d6, 2.4, 7.5, -1.8, 2.35, -3.0],
    [0xff8c42, 2.1, 7.0, -4.9, 2.3, 0.5],
    [0xff9d4a, 2.0, 7.5, 4.8, 2.4, -2.8],
    [0xfff3d6, 1.8, 11, 3.8, 3.6, -0.6],
    [0xffd89e, 2.4, 7.5, 0.0, 3.1, 2.4],
  ];
  for (const [c, i, d, x, y, z] of pts) {
    const l = new THREE.PointLight(c, i, d);
    l.position.set(x, y, z);
    scene.add(l);
  }
  const wokFlameLight = new THREE.PointLight(0xff6b1a, 2.5, 4.5);
  wokFlameLight.position.set(-1.75, 1.25, -3.15);
  scene.add(wokFlameLight);

  return { keyDir, wokFlameLight };
}
