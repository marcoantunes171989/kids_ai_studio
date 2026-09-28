import type { CameraKeyframe, Keyframe, Pose } from "./types.js";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Interpola a pose (posição/rotação/escala) de uma entidade em um instante t (0..1 da cena)
 * a partir de sua lista de keyframes ordenada por t. */
export function interpolatePose(keyframes: Keyframe[], t: number): { pose: Pose; movement: string; expression: string } {
  if (keyframes.length === 0) {
    return { pose: { x: 500, y: 500, scale: 1, rotation: 0 }, movement: "parado", expression: "neutro" };
  }
  const sorted = [...keyframes].sort((a, b) => a.t - b.t);
  if (t <= sorted[0].t) {
    return { pose: sorted[0].pose, movement: sorted[0].movement ?? "parado", expression: sorted[0].expression ?? "neutro" };
  }
  const last = sorted[sorted.length - 1];
  if (t >= last.t) {
    return { pose: last.pose, movement: last.movement ?? "parado", expression: last.expression ?? "neutro" };
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t || 1;
      const localT = easeInOut((t - a.t) / span);
      return {
        pose: {
          x: lerp(a.pose.x, b.pose.x, localT),
          y: lerp(a.pose.y, b.pose.y, localT),
          scale: lerp(a.pose.scale, b.pose.scale, localT),
          rotation: lerp(a.pose.rotation, b.pose.rotation, localT),
          flip: a.pose.flip,
        },
        movement: a.movement ?? "parado",
        expression: b.expression ?? a.expression ?? "neutro",
      };
    }
  }
  return { pose: last.pose, movement: last.movement ?? "parado", expression: last.expression ?? "neutro" };
}

export function interpolateCamera(keyframes: CameraKeyframe[], t: number): { x: number; y: number; zoom: number } {
  if (keyframes.length === 0) return { x: 500, y: 500, zoom: 1 };
  const sorted = [...keyframes].sort((a, b) => a.t - b.t);
  if (t <= sorted[0].t) return sorted[0];
  const last = sorted[sorted.length - 1];
  if (t >= last.t) return last;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (t >= a.t && t <= b.t) {
      const localT = easeInOut((t - a.t) / (b.t - a.t || 1));
      return { x: lerp(a.x, b.x, localT), y: lerp(a.y, b.y, localT), zoom: lerp(a.zoom, b.zoom, localT) };
    }
  }
  return last;
}
