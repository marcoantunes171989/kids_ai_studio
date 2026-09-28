import type { Project } from "@kidsai/engine";
import { db, nowIso } from "../db.js";

export function listProjects(): Project[] {
  const rows = db.prepare("SELECT data FROM projects ORDER BY updated_at DESC").all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Project);
}

export function getProject(id: string): Project | undefined {
  const row = db.prepare("SELECT data FROM projects WHERE id = ?").get(id) as { data: string } | undefined;
  return row ? (JSON.parse(row.data) as Project) : undefined;
}

export function saveProject(project: Project): Project {
  const existing = db.prepare("SELECT id FROM projects WHERE id = ?").get(project.id);
  const now = nowIso();
  project.updatedAt = now;
  if (!existing) {
    project.createdAt = now;
    db.prepare("INSERT INTO projects (id, title, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run(
      project.id,
      project.title,
      JSON.stringify(project),
      project.createdAt,
      project.updatedAt
    );
  } else {
    db.prepare("UPDATE projects SET title = ?, data = ?, updated_at = ? WHERE id = ?").run(
      project.title,
      JSON.stringify(project),
      project.updatedAt,
      project.id
    );
  }
  return project;
}

export function deleteProject(id: string): boolean {
  const result = db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  return result.changes > 0;
}
