import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type RenderJob, type SystemStatus } from "../api/client.js";
import type { Project } from "@kidsai/engine";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [renders, setRenders] = useState<RenderJob[]>([]);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listProjects(), api.listRenders(), api.systemStatus()])
      .then(([p, r, s]) => {
        setProjects(p);
        setRenders(r);
        setStatus(s);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando painel...</p>;

  const finished = renders.filter((r) => r.status === "concluido");
  const inProgress = renders.filter((r) => r.status === "renderizando" || r.status === "pendente");
  const recentProjects = [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const recentExports = [...finished].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div>
      <h1>Visão geral</h1>
      <p className="page-subtitle">Resumo da produtora e das produções recentes.</p>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-label">Total de projetos</div>
          <div className="stat-value">{projects.length}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Em produção</div>
          <div className="stat-value">{inProgress.length}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Vídeos finalizados</div>
          <div className="stat-value">{finished.length}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Espaço livre no servidor</div>
          <div className="stat-value">{status?.diskFreeGB != null ? `${status.diskFreeGB} GB` : "—"}</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h2>Status do FFmpeg</h2>
          {status?.ffmpeg.available ? (
            <span className="pill ok">Disponível</span>
          ) : (
            <span className="pill error">Não encontrado</span>
          )}
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>{status?.ffmpeg.version ?? "—"}</p>
        </div>
        <div className="card">
          <h2>Resolução padrão</h2>
          <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>1080p / 30 FPS</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Ajustável por projeto na hora da renderização.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Produções recentes</h2>
          {recentProjects.length === 0 ? (
            <p className="page-subtitle">Nenhum projeto criado ainda.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Título</th><th>Duração</th><th>Formato</th></tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/projetos/${p.id}/editor`}>{p.title}</Link></td>
                    <td>{p.durationSeconds}s</td>
                    <td>{p.aspectRatio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link to="/criar" className="btn" style={{ marginTop: 14 }}>+ Criar novo vídeo</Link>
        </div>

        <div className="card">
          <h2>Últimas exportações</h2>
          {recentExports.length === 0 ? (
            <p className="page-subtitle">Nenhuma renderização concluída ainda.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Projeto</th><th>Resolução</th><th></th></tr>
              </thead>
              <tbody>
                {recentExports.map((r) => (
                  <tr key={r.id}>
                    <td>{projectById[r.projectId]?.title ?? r.projectId}</td>
                    <td>{r.resolution} · {r.fps}fps</td>
                    <td>
                      {r.outputPath && (
                        <a className="btn small secondary" href={`/media/videos/${r.outputPath.split(/[\\/]/).pop()}`} download>
                          Baixar
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
