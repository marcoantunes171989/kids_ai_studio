import { useEffect, useState } from "react";
import { api, type RenderJob } from "../api/client.js";
import type { Project } from "@kidsai/engine";

export default function Videos() {
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.listRenders().then(setJobs);
    api.listProjects().then(setProjects);
  }, []);

  const finished = jobs.filter((j) => j.status === "concluido" && j.outputPath);
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div>
      <h1>Vídeos finalizados</h1>
      <p className="page-subtitle">Vídeos MP4 já renderizados, prontos para download.</p>

      {finished.length === 0 ? (
        <div className="card empty-state">Nenhum vídeo finalizado ainda.</div>
      ) : (
        <div className="grid grid-3">
          {finished.map((j) => {
            const filename = j.outputPath!.split(/[\\/]/).pop();
            const project = projectById[j.projectId];
            return (
              <div key={j.id} className="card">
                <video src={`/media/videos/${filename}`} controls style={{ width: "100%", borderRadius: 8, background: "#000" }} />
                <h2 style={{ marginTop: 10 }}>{project?.title ?? j.projectId}</h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{j.resolution} · {j.fps}fps</p>
                <a className="btn small" href={`/media/videos/${filename}`} download>Baixar MP4</a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
