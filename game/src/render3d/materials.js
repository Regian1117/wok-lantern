export const MATERIAL_LIB_ID = 'materials';

import * as THREE from '../../vendor/three.module.min.js';
import {
  makeFlagstoneTextures, makeSubwayTileTextures, makeOakPlankTextures,
  makeMarbleTextures, makeBambooTexture, makeCrestPlaqueTexture, makeScrollTexture,
} from './textures.js';

export function makeMesh(parent, geo, mat, pos = null, rot = null, scale = null, shadow = false) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  if (scale) m.scale.set(...scale);
  if (shadow) m.castShadow = m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}

const std = (color, roughness, metalness = 0.04, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

const gloss = (color, roughness = 0.18, clearcoat = 0.9, extra = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness, metalness: 0.04, clearcoat, ...extra });

export function createMaterialLibrary() {
  const [flag, tile] = [makeFlagstoneTextures(), makeSubwayTileTextures()];
  const libs = {
    flagstoneMat: new THREE.MeshStandardMaterial({ map: flag.map, bumpMap: flag.bumpMap, bumpScale: 0.03, roughness: 0.82, metalness: 0.05 }),
    tileMat: new THREE.MeshStandardMaterial({ map: tile.map, bumpMap: tile.bumpMap, bumpScale: 0.02, roughness: 0.28, metalness: 0.08 }),
    oakMat: new THREE.MeshStandardMaterial({ map: makeOakPlankTextures('#A66C3E', '#84522D'), roughness: 0.54, metalness: 0.04 }),
    diningFloorMat: new THREE.MeshStandardMaterial({ map: makeOakPlankTextures('#5C351E', '#472716'), roughness: 0.48, metalness: 0.06 }),
    marbleMat: new THREE.MeshStandardMaterial({ map: makeMarbleTextures(), roughness: 0.2, metalness: 0.05 }),
    bambooMat: new THREE.MeshStandardMaterial({ map: makeBambooTexture(), roughness: 0.72, metalness: 0.02 }),
    crestMat: new THREE.MeshStandardMaterial({ map: makeCrestPlaqueTexture(), roughness: 0.35, metalness: 0.1 }),
    scrollMat: new THREE.MeshStandardMaterial({ map: makeScrollTexture(), roughness: 0.68, metalness: 0.02 }),
  };
  for (const [k, c, r, met, ex] of [
    ['walnutMat', 0x3b1f14, 0.48, 0.06], ['oxbloodMat', 0x5c1a15, 0.34, 0.1],
    ['steelMat', 0xbec5cc, 0.24, 0.88], ['darkIronMat', 0x26292e, 0.45, 0.82],
    ['brassMat', 0xd99b26, 0.22, 0.92], ['copperMat', 0xc86e3b, 0.24, 0.88],
    ['crimsonVelvetMat', 0x7f1d1d, 0.85, 0.02], ['silkLanternMat', 0xdc2626, 0.45, 0.05, { emissive: 0xc2410c, emissiveIntensity: 0.9 }],
    ['rubberMat', 0x1b1a1c, 0.9, 0.02], ['butcherEndMat', 0xc28a52, 0.65, 0.03],
    ['noodleMat', 0xfbbf24, 0.44, 0.02], ['scallionMat', 0x16a34a, 0.48, 0.02],
    ['ivoryApronMat', 0xfaf3e6, 0.62, 0.02], ['indigoMat', 0x1e293b, 0.78, 0.02],
    ['tunicMat', 0x991b1b, 0.6, 0.05], ['skinMat', 0xe8b68e, 0.55, 0.02],
    ['hairMat', 0x171412, 0.7, 0.05], ['goldHighlightMat', 0xfacc15, 0.24, 0.7, { emissive: 0xd99b26, emissiveIntensity: 0.85 }],
  ]) libs[k] = std(c, r, met, ex);
  for (const [k, c, r, cc, ex] of [
    ['ceramicMat', 0xfaf3e6, 0.16, 0.85], ['cobaltCeramicMat', 0x1d4ed8, 0.18, 0.88],
    ['lacquerMat', 0x45120d, 0.2, 0.9], ['waterMat', 0x67b7d1, 0.12, 0.9, { transparent: true, opacity: 0.78 }],
    ['glazeMat', 0x7a1226, 0.1, 1.0, { emissive: 0x2b040c, emissiveIntensity: 0.3 }],
    ['iceMat', 0xdbeafe, 0.14, 0.9, { transparent: true, opacity: 0.85 }],
    ['duckMat', 0xb43b16, 0.16, 1.0, { emissive: 0x381004, emissiveIntensity: 0.42 }],
    ['prawnMat', 0xfb7185, 0.24, 0.85], ['chiliMat', 0xdc2626, 0.22, 0.85],
    ['bokChoyMat', 0x22c55e, 0.34, 0.75], ['dumplingMat', 0xfef3c7, 0.28, 0.82],
  ]) libs[k] = gloss(c, r, cc, ex);
  return libs;
}
