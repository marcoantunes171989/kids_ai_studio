import { CHARACTERS, characterSvgParts, type BodyPart } from "./characters.js";
import { OBJECTS } from "./objects.js";
import { SCENARIOS, scenarioBackgroundSvg } from "./scenarios.js";
import { interpolateCamera, interpolatePose } from "./timeline.js";
import { movementPose, MOVEMENT_CYCLE_SECONDS } from "./animations.js";
import type { ExpressionId, MovementId, Scene } from "./types.js";

const VB = 1000; // viewBox lógico quadrado; o frame final é recortado pelo aspecto no encoder

const PART_ORDER: BodyPart[] = [
  "cauda",
  "pernaEsq",
  "pernaDir",
  "corpo",
  "bracoEsq",
  "orelhaEsq",
  "orelhaDir",
  "cabeca",
  "bracoDir",
];

function renderCharacterGroup(characterId: keyof typeof CHARACTERS, expression: ExpressionId, movement: MovementId, cycleT: number): string {
  const def = CHARACTERS[characterId];
  const parts = characterSvgParts(def, expression);
  const pose = movementPose(movement, cycleT);
  const groups = PART_ORDER.map((part) => {
    const t = pose[part];
    return `<g transform="translate(${t.x} ${t.y}) rotate(${t.rotation})">${parts[part]}</g>`;
  }).join("\n");
  return `<g>${groups}</g>`;
}

/** Calcula em qual ponto do ciclo de animação (0..1) uma cena com "movement" contínuo está, em um dado tempo absoluto. */
function cyclePhase(absSeconds: number, cycleSeconds: number): number {
  if (cycleSeconds <= 0) return 0;
  const phase = (absSeconds % cycleSeconds) / cycleSeconds;
  return phase;
}

export interface RenderFrameOptions {
  scene: Scene;
  /** tempo absoluto dentro da cena, em segundos */
  timeSeconds: number;
  width: number;
  height: number;
}

/** Gera o SVG completo (string) de um quadro da cena, já recortado para width x height. */
export function renderSceneFrameSvg({ scene, timeSeconds, width, height }: RenderFrameOptions): string {
  const t = scene.duration > 0 ? Math.min(timeSeconds / scene.duration, 1) : 0;
  const scenario = SCENARIOS[scene.scenarioId];
  const camera = interpolateCamera(scene.camera, t);

  const charLayers = scene.characters
    .map((inst) => {
      const { pose, movement, expression } = interpolatePose(inst.keyframes, t);
      const cycleT = cyclePhase(timeSeconds, movementCycleSeconds(movement as MovementId));
      const flip = pose.flip ? -1 : 1;
      return `<g transform="translate(${pose.x} ${pose.y}) rotate(${pose.rotation}) scale(${pose.scale * flip} ${pose.scale})">
        ${renderCharacterGroup(inst.characterId, expression as ExpressionId, movement as MovementId, cycleT)}
      </g>`;
    })
    .join("\n");

  const objectLayers = scene.objects
    .map((inst) => {
      const { pose } = interpolatePose(inst.keyframes, t);
      const def = OBJECTS[inst.objectId];
      const flip = pose.flip ? -1 : 1;
      return `<g transform="translate(${pose.x} ${pose.y}) rotate(${pose.rotation}) scale(${pose.scale * flip} ${pose.scale})">${def.svg}</g>`;
    })
    .join("\n");

  // viewBox controlado pela câmera: zoom>1 reduz a janela visível, centrada em (camera.x, camera.y)
  const viewW = VB / camera.zoom;
  const viewH = VB / camera.zoom;
  const viewX = camera.x - viewW / 2;
  const viewY = camera.y - viewH / 2;

  // preserveAspectRatio "slice": o palco lógico quadrado é ampliado para cobrir todo o
  // quadro de saída (9:16, 16:9 ou 1:1) sem faixas pretas, recortando igualmente as bordas
  // opostas ao invés de encaixar com letterboxing.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewX} ${viewY} ${viewW} ${viewH}" preserveAspectRatio="xMidYMid slice">
    <g>${scenarioBackgroundSvg(scenario)}</g>
    <g>${objectLayers}</g>
    <g>${charLayers}</g>
  </svg>`;
}

function movementCycleSeconds(m: MovementId): number {
  return MOVEMENT_CYCLE_SECONDS[m] ?? 1;
}
