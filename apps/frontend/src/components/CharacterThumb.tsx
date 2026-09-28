import { CHARACTERS, characterSvgParts, movementPose, type CharacterId, type ExpressionId } from "@kidsai/engine";

const PART_ORDER = ["cauda", "pernaEsq", "pernaDir", "corpo", "bracoEsq", "orelhaEsq", "orelhaDir", "cabeca", "bracoDir"] as const;

export default function CharacterThumb({ characterId, expression = "feliz", size = 96 }: { characterId: CharacterId; expression?: ExpressionId; size?: number }) {
  const def = CHARACTERS[characterId];
  const parts = characterSvgParts(def, expression);
  const pose = movementPose("parado", 0.25);
  return (
    <svg width={size} height={size} viewBox="-70 -100 140 180">
      {PART_ORDER.map((part) => {
        const t = pose[part];
        return (
          <g key={part} transform={`translate(${t.x} ${t.y}) rotate(${t.rotation})`} dangerouslySetInnerHTML={{ __html: parts[part] }} />
        );
      })}
    </svg>
  );
}
