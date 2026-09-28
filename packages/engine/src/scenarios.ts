import type { ScenarioId } from "./types.js";

export interface ScenarioDef {
  id: ScenarioId;
  name: string;
  sky: string;
  ground: string;
  groundY: number; // posição do horizonte, 0..1000
  decorations: string; // SVG estático de fundo (props fixos do cenário)
}

const W = 1000;
const H = 1000;

export const SCENARIOS: Record<ScenarioId, ScenarioDef> = {
  casa: {
    id: "casa",
    name: "Casa",
    sky: "#FCEFD8",
    ground: "#E8C99B",
    groundY: 680,
    decorations: `
      <rect x="60" y="120" width="880" height="560" fill="#F7E3C0"/>
      <rect x="120" y="180" width="220" height="260" rx="10" fill="#F1C6A0" stroke="#B98A5C" stroke-width="4"/>
      <rect x="660" y="200" width="180" height="200" rx="10" fill="#F1C6A0" stroke="#B98A5C" stroke-width="4"/>
      <rect x="0" y="660" width="1000" height="20" fill="#C9A36B"/>
    `,
  },
  escola: {
    id: "escola",
    name: "Escola",
    sky: "#DCEFFB",
    ground: "#D7E7C8",
    groundY: 700,
    decorations: `
      <rect x="100" y="160" width="800" height="520" fill="#FDECC8"/>
      <rect x="440" y="260" width="120" height="180" fill="#B4522A"/>
      <polygon points="80,160 500,60 920,160" fill="#8C4A2E"/>
    `,
  },
  parque: {
    id: "parque",
    name: "Parque",
    sky: "#CDEBFA",
    ground: "#8FC46B",
    groundY: 640,
    decorations: `
      <circle cx="260" cy="220" r="60" fill="#5FA85A"/>
      <rect x="250" y="260" width="20" height="60" fill="#7A5230"/>
      <circle cx="740" cy="200" r="70" fill="#5FA85A"/>
      <rect x="730" y="250" width="20" height="70" fill="#7A5230"/>
      <rect x="420" y="560" width="160" height="16" fill="#A9754A"/>
      <rect x="440" y="576" width="18" height="40" fill="#A9754A"/>
      <rect x="540" y="576" width="18" height="40" fill="#A9754A"/>
    `,
  },
  jardim: {
    id: "jardim",
    name: "Jardim",
    sky: "#D6F0E3",
    ground: "#9FD08A",
    groundY: 660,
    decorations: `
      <circle cx="200" cy="600" r="18" fill="#F191C1"/>
      <circle cx="260" cy="620" r="14" fill="#F6C445"/>
      <circle cx="740" cy="610" r="16" fill="#F191C1"/>
      <circle cx="800" cy="590" r="14" fill="#F6C445"/>
      <path d="M 500 660 C 470 560 530 500 500 420" stroke="#5B8A45" stroke-width="10" fill="none"/>
    `,
  },
  floresta: {
    id: "floresta",
    name: "Floresta",
    sky: "#BCE0D6",
    ground: "#6C9E52",
    groundY: 620,
    decorations: `
      <polygon points="100,600 180,320 260,600" fill="#3F7A3F"/>
      <polygon points="260,600 340,260 420,600" fill="#356A35"/>
      <polygon points="640,600 720,280 800,600" fill="#3F7A3F"/>
      <polygon points="800,600 880,320 960,600" fill="#356A35"/>
    `,
  },
  quarto: {
    id: "quarto",
    name: "Quarto",
    sky: "#F7E9F2",
    ground: "#E2C9A0",
    groundY: 700,
    decorations: `
      <rect x="0" y="0" width="1000" height="700" fill="#FBEFF6"/>
      <rect x="80" y="380" width="220" height="140" rx="12" fill="#F4C7DC" stroke="#D492B3" stroke-width="4"/>
      <rect x="700" y="200" width="160" height="220" fill="#E3D3B8" stroke="#B39868" stroke-width="4"/>
    `,
  },
  sala_de_aula: {
    id: "sala_de_aula",
    name: "Sala de Aula",
    sky: "#E7F1FB",
    ground: "#D9C6A3",
    groundY: 700,
    decorations: `
      <rect x="0" y="0" width="1000" height="700" fill="#EFF6FC"/>
      <rect x="120" y="120" width="380" height="220" fill="#3D6B4C" stroke="#274A31" stroke-width="8"/>
      <rect x="640" y="420" width="200" height="120" fill="#C99A5B"/>
    `,
  },
  playground: {
    id: "playground",
    name: "Playground",
    sky: "#CDEBFA",
    ground: "#D8B36B",
    groundY: 660,
    decorations: `
      <rect x="380" y="380" width="240" height="16" fill="#E0663E"/>
      <rect x="390" y="396" width="16" height="200" fill="#E0663E"/>
      <rect x="590" y="396" width="16" height="200" fill="#E0663E"/>
      <path d="M 420 396 Q 500 480 580 396" stroke="#3D8FD1" stroke-width="10" fill="none"/>
    `,
  },
  rua: {
    id: "rua",
    name: "Rua com Faixa de Pedestres",
    sky: "#DCEFFB",
    ground: "#6C6C72",
    groundY: 640,
    decorations: `
      ${Array.from({ length: 8 })
        .map((_, i) => `<rect x="${140 + i * 95}" y="600" width="60" height="90" fill="#FFFFFF" opacity="0.85"/>`)
        .join("\n")}
    `,
  },
  cozinha: {
    id: "cozinha",
    name: "Cozinha",
    sky: "#FFF3E2",
    ground: "#D9C29B",
    groundY: 700,
    decorations: `
      <rect x="0" y="0" width="1000" height="700" fill="#FFF7EA"/>
      <rect x="100" y="420" width="800" height="120" fill="#E3C08A" stroke="#B4894E" stroke-width="4"/>
      <rect x="650" y="260" width="150" height="160" fill="#CFCFCF" stroke="#9B9B9B" stroke-width="4"/>
    `,
  },
};

export const SCENARIO_LIST = Object.values(SCENARIOS);

/** Margem de segurança em torno do palco lógico 1000x1000: garante que movimentos de
 * câmera (pan/zoom) nunca exponham área sem conteúdo desenhado (fundo em branco/preto). */
const MARGIN = 600;

export function scenarioBackgroundSvg(def: ScenarioDef): string {
  return `
    <rect x="${-MARGIN}" y="${-MARGIN}" width="${W + MARGIN * 2}" height="${H + MARGIN * 2}" fill="${def.sky}"/>
    ${def.decorations}
    <rect x="${-MARGIN}" y="${def.groundY}" width="${W + MARGIN * 2}" height="${H - def.groundY + MARGIN}" fill="${def.ground}"/>
  `;
}
