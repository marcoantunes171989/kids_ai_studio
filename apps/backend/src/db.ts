import { createRequire } from "node:module";
import { DB_PATH, ensureDataDirs } from "./paths.js";

ensureDataDirs();

// Import via createRequire: "node:sqlite" é um módulo experimental recente que a etapa de
// resolução estática do Vite/Vitest ainda não reconhece corretamente; require() em tempo
// de execução evita essa reescrita e é resolvido nativamente pelo Node.
const require = createRequire(import.meta.url);
const { DatabaseSync } = require("node:sqlite") as typeof import("node:sqlite");

// Vitest define process.env.VITEST automaticamente: usamos um banco em memória durante os
// testes para nunca escrever dados de teste no banco real de desenvolvimento/produção.
export const db = new DatabaseSync(process.env.VITEST ? ":memory:" : DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS renders (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    status TEXT NOT NULL,
    progress REAL NOT NULL DEFAULT 0,
    resolution TEXT NOT NULL,
    fps INTEGER NOT NULL,
    output_path TEXT,
    error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );
`);

export function nowIso() {
  return new Date().toISOString();
}
