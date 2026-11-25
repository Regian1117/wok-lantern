export const ENV_LIGHTING_ID = 'environment';

import * as THREE from '../../vendor/three.module.min.js';

export function buildStudioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x281611);

  const warmPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 10),
    new THREE.MeshBasicMaterial({ color: 0xffe4b8, side: THREE.DoubleSide }),
  );
  warmPanel.position.set(0, 7, 0);
  warmPanel.rotation.x = Math.PI / 2;
  envScene.add(warmPanel);

  const amberSide = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 6),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide }),
  );
  amberSide.position.set(-7, 2, 0);
  amberSide.rotation.y = Math.PI / 2;
  envScene.add(amberSide);

  const coolFill = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 6),
    new THREE.MeshBasicMaterial({ color: 0x93c5fd, side: THREE.DoubleSide }),
  );
  coolFill.position.set(7, 2, 2);
  coolFill.rotation.y = -Math.PI / 2;
  envScene.add(coolFill);

  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return rt.texture;
}

export function setupKitchenLighting(scene) {
  const hemi = new THREE.HemisphereLight(0xffe9cc, 0x3b1c12, 1.05);
  scene.add(hemi);

  const keyDir = new THREE.DirectionalLight(0xfff1dc, 2.2);
  keyDir.position.set(5.5, 9.5, 6.2);
  keyDir.castShadow = true;
  keyDir.shadow.mapSize.set(2048, 2048);
  keyDir.shadow.camera.near = 1;
  keyDir.shadow.camera.far = 26;
  keyDir.shadow.camera.left = -7.5;
  keyDir.shadow.camera.right = 7.5;
  keyDir.shadow.camera.top = 7.5;
  keyDir.shadow.camera.bottom = -7.5;
  keyDir.shadow.bias = -0.0005;
  scene.add(keyDir);

  const hoodStrip = new THREE.PointLight(0xfff2d6, 2.4, 7.5);
  hoodStrip.position.set(-1.8, 2.35, -3.0);
  scene.add(hoodStrip);

  const leftLanternLight = new THREE.PointLight(0xff8c42, 2.1, 7.0);
  leftLanternLight.position.set(-4.9, 2.3, 0.5);
  scene.add(leftLanternLight);

  const rightLanternLight = new THREE.PointLight(0xff9d4a, 2.0, 7.5);
  rightLanternLight.position.set(4.8, 2.4, -2.8);
  scene.add(rightLanternLight);

  const wokFlameLight = new THREE.PointLight(0xff6b1a, 2.5, 4.5);
  wokFlameLight.position.set(-1.75, 1.25, -3.15);
  scene.add(wokFlameLight);

  return { keyDir, wokFlameLight, leftLanternLight };
}
