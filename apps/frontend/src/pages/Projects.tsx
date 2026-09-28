import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import type { Project } from "@kidsai/engine";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  function reload() {
    api.listProjects().then(setProjects).finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este projeto permanentemente?")) return;
    await api.deleteProject(id);
    reload();
  }

  if (loading) return <p>Carregando projetos...</p>;

  return (
    <div>
      <h1>Projetos</h1>
      <p className="page-subtitle">Todos os projetos salvos, disponíveis mesmo após reiniciar o servidor.</p>

      {projects.length === 0 ? (
        <div className="card empty-state">
          Nenhum projeto ainda. <Link to="/criar">Crie o primeiro vídeo</Link>.
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr><th>Título</th><th>Tema</th><th>Duração</th><th>Formato</th><th>Cenas</th><th>Atualizado</th><th></th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.educationalTheme}</td>
                  <td>{p.durationSeconds}s</td>
                  <td>{p.aspectRatio}</td>
                  <td>{p.scenes.length}</td>
                  <td>{new Date(p.updatedAt).toLocaleString("pt-BR")}</td>
                  <td className="inline-actions">
                    <Link to={`/projetos/${p.id}/editor`} className="btn small secondary">Abrir editor</Link>
                    <Link to={`/renderizacoes?projectId=${p.id}`} className="btn small secondary">Renderizar</Link>
                    <button className="btn small danger" onClick={() => handleDelete(p.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
