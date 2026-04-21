"use client";
import { useState, useEffect, useCallback } from "react";
import {
  calculateRetirementNetWorth,
  findRequiredVariable,
  generateInsights,
  generateNarrative,
  type RetirementInputs,
  type ProjectionResult,
} from "@/lib/calculations";
import { CURRENCIES, formatFull } from "@/lib/currency";
import InputGroup from "./InputGroup";
import ProjectionChart from "./ProjectionChart";
import Milestones from "./Milestones";
import InsightsPanel from "./InsightsPanel";
import Narrative from "./Narrative";


const PRESETS = {
  conservative: { annual_return: 5, label: "Conservative" },
  moderate: { annual_return: 8, label: "Moderate" },
  aggressive: { annual_return: 12, label: "Aggressive" },
};

/**
 * FIRE spending presets by currency code.
 * Values represent typical annual spending for each FIRE category.
 * Sources: country-specific FIRE community benchmarks.
 */
const FIRE_PRESETS: Record<string, { lean: number; chubby: number; fat: number }> = {
  // USA: Lean ~$40k (frugal, LCOL), Chubby ~$100k (comfortable), Fat ~$200k+ (r/fatFIRE threshold)
  USD: { lean: 40000,    chubby: 100000,   fat: 250000   },
  // Europe: roughly 80% of USD given lower healthcare costs
  EUR: { lean: 24000,    chubby: 80000,    fat: 200000   },
  // UK: similar to USD in metro areas, lower elsewhere
  GBP: { lean: 25000,    chubby: 75000,    fat: 180000   },
  // Japan: Tokyo-centric; Yen-adjusted for LCOL-to-luxury range
  JPY: { lean: 3600000,  chubby: 10000000, fat: 25000000 },
  // China: Tier 1 city basis (Shanghai/Beijing)
  CNY: { lean: 120000,   chubby: 360000,   fat: 900000   },
  // India: ₹50k/mo lean → ₹2L/mo chubby → ₹6L/mo fat
  INR: { lean: 600000,   chubby: 2400000,  fat: 7200000  },
  // Australia: higher COL than US; Fat FIRE is AU$250k+
  AUD: { lean: 50000,    chubby: 120000,   fat: 250000   },
  // Canada: similar to US but slightly lower
  CAD: { lean: 45000,    chubby: 100000,   fat: 220000   },
  // Switzerland: one of the highest COL countries in the world
  CHF: { lean: 60000,    chubby: 150000,   fat: 350000   },
  // Singapore: high COL, especially housing; Fat FIRE ~S$300k
  SGD: { lean: 48000,    chubby: 120000,   fat: 300000   },
};

const FIRE_LABELS = {
  lean:   { label: "Lean",   desc: "Frugal lifestyle, bare essentials covered" },
  chubby: { label: "Chubby", desc: "Comfortable lifestyle with moderate luxuries" },
  fat:    { label: "Fat",    desc: "Wealthy lifestyle with full financial freedom" },
};

const TOOLTIPS: Record<string, string> = {
  annual_return:
    "The average historical return of the S&P 500 is ~10% before inflation (~7% after). Bond-heavy portfolios average 4–6%.",
  inflation_rate:
    "Historical US inflation averages ~3%. The Fed targets 2%. Higher inflation erodes purchasing power over time.",
  contribution_increase_rate:
    "How much you increase contributions each year — ideally matching or exceeding your salary growth rate.",
  tax_rate:
    "Your effective tax rate on withdrawals. Tax-advantaged accounts (401k, IRA) can reduce this significantly.",
  current_yearly_spending:
    "Your total annual spending today. This is projected forward with inflation to estimate retirement needs.",
  target_buffer:
    "The amount you want left at age 100 — a safety net for unexpected expenses, inheritance, or market downturns.",
};


export default function RetirementCalculator() {
  const [isDark, setIsDark] = useState(true);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [activePreset, setActivePreset] = useState<string | null>("moderate");
  const [fireLevel, setFireLevel] = useState<string | null>(null);
  const [formData, setFormData] = useState<RetirementInputs>({
    current_age: 30,
    retirement_age: 60,
    current_savings: 50000,
    monthly_contribution: 2000,
    annual_return: 8,
    inflation_rate: 2,
    contribution_increase_rate: 3,
    current_yearly_spending: 40000,
    tax_rate: 20,
    target_buffer: 0,
    spending_model: "flat",
  });

  const [result, setResult] = useState<ProjectionResult | null>(null);
  const [selectedAge, setSelectedAge] = useState<number>(60);
  const [requiredVariables, setRequiredVariables] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Real-time calculations
  const calculate = useCallback(() => {
    const res = calculateRetirementNetWorth(formData);
    setResult(res);

    const req = {
      expected_yearly_roi: findRequiredVariable("annual_return", 0, 200, formData),
      monthly_contribution: findRequiredVariable("monthly_contribution", 0, 100000000, formData),
      retirement_age: findRequiredVariable("retirement_age", formData.current_age, 100, formData),
      expected_yearly_spending: findRequiredVariable("current_yearly_spending", 0, 100000000, formData),
    };
    setRequiredVariables(req);
    setInsights(generateInsights(formData, res, (n) => formatFull(n, currency)));
    setNarrative(generateNarrative(formData, res, (n) => formatFull(n, currency)));
  }, [formData, currency]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  useEffect(() => {
    setSelectedAge(formData.retirement_age);
  }, [formData.retirement_age]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) return;
    setFormData((prev) => ({ ...prev, [e.target.name]: val }));
    if (e.target.name === "annual_return") {
      const match = Object.entries(PRESETS).find(([, p]) => p.annual_return === val);
      setActivePreset(match ? match[0] : null);
    }
  };

  const applyPreset = (key: string) => {
    const p = PRESETS[key as keyof typeof PRESETS];
    setFormData((prev) => ({ ...prev, annual_return: p.annual_return }));
    setActivePreset(key);
  };

  const getValueAtAge = (age: number) => {
    if (!result) return null;
    const ageData = result.projection.find((d) => d.Year === age);
    if (!ageData) return null;
    const yearsFromNow = age - formData.current_age;
    const inflationAdjustedNetWorth =
      ageData["Net Worth"] / Math.pow(1 + formData.inflation_rate / 100, yearsFromNow);
    const spendingAtAge =
      formData.current_yearly_spending * Math.pow(1 + formData.inflation_rate / 100, yearsFromNow);
    return { nominalNetWorth: ageData["Net Worth"], inflationAdjustedNetWorth, spendingAtAge };
  };

  const ageData = getValueAtAge(selectedAge);

  return (
    <div className="w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Retirement Planner</h1>
            <p className="text-sm text-gray-500 mt-1">Interactive Financial Projections</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:inline" style={{ color: "var(--text-muted)" }}>Currency</span>
            <select
              value={currency.code}
              onChange={(e) => setCurrency(CURRENCIES.find((c) => c.code === e.target.value)!)}
              className="bg-indigo-600/20 text-indigo-300 text-sm px-3 py-2 rounded-lg border border-indigo-500/30 cursor-pointer focus:outline-none"
              title="Select Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                width: 40, height: 40,
                borderRadius: "50%",
                border: "1px solid var(--glass-border)",
                background: "var(--glass-bg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Inputs (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card p-5 space-y-4">
              <p className="section-heading">Personal Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Current Age" name="current_age" value={formData.current_age}
                  onChange={handleChange} min={18} max={80} step={1} showSlider />
                <InputGroup label="Retirement Age" name="retirement_age" value={formData.retirement_age}
                  onChange={handleChange} min={formData.current_age + 1} max={100} step={1} showSlider />
              </div>
              {formData.retirement_age < formData.current_age && (
                <div className="text-red-400 text-xs bg-red-900/20 p-2 rounded-lg border border-red-500/30">
                  Retirement age cannot be less than current age.
                </div>
              )}
              <InputGroup label="Current Savings" name="current_savings" value={formData.current_savings}
                onChange={handleChange} hint={formatFull(formData.current_savings, currency)} />
              <InputGroup label="Monthly Contribution" name="monthly_contribution"
                value={formData.monthly_contribution} onChange={handleChange}
                hint={formatFull(formData.monthly_contribution, currency)} />
              <InputGroup label="Contribution Increase (%)" name="contribution_increase_rate"
                value={formData.contribution_increase_rate} onChange={handleChange}
                tooltip={TOOLTIPS.contribution_increase_rate} />
            </div>

            <div className="glass-card p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="section-heading mb-0">Return & Inflation</p>
                <div className="flex gap-1.5">
                  {Object.entries(PRESETS).map(([key, p]) => (
                    <button key={key} onClick={() => applyPreset(key)}
                      className={`preset-btn ${activePreset === key ? "active" : ""}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <InputGroup label="Annual Return (%)" name="annual_return" value={formData.annual_return}
                onChange={handleChange} tooltip={TOOLTIPS.annual_return}
                min={0} max={25} step={0.5} showSlider />
              <InputGroup label="Inflation Rate (%)" name="inflation_rate" value={formData.inflation_rate}
                onChange={handleChange} tooltip={TOOLTIPS.inflation_rate}
                min={0} max={10} step={0.5} showSlider />
            </div>

            <div className="glass-card p-5 space-y-4">
              <p className="section-heading">Spending & Tax</p>
              {/* FIRE Level Selector */}
              <div>
                <div className="flex items-center mb-1.5">
                  <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">FIRE Level</p>
                  <span className="tooltip-trigger">
                    ?
                    <span className="tooltip-content">Auto-fills yearly spending based on common FIRE benchmarks for your currency. Lean: frugal. Chubby: comfortable. Fat: wealthy lifestyle.</span>
                  </span>
                </div>
                <div className="toggle-group">
                  {(Object.entries(FIRE_LABELS) as [string, { label: string; desc: string }][]).map(([key, { label, desc }]) => {
                    const presets = FIRE_PRESETS[currency.code] ?? FIRE_PRESETS["USD"];
                    return (
                      <button
                        key={key}
                        className={`toggle-btn ${fireLevel === key ? "active" : ""}`}
                        title={`${desc} — ${formatFull(presets[key as keyof typeof presets], currency)}/yr`}
                        onClick={() => {
                          const val = presets[key as keyof typeof presets];
                          setFireLevel(key);
                          setFormData((p) => ({ ...p, current_yearly_spending: val }));
                        }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Yearly Spending" name="current_yearly_spending"
                  value={formData.current_yearly_spending}
                  onChange={(e) => { setFireLevel(null); handleChange(e); }}
                  hint={formatFull(formData.current_yearly_spending, currency)}
                  tooltip={TOOLTIPS.current_yearly_spending} />
                <InputGroup label="Tax Rate (%)" name="tax_rate" value={formData.tax_rate}
                  onChange={handleChange} tooltip={TOOLTIPS.tax_rate} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-1.5">
                    <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                      Spending Model
                    </p>
                    <span className="tooltip-trigger">
                      ?
                      <span className="tooltip-content">Flat: constant inflation-adjusted spending. Smile: higher early (active) and late (healthcare) years. Rising: spending linearly doubles by age 100.</span>
                    </span>
                  </div>
                  <div className="toggle-group">
                    <button className={`toggle-btn ${formData.spending_model === "flat" ? "active" : ""}`}
                      onClick={() => setFormData((p) => ({ ...p, spending_model: "flat" }))}>
                      Flat
                    </button>
                    <button className={`toggle-btn ${formData.spending_model === "smile" ? "active" : ""}`}
                      onClick={() => setFormData((p) => ({ ...p, spending_model: "smile" }))}>
                      Smile
                    </button>
                    <button className={`toggle-btn ${formData.spending_model === "increasing" ? "active" : ""}`}
                      onClick={() => setFormData((p) => ({ ...p, spending_model: "increasing" }))}>
                      Rising
                    </button>
                  </div>
                </div>
                <InputGroup label="Target Buffer" name="target_buffer" value={formData.target_buffer}
                  onChange={handleChange} tooltip={TOOLTIPS.target_buffer}
                  hint={formData.target_buffer > 0 ? formatFull(formData.target_buffer, currency) : undefined} />
              </div>
            </div>

            {/* Required Variables */}
            {requiredVariables && (
              <div className="glass-card p-5 space-y-3" style={{ borderColor: "rgba(251,191,36,0.2)" }}>
                <p className="section-heading" style={{ color: "#fbbf24" }}>
                  🎯 What it takes to retire
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Required Annual Return", value: requiredVariables.expected_yearly_roi, fmt: (v: number) => `${v.toFixed(2)}%` },
                    { label: "Required Monthly Contribution", value: requiredVariables.monthly_contribution, fmt: (v: number) => formatFull(v, currency) },
                    { label: "Required Retirement Age", value: requiredVariables.retirement_age, fmt: (v: number) => `${Math.round(v)} years` },
                    { label: "Required Yearly Spending", value: requiredVariables.expected_yearly_spending, fmt: (v: number) => formatFull(v, currency) },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-2.5 rounded-lg" style={{ background: "var(--bg-input)" }}>
                      <span className="text-gray-400 text-sm">{item.label}</span>
                      <span className="text-amber-300 font-mono font-semibold text-sm">
                        {item.value != null ? item.fmt(item.value) : "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Results (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Stats Cards */}
            {ageData && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-in-up">
                <div className="stat-card">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
                    Net Worth at Age {selectedAge}
                  </p>
                  <p className="text-2xl font-bold text-cyan-400 number-pop" key={`nw-${selectedAge}`}>
                    {formatFull(ageData.nominalNetWorth, currency)}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">nominal value</p>
                </div>
                <div className="stat-card">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
                    Inflation-Adjusted
                  </p>
                  <p className="text-2xl font-bold text-green-400 number-pop" key={`ia-${selectedAge}`}>
                    {formatFull(ageData.inflationAdjustedNetWorth, currency)}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">in today&apos;s value</p>
                </div>
                <div className="stat-card">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
                    Annual Spending at {selectedAge}
                  </p>
                  <p className="text-2xl font-bold text-orange-400 number-pop" key={`sp-${selectedAge}`}>
                    {formatFull(ageData.spendingAtAge, currency)}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">accounting for inflation</p>
                </div>
              </div>
            )}

            {/* Selected Age Slider */}
            {result && (
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                    Selected Age
                  </p>
                  <p className="text-lg font-bold text-indigo-400">
                    {selectedAge} years old
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      ({selectedAge - formData.current_age} years from now)
                    </span>
                  </p>
                </div>
                <input type="range" min={formData.current_age} max={100} step={1}
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(parseInt(e.target.value))} />
              </div>
            )}

            {/* Chart */}
            {result && (
              <div className="glass-card p-5">
                <ProjectionChart
                  data={result.projection}
                  retirementAge={formData.retirement_age}
                  milestones={result.milestones}
                  currency={currency}
                  isDark={isDark}
                  onAgeSelect={setSelectedAge}
                />
              </div>
            )}

            {/* Milestones */}
            {result && <Milestones milestones={result.milestones} currency={currency} />}

            {/* Narrative */}
            {narrative && <Narrative narrative={narrative} />}

            {/* Insights */}
            {insights.length > 0 && <InsightsPanel insights={insights} />}
          </div>
        </div>
    </div>
  );
}