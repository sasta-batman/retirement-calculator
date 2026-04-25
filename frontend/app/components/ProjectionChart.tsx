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
  const axisColor = isDark ? "#5c5f6a" : "#8b8f9a";
  const tooltipBg = isDark ? "#1c1e27" : "#ffffff";
  const tooltipText = isDark ? "#e8eaed" : "#1a1c23";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const gridStroke = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
  const legendColor = isDark ? "#8b8f9a" : "#5c5f6a";
  const accentColor = isDark ? "#2dd4a8" : "#0d9373";
  const refLineColor = isDark ? "#5c5f6a" : "#8b8f9a";

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
            <linearGradient id="gradNetWorth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
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
            stroke={refLineColor}
            strokeDasharray="6 3"
            strokeWidth={1}
            label={{
              value: "Retirement",
              position: "top",
              fill: refLineColor,
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="Net Worth"
            stroke={accentColor}
            fill="url(#gradNetWorth)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
