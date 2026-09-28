import { SCENARIOS, scenarioBackgroundSvg, type ScenarioId } from "@kidsai/engine";

export default function ScenarioThumb({ scenarioId, width = 160, height = 100 }: { scenarioId: ScenarioId; width?: number | string; height?: number | string }) {
  const def = SCENARIOS[scenarioId];
  return (
    <svg width={width} height={height} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ borderRadius: 8, display: "block" }}>
      <g dangerouslySetInnerHTML={{ __html: scenarioBackgroundSvg(def) }} />
    </svg>
  );
}
