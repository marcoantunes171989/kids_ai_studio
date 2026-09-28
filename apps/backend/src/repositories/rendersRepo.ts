import { db, nowIso } from "../db.js";

export type RenderStatus = "pendente" | "renderizando" | "concluido" | "erro" | "cancelado";

export interface RenderJob {
  id: string;
  projectId: string;
  status: RenderStatus;
  progress: number;
  resolution: string;
  fps: number;
  outputPath: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

function rowToJob(row: any): RenderJob {
  return {
    id: row.id,
    projectId: row.project_id,
    status: row.status,
    progress: row.progress,
    resolution: row.resolution,
    fps: row.fps,
    outputPath: row.output_path,
    error: row.error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createRenderJob(job: Omit<RenderJob, "createdAt" | "updatedAt">): RenderJob {
  const now = nowIso();
  db.prepare(
    `INSERT INTO renders (id, project_id, status, progress, resolution, fps, output_path, error, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(job.id, job.projectId, job.status, job.progress, job.resolution, job.fps, job.outputPath, job.error, now, now);
  return { ...job, createdAt: now, updatedAt: now };
}

export function updateRenderJob(id: string, patch: Partial<Pick<RenderJob, "status" | "progress" | "outputPath" | "error">>) {
  const current = getRenderJob(id);
  if (!current) return;
  const merged = { ...current, ...patch, updatedAt: nowIso() };
  db.prepare(
    `UPDATE renders SET status = ?, progress = ?, output_path = ?, error = ?, updated_at = ? WHERE id = ?`
  ).run(merged.status, merged.progress, merged.outputPath, merged.error, merged.updatedAt, id);
}

export function getRenderJob(id: string): RenderJob | undefined {
  const row = db.prepare("SELECT * FROM renders WHERE id = ?").get(id) as any;
  return row ? rowToJob(row) : undefined;
}

export function listRenderJobs(projectId?: string): RenderJob[] {
  const rows = projectId
    ? (db.prepare("SELECT * FROM renders WHERE project_id = ? ORDER BY created_at DESC").all(projectId) as any[])
    : (db.prepare("SELECT * FROM renders ORDER BY created_at DESC").all() as any[]);
  return rows.map(rowToJob);
}
