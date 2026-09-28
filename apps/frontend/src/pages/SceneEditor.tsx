import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CHARACTER_LIST,
  SCENARIO_LIST,
  OBJECT_LIST,
  renderSceneFrameSvg,
  frameSize,
  type Project,
  type Scene,
  type CharacterInstance,
  type ObjectInstance,
  type MovementId,
  type ExpressionId,
  type CharacterId,
  type ScenarioId,
  type ObjectId,
} from "@kidsai/engine";
import { api } from "../api/client.js";
import { randomId } from "../utils/id.js";

const MOVEMENTS: MovementId[] = ["parado", "caminhar", "correr", "pular", "sentar", "acenar", "apontar", "comemorar", "triste", "feliz"];
const EXPRESSIONS: ExpressionId[] = ["neutro", "feliz", "triste", "surpreso", "animado"];
const TRANSITIONS: Scene["transitionIn"][] = ["corte", "fade", "slide"];

function emptyScene(scenarioId: ScenarioId): Scene {
  return {
    id: randomId(),
    name: "Nova cena",
    scenarioId,
    duration: 5,
    characters: [],
    objects: [],
    camera: [{ t: 0, x: 500, y: 560, zoom: 1 }],
    transitionIn: "corte",
  };
}

export default function SceneEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    api.getProject(id).then(setProject).catch((e) => setError(e.message));
  }, [id]);

  const scene = project?.scenes[sceneIndex];

  // Loop de pré-visualização: usa exatamente o mesmo motor (renderSceneFrameSvg) do backend,
  // garantindo que o que o usuário vê corresponda ao vídeo exportado.
  useEffect(() => {
    if (!scene || !previewRef.current || !project) return;
    const full = frameSize(project.aspectRatio, "480p");
    const scaleDown = 360 / Math.max(full.width, full.height);
    const width = Math.round(full.width * scaleDown);
    const height = Math.round(full.height * scaleDown);
    let raf: number;
    const start = performance.now();
    const loop = () => {
      const elapsed = ((performance.now() - start) / 1000) % Math.max(scene.duration, 0.1);
      const svg = renderSceneFrameSvg({ scene, timeSeconds: elapsed, width, height });
      if (previewRef.current) previewRef.current.innerHTML = svg;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene?.id, scene?.duration, JSON.stringify(scene?.characters), JSON.stringify(scene?.objects), JSON.stringify(scene?.camera), scene?.scenarioId, project?.aspectRatio]);

  function updateScenes(updater: (scenes: Scene[]) => Scene[]) {
    setProject((p) => (p ? { ...p, scenes: updater(p.scenes) } : p));
  }

  function updateScene(patch: Partial<Scene>) {
    updateScenes((scenes) => scenes.map((s, i) => (i === sceneIndex ? { ...s, ...patch } : s)));
  }

  function addScene() {
    if (!project) return;
    const newScene = emptyScene(project.scenarioIds[0] ?? SCENARIO_LIST[0].id);
    updateScenes((scenes) => [...scenes, newScene]);
    setSceneIndex(project.scenes.length);
  }

  function duplicateScene(i: number) {
    updateScenes((scenes) => {
      const copy: Scene = { ...scenes[i], id: randomId(), name: `${scenes[i].name} (cópia)` };
      const next = [...scenes];
      next.splice(i + 1, 0, copy);
      return next;
    });
  }

  function removeScene(i: number) {
    updateScenes((scenes) => scenes.filter((_, idx) => idx !== i));
    setSceneIndex((prev) => Math.max(0, Math.min(prev, (project?.scenes.length ?? 1) - 2)));
  }

  function moveScene(i: number, dir: -1 | 1) {
    updateScenes((scenes) => {
      const j = i + dir;
      if (j < 0 || j >= scenes.length) return scenes;
      const next = [...scenes];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setSceneIndex((prev) => (prev === i ? i + dir : prev === i + dir ? i : prev));
  }

  function addCharacterToScene(characterId: CharacterId) {
    if (!scene) return;
    const inst: CharacterInstance = {
      id: randomId(),
      characterId,
      keyframes: [{ t: 0, pose: { x: 400, y: 590, scale: 1, rotation: 0 }, movement: "parado", expression: "feliz" }],
    };
    updateScene({ characters: [...scene.characters, inst] });
  }

  function updateCharacterInstance(instId: string, patch: Partial<CharacterInstance["keyframes"][0]>) {
    if (!scene) return;
    updateScene({
      characters: scene.characters.map((c) =>
        c.id === instId ? { ...c, keyframes: c.keyframes.map((k, i) => (i === 0 ? { ...k, ...patch, pose: { ...k.pose, ...patch.pose } } : k)) } : c
      ),
    });
  }

  function removeCharacterInstance(instId: string) {
    if (!scene) return;
    updateScene({ characters: scene.characters.filter((c) => c.id !== instId) });
  }

  function addObjectToScene(objectId: ObjectId) {
    if (!scene) return;
    const inst: ObjectInstance = { id: randomId(), objectId, keyframes: [{ t: 0, pose: { x: 500, y: 610, scale: 1, rotation: 0 } }] };
    updateScene({ objects: [...scene.objects, inst] });
  }

  function removeObjectInstance(instId: string) {
    if (!scene) return;
    updateScene({ objects: scene.objects.filter((o) => o.id !== instId) });
  }

  async function save() {
    if (!project) return;
    setSaving(true);
    setError(null);
    try {
      await api.updateProject(project.id, project);
      setSavedAt(new Date().toLocaleTimeString("pt-BR"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !project) return <div className="alert error">{error}</div>;
  if (!project) return <p>Carregando projeto...</p>;

  return (
    <div>
      <h1>{project.title}</h1>
      <p className="page-subtitle">Editor de cenas — {project.durationSeconds}s · {project.aspectRatio}</p>
      {error && <div className="alert error">{error}</div>}

      <div className="inline-actions" style={{ marginBottom: 16 }}>
        <button className="btn" onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</button>
        {savedAt && <span className="pill ok">Salvo às {savedAt}</span>}
        <button className="btn secondary" onClick={() => navigate(`/renderizacoes?projectId=${project.id}`)}>Ir para renderização</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2>Cenas ({project.scenes.length})</h2>
            <div className="scene-list">
              {project.scenes.map((s, i) => (
                <div key={s.id} className={`scene-card${i === sceneIndex ? " active" : ""}`} onClick={() => setSceneIndex(i)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{i + 1}. {s.name}</strong>
                    <span className="pill info">{s.duration}s</span>
                  </div>
                  <div className="inline-actions" style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                    <button className="btn small secondary" onClick={() => moveScene(i, -1)} disabled={i === 0}>↑</button>
                    <button className="btn small secondary" onClick={() => moveScene(i, 1)} disabled={i === project.scenes.length - 1}>↓</button>
                    <button className="btn small secondary" onClick={() => duplicateScene(i)}>Duplicar</button>
                    <button className="btn small danger" onClick={() => removeScene(i)} disabled={project.scenes.length <= 1}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn secondary" style={{ marginTop: 12 }} onClick={addScene}>+ Adicionar cena</button>
          </div>

          {scene && (
            <div className="card">
              <h2>Editar cena {sceneIndex + 1}</h2>
              <div className="field-row">
                <div>
                  <label>Nome</label>
                  <input type="text" value={scene.name} onChange={(e) => updateScene({ name: e.target.value })} />
                </div>
                <div>
                  <label>Duração (s)</label>
                  <input type="number" min={1} step={0.5} value={scene.duration} onChange={(e) => updateScene({ duration: Number(e.target.value) })} />
                </div>
                <div>
                  <label>Transição de entrada</label>
                  <select value={scene.transitionIn} onChange={(e) => updateScene({ transitionIn: e.target.value as Scene["transitionIn"] })}>
                    {TRANSITIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <label>Cenário</label>
              <select value={scene.scenarioId} onChange={(e) => updateScene({ scenarioId: e.target.value as ScenarioId })}>
                {SCENARIO_LIST.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <label>Câmera — zoom / posição</label>
              <div className="field-row">
                <input type="number" step={0.1} min={0.5} max={3} value={scene.camera[0]?.zoom ?? 1}
                  onChange={(e) => updateScene({ camera: [{ ...scene.camera[0], zoom: Number(e.target.value) }] })} placeholder="zoom" />
                <input type="number" value={scene.camera[0]?.x ?? 500}
                  onChange={(e) => updateScene({ camera: [{ ...scene.camera[0], x: Number(e.target.value) }] })} placeholder="posição x" />
                <input type="number" value={scene.camera[0]?.y ?? 560}
                  onChange={(e) => updateScene({ camera: [{ ...scene.camera[0], y: Number(e.target.value) }] })} placeholder="posição y" />
              </div>

              <label>Personagens na cena</label>
              {scene.characters.map((c) => {
                const kf = c.keyframes[0];
                const def = CHARACTER_LIST.find((d) => d.id === c.characterId);
                return (
                  <div key={c.id} className="scene-card" style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>{def?.name}</strong>
                      <button className="btn small danger" onClick={() => removeCharacterInstance(c.id)}>Remover</button>
                    </div>
                    <div className="field-row">
                      <div>
                        <label>Movimento</label>
                        <select value={kf.movement} onChange={(e) => updateCharacterInstance(c.id, { movement: e.target.value as MovementId })}>
                          {MOVEMENTS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label>Expressão</label>
                        <select value={kf.expression} onChange={(e) => updateCharacterInstance(c.id, { expression: e.target.value as ExpressionId })}>
                          {EXPRESSIONS.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
                        </select>
                      </div>
                      <div>
                        <label>Posição X</label>
                        <input type="number" value={kf.pose.x} onChange={(e) => updateCharacterInstance(c.id, { pose: { ...kf.pose, x: Number(e.target.value) } })} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <select onChange={(e) => { if (e.target.value) addCharacterToScene(e.target.value as CharacterId); e.target.value = ""; }} defaultValue="">
                <option value="" disabled>+ Adicionar personagem</option>
                {CHARACTER_LIST.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label style={{ marginTop: 18 }}>Objetos na cena</label>
              {scene.objects.map((o) => {
                const def = OBJECT_LIST.find((d) => d.id === o.objectId);
                return (
                  <div key={o.id} className="inline-actions" style={{ marginBottom: 6 }}>
                    <span className="pill info">{def?.name}</span>
                    <button className="btn small danger" onClick={() => removeObjectInstance(o.id)}>Remover</button>
                  </div>
                );
              })}
              <select onChange={(e) => { if (e.target.value) addObjectToScene(e.target.value as ObjectId); e.target.value = ""; }} defaultValue="">
                <option value="" disabled>+ Adicionar objeto</option>
                {OBJECT_LIST.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="card" style={{ position: "sticky", top: 20 }}>
          <h2>Pré-visualização</h2>
          <div className="preview-frame" style={{ aspectRatio: project.aspectRatio.replace(":", "/"), width: "100%" }} ref={previewRef} />

          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            A pré-visualização usa o mesmo motor de renderização do vídeo exportado.
          </p>
        </div>
      </div>
    </div>
  );
}
