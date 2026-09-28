import type { ObjectId } from "./types.js";

export interface ObjectDef {
  id: ObjectId;
  name: string;
  svg: string; // desenhado centrado em (0,0)
}

export const OBJECTS: Record<ObjectId, ObjectDef> = {
  bola: {
    id: "bola",
    name: "Bola",
    svg: `<circle cx="0" cy="0" r="18" fill="#E8532B" stroke="#8C2E14" stroke-width="2"/>
          <path d="M -18 0 A 18 18 0 0 1 18 0" stroke="#FFF" stroke-width="2" fill="none"/>
          <path d="M -9 -15 A 18 18 0 0 1 -9 15" stroke="#FFF" stroke-width="2" fill="none"/>`,
  },
  brinquedo: {
    id: "brinquedo",
    name: "Brinquedo",
    svg: `<rect x="-14" y="-14" width="28" height="28" rx="6" fill="#F6C445" stroke="#B4860B" stroke-width="2"/>
          <circle cx="0" cy="0" r="6" fill="#3D8FD1"/>`,
  },
  livro: {
    id: "livro",
    name: "Livro",
    svg: `<rect x="-16" y="-12" width="32" height="24" rx="2" fill="#4E8AC9" stroke="#2A5883" stroke-width="2"/>
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#2A5883" stroke-width="2"/>`,
  },
  arvore: {
    id: "arvore",
    name: "Árvore",
    svg: `<rect x="-6" y="0" width="12" height="34" fill="#7A5230"/>
          <circle cx="0" cy="-20" r="34" fill="#4F9450"/>`,
  },
  mochila: {
    id: "mochila",
    name: "Mochila",
    svg: `<rect x="-14" y="-18" width="28" height="36" rx="8" fill="#E0663E" stroke="#8C3A1E" stroke-width="2"/>
          <rect x="-8" y="-22" width="16" height="10" rx="4" fill="#B4502D"/>`,
  },
  mesa: {
    id: "mesa",
    name: "Mesa",
    svg: `<rect x="-30" y="-6" width="60" height="10" fill="#B4894E"/>
          <rect x="-26" y="4" width="8" height="26" fill="#8C6633"/>
          <rect x="18" y="4" width="8" height="26" fill="#8C6633"/>`,
  },
  cadeira: {
    id: "cadeira",
    name: "Cadeira",
    svg: `<rect x="-14" y="-24" width="28" height="8" fill="#B4894E"/>
          <rect x="-14" y="-16" width="8" height="34" fill="#8C6633"/>
          <rect x="6" y="-16" width="8" height="34" fill="#8C6633"/>`,
  },
  semaforo: {
    id: "semaforo",
    name: "Semáforo",
    svg: `<rect x="-6" y="-40" width="12" height="60" fill="#555"/>
          <rect x="-14" y="-70" width="28" height="40" rx="6" fill="#333"/>
          <circle cx="0" cy="-60" r="6" fill="#E8532B"/>
          <circle cx="0" cy="-46" r="6" fill="#F6C445"/>
          <circle cx="0" cy="-32" r="6" fill="#5FA85A"/>`,
  },
};

export const OBJECT_LIST = Object.values(OBJECTS);
