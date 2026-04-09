"use client";

interface InsightsPanelProps {
  insights: string[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  if (!insights.length) return null;
  return (
    <div className="glass-card p-4">
      <p className="section-heading">💡 Did You Know?</p>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div key={i} className="insight-card fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}
