import path from "node:path";
import { randomUUID } from "node:crypto";
import type { RenderSettings } from "@kidsai/engine";
import { getProject } from "../repositories/projectsRepo.js";
import { createRenderJob, updateRenderJob, type RenderJob } from "../repositories/rendersRepo.js";
import { exportProjectToMp4 } from "./videoExporter.js";
import { VIDEOS_DIR } from "../paths.js";

const cancelFlags = new Map<string, boolean>();

export function requestCancel(jobId: string) {
  cancelFlags.set(jobId, true);
}

export function startRenderJob(projectId: string, settings: RenderSettings): RenderJob {
  const project = getProject(projectId);
  if (!project) {
    throw new Error("Projeto não encontrado.");
  }
  if (!project.scenes || project.scenes.length === 0) {
    throw new Error("O projeto não possui cenas. Adicione ao menos uma cena no editor antes de renderizar.");
  }

  const id = randomUUID();
  const safeTitle = project.title.replace(/[^a-zA-Z0-9-_]+/g, "_").slice(0, 60) || "video";
  const outputPath = path.join(VIDEOS_DIR, `${safeTitle}_${id.slice(0, 8)}.mp4`);

  const job = createRenderJob({
    id,
    projectId,
    status: "pendente",
    progress: 0,
    resolution: settings.resolution,
    fps: settings.fps,
    outputPath: null,
    error: null,
  });

  cancelFlags.set(id, false);

  // Renderização assíncrona em segundo plano; status consultável via GET /api/render/:id
  void (async () => {
    try {
      updateRenderJob(id, { status: "renderizando", progress: 0 });
      await exportProjectToMp4({
        project,
        settings,
        outputPath,
        onProgress: ({ ratio }) => {
          updateRenderJob(id, { status: "renderizando", progress: Math.round(ratio * 100) / 100 });
        },
        shouldCancel: () => cancelFlags.get(id) === true,
      });
      updateRenderJob(id, { status: "concluido", progress: 1, outputPath });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const cancelled = cancelFlags.get(id) === true;
      updateRenderJob(id, { status: cancelled ? "cancelado" : "erro", error: message });
    } finally {
      cancelFlags.delete(id);
    }
  })();

  return job;
}
