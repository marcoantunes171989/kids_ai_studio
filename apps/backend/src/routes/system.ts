import { Router } from "express";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { FFMPEG_BIN, FFPROBE_BIN, DATA_DIR } from "../paths.js";

export const systemRouter = Router();

function checkFfmpeg() {
  try {
    const result = spawnSync(FFMPEG_BIN, ["-version"], { encoding: "utf-8" });
    if (result.status !== 0 || !result.stdout) return { available: false, version: null as string | null };
    const firstLine = result.stdout.split("\n")[0] ?? "";
    return { available: true, version: firstLine.trim() };
  } catch {
    return { available: false, version: null as string | null };
  }
}

function diskFreeGB() {
  try {
    const stat = fs.statfsSync(DATA_DIR);
    const freeBytes = Number(stat.bavail) * Number(stat.bsize);
    return Math.round((freeBytes / 1024 / 1024 / 1024) * 10) / 10;
  } catch {
    return null;
  }
}

systemRouter.get("/status", (_req, res) => {
  const ffmpeg = checkFfmpeg();
  res.json({
    ffmpeg: { ...ffmpeg, path: FFMPEG_BIN },
    ffprobePath: FFPROBE_BIN,
    diskFreeGB: diskFreeGB(),
    nodeVersion: process.version,
    platform: process.platform,
    dataDir: DATA_DIR,
  });
});
