import type { MovementId } from "./types.js";
import type { BodyPart } from "./characters.js";

export interface PartTransform {
  x: number;
  y: number;
  rotation: number;
}

export type Pose2 = Record<BodyPart, PartTransform>;

const BASE_POSE: Pose2 = {
  corpo: { x: 0, y: 0, rotation: 0 },
  cabeca: { x: 0, y: -46, rotation: 0 },
  orelhaEsq: { x: -14, y: -66, rotation: -10 },
  orelhaDir: { x: 14, y: -66, rotation: 10 },
  bracoEsq: { x: -26, y: -14, rotation: 0 },
  bracoDir: { x: 26, y: -14, rotation: 0 },
  pernaEsq: { x: -14, y: 20, rotation: 0 },
  pernaDir: { x: 14, y: 20, rotation: 0 },
  cauda: { x: -26, y: 10, rotation: 20 },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clonePose(p: Pose2): Pose2 {
  return Object.fromEntries(
    Object.entries(p).map(([k, v]) => [k, { ...v }])
  ) as Pose2;
}

function wave(t: number) {
  // t 0..1 -> -1..1..-1 senoidal
  return Math.sin(t * Math.PI * 2);
}

/** Calcula a pose (transformação local por parte) de um movimento em um instante t (0..1 dentro do ciclo). */
export function movementPose(movement: MovementId, t: number): Pose2 {
  const pose = clonePose(BASE_POSE);
  switch (movement) {
    case "parado": {
      const breathe = wave(t) * 1.2;
      pose.corpo.y += breathe * 0.3;
      pose.cabeca.y += breathe * 0.3;
      break;
    }
    case "caminhar": {
      const s = wave(t);
      pose.pernaEsq.rotation = s * 30;
      pose.pernaDir.rotation = -s * 30;
      pose.bracoEsq.rotation = -s * 22;
      pose.bracoDir.rotation = s * 22;
      pose.corpo.y += Math.abs(s) * -3;
      pose.cabeca.y += Math.abs(s) * -3;
      break;
    }
    case "correr": {
      const s = wave(t);
      pose.pernaEsq.rotation = s * 48;
      pose.pernaDir.rotation = -s * 48;
      pose.bracoEsq.rotation = -s * 40;
      pose.bracoDir.rotation = s * 40;
      const bounce = Math.abs(s) * -8;
      pose.corpo.y += bounce;
      pose.cabeca.y += bounce;
      pose.corpo.rotation = s * 6;
      break;
    }
    case "pular": {
      // salto único: sobe e desce em arco, pernas flexionam na aterrissagem
      const arc = Math.sin(t * Math.PI);
      const jumpHeight = -34 * arc;
      pose.corpo.y += jumpHeight;
      pose.cabeca.y += jumpHeight;
      pose.bracoEsq.rotation = -60 * arc;
      pose.bracoDir.rotation = 60 * arc;
      pose.pernaEsq.rotation = t < 0.15 || t > 0.85 ? 20 : -10 * arc;
      pose.pernaDir.rotation = t < 0.15 || t > 0.85 ? -20 : 10 * arc;
      break;
    }
    case "sentar": {
      const s = Math.min(t / 0.4, 1); // senta nos primeiros 40% e mantém
      pose.corpo.y += 14 * s;
      pose.pernaEsq.rotation = 70 * s;
      pose.pernaDir.rotation = -70 * s;
      pose.pernaEsq.y += 6 * s;
      pose.pernaDir.y += 6 * s;
      pose.cabeca.y += 14 * s;
      break;
    }
    case "acenar": {
      const s = wave(t * 3); // acena rápido
      pose.bracoDir.rotation = -110 + s * 20;
      pose.bracoDir.y -= 10;
      pose.cabeca.rotation = wave(t) * 4;
      break;
    }
    case "apontar": {
      const s = Math.min(t / 0.3, 1);
      pose.bracoDir.rotation = lerp(0, -80, s);
      pose.bracoDir.x += 6 * s;
      pose.cabeca.rotation = lerp(0, -8, s);
      break;
    }
    case "comemorar": {
      const s = wave(t * 2);
      pose.bracoEsq.rotation = -140 + s * 15;
      pose.bracoDir.rotation = 140 - s * 15;
      const hop = Math.abs(Math.sin(t * Math.PI * 2)) * -10;
      pose.corpo.y += hop;
      pose.cabeca.y += hop;
      pose.cabeca.rotation = s * 6;
      break;
    }
    case "triste": {
      pose.cabeca.y += 10;
      pose.cabeca.rotation = -6;
      pose.bracoEsq.rotation = 20;
      pose.bracoDir.rotation = -20;
      const droop = Math.sin(t * Math.PI * 2) * 1.5;
      pose.corpo.y += droop;
      break;
    }
    case "feliz": {
      const s = wave(t * 2);
      pose.cabeca.rotation = s * 5;
      pose.bracoEsq.rotation = -20 + s * 10;
      pose.bracoDir.rotation = 20 - s * 10;
      const bounce = Math.abs(s) * -4;
      pose.corpo.y += bounce;
      pose.cabeca.y += bounce;
      break;
    }
  }
  return pose;
}

/** Duração sugerida de um ciclo de movimento, em segundos, quando usado em looping. */
export const MOVEMENT_CYCLE_SECONDS: Record<MovementId, number> = {
  parado: 2.4,
  caminhar: 0.8,
  correr: 0.5,
  pular: 0.9,
  sentar: 1.2,
  acenar: 0.6,
  apontar: 1,
  comemorar: 0.7,
  triste: 2,
  feliz: 0.8,
};
