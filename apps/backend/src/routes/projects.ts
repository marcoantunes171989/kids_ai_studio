import { Router } from "express";
import { randomUUID } from "node:crypto";
import type { Project } from "@kidsai/engine";
import { deleteProject, getProject, listProjects, saveProject } from "../repositories/projectsRepo.js";

export const projectsRouter = Router();

projectsRouter.get("/", (_req, res) => {
  res.json(listProjects());
});

projectsRouter.get("/:id", (req, res) => {
  const project = getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return;
  }
  res.json(project);
});

projectsRouter.post("/", (req, res) => {
  const body = req.body as Partial<Project>;
  if (!body.title) {
    res.status(400).json({ error: "O título do projeto é obrigatório." });
    return;
  }
  const now = new Date().toISOString();
  const project: Project = {
    id: randomUUID(),
    title: body.title,
    mainIdea: body.mainIdea ?? "",
    educationalTheme: body.educationalTheme ?? "",
    ageRange: body.ageRange ?? "",
    durationSeconds: body.durationSeconds ?? 60,
    aspectRatio: body.aspectRatio ?? "9:16",
    characterIds: body.characterIds ?? [],
    scenarioIds: body.scenarioIds ?? [],
    scenes: body.scenes ?? [],
    createdAt: now,
    updatedAt: now,
  };
  res.status(201).json(saveProject(project));
});

projectsRouter.put("/:id", (req, res) => {
  const existing = getProject(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return;
  }
  const body = req.body as Partial<Project>;
  const merged: Project = { ...existing, ...body, id: existing.id };
  res.json(saveProject(merged));
});

projectsRouter.delete("/:id", (req, res) => {
  const ok = deleteProject(req.params.id);
  if (!ok) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return;
  }
  res.status(204).send();
});
