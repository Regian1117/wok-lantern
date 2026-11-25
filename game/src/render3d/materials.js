export const MATERIAL_LIB_ID = 'materials';

import * as THREE from '../../vendor/three.module.min.js';
import {
  makeFlagstoneTextures,
  makeSubwayTileTextures,
  makeOakPlankTextures,
  makeMarbleTextures,
  makeBambooTexture,
  makeCrestPlaqueTexture,
  makeScrollTexture,
} from './textures.js';

export function createMaterialLibrary() {
  const flag = makeFlagstoneTextures();
  const tile = makeSubwayTileTextures();
  const oakTex = makeOakPlankTextures('#A66C3E', '#84522D');
  const darkFloorTex = makeOakPlankTextures('#5C351E', '#472716');
  const marbleTex = makeMarbleTextures();
  const bambooTex = makeBambooTexture();
  const crestTex = makeCrestPlaqueTexture();
  const scrollTex = makeScrollTexture();

  return {
    flagstoneMat: new THREE.MeshStandardMaterial({ map: flag.map, bumpMap: flag.bumpMap, bumpScale: 0.03, roughness: 0.82, metalness: 0.05 }),
    tileMat: new THREE.MeshStandardMaterial({ map: tile.map, bumpMap: tile.bumpMap, bumpScale: 0.02, roughness: 0.3, metalness: 0.08 }),
    oakMat: new THREE.MeshStandardMaterial({ map: oakTex, roughness: 0.56, metalness: 0.04 }),
    diningFloorMat: new THREE.MeshStandardMaterial({ map: darkFloorTex, roughness: 0.48, metalness: 0.06 }),
    walnutMat: new THREE.MeshStandardMaterial({ color: 0x3b1f14, roughness: 0.48, metalness: 0.06 }),
    marbleMat: new THREE.MeshStandardMaterial({ map: marbleTex, roughness: 0.22, metalness: 0.05 }),
    bambooMat: new THREE.MeshStandardMaterial({ map: bambooTex, roughness: 0.72, metalness: 0.02 }),
    crestMat: new THREE.MeshStandardMaterial({ map: crestTex, roughness: 0.35, metalness: 0.1 }),
    scrollMat: new THREE.MeshStandardMaterial({ map: scrollTex, roughness: 0.68, metalness: 0.02 }),
    steelMat: new THREE.MeshStandardMaterial({ color: 0xbec5cc, roughness: 0.26, metalness: 0.88 }),
    darkIronMat: new THREE.MeshStandardMaterial({ color: 0x26292e, roughness: 0.45, metalness: 0.82 }),
    brassMat: new THREE.MeshStandardMaterial({ color: 0xd99b26, roughness: 0.24, metalness: 0.9 }),
    copperMat: new THREE.MeshStandardMaterial({ color: 0xc86e3b, roughness: 0.26, metalness: 0.88 }),
    ceramicMat: new THREE.MeshStandardMaterial({ color: 0xfaf3e6, roughness: 0.18, metalness: 0.04 }),
    cobaltCeramicMat: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2, metalness: 0.06 }),
    lacquerMat: new THREE.MeshStandardMaterial({ color: 0x45120d, roughness: 0.22, metalness: 0.14 }),
    crimsonVelvetMat: new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.85, metalness: 0.02 }),
    silkLanternMat: new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.72,
      roughness: 0.5,
      metalness: 0.05,
    }),
    rubberMat: new THREE.MeshStandardMaterial({ color: 0x1b1a1c, roughness: 0.9, metalness: 0.02 }),
    waterMat: new THREE.MeshPhysicalMaterial({ color: 0x67b7d1, roughness: 0.12, metalness: 0.05, transparent: true, opacity: 0.78 }),
    glazeMat: new THREE.MeshPhysicalMaterial({
      color: 0x7a1226,
      emissive: 0x2b040c,
      emissiveIntensity: 0.28,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
    }),
    iceMat: new THREE.MeshPhysicalMaterial({ color: 0xdbeafe, roughness: 0.15, metalness: 0.05, transparent: true, opacity: 0.85 }),
    butcherEndMat: new THREE.MeshStandardMaterial({ color: 0xc28a52, roughness: 0.65, metalness: 0.03 }),
    duckMat: new THREE.MeshStandardMaterial({ color: 0x8f3412, roughness: 0.24, metalness: 0.08 }),
    noodleMat: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.52, metalness: 0.02 }),
    prawnMat: new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.36, metalness: 0.04 }),
    chiliMat: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.28, metalness: 0.05 }),
    bokChoyMat: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.45, metalness: 0.02 }),
    dumplingMat: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.42, metalness: 0.02 }),
    scallionMat: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5, metalness: 0.02 }),
    indigoMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.78, metalness: 0.02 }),
    tunicMat: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.62, metalness: 0.05 }),
    skinMat: new THREE.MeshStandardMaterial({ color: 0xe8b68e, roughness: 0.55, metalness: 0.02 }),
    hairMat: new THREE.MeshStandardMaterial({ color: 0x171412, roughness: 0.7, metalness: 0.05 }),
    goldHighlightMat: new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd99b26,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.7,
    }),
  };
}
