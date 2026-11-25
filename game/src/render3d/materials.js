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

export function makeMesh(parent, geo, mat, pos = null, rot = null, scale = null, shadow = false) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  if (scale) m.scale.set(scale[0], scale[1], scale[2]);
  if (shadow) {
    m.castShadow = true;
    m.receiveShadow = true;
  }
  if (parent) parent.add(m);
  return m;
}

const std = (color, roughness, metalness = 0.04, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

const gloss = (color, roughness = 0.18, clearcoat = 0.9, extra = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness, metalness: 0.04, clearcoat, ...extra });

export function createMaterialLibrary() {
  const flag = makeFlagstoneTextures();
  const tile = makeSubwayTileTextures();
  const oakTex = makeOakPlankTextures('#A66C3E', '#84522D');
  const darkFloorTex = makeOakPlankTextures('#5C351E', '#472716');

  return {
    flagstoneMat: new THREE.MeshStandardMaterial({ map: flag.map, bumpMap: flag.bumpMap, bumpScale: 0.03, roughness: 0.82, metalness: 0.05 }),
    tileMat: new THREE.MeshStandardMaterial({ map: tile.map, bumpMap: tile.bumpMap, bumpScale: 0.02, roughness: 0.28, metalness: 0.08 }),
    oakMat: new THREE.MeshStandardMaterial({ map: oakTex, roughness: 0.54, metalness: 0.04 }),
    diningFloorMat: new THREE.MeshStandardMaterial({ map: darkFloorTex, roughness: 0.48, metalness: 0.06 }),
    walnutMat: std(0x3b1f14, 0.48, 0.06),
    oxbloodMat: std(0x5c1a15, 0.34, 0.1),
    marbleMat: new THREE.MeshStandardMaterial({ map: makeMarbleTextures(), roughness: 0.2, metalness: 0.05 }),
    bambooMat: new THREE.MeshStandardMaterial({ map: makeBambooTexture(), roughness: 0.72, metalness: 0.02 }),
    crestMat: new THREE.MeshStandardMaterial({ map: makeCrestPlaqueTexture(), roughness: 0.35, metalness: 0.1 }),
    scrollMat: new THREE.MeshStandardMaterial({ map: makeScrollTexture(), roughness: 0.68, metalness: 0.02 }),
    steelMat: std(0xbec5cc, 0.24, 0.88),
    darkIronMat: std(0x26292e, 0.45, 0.82),
    brassMat: std(0xd99b26, 0.22, 0.92),
    copperMat: std(0xc86e3b, 0.24, 0.88),
    ceramicMat: gloss(0xfaf3e6, 0.16, 0.85),
    cobaltCeramicMat: gloss(0x1d4ed8, 0.18, 0.88),
    lacquerMat: gloss(0x45120d, 0.2, 0.9),
    crimsonVelvetMat: std(0x7f1d1d, 0.85, 0.02),
    silkLanternMat: std(0xdc2626, 0.45, 0.05, { emissive: 0xc2410c, emissiveIntensity: 0.9 }),
    rubberMat: std(0x1b1a1c, 0.9, 0.02),
    waterMat: gloss(0x67b7d1, 0.12, 0.9, { transparent: true, opacity: 0.78 }),
    glazeMat: gloss(0x7a1226, 0.1, 1.0, { emissive: 0x2b040c, emissiveIntensity: 0.3 }),
    iceMat: gloss(0xdbeafe, 0.14, 0.9, { transparent: true, opacity: 0.85 }),
    butcherEndMat: std(0xc28a52, 0.65, 0.03),
    duckMat: gloss(0xb43b16, 0.16, 1.0, { emissive: 0x381004, emissiveIntensity: 0.42 }),
    noodleMat: std(0xfbbf24, 0.44, 0.02),
    prawnMat: gloss(0xfb7185, 0.24, 0.85),
    chiliMat: gloss(0xdc2626, 0.22, 0.85),
    bokChoyMat: gloss(0x22c55e, 0.34, 0.75),
    dumplingMat: gloss(0xfef3c7, 0.28, 0.82),
    scallionMat: std(0x16a34a, 0.48, 0.02),
    ivoryApronMat: std(0xfaf3e6, 0.62, 0.02),
    indigoMat: std(0x1e293b, 0.78, 0.02),
    tunicMat: std(0x991b1b, 0.6, 0.05),
    skinMat: std(0xe8b68e, 0.55, 0.02),
    hairMat: std(0x171412, 0.7, 0.05),
    goldHighlightMat: std(0xfacc15, 0.24, 0.7, { emissive: 0xd99b26, emissiveIntensity: 0.85 }),
  };
}
