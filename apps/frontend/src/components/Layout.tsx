import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) => `sidebar-link${isActive ? " active" : ""}`;

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">🎬 Kids AI Studio</div>

        <div className="sidebar-group-title">Dashboard</div>
        <NavLink to="/" end className={linkClass}>Visão geral</NavLink>

        <div className="sidebar-group-title">Criação</div>
        <NavLink to="/criar" className={linkClass}>Criar vídeo</NavLink>
        <NavLink to="/historias" className={linkClass}>Histórias</NavLink>
        <NavLink to="/personagens" className={linkClass}>Personagens</NavLink>
        <NavLink to="/cenarios" className={linkClass}>Cenários</NavLink>

        <div className="sidebar-group-title">Produção</div>
        <NavLink to="/biblioteca/projetos" className={linkClass}>Editor de cenas</NavLink>
        <NavLink to="/renderizacoes" className={linkClass}>Renderizações</NavLink>

        <div className="sidebar-group-title">Biblioteca</div>
        <NavLink to="/biblioteca/projetos" end className={linkClass}>Projetos</NavLink>
        <NavLink to="/biblioteca/videos" className={linkClass}>Vídeos finalizados</NavLink>

        <div className="sidebar-group-title">Configurações</div>
        <NavLink to="/configuracoes" className={linkClass}>Configurações</NavLink>
      </aside>
      <div className="main-area">
        <div className="topbar">Produtora de vídeos infantis educativos</div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
