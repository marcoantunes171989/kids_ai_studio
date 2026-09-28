import { useEffect, useState } from "react";
import { api, type SystemStatus } from "../api/client.js";

export default function Settings() {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    api.systemStatus().then(setStatus);
  }, []);

  return (
    <div>
      <h1>Configurações</h1>
      <p className="page-subtitle">Resolução, diretórios, motor de renderização, GitHub e preparação para a Vercel.</p>

      <div className="grid grid-2">
        <div className="card">
          <h2>Resolução e motor de renderização</h2>
          <table>
            <tbody>
              <tr><td>Resoluções suportadas</td><td>480p, 720p, 1080p, 1440p, 2160p (4K)</td></tr>
              <tr><td>Taxas de quadro</td><td>24, 30 e 60 FPS (quando suportado)</td></tr>
              <tr><td>Codec</td><td>H.264 (libx264) em contêiner MP4</td></tr>
              <tr><td>FFmpeg</td><td>{status?.ffmpeg.available ? <span className="pill ok">Disponível</span> : <span className="pill error">Não encontrado</span>}</td></tr>
              <tr><td>Versão</td><td style={{ fontSize: 12 }}>{status?.ffmpeg.version ?? "—"}</td></tr>
              <tr><td>Caminho do binário</td><td style={{ fontSize: 12, wordBreak: "break-all" }}>{status?.ffmpeg.path}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Diretórios</h2>
          <table>
            <tbody>
              <tr><td>Dados da aplicação</td><td style={{ fontSize: 12, wordBreak: "break-all" }}>{status?.dataDir}</td></tr>
              <tr><td>Espaço livre</td><td>{status?.diskFreeGB != null ? `${status.diskFreeGB} GB` : "—"}</td></tr>
              <tr><td>Node.js</td><td>{status?.nodeVersion}</td></tr>
              <tr><td>Plataforma</td><td>{status?.platform}</td></tr>
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
            Projetos, personagens importados, renderizações e vídeos finalizados ficam fora do controle de
            versão Git (diretório <code>data/</code>) e permanecem disponíveis após reiniciar o servidor.
          </p>
        </div>

        <div className="card">
          <h2>GitHub</h2>
          <p style={{ fontSize: 13 }}>
            Repositório oficial: <br />
            <a href="https://github.com/marcoantunes171989/kids_ai_studio" target="_blank" rel="noreferrer">
              github.com/marcoantunes171989/kids_ai_studio
            </a>
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Branch principal: <strong>main</strong>. Vídeos, arquivos temporários e credenciais nunca são
            versionados (ver <code>.gitignore</code>).
          </p>
        </div>

        <div className="card">
          <h2>Preparação para Vercel</h2>
          <p style={{ fontSize: 13 }}>
            O frontend (painel) é compatível com hospedagem estática/SSR na Vercel. O processamento pesado de
            vídeo (motor de animação + FFmpeg) permanece no Windows Server local.
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 18 }}>
            <li>Frontend → Vercel (interface e API de leitura)</li>
            <li>Backend de renderização → permanece no servidor local, atrás de autenticação e HTTPS</li>
            <li>Comunicação painel ↔ motor local via API protegida (a implementar antes do deploy)</li>
            <li>Fila de renderização e consulta de status já implementadas nesta versão</li>
            <li>Nenhuma porta administrativa exposta à internet</li>
          </ul>
          <p style={{ fontSize: 12, color: "var(--warning)" }}>
            Nenhum deploy na Vercel foi realizado nesta primeira etapa, conforme planejado.
          </p>
        </div>
      </div>
    </div>
  );
}
