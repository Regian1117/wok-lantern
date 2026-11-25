// Wok & Lantern — Night Market Kitchen dossier packager (Node 22, standard library only).
// Copies the offline static game/ directory and screenshots/ renders into MAKEFUN_OUTPUT_DIR
// (defaulting to /output) and emits canonical dossier.json via the vendored make.fun helper.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const SCORER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function prepareDossierOutput(outputDir: string): void {
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
}

function copyStaticArtifacts(repoRoot: string, outputDir: string): void {
  const gameSrc = join(repoRoot, 'game');
  const shotsSrc = join(repoRoot, 'screenshots');
  cpSync(gameSrc, join(outputDir, 'game'), { recursive: true });
  if (existsSync(shotsSrc)) {
    cpSync(shotsSrc, join(outputDir, 'screenshots'), { recursive: true });
  }
}

function writeDossierFile(outputDir: string): void {
  const dossierBytes = buildDossier(outputDir, SCORER_CAPS);
  writeFileSync(join(outputDir, 'dossier.json'), dossierBytes);
}

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

prepareDossierOutput(outputDir);
copyStaticArtifacts(repoRoot, outputDir);
writeDossierFile(outputDir);
