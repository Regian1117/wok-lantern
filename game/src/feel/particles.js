export const MAX_PARTICLES = 64;

function pushParticle(state, p) {
  if (state.particles.length >= MAX_PARTICLES) state.particles.shift();
  state.particles.push(p);
}

export function spawnSteam(state, x, y, z) {
  pushParticle(state, {
    kind: 'steam',
    x: x + (state.rng() - 0.5) * 0.24,
    y,
    z: z + (state.rng() - 0.5) * 0.24,
    vy: 0.7 + state.rng() * 0.35,
    age: 0,
    life: 1.2,
    size: 0.14 + state.rng() * 0.1,
  });
}

export function spawnSmoke(state, x, y, z) {
  pushParticle(state, {
    kind: 'smoke',
    x: x + (state.rng() - 0.5) * 0.28,
    y,
    z: z + (state.rng() - 0.5) * 0.28,
    vy: 0.6 + state.rng() * 0.3,
    age: 0,
    life: 1.4,
    size: 0.18 + state.rng() * 0.12,
  });
}

export function spawnFlame(state, x, y, z) {
  pushParticle(state, {
    kind: 'flame',
    x: x + (state.rng() - 0.5) * 0.2,
    y,
    z: z + (state.rng() - 0.5) * 0.2,
    vy: 1.1 + state.rng() * 0.6,
    age: 0,
    life: 0.45,
    size: 0.12 + state.rng() * 0.08,
  });
}

export function spawnSparks(state, x, y, z, count = 6) {
  for (let i = 0; i < count; i++) {
    pushParticle(state, {
      kind: 'spark',
      x: x + (state.rng() - 0.5) * 0.3,
      y,
      z: z + (state.rng() - 0.5) * 0.3,
      vy: 1.4 + state.rng() * 1.1,
      age: 0,
      life: 0.55,
      size: 0.05,
    });
  }
}

export function stepParticles(state, dt) {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.age += dt;
    p.y += p.vy * dt;
    if (p.age >= p.life) state.particles.splice(i, 1);
  }
}
