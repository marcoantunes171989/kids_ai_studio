import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type RenderJob } from "../api/client.js";
import type { Project, RenderSettings } from "@kidsai/engine";

const RESOLUTIONS: RenderSettings["resolution"][] = ["480p", "720p", "1080p", "1440p", "2160p"];
const FPS_OPTIONS: RenderSettings["fps"][] = [24, 30, 60];

const STATUS_LABEL: Record<RenderJob["status"], string> = {
  pendente: "Pendente",
  renderizando: "Renderizando",
  concluido: "Concluído",
  erro: "Erro",
  cancelado: "Cancelado",
};

const STATUS_PILL: Record<RenderJob["status"], string> = {
  pendente: "info",
  renderizando: "warn",
  concluido: "ok",
  erro: "error",
  cancelado: "error",
};

export default function Renders() {
  const [params] = useSearchParams();
  const projectIdParam = params.get("projectId") ?? "";
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [projectId, setProjectId] = useState(projectIdParam);
  const [resolution, setResolution] = useState<RenderSettings["resolution"]>("1080p");
  const [fps, setFps] = useState<RenderSettings["fps"]>(30);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  function reload() {
    api.listRenders().then(setJobs);
  }

  useEffect(() => {
    api.listProjects().then((p) => {
      setProjects(p);
      if (!projectId && p.length > 0) setProjectId(p[0].id);
    });
    reload();
    const interval = setInterval(reload, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStart() {
    setError(null);
    if (!projectId) {
      setError("Selecione um projeto.");
      return;
    }
    setStarting(true);
    try {
      await api.startRender(projectId, { resolution, fps });
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao iniciar renderização.");
    } finally {
      setStarting(false);
    }
  }

  async function handleCancel(id: string) {
    await api.cancelRender(id);
    reload();
  }

  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div>
      <h1>Renderizações</h1>
      <p className="page-subtitle">Exporte seus projetos em MP4 usando o FFmpeg local.</p>

      {error && <div className="alert error">{error}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <h2>Nova renderização</h2>
        <div className="field-row">
          <div>
            <label>Projeto</label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="" disabled>Selecione um projeto</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label>Resolução</label>
            <select value={resolution} onChange={(e) => setResolution(e.target.value as RenderSettings["resolution"])}>
              {RESOLUTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label>FPS</label>
            <select value={fps} onChange={(e) => setFps(Number(e.target.value) as RenderSettings["fps"])}>
              {FPS_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <button className="btn" style={{ marginTop: 16 }} onClick={handleStart} disabled={starting}>
          {starting ? "Iniciando..." : "Renderizar vídeo"}
        </button>
      </div>

      <div className="card">
        <h2>Fila e histórico</h2>
        {jobs.length === 0 ? (
          <div className="empty-state">Nenhuma renderização ainda.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Projeto</th><th>Resolução</th><th>Status</th><th>Progresso</th><th></th></tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td>{projectById[j.projectId]?.title ?? j.projectId}</td>
                  <td>{j.resolution} · {j.fps}fps</td>
                  <td><span className={`pill ${STATUS_PILL[j.status]}`}>{STATUS_LABEL[j.status]}</span></td>
                  <td style={{ minWidth: 140 }}>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${Math.round(j.progress * 100)}%` }} />
                    </div>
                    {j.error && <div style={{ color: "var(--danger)", fontSize: 11, marginTop: 4 }}>{j.error}</div>}
                  </td>
                  <td>
                    {j.status === "renderizando" || j.status === "pendente" ? (
                      <button className="btn small secondary" onClick={() => handleCancel(j.id)}>Cancelar</button>
                    ) : j.status === "concluido" && j.outputPath ? (
                      <a className="btn small" href={`/media/videos/${j.outputPath.split(/[\\/]/).pop()}`} download>Baixar MP4</a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
