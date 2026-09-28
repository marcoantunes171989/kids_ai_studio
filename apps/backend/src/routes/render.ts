import { Router } from "express";
import type { RenderSettings } from "@kidsai/engine";
import { startRenderJob, requestCancel } from "../engine/renderManager.js";
import { getRenderJob, listRenderJobs } from "../repositories/rendersRepo.js";

export const renderRouter = Router();

renderRouter.get("/", (req, res) => {
  const projectId = typeof req.query.projectId === "string" ? req.query.projectId : undefined;
  res.json(listRenderJobs(projectId));
});

renderRouter.get("/:id", (req, res) => {
  const job = getRenderJob(req.params.id);
  if (!job) {
    res.status(404).json({ error: "Renderização não encontrada." });
    return;
  }
  res.json(job);
});

renderRouter.post("/", (req, res) => {
  const { projectId, resolution, fps } = req.body as { projectId?: string; resolution?: RenderSettings["resolution"]; fps?: RenderSettings["fps"] };
  if (!projectId) {
    res.status(400).json({ error: "projectId é obrigatório." });
    return;
  }
  try {
    const job = startRenderJob(projectId, { resolution: resolution ?? "1080p", fps: fps ?? 30 });
    res.status(202).json(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
});

renderRouter.post("/:id/cancel", (req, res) => {
  const job = getRenderJob(req.params.id);
  if (!job) {
    res.status(404).json({ error: "Renderização não encontrada." });
    return;
  }
  requestCancel(req.params.id);
  res.status(202).json({ status: "cancelamento solicitado" });
});
