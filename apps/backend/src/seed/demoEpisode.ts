import { randomUUID } from "node:crypto";
import type { Project, Scene } from "@kidsai/engine";

const GROUND_Y_PARQUE = 640;
const FEET_OFFSET = 46; // distância do pivô do personagem (quadril) até os pés
const CHAR_Y = GROUND_Y_PARQUE - FEET_OFFSET; // ~594

function scene(partial: Omit<Scene, "id">): Scene {
  return { id: randomUUID(), ...partial };
}

/**
 * Episódio demonstrativo: "O leãozinho aprende a compartilhar"
 * Formato 9:16, 1080p, sem áudio, ~48 segundos.
 * Estrutura narrativa: situação inicial -> objetivo -> desafio -> decisão -> resolução -> conclusão educativa.
 */
export function buildDemoEpisode(): Project {
  const now = new Date().toISOString();

  const scene1 = scene({
    name: "1. Situação inicial — o leãozinho brinca sozinho",
    scenarioId: "parque",
    duration: 8,
    transitionIn: "fade",
    camera: [{ t: 0, x: 500, y: 560, zoom: 1 }],
    characters: [
      {
        id: "leao",
        characterId: "leaozinho",
        keyframes: [
          { t: 0, pose: { x: 380, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "feliz", expression: "feliz" },
          { t: 0.5, pose: { x: 460, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "caminhar", expression: "feliz" },
          { t: 1, pose: { x: 380, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "feliz", expression: "feliz" },
        ],
      },
    ],
    objects: [
      {
        id: "bola1",
        objectId: "bola",
        keyframes: [
          { t: 0, pose: { x: 440, y: CHAR_Y + 30, scale: 1, rotation: 0 } },
          { t: 0.5, pose: { x: 520, y: CHAR_Y + 10, scale: 1, rotation: 90 } },
          { t: 1, pose: { x: 440, y: CHAR_Y + 30, scale: 1, rotation: 180 } },
        ],
      },
    ],
  });

  const scene2 = scene({
    name: "2. Objetivo e desafio — o coelhinho se aproxima",
    scenarioId: "parque",
    duration: 8,
    transitionIn: "corte",
    camera: [{ t: 0, x: 500, y: 560, zoom: 1 }],
    characters: [
      {
        id: "leao",
        characterId: "leaozinho",
        keyframes: [{ t: 0, pose: { x: 380, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "feliz", expression: "feliz" }],
      },
      {
        id: "coelho",
        characterId: "coelhinho",
        keyframes: [
          { t: 0, pose: { x: 920, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "correr", expression: "animado" },
          { t: 1, pose: { x: 560, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "acenar", expression: "animado" },
        ],
      },
    ],
    objects: [
      {
        id: "bola1",
        objectId: "bola",
        keyframes: [{ t: 0, pose: { x: 440, y: CHAR_Y + 30, scale: 1, rotation: 0 } }],
      },
    ],
  });

  const scene3 = scene({
    name: "3. Decisão — o leãozinho não compartilha",
    scenarioId: "parque",
    duration: 8,
    transitionIn: "corte",
    camera: [
      { t: 0, x: 500, y: 560, zoom: 1 },
      { t: 1, x: 480, y: 540, zoom: 1.15 },
    ],
    characters: [
      {
        id: "leao",
        characterId: "leaozinho",
        keyframes: [
          { t: 0, pose: { x: 380, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "apontar", expression: "neutro" },
          { t: 1, pose: { x: 360, y: CHAR_Y, scale: 1, rotation: -8 }, movement: "parado", expression: "neutro" },
        ],
      },
      {
        id: "coelho",
        characterId: "coelhinho",
        keyframes: [
          { t: 0, pose: { x: 560, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "parado", expression: "animado" },
          { t: 1, pose: { x: 580, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "triste", expression: "triste" },
        ],
      },
    ],
    objects: [
      { id: "bola1", objectId: "bola", keyframes: [{ t: 0, pose: { x: 420, y: CHAR_Y + 30, scale: 1, rotation: 0 } }] },
    ],
  });

  const scene4 = scene({
    name: "4. Resolução — o leãozinho percebe e oferece a bola",
    scenarioId: "parque",
    duration: 8,
    transitionIn: "corte",
    camera: [{ t: 0, x: 500, y: 560, zoom: 1.1 }],
    characters: [
      {
        id: "leao",
        characterId: "leaozinho",
        keyframes: [
          { t: 0, pose: { x: 360, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "parado", expression: "surpreso" },
          { t: 0.4, pose: { x: 420, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "caminhar", expression: "feliz" },
          { t: 1, pose: { x: 480, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "apontar", expression: "feliz" },
        ],
      },
      {
        id: "coelho",
        characterId: "coelhinho",
        keyframes: [
          { t: 0, pose: { x: 580, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "triste", expression: "triste" },
          { t: 0.6, pose: { x: 580, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "parado", expression: "surpreso" },
          { t: 1, pose: { x: 560, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "feliz", expression: "feliz" },
        ],
      },
    ],
    objects: [
      {
        id: "bola1",
        objectId: "bola",
        keyframes: [
          { t: 0, pose: { x: 420, y: CHAR_Y + 30, scale: 1, rotation: 0 } },
          { t: 1, pose: { x: 520, y: CHAR_Y + 20, scale: 1, rotation: 180 } },
        ],
      },
    ],
  });

  const scene5 = scene({
    name: "5. Conclusão educativa — brincando juntos",
    scenarioId: "parque",
    duration: 16,
    transitionIn: "fade",
    camera: [{ t: 0, x: 500, y: 560, zoom: 1 }],
    characters: [
      {
        id: "leao",
        characterId: "leaozinho",
        keyframes: [
          { t: 0, pose: { x: 420, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "comemorar", expression: "feliz" },
          { t: 0.5, pose: { x: 460, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "caminhar", expression: "feliz" },
          { t: 1, pose: { x: 420, y: CHAR_Y, scale: 1, rotation: 0 }, movement: "comemorar", expression: "feliz" },
        ],
      },
      {
        id: "coelho",
        characterId: "coelhinho",
        keyframes: [
          { t: 0, pose: { x: 580, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "comemorar", expression: "feliz" },
          { t: 0.5, pose: { x: 540, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "pular", expression: "feliz" },
          { t: 1, pose: { x: 580, y: CHAR_Y, scale: 1, rotation: 0, flip: true }, movement: "comemorar", expression: "feliz" },
        ],
      },
    ],
    objects: [
      {
        id: "bola1",
        objectId: "bola",
        keyframes: [
          { t: 0, pose: { x: 500, y: CHAR_Y + 20, scale: 1, rotation: 0 } },
          { t: 0.5, pose: { x: 500, y: CHAR_Y - 20, scale: 1.1, rotation: 180 } },
          { t: 1, pose: { x: 500, y: CHAR_Y + 20, scale: 1, rotation: 360 } },
        ],
      },
    ],
  });

  return {
    id: "demo-leaozinho-compartilhar",
    title: "O leãozinho aprende a compartilhar",
    mainIdea: "Um leãozinho aprende a importância de compartilhar seus brinquedos com um novo amigo.",
    educationalTheme: "Amizade e compartilhamento",
    ageRange: "3 a 6 anos",
    durationSeconds: 48,
    aspectRatio: "9:16",
    characterIds: ["leaozinho", "coelhinho"],
    scenarioIds: ["parque"],
    scenes: [scene1, scene2, scene3, scene4, scene5],
    createdAt: now,
    updatedAt: now,
  };
}
