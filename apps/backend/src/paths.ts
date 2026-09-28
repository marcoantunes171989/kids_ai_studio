import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// apps/backend/src -> raiz do projeto (3 níveis acima)
export const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

export const DATA_DIR = path.join(PROJECT_ROOT, "data");
export const DB_DIR = path.join(DATA_DIR, "db");
export const DB_PATH = path.join(DB_DIR, "kidsaistudio.db");
export const CHARACTERS_DIR = path.join(DATA_DIR, "characters", "imported");
export const SCENARIOS_DIR = path.join(DATA_DIR, "scenarios", "imported");
export const PROJECTS_DIR = path.join(DATA_DIR, "projects");
export const TEMP_DIR = path.join(DATA_DIR, "temp");
export const RENDERS_DIR = path.join(DATA_DIR, "renders");
export const VIDEOS_DIR = path.join(DATA_DIR, "videos");

export const FFMPEG_DIR = path.join(PROJECT_ROOT, "tools", "ffmpeg", "bin");
export const FFMPEG_BIN = path.join(FFMPEG_DIR, "ffmpeg.exe");
export const FFPROBE_BIN = path.join(FFMPEG_DIR, "ffprobe.exe");

export function ensureDataDirs() {
  for (const dir of [DB_DIR, CHARACTERS_DIR, SCENARIOS_DIR, PROJECTS_DIR, TEMP_DIR, RENDERS_DIR, VIDEOS_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
