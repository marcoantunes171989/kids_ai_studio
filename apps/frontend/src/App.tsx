import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.js";
import Dashboard from "./pages/Dashboard.js";
import CreateVideo from "./pages/CreateVideo.js";
import Stories from "./pages/Stories.js";
import Characters from "./pages/Characters.js";
import Scenarios from "./pages/Scenarios.js";
import SceneEditor from "./pages/SceneEditor.js";
import Renders from "./pages/Renders.js";
import Projects from "./pages/Projects.js";
import Videos from "./pages/Videos.js";
import Settings from "./pages/Settings.js";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/criar" element={<CreateVideo />} />
        <Route path="/historias" element={<Stories />} />
        <Route path="/personagens" element={<Characters />} />
        <Route path="/cenarios" element={<Scenarios />} />
        <Route path="/projetos/:id/editor" element={<SceneEditor />} />
        <Route path="/renderizacoes" element={<Renders />} />
        <Route path="/biblioteca/projetos" element={<Projects />} />
        <Route path="/biblioteca/videos" element={<Videos />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Route>
    </Routes>
  );
}
