import path from "node:path";
import { exportProjectToMp4 } from "../engine/videoExporter.js";
import { buildDemoEpisode } from "./demoEpisode.js";
import { VIDEOS_DIR, ensureDataDirs } from "../paths.js";

ensureDataDirs();

const project = buildDemoEpisode();
const outputPath = path.join(VIDEOS_DIR, "demo_leaozinho_aprende_a_compartilhar.mp4");

console.log(`Renderizando episódio demonstrativo em 1080p/30fps...`);
console.log(`Destino: ${outputPath}`);

const start = Date.now();
await exportProjectToMp4({
  project,
  settings: { resolution: "1080p", fps: 30 },
  outputPath,
  onProgress: ({ frame, totalFrames, ratio }) => {
    process.stdout.write(`\rProgresso: ${frame}/${totalFrames} quadros (${Math.round(ratio * 100)}%)   `);
  },
});

const seconds = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\nConcluído em ${seconds}s. Arquivo: ${outputPath}`);
