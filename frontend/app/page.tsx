"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Home() {
  // State to store inputs
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
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
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white">Retirement Planner</h1>
          <p className="text-blue-100 text-sm mt-1">AI-Powered Projections</p>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Current Age" name="current_age" value={formData.current_age} onChange={handleChange} />
            <InputGroup label="Retirement Age" name="retirement_age" value={formData.retirement_age} onChange={handleChange} />
          </div>
          <InputGroup label="Current Savings ($)" name="current_savings" value={formData.current_savings} onChange={handleChange} />
          <InputGroup label="Monthly Contribution ($)" name="monthly_contribution" value={formData.monthly_contribution} onChange={handleChange} />
          <InputGroup label="Annual Return (%)" name="annual_return" value={formData.annual_return} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Inflation Rate (%)" name="inflation_rate" value={formData.inflation_rate} onChange={handleChange} />
            <InputGroup label="Contribution Increase Rate (%)" name="contribution_increase_rate" value={formData.contribution_increase_rate} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Current Yearly Spending ($)" name="current_yearly_spending" value={formData.current_yearly_spending} onChange={handleChange} />
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

        {/* Results Section */}
        {result && (
          <div className="bg-gray-900 p-6 border-t border-gray-700 animation-fade-in">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Projected Net Worth</p>
            <h2 className="text-4xl font-bold text-green-400">${result.total_savings.toLocaleString()}</h2>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Safe Monthly Income (4%):</span>
                <span className="text-white font-bold">${result.monthly_income_in_retirement.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>Inflation-adjusted Value:</span>
                <span className="font-bold">${result.real_total_savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>After-tax Monthly Income:</span>
                <span className="font-bold">${result.after_tax_monthly_income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Projected Yearly Spending (at retirement):</span>
                <span className="font-bold">${result.future_yearly_spending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Spending Needed:</span>
                <span className="font-bold">${(result.future_yearly_spending / 12).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Surplus / (Gap):</span>
                <span className="font-bold">${(result.after_tax_monthly_income - result.future_yearly_spending / 12).toLocaleString()}</span>
              </div>
            </div>

            {/* Wealth Projection Chart */}
            {projectionData && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">Wealth Projection (Age to 100)</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projectionData.projection} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="Year" 
                      stroke="#999" 
                      tick={{ fontSize: 12 }}
                      label={{ value: "Age", position: "insideBottomRight", offset: -5, fill: "#999" }}
                    />
                    <YAxis 
                      stroke="#999" 
                      tick={{ fontSize: 12 }}
                      label={{ value: "Net Worth ($)", angle: -90, position: "insideLeft", fill: "#999" }}
                      tickFormatter={(value: any) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }}
                      formatter={(value: any) => `$${Number(value).toLocaleString()}`}
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
                    {/* Retirement age vertical line indicator */}
                    {projectionData.retirement_age && (
                      <line x1={projectionData.retirement_age} y1={0} x2={projectionData.retirement_age} y2="100%" stroke="#ef4444" strokeDasharray="5 5" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-gray-500 text-xs mt-3 text-center">
                  <span className="text-blue-400">─ Wealth Projection</span> | Retirement age: <span className="text-red-400">{projectionData.retirement_age}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Simple helper component for inputs
function InputGroup({ label, name, value, onChange }: any) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wide">{label}</label>
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