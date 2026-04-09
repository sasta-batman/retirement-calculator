"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { ProjectionPoint, Milestone } from "@/lib/calculations";
import { formatCompact, formatFull, type CurrencyDefinition } from "@/lib/currency";

interface ProjectionChartProps {
  data: ProjectionPoint[];
  retirementAge: number;
  milestones: Milestone[];
  currency: Pick<CurrencyDefinition, "code" | "symbol">;
  isDark: boolean;
  onAgeSelect: (age: number) => void;
}


export default function ProjectionChart({
  data, retirementAge, milestones, currency, isDark, onAgeSelect,
}: ProjectionChartProps) {
  const axisColor = isDark ? "#64748b" : "#7c87b0";
  const tooltipBg = isDark ? "#1a1f35" : "#ffffff";
  const tooltipText = isDark ? "#f1f5f9" : "#1e2340";
  const tooltipBorder = isDark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)";
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.08)";
  const legendColor = isDark ? "#94a3b8" : "#4b5680";

  const handleClick = (chartData: any) => {
    if (chartData?.activeTooltipIndex !== undefined) {
      const clicked = data[chartData.activeTooltipIndex];
      if (clicked) onAgeSelect(clicked.Year);
    }
  };

  return (
    <div>
      <p className="section-heading">Wealth Projection (Click to Select Age)</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} onClick={handleClick} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="gradContributions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis
            dataKey="Year"
            stroke={axisColor}
            tick={{ fontSize: 11, fill: axisColor }}
            label={{ value: "Age", position: "insideBottomRight", offset: -5, fill: axisColor }}
          />
          <YAxis
            stroke={axisColor}
            tick={{ fontSize: 11, fill: axisColor }}
            tickFormatter={(v) => formatCompact(v, currency)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "12px",
              color: tooltipText,
              fontSize: "13px",
            }}
            formatter={(value: number, name: string) => [
              formatFull(value, currency),
              name,
            ]}
            labelFormatter={(label) => `Age ${label}`}
          />
          <Legend wrapperStyle={{ color: legendColor, fontSize: "12px" }} />
          <ReferenceLine
            x={retirementAge}
            stroke="#fbbf24"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{
              value: "Retirement",
              position: "top",
              fill: "#fbbf24",
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="Total Contributions"
            stackId="1"
            stroke="#6366f1"
            fill="url(#gradContributions)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="Compound Growth"
            stackId="1"
            stroke="#22d3ee"
            fill="url(#gradGrowth)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
