"use client";
import type { Milestone } from "@/lib/calculations";
import { formatCompact, type CurrencyDefinition } from "@/lib/currency";

interface MilestonesProps {
  milestones: Milestone[];
  currency: Pick<CurrencyDefinition, "code" | "symbol">;
}

/** Priority score: higher = more important. */
function priority(m: Milestone): number {
  if (m.type === "fire") return 3;
  if (m.type === "achievement") return 2;
  return 1; // warning
}

/**
 * Keep only the single best milestone per age.
 * Tie-break between same-type achievements by highest value.
 */
function dedupeByAge(milestones: Milestone[]): Milestone[] {
  const best = new Map<number, Milestone>();
  for (const m of milestones) {
    const existing = best.get(m.age);
    if (!existing) {
      best.set(m.age, m);
    } else {
      const mScore = priority(m);
      const eScore = priority(existing);
      if (
        mScore > eScore ||
        (mScore === eScore && m.value > existing.value)
      ) {
        best.set(m.age, m);
      }
    }
  }
  // Return in original age order
  return Array.from(best.values()).sort((a, b) => a.age - b.age);
}

export default function Milestones({ milestones, currency }: MilestonesProps) {
  if (!milestones.length) return null;
  const deduped = dedupeByAge(milestones);
  return (
    <div className="glass-card p-4">
      <p className="section-heading">🏆 Milestones</p>
      <div className="flex flex-wrap gap-2">
        {deduped.map((m, i) => (
          <span
            key={i}
            className={`milestone-badge ${
              m.type === "achievement"
                ? "milestone-achievement"
                : m.type === "fire"
                ? "milestone-fire"
                : "milestone-warning"
            }`}
          >
            Age {m.age}:{" "}
            {m.value > 0
              ? `${formatCompact(m.value, currency)} ${m.label}`
              : m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
