export const FOOD_SCENE_ID = 'sceneFood';

import * as THREE from '../../vendor/three.module.min.js';

function buildCrateShell(mats, x, z) {
  const grp = new THREE.Group();
  grp.position.set(x, 0.94, z);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.26, 0.78), mats.oakMat);
  box.position.y = 0.13;
  box.castShadow = true;
  grp.add(box);
  const rim = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.04, 0.85), mats.goldHighlightMat);
  rim.position.y = 0.26;
  rim.visible = false;
  grp.add(rim);
  return { grp, rim };
}

function populateCrate(grp, kind, mats) {
  if (kind === 'noodles') {
    for (let i = 0; i < 4; i++) {
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.045, 8, 16), mats.noodleMat);
      coil.rotation.x = Math.PI / 2;
      coil.position.set(-0.2 + (i % 2) * 0.36, 0.28, -0.14 + Math.floor(i / 2) * 0.28);
      grp.add(coil);
    }
  } else if (kind === 'bokchoy') {
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.24, 7), mats.bokChoyMat);
      leaf.position.set(-0.2 + (i % 2) * 0.38, 0.32, -0.14 + Math.floor(i / 2) * 0.28);
      leaf.rotation.z = (i % 2 ? -1 : 1) * 0.35;
      grp.add(leaf);
    }
  } else if (kind === 'chili') {
    for (let i = 0; i < 7; i++) {
      const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.18, 4, 8), mats.chiliMat);
      pod.rotation.z = Math.PI * 0.42;
      pod.rotation.y = i * 0.85;
      pod.position.set(-0.22 + (i % 3) * 0.22, 0.29, -0.15 + Math.floor(i / 3) * 0.2);
      grp.add(pod);
    }
  } else if (kind === 'dumplings') {
    const liner = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16), mats.bambooMat);
    liner.position.y = 0.26;
    grp.add(liner);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), mats.dumplingMat);
      d.scale.set(1, 0.78, 1);
      d.position.set(Math.cos(a) * 0.17, 0.33, Math.sin(a) * 0.17);
      grp.add(d);
    }
  } else if (kind === 'prawn') {
    const ice = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.66), mats.iceMat);
    ice.position.y = 0.25;
    grp.add(ice);
    for (let i = 0; i < 5; i++) {
      const pr = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.036, 7, 12, Math.PI * 1.35), mats.prawnMat);
      pr.rotation.x = Math.PI / 2;
      pr.rotation.z = i * 0.9;
      pr.position.set(-0.22 + (i % 3) * 0.22, 0.31, -0.12 + Math.floor(i / 3) * 0.24);
      grp.add(pr);
    }
  } else if (kind === 'duck') {
    for (let i = 0; i < 2; i++) {
      const duck = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.24, 6, 10), mats.duckMat);
      duck.rotation.z = Math.PI / 2;
      duck.position.set(-0.18 + i * 0.36, 0.31, 0);
      grp.add(duck);
    }
    const scallion = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8), mats.scallionMat);
    scallion.rotation.z = Math.PI / 2;
    scallion.position.set(0, 0.32, 0.22);
    grp.add(scallion);
  }
}

export function buildPekingDuckPlatter(mats, scale = 1) {
  const g = new THREE.Group();
  const crimsonRimMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.24, metalness: 0.12 });
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.4, 0.055, 8), crimsonRimMat);
  platter.castShadow = true;
  g.add(platter);

  const goldRim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.018, 8, 8), mats.brassMat);
  goldRim.rotation.x = Math.PI / 2;
  goldRim.rotation.z = Math.PI / 8;
  goldRim.position.y = 0.032;
  const ivoryWell = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.014, 8), mats.ceramicMat);
  ivoryWell.position.y = 0.028;
  g.add(goldRim, ivoryWell);

  const brightDuckMat = new THREE.MeshStandardMaterial({
    color: 0xb43b16,
    emissive: 0x381004,
    emissiveIntensity: 0.45,
    roughness: 0.18,
    metalness: 0.06,
  });
  for (let i = 0; i < 8; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const slice = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.036, 0.058), brightDuckMat);
    slice.position.set(-0.18 + col * 0.1, 0.054, -0.09 + row * 0.085);
    slice.rotation.y = 0.22;
    g.add(slice);
  }

  const cucMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.32, metalness: 0.02 });
  for (let d = 0; d < 6; d++) {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.016, 10), cucMat);
    disc.position.set(-0.26 + d * 0.052, 0.048, 0.12 + (d % 2) * 0.045);
    g.add(disc);
  }

  for (let c = 0; c < 3; c++) {
    const crepe = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.014, 12), mats.dumplingMat);
    crepe.position.set(0.17, 0.042 + c * 0.015, 0.14);
    g.add(crepe);
  }
  const hoisin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.05, 12), mats.ceramicMat);
  hoisin.position.set(-0.16, 0.055, 0.2);
  const sauce = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.012, 12), mats.glazeMat);
  sauce.position.set(-0.16, 0.082, 0.2);
  g.add(hoisin, sauce);
  g.scale.setScalar(scale);
  return g;
}

export function buildCharKwayTeowBowl(mats, scale = 1) {
  const g = new THREE.Group();
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.2, 0.17, 20), mats.cobaltCeramicMat);
  bowl.position.y = 0.085;
  bowl.castShadow = true;
  g.add(bowl);

  const brothMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.2, metalness: 0.05 });
  const broth = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.26, 0.03, 18), brothMat);
  broth.position.y = 0.155;
  g.add(broth);

  const noodleGold = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.45, metalness: 0.02 });
  const noodleAmber = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.48, metalness: 0.02 });
  for (let n = 0; n < 6; n++) {
    const a = (n * Math.PI) / 3;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.115 + (n % 2) * 0.045, 0.032, 7, 16),
      n % 2 === 0 ? noodleGold : noodleAmber,
    );
    ring.rotation.x = Math.PI / 2 + (n % 2 === 0 ? 0.14 : -0.14);
    ring.rotation.y = a;
    ring.position.set(Math.cos(a) * 0.055, 0.178 + (n % 3) * 0.015, Math.sin(a) * 0.055);
    g.add(ring);
  }

  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 + 0.25;
    const pr = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.024, 7, 12, Math.PI * 1.38), mats.prawnMat);
    pr.rotation.x = Math.PI / 2;
    pr.rotation.z = a;
    pr.position.set(Math.cos(a) * 0.135, 0.228, Math.sin(a) * 0.135);
    g.add(pr);
  }

  const lapCheongMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35, metalness: 0.04 });
  for (let s = 0; s < 4; s++) {
    const a = (s * Math.PI) / 2 + 0.6;
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.018, 12), lapCheongMat);
    disc.rotation.z = 0.32;
    disc.rotation.y = a;
    disc.position.set(Math.cos(a) * 0.095, 0.224, Math.sin(a) * 0.095);
    g.add(disc);
  }

  const chiveMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });
  for (let c = 0; c < 8; c++) {
    const a = (c * Math.PI * 2) / 8;
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.012, 0.015), chiveMat);
    strip.rotation.y = a + 0.4;
    strip.position.set(Math.cos(a) * 0.075, 0.242, Math.sin(a) * 0.075);
    g.add(strip);
  }

  const limeMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.4 });
  const lime = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.032, 12, 1, false, 0, Math.PI), limeMat);
  lime.rotation.z = 0.45;
  lime.position.set(0.24, 0.195, 0.13);
  g.add(lime);
  g.scale.setScalar(scale);
  return g;
}

export function buildXiaolongbaoSteamer(mats, scale = 1) {
  const g = new THREE.Group();
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 18), mats.bambooMat);
  basket.position.y = 0.07;
  g.add(basket);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6;
    const dump = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), mats.dumplingMat);
    dump.scale.set(1, 0.8, 1);
    dump.position.set(Math.cos(a) * 0.14, 0.15, Math.sin(a) * 0.14);
    g.add(dump);
  }
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.025, 12), mats.ceramicMat);
  saucer.position.set(0.36, 0.015, 0.05);
  g.add(saucer);
  g.scale.setScalar(scale);
  return g;
}

export function buildKitchenFood(mats) {
  const group = new THREE.Group();
  const crateSpecs = [
    { id: 'crate_noodles', kind: 'noodles', x: 1.2, z: -3.15, rot: 0 },
    { id: 'crate_bokchoy', kind: 'bokchoy', x: 2.55, z: -3.15, rot: 0 },
    { id: 'crate_chili', kind: 'chili', x: 3.9, z: -3.15, rot: 0 },
    { id: 'crate_dumpling', kind: 'dumplings', x: 4.75, z: -1.6, rot: -Math.PI / 2 },
    { id: 'crate_prawn', kind: 'prawn', x: 4.75, z: -0.15, rot: -Math.PI / 2 },
    { id: 'crate_duck', kind: 'duck', x: 4.75, z: 1.3, rot: -Math.PI / 2 },
  ];
  const crateRims = {};
  for (const sp of crateSpecs) {
    const { grp, rim } = buildCrateShell(mats, sp.x, sp.z);
    grp.rotation.y = sp.rot;
    populateCrate(grp, sp.kind, mats);
    group.add(grp);
    crateRims[sp.id] = rim;
  }

  // Right wok noodles + flame cones
  const wokNoodles = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.07, 8, 14), mats.noodleMat);
  wokNoodles.rotation.x = Math.PI / 2;
  wokNoodles.position.set(-1.75, 1.0, -3.15);
  const flameCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 0.44, 12),
    new THREE.MeshBasicMaterial({ color: 0xff7b1a, transparent: true, opacity: 0.72 }),
  );
  flameCone.position.set(-1.75, 0.92, -3.15);
  const blueCore = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.25, 10),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }),
  );
  blueCore.position.set(-1.75, 0.86, -3.15);
  group.add(wokNoodles, flameCone, blueCore);

  // Left wok scorched embers
  const emberRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.04, 8, 16),
    new THREE.MeshBasicMaterial({ color: 0xef4444 }),
  );
  emberRing.rotation.x = Math.PI / 2;
  emberRing.position.set(-3.05, 0.98, -3.15);
  group.add(emberRing);

  // Center island carved Peking Duck 2/3 plate
  const islandPlate = buildPekingDuckPlatter(mats, 0.92);
  islandPlate.position.set(0.38, 0.99, 0.12);
  group.add(islandPlate);

  // Front Marble Service Pass: 3 Hero Plated Dishes
  const passBowls = buildCharKwayTeowBowl(mats, 1.08);
  passBowls.position.set(-1.75, 0.99, 3.2);
  const passDuck = buildPekingDuckPlatter(mats, 1.12);
  passDuck.position.set(0.0, 0.99, 3.22);
  const passXlb = buildXiaolongbaoSteamer(mats, 1.05);
  passXlb.position.set(1.65, 0.99, 3.2);
  group.add(passBowls, passDuck, passXlb);

  return { group, crateRims, flameCone, emberRing };
}
