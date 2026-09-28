import { useEffect, useRef, useState } from "react";
import { CHARACTER_LIST } from "@kidsai/engine";
import CharacterThumb from "../components/CharacterThumb.js";
import { api } from "../api/client.js";

const MOVEMENTS = ["caminhar", "correr", "pular", "sentar", "acenar", "apontar", "comemorar", "triste", "feliz"];

export default function Characters() {
  const [imported, setImported] = useState<{ id: string; name: string; url: string }[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function loadImported() {
    api.listCharacters().then((r) => setImported(r.imported));
  }

  useEffect(loadImported, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setWarning(null);
    try {
      const result = await api.importCharacter(file);
      setWarning(result.warning);
      loadImported();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao importar personagem.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div>
      <h1>Personagens</h1>
      <p className="page-subtitle">Biblioteca de personagens vetoriais originais, com movimentos reutilizáveis.</p>

      <div className="grid grid-4">
        {CHARACTER_LIST.map((c) => (
          <div key={c.id} className="card" style={{ textAlign: "center" }}>
            <CharacterThumb characterId={c.id} size={110} />
            <h2 style={{ marginTop: 6 }}>{c.name}</h2>
            <div className="inline-actions" style={{ justifyContent: "center" }}>
              {MOVEMENTS.map((m) => <span key={m} className="pill info">{m}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>Importar personagem (PNG, SVG ou WebP)</h2>
        {error && <div className="alert error">{error}</div>}
        {warning && <div className="alert warn">{warning}</div>}
        <input ref={fileInput} type="file" accept=".png,.svg,.webp" onChange={handleFile} />
        {imported.length > 0 && (
          <div className="gallery" style={{ marginTop: 16 }}>
            {imported.map((img) => (
              <div key={img.id} className="gallery-item">
                <img src={img.url} alt={img.name} style={{ maxWidth: "100%", maxHeight: 80 }} />
                <div style={{ fontSize: 12, marginTop: 6 }}>{img.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
