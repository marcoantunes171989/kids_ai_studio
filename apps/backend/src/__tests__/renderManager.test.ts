import { describe, it, expect, beforeAll } from "vitest";
import { randomUUID } from "node:crypto";
import { saveProject } from "../repositories/projectsRepo.js";
import { startRenderJob } from "../engine/renderManager.js";
import type { Project } from "@kidsai/engine";

function emptyProject(): Project {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    title: "Projeto de teste",
    mainIdea: "",
    educationalTheme: "",
    ageRange: "",
    durationSeconds: 0,
    aspectRatio: "9:16",
    characterIds: [],
    scenarioIds: [],
    scenes: [],
    createdAt: now,
    updatedAt: now,
  };
}

describe("startRenderJob", () => {
  it("rejeita renderização de projeto sem cenas", () => {
    const project = emptyProject();
    saveProject(project);
    expect(() => startRenderJob(project.id, { resolution: "480p", fps: 24 })).toThrow(/não possui cenas/);
  });

  it("rejeita projeto inexistente", () => {
    expect(() => startRenderJob("id-inexistente", { resolution: "480p", fps: 24 })).toThrow(/não encontrado/);
  });
});
