import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { randomId } from "../utils/id.js";
import { api } from "../api/client.js";
import type { AspectRatio, CharacterId, ScenarioId, Scene } from "@kidsai/engine";

const DURATIONS = [30, 45, 60, 90, 120, 180, 240, 300];
const FORMATS: { value: AspectRatio; label: string }[] = [
  { value: "9:16", label: "Vertical 9:16" },
  { value: "16:9", label: "Horizontal 16:9" },
  { value: "1:1", label: "Quadrado 1:1" },
];
const EDUCATIONAL_THEMES = [
  "Amizade", "Empatia", "Compartilhar brinquedos", "Respeito", "Higiene pessoal",
  "Segurança no trânsito", "Segurança doméstica", "Cooperação", "Organização",
  "Alimentação saudável", "Emoções", "Respeito aos animais",
];

function formatDuration(seconds: number) {
  return seconds < 60 ? `${seconds} segundos` : `${Math.round(seconds / 60)} minuto${seconds > 60 ? "s" : ""}`;
}

export default function CreateVideo() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<{ id: string; name: string }[]>([]);
  const [scenarios, setScenarios] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [mainIdea, setMainIdea] = useState("");
  const [theme, setTheme] = useState(EDUCATIONAL_THEMES[0]);
  const [ageRange, setAgeRange] = useState("3 a 6 anos");
  const [duration, setDuration] = useState(60);
  const [format, setFormat] = useState<AspectRatio>("9:16");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [sceneCount, setSceneCount] = useState(4);

  useEffect(() => {
    api.listCharacters().then((r) => setCharacters(r.builtIn.map((c) => ({ id: c.id, name: c.name }))));
    api.listScenarios().then((r) => setScenarios(r.builtIn.map((s) => ({ id: s.id, name: s.name }))));
  }, []);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Informe um título para o vídeo.");
      return;
    }
    if (selectedScenarios.length === 0) {
      setError("Selecione ao menos um cenário.");
      return;
    }
    setSaving(true);
    try {
      const perScene = duration / sceneCount;
      const scenes: Scene[] = Array.from({ length: sceneCount }).map((_, i) => ({
        id: randomId(),
        name: `Cena ${i + 1}`,
        scenarioId: selectedScenarios[i % selectedScenarios.length] as ScenarioId,
        duration: Math.round(perScene * 10) / 10,
        characters: selectedCharacters.map((charId, ci) => ({
          id: randomId(),
          characterId: charId as CharacterId,
          keyframes: [
            { t: 0, pose: { x: 350 + ci * 200, y: 590, scale: 1, rotation: 0 }, movement: "parado", expression: "feliz" },
          ],
        })),
        objects: [],
        camera: [{ t: 0, x: 500, y: 560, zoom: 1 }],
        transitionIn: i === 0 ? "fade" : "corte",
      }));

      const project = await api.createProject({
        title,
        mainIdea,
        educationalTheme: theme,
        ageRange,
        durationSeconds: duration,
        aspectRatio: format,
        characterIds: selectedCharacters as CharacterId[],
        scenarioIds: selectedScenarios as ScenarioId[],
        scenes,
      });
      navigate(`/projetos/${project.id}/editor`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar projeto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Criar vídeo</h1>
      <p className="page-subtitle">Defina a ideia, os personagens e a estrutura do seu novo vídeo educativo.</p>

      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <label>Título</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: O leãozinho aprende a compartilhar" />

        <label>Ideia principal</label>
        <textarea value={mainIdea} onChange={(e) => setMainIdea(e.target.value)} placeholder="Descreva brevemente a história" />

        <div className="field-row">
          <div>
            <label>Tema educativo</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              {EDUCATIONAL_THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label>Faixa etária</label>
            <input type="text" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div>
            <label>Duração</label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
              {DURATIONS.map((d) => <option key={d} value={d}>{formatDuration(d)}</option>)}
            </select>
          </div>
          <div>
            <label>Formato</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as AspectRatio)}>
              {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label>Quantidade de cenas</label>
            <input type="number" min={1} max={20} value={sceneCount} onChange={(e) => setSceneCount(Number(e.target.value))} />
          </div>
        </div>

        <label>Personagens</label>
        <div className="gallery">
          {characters.map((c) => (
            <div
              key={c.id}
              className={`gallery-item${selectedCharacters.includes(c.id) ? " selected" : ""}`}
              onClick={() => toggle(selectedCharacters, setSelectedCharacters, c.id)}
              style={{ cursor: "pointer" }}
            >
              {c.name}
            </div>
          ))}
        </div>

        <label>Cenários</label>
        <div className="gallery">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className={`gallery-item${selectedScenarios.includes(s.id) ? " selected" : ""}`}
              onClick={() => toggle(selectedScenarios, setSelectedScenarios, s.id)}
              style={{ cursor: "pointer" }}
            >
              {s.name}
            </div>
          ))}
        </div>

        <button type="submit" className="btn" disabled={saving} style={{ marginTop: 20 }}>
          {saving ? "Salvando..." : "Salvar projeto e abrir editor"}
        </button>
      </form>
    </div>
  );
}
