"use client";
import type { Milestone } from "@/lib/calculations";
import { formatCompact, type CurrencyDefinition } from "@/lib/currency";

interface MilestonesProps {
  milestones: Milestone[];
  currency: Pick<CurrencyDefinition, "code" | "symbol">;
}

export default function Milestones({ milestones, currency }: MilestonesProps) {
  if (!milestones.length) return null;
  return (
    <div className="glass-card p-4">
      <p className="section-heading">🏆 Milestones</p>
      <div className="flex flex-wrap gap-2">
        {milestones.map((m, i) => (
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
