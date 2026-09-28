// Tipos centrais do motor de animação 2D do Kids AI Studio.
// Este pacote é compartilhado entre o backend (renderização real para MP4)
// e o frontend (pré-visualização), garantindo que o que o usuário vê
// corresponda ao vídeo exportado.

export type CharacterId = "leaozinho" | "coelhinho" | "ursinho" | "raposinha";

export type MovementId =
  | "parado"
  | "caminhar"
  | "correr"
  | "pular"
  | "sentar"
  | "acenar"
  | "apontar"
  | "comemorar"
  | "triste"
  | "feliz";

export type ExpressionId = "neutro" | "feliz" | "triste" | "surpreso" | "animado";

export type ScenarioId =
  | "casa"
  | "escola"
  | "parque"
  | "jardim"
  | "floresta"
  | "quarto"
  | "sala_de_aula"
  | "playground"
  | "rua"
  | "cozinha";

export type ObjectId =
  | "bola"
  | "brinquedo"
  | "livro"
  | "arvore"
  | "mochila"
  | "mesa"
  | "cadeira"
  | "semaforo";

export type AspectRatio = "9:16" | "16:9" | "1:1";

export interface Vec2 {
  x: number;
  y: number;
}

/** Posição/orientação de uma entidade em um instante da cena, em coordenadas normalizadas (0..1000 no eixo maior). */
export interface Pose {
  x: number;
  y: number;
  scale: number;
  rotation: number; // graus
  flip?: boolean; // espelhar horizontalmente (ex: olhar para a esquerda)
}

export interface Keyframe {
  /** tempo normalizado dentro da cena, 0..1 */
  t: number;
  pose: Pose;
  expression?: ExpressionId;
  movement?: MovementId;
}

export interface CharacterInstance {
  id: string; // id único da instância dentro da cena
  characterId: CharacterId;
  keyframes: Keyframe[];
}

export interface ObjectInstance {
  id: string;
  objectId: ObjectId;
  keyframes: Keyframe[];
}

export interface CameraKeyframe {
  t: number;
  /** centro da câmera em coordenadas normalizadas 0..1000 */
  x: number;
  y: number;
  /** 1 = enquadramento padrão, >1 = zoom in */
  zoom: number;
}

export interface Scene {
  id: string;
  name: string;
  scenarioId: ScenarioId;
  /** duração da cena em segundos */
  duration: number;
  characters: CharacterInstance[];
  objects: ObjectInstance[];
  camera: CameraKeyframe[];
  /** transição de entrada da cena */
  transitionIn: "corte" | "fade" | "slide";
}

export interface Project {
  id: string;
  title: string;
  mainIdea: string;
  educationalTheme: string;
  ageRange: string;
  durationSeconds: number;
  aspectRatio: AspectRatio;
  characterIds: CharacterId[];
  scenarioIds: ScenarioId[];
  scenes: Scene[];
  createdAt: string;
  updatedAt: string;
}

export interface RenderSettings {
  resolution: "480p" | "720p" | "1080p" | "1440p" | "2160p";
  fps: 24 | 30 | 60;
}

export const RESOLUTION_PX: Record<RenderSettings["resolution"], number> = {
  "480p": 480,
  "720p": 720,
  "1080p": 1080,
  "1440p": 1440,
  "2160p": 2160,
};

/** A resolução nomeada (480p..2160p) define a altura em formatos horizontais/quadrados
 * e a largura em formatos verticais — convenção comum para vídeos 9:16 de redes sociais. */
export function frameSize(aspect: AspectRatio, resolution: RenderSettings["resolution"]) {
  const px = RESOLUTION_PX[resolution];
  const even = (n: number) => Math.round(n / 2) * 2;
  switch (aspect) {
    case "9:16":
      return { width: even(px), height: even((px * 16) / 9) };
    case "16:9":
      return { width: even((px * 16) / 9), height: even(px) };
    case "1:1":
      return { width: even(px), height: even(px) };
  }
}
