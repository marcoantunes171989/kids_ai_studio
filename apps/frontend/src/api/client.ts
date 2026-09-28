import type { Project, RenderSettings } from "@kidsai/engine";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Erro ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface SystemStatus {
  ffmpeg: { available: boolean; version: string | null; path: string };
  ffprobePath: string;
  diskFreeGB: number | null;
  nodeVersion: string;
  platform: string;
  dataDir: string;
}

export interface RenderJob {
  id: string;
  projectId: string;
  status: "pendente" | "renderizando" | "concluido" | "erro" | "cancelado";
  progress: number;
  resolution: string;
  fps: number;
  outputPath: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  systemStatus: () => request<SystemStatus>("/system/status"),

  listProjects: () => request<Project[]>("/projects"),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  createProject: (data: Partial<Project>) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) => request<void>(`/projects/${id}`, { method: "DELETE" }),

  listCharacters: () => request<{ builtIn: any[]; imported: any[] }>("/library/characters"),
  listScenarios: () => request<{ builtIn: any[] }>("/library/scenarios"),
  listObjects: () => request<{ builtIn: any[] }>("/library/objects"),
  importCharacter: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/library/characters/import", { method: "POST", body: form });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(body.error ?? `Erro ${res.status}`);
    }
    return res.json();
  },

  listRenders: (projectId?: string) => request<RenderJob[]>(`/render${projectId ? `?projectId=${projectId}` : ""}`),
  getRender: (id: string) => request<RenderJob>(`/render/${id}`),
  startRender: (projectId: string, settings: RenderSettings) =>
    request<RenderJob>("/render", { method: "POST", body: JSON.stringify({ projectId, ...settings }) }),
  cancelRender: (id: string) => request<{ status: string }>(`/render/${id}/cancel`, { method: "POST" }),
};
