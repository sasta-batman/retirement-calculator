"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Top 10 world currencies
const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

// Format numbers dynamically (k, M, B)
function formatNumber(value: number, symbol: string = "$"): string {
  if (symbol != "₹") {
    if (Math.abs(value) >= 1e9) {
      return `${symbol}${(value / 1e9).toFixed(2)}B`;
    }
    if (Math.abs(value) >= 1e6) {
      return `${symbol}${(value / 1e6).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1e3) {
      return `${symbol}${(value / 1e3).toFixed(2)}k`;
    }
    return `${symbol}${value.toFixed(0)}`;
  } else {
    // Indian Rupee formatting
    const absValue = Math.abs(value);
    if (absValue >= 1e7) {
      return `₹${(value / 1e7).toFixed(2)}Cr`;
    }
    if (absValue >= 1e5) {
      return `₹${(value / 1e5).toFixed(2)}L`;
    }
    return `₹${value.toFixed(0)}`;
  }
}

// Format for chart axis (more compact)
function formatChartAxis(value: any): string {
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (Math.abs(num) >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`;
  }
  if (Math.abs(num) >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1e3) {
    return `$${(num / 1e3).toFixed(1)}k`;
  }
  return `$${num.toFixed(0)}`;
}

export default function Home() {
  // State to store inputs
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [formData, setFormData] = useState({
    current_age: 30,
    retirement_age: 60,
    current_savings: 50000,
    monthly_contribution: 2000,
    annual_return: 8,
    inflation_rate: 2,
    contribution_increase_rate: 3,
    current_yearly_spending: 40000,
    tax_rate: 20,
  });

  const [result, setResult] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);
  const [projectionData, setProjectionData] = useState<null | any>(null);
  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  // Get inflation-adjusted net worth and spending for a given age
  const getValueAtAge = (age: number) => {
    if (!projectionData) return null;
    
    const ageData = projectionData.projection.find((d: any) => d.Year === age);
    if (!ageData) return null;

    // Net worth at age is already nominal
    const nominalNetWorth = ageData['Net Worth'];
    
    // Inflation-adjust back to today's value
    const yearsFromNow = age - formData.current_age;
    const inflationAdjustedNetWorth = nominalNetWorth / Math.pow(1 + formData.inflation_rate / 100, yearsFromNow);
    
    // Spending at age X, accounting for inflation
    const spendingAtAge = formData.current_yearly_spending * Math.pow(1 + formData.inflation_rate / 100, yearsFromNow);
    
    return {
      inflationAdjustedNetWorth,
      spendingAtAge
    };
  };

  // Handle chart click
  const handleChartClick = (data: any) => {
    if (data && data.activeTooltipIndex !== undefined) {
      const clickedData = projectionData.projection[data.activeTooltipIndex];
      if (clickedData) {
        setSelectedAge(clickedData.Year);
      }
    }
  };

  // Call Backend API
  const calculate = async () => {
    setLoading(true);
    try {
      // Note: Codespaces exposes ports on special URLs. 
      // For local dev, we use localhost:8000.
      const response = await fetch("/api/python/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);

      // Fetch projection data for the chart
      const projectionResponse = await fetch("/api/python/calculate-projection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const projectionDataResponse = await projectionResponse.json();
      setProjectionData(projectionDataResponse);
      
      // Set selected age to retirement age by default
      setSelectedAge(formData.retirement_age);
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h1 className="text-2xl font-bold text-white">Retirement Planner</h1>
              <p className="text-blue-100 text-sm mt-1">AI-Powered Projections</p>
            </div>
            <select
              value={currency.code}
              onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value)!)}
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded font-medium transition-colors cursor-pointer"
              title="Select Currency"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive content: stacked on mobile, two-column on md+ */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Current Age" name="current_age" value={formData.current_age} onChange={handleChange} />
              <InputGroup label="Retirement Age" name="retirement_age" value={formData.retirement_age} onChange={handleChange} />
            </div>
            <InputGroup label="Current Savings" name="current_savings" value={formData.current_savings} onChange={handleChange} hint={formatNumber(formData.current_savings, currency.symbol)} />
            <InputGroup label="Monthly Contribution" name="monthly_contribution" value={formData.monthly_contribution} onChange={handleChange} hint={formatNumber(formData.monthly_contribution, currency.symbol)}/>
            <InputGroup label="Annual Return (%)" name="annual_return" value={formData.annual_return} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Inflation Rate (%)" name="inflation_rate" value={formData.inflation_rate} onChange={handleChange} />
              <InputGroup label="Contribution Increase Rate (%)" name="contribution_increase_rate" value={formData.contribution_increase_rate} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Current Yearly Spending" name="current_yearly_spending" value={formData.current_yearly_spending} onChange={handleChange} hint={formatNumber(formData.current_yearly_spending, currency.symbol)}/>
              <InputGroup label="Tax Rate (%)" name="tax_rate" value={formData.tax_rate} onChange={handleChange} />
            </div>

            <button
              onClick={calculate}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors mt-4"
            >
              {loading ? "Calculating..." : "Calculate Future Wealth"}
            </button>
          </div>

          {/* Right: Results (shows placeholder on mobile when empty) */}
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 min-h-[200px]">
            {!result && (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Results will appear here after calculation.
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Age and Year Display */}
                {selectedAge !== null && (
                  <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Selected Age</p>
                    <p className="text-xl font-bold text-blue-400">{selectedAge} years old</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedAge - formData.current_age} years from now</p>
                  </div>
                )}

                {/* Nominal Net Worth and Inflation-Adjusted */}
                {selectedAge !== null && getValueAtAge(selectedAge) && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Net Worth at Age {selectedAge}</p>
                      <h2 className="text-2xl md:text-3xl font-bold text-cyan-400">
                        {projectionData?.projection.find((d: any) => d.Year === selectedAge) &&
                          formatNumber(projectionData.projection.find((d: any) => d.Year === selectedAge)['Net Worth'], currency.symbol)}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">(nominal value)</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Inflation-Adjusted Value</p>
                      <h2 className="text-2xl md:text-3xl font-bold text-green-400">
                        {formatNumber(getValueAtAge(selectedAge)!.inflationAdjustedNetWorth, currency.symbol)}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">(in today's dollars)</p>
                    </div>

                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Annual Spending at Age {selectedAge}</p>
                      <h2 className="text-2xl md:text-3xl font-bold text-orange-400">
                        {formatNumber(getValueAtAge(selectedAge)!.spendingAtAge, currency.symbol)}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">(accounting for inflation)</p>
                    </div>
                  </div>
                )}

                {/* Wealth Projection Chart */}
                {projectionData && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">Wealth Projection (Click to Select Age)</p>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={projectionData.projection} onClick={handleChartClick} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis 
                          dataKey="Year" 
                          stroke="#999" 
                          tick={{ fontSize: 11 }}
                          label={{ value: "Age", position: "insideBottomRight", offset: -5, fill: "#999" }}
                        />
                        <YAxis 
                          stroke="#999" 
                          tick={{ fontSize: 11 }}
                          label={{ value: `Net Worth (${currency.code})`, angle: -90, position: "insideLeft", fill: "#999" }}
                          tickFormatter={formatChartAxis}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }}
                          formatter={(value: any) => formatNumber(Number(value), currency.symbol)}
                          labelFormatter={(label: any) => `Age ${label}`}
                        />
                        <Legend 
                          wrapperStyle={{ color: "#d1d5db" }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Net Worth" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="text-gray-500 text-xs mt-3 text-center">
                      <span className="text-blue-400">─ Wealth Projection ({currency.code})</span> | Retirement age: <span className="text-red-400">{projectionData.retirement_age}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Simple helper component for inputs
function InputGroup({ label, name, value, onChange, hint}: any) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
      <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wide">{label}</label>
      {/* Render the hint if it exists */}
        {hint && (
          <span className="text-xs text-green-400 font-mono font-medium">
            {hint}
          </span>
        )}
      </div>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
}