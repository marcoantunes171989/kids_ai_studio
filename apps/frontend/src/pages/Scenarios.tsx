import { SCENARIO_LIST, OBJECT_LIST } from "@kidsai/engine";
import ScenarioThumb from "../components/ScenarioThumb.js";

export default function Scenarios() {
  return (
    <div>
      <h1>Cenários</h1>
      <p className="page-subtitle">Biblioteca de cenários reutilizáveis e objetos animáveis.</p>

      <div className="grid grid-4">
        {SCENARIO_LIST.map((s) => (
          <div key={s.id} className="card" style={{ padding: 10 }}>
            <ScenarioThumb scenarioId={s.id} width="100%" height={110} />
            <h2 style={{ margin: "10px 4px 0" }}>{s.name}</h2>
          </div>
        ))}
      </div>

      <h1 style={{ marginTop: 32 }}>Objetos animáveis</h1>
      <div className="grid grid-4">
        {OBJECT_LIST.map((o) => (
          <div key={o.id} className="card" style={{ textAlign: "center" }}>
            <svg width={80} height={80} viewBox="-40 -40 80 80" dangerouslySetInnerHTML={{ __html: o.svg }} />
            <h2>{o.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
