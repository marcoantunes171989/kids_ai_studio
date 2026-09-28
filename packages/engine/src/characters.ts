import type { CharacterId, ExpressionId } from "./types.js";

export interface CharacterDef {
  id: CharacterId;
  name: string;
  /** paleta de cores do personagem */
  colors: {
    body: string;
    belly: string;
    accent: string; // orelhas internas, cauda, focinho
    outline: string;
  };
  /** forma das orelhas usada para diferenciar espécies */
  earShape: "round" | "long" | "triangle" | "pointed";
  hasTail: "short" | "fluffy" | "long" | "none";
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  leaozinho: {
    id: "leaozinho",
    name: "Leãozinho",
    colors: { body: "#F4A93A", belly: "#FFE3B0", accent: "#C9701E", outline: "#7A4415" },
    earShape: "round",
    hasTail: "fluffy",
  },
  coelhinho: {
    id: "coelhinho",
    name: "Coelhinho",
    colors: { body: "#F2F2F2", belly: "#FFFFFF", accent: "#F6A6C1", outline: "#B0AFAF" },
    earShape: "long",
    hasTail: "short",
  },
  ursinho: {
    id: "ursinho",
    name: "Ursinho",
    colors: { body: "#9C6B45", belly: "#E8CBA6", accent: "#6E4826", outline: "#4A3018" },
    earShape: "round",
    hasTail: "short",
  },
  raposinha: {
    id: "raposinha",
    name: "Raposinha",
    colors: { body: "#E8632C", belly: "#FFF4E6", accent: "#3A2A22", outline: "#7A3312" },
    earShape: "triangle",
    hasTail: "long",
  },
};

export const CHARACTER_LIST = Object.values(CHARACTERS);

/** Partes articuláveis do boneco padrão usado por todos os personagens.
 * Cada parte recebe uma transformação (translate/rotate) por quadro, calculada em animations.ts. */
export type BodyPart =
  | "corpo"
  | "cabeca"
  | "orelhaEsq"
  | "orelhaDir"
  | "bracoEsq"
  | "bracoDir"
  | "pernaEsq"
  | "pernaDir"
  | "cauda";

function earPath(shape: CharacterDef["earShape"]): string {
  switch (shape) {
    case "round":
      return "M -14 0 A 14 14 0 1 1 14 0 A 14 14 0 1 1 -14 0 Z";
    case "long":
      return "M -8 4 C -12 -40 -4 -60 0 -60 C 4 -60 12 -40 8 4 Z";
    case "triangle":
      return "M -14 6 L 0 -34 L 14 6 Z";
    case "pointed":
      return "M -10 6 L 2 -30 L 14 6 Z";
  }
}

function tailPath(shape: CharacterDef["hasTail"]): string {
  switch (shape) {
    case "fluffy":
      return "M 0 0 C 30 -6 46 10 40 30 C 54 26 58 44 40 46 C 46 30 30 26 20 14 Z";
    case "short":
      return "M 0 0 C 14 -4 18 8 6 14 Z";
    case "long":
      return "M 0 0 C 26 4 46 -6 56 -20 C 48 -4 40 6 22 10 Z";
    case "none":
      return "";
  }
}

/** Olhos/boca por expressão — trocados sobre a cabeça do personagem. */
function facePaths(expression: ExpressionId): string {
  switch (expression) {
    case "feliz":
      return `
        <circle cx="-9" cy="-4" r="3.2" fill="#222"/>
        <circle cx="9" cy="-4" r="3.2" fill="#222"/>
        <path d="M -10 6 Q 0 16 10 6" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      `;
    case "triste":
      return `
        <path d="M -12 -6 Q -9 -2 -6 -6" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 6 -6 Q 9 -2 12 -6" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="-9" cy="-2" r="2.6" fill="#222"/>
        <circle cx="9" cy="-2" r="2.6" fill="#222"/>
        <path d="M -9 10 Q 0 4 9 10" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      `;
    case "surpreso":
      return `
        <circle cx="-9" cy="-4" r="4" fill="#222"/>
        <circle cx="9" cy="-4" r="4" fill="#222"/>
        <ellipse cx="0" cy="9" rx="5" ry="7" fill="#222"/>
      `;
    case "animado":
      return `
        <path d="M -12 -6 L -6 -2" stroke="#222" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M 12 -6 L 6 -2" stroke="#222" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M -11 5 Q 0 18 11 5" stroke="#222" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      `;
    case "neutro":
    default:
      return `
        <circle cx="-9" cy="-4" r="3" fill="#222"/>
        <circle cx="9" cy="-4" r="3" fill="#222"/>
        <path d="M -7 8 Q 0 12 7 8" stroke="#222" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      `;
  }
}

/** Gera o SVG completo do personagem (grupo raiz "corpo" com partes filhas nomeadas),
 * pronto para receber transformações por quadro em cada parte via renderer. */
export function characterSvgParts(def: CharacterDef, expression: ExpressionId) {
  const { body, belly, accent, outline } = def.colors;
  return {
    corpo: `<ellipse cx="0" cy="0" rx="30" ry="36" fill="${body}" stroke="${outline}" stroke-width="2"/>
            <ellipse cx="0" cy="10" rx="18" ry="22" fill="${belly}"/>`,
    cauda: `<path d="${tailPath(def.hasTail)}" fill="${accent}" stroke="${outline}" stroke-width="1.5"/>`,
    pernaEsq: `<rect x="-10" y="0" width="14" height="26" rx="7" fill="${body}" stroke="${outline}" stroke-width="2"/>`,
    pernaDir: `<rect x="-4" y="0" width="14" height="26" rx="7" fill="${body}" stroke="${outline}" stroke-width="2"/>`,
    bracoEsq: `<rect x="-8" y="0" width="12" height="22" rx="6" fill="${body}" stroke="${outline}" stroke-width="2"/>`,
    bracoDir: `<rect x="-4" y="0" width="12" height="22" rx="6" fill="${body}" stroke="${outline}" stroke-width="2"/>`,
    orelhaEsq: `<path d="${earPath(def.earShape)}" fill="${body}" stroke="${outline}" stroke-width="2"/>`,
    orelhaDir: `<path d="${earPath(def.earShape)}" fill="${body}" stroke="${outline}" stroke-width="2"/>`,
    cabeca: `<circle cx="0" cy="0" r="24" fill="${body}" stroke="${outline}" stroke-width="2"/>
             <ellipse cx="0" cy="14" rx="10" ry="7" fill="${accent}" opacity="0.6"/>
             ${facePaths(expression)}`,
  } satisfies Record<BodyPart, string>;
}
