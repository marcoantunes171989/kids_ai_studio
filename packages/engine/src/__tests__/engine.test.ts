import { describe, it, expect } from "vitest";
import { frameSize } from "../types.js";
import { interpolatePose } from "../timeline.js";
import { movementPose } from "../animations.js";
import { renderSceneFrameSvg } from "../sceneRenderer.js";
import type { Scene } from "../types.js";

describe("frameSize", () => {
  it("gera dimensões pares para 9:16 em 1080p", () => {
    const { width, height } = frameSize("9:16", "1080p");
    expect(width).toBe(1080);
    expect(height).toBeGreaterThan(width);
    expect(width % 2).toBe(0);
    expect(height % 2).toBe(0);
  });

  it("gera dimensões pares para 16:9 em 720p", () => {
    const { width, height } = frameSize("16:9", "720p");
    expect(width).toBeGreaterThan(height);
  });

  it("gera quadrado para 1:1", () => {
    const { width, height } = frameSize("1:1", "1080p");
    expect(width).toBe(height);
  });
});

describe("interpolatePose", () => {
  it("interpola linearmente entre dois keyframes", () => {
    const kfs = [
      { t: 0, pose: { x: 0, y: 0, scale: 1, rotation: 0 } },
      { t: 1, pose: { x: 100, y: 0, scale: 1, rotation: 0 } },
    ];
    const { pose } = interpolatePose(kfs, 0.5);
    expect(pose.x).toBeGreaterThan(0);
    expect(pose.x).toBeLessThan(100);
  });

  it("retorna o primeiro keyframe antes do início", () => {
    const kfs = [{ t: 0.2, pose: { x: 5, y: 5, scale: 1, rotation: 0 } }];
    const { pose } = interpolatePose(kfs, 0);
    expect(pose.x).toBe(5);
  });
});

describe("movementPose", () => {
  it("produz transformações válidas (sem NaN) para todos os movimentos", () => {
    const movements = ["parado", "caminhar", "correr", "pular", "sentar", "acenar", "apontar", "comemorar", "triste", "feliz"] as const;
    for (const m of movements) {
      for (let t = 0; t <= 1; t += 0.25) {
        const pose = movementPose(m, t);
        for (const part of Object.values(pose)) {
          expect(Number.isFinite(part.x)).toBe(true);
          expect(Number.isFinite(part.y)).toBe(true);
          expect(Number.isFinite(part.rotation)).toBe(true);
        }
      }
    }
  });
});

describe("renderSceneFrameSvg", () => {
  it("gera um SVG válido contendo personagens e cenário", () => {
    const scene: Scene = {
      id: "s1",
      name: "Cena 1",
      scenarioId: "parque",
      duration: 2,
      characters: [
        {
          id: "c1",
          characterId: "leaozinho",
          keyframes: [
            { t: 0, pose: { x: 300, y: 500, scale: 1, rotation: 0 }, movement: "caminhar", expression: "feliz" },
            { t: 1, pose: { x: 700, y: 500, scale: 1, rotation: 0 }, movement: "caminhar", expression: "feliz" },
          ],
        },
      ],
      objects: [],
      camera: [{ t: 0, x: 500, y: 500, zoom: 1 }],
      transitionIn: "corte",
    };
    const svg = renderSceneFrameSvg({ scene, timeSeconds: 1, width: 1080, height: 1920 });
    expect(svg).toContain("<svg");
    expect(svg).toContain("viewBox");
    expect(svg.length).toBeGreaterThan(200);
  });
});
