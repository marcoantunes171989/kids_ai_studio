import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { frameSize, renderSceneFrameSvg, type Project, type RenderSettings } from "@kidsai/engine";
import { FFMPEG_BIN } from "../paths.js";

export interface ExportProgress {
  frame: number;
  totalFrames: number;
  ratio: number;
}

export interface ExportOptions {
  project: Project;
  settings: RenderSettings;
  outputPath: string;
  onProgress?: (p: ExportProgress) => void;
  shouldCancel?: () => boolean;
}

/** Aplica um fade a partir do preto nos primeiros `fadeSeconds` de uma cena com transitionIn "fade". */
function applyFade(raw: Buffer, sceneTimeSeconds: number, fadeSeconds: number) {
  if (sceneTimeSeconds >= fadeSeconds) return raw;
  const alpha = Math.max(0, Math.min(1, sceneTimeSeconds / fadeSeconds));
  for (let i = 0; i < raw.length; i += 4) {
    raw[i] = Math.round(raw[i] * alpha);
    raw[i + 1] = Math.round(raw[i + 1] * alpha);
    raw[i + 2] = Math.round(raw[i + 2] * alpha);
  }
  return raw;
}

export async function exportProjectToMp4({ project, settings, outputPath, onProgress, shouldCancel }: ExportOptions): Promise<void> {
  const { width, height } = frameSize(project.aspectRatio, settings.resolution);
  const fps = settings.fps;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const totalFrames = project.scenes.reduce((sum, scene) => sum + Math.max(1, Math.round(scene.duration * fps)), 0);
  if (totalFrames === 0) {
    throw new Error("O projeto não possui cenas com duração para renderizar.");
  }

  const ffArgs = [
    "-y",
    "-f", "rawvideo",
    "-pix_fmt", "rgba",
    "-s", `${width}x${height}`,
    "-r", String(fps),
    "-i", "pipe:0",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    outputPath,
  ];

  const ff = spawn(FFMPEG_BIN, ffArgs, { stdio: ["pipe", "ignore", "pipe"] });

  let stderrTail = "";
  ff.stderr.on("data", (chunk) => {
    stderrTail = (stderrTail + chunk.toString()).slice(-4000);
  });

  const ffExit = new Promise<void>((resolve, reject) => {
    ff.on("error", reject);
    ff.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg encerrou com código ${code}. Detalhes: ${stderrTail}`));
    });
  });

  let frameIndex = 0;
  try {
    for (const scene of project.scenes) {
      const sceneFrames = Math.max(1, Math.round(scene.duration * fps));
      for (let f = 0; f < sceneFrames; f++) {
        if (shouldCancel?.()) {
          ff.stdin.end();
          throw new Error("Renderização cancelada pelo usuário.");
        }
        const sceneTimeSeconds = f / fps;
        const svg = renderSceneFrameSvg({ scene, timeSeconds: sceneTimeSeconds, width, height });
        let raw = await sharp(Buffer.from(svg), { density: 96 })
          .resize(width, height)
          .ensureAlpha()
          .raw()
          .toBuffer();

        if (scene.transitionIn === "fade") {
          raw = applyFade(raw, sceneTimeSeconds, Math.min(0.5, scene.duration / 3));
        }

        const canWrite = ff.stdin.write(raw);
        if (!canWrite) {
          await new Promise((resolve) => ff.stdin.once("drain", resolve));
        }

        frameIndex++;
        onProgress?.({ frame: frameIndex, totalFrames, ratio: frameIndex / totalFrames });
      }
    }
    ff.stdin.end();
  } catch (err) {
    ff.kill("SIGKILL");
    throw err;
  }

  await ffExit;
}
