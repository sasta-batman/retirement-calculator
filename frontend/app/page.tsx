"use client";
import { useState } from "react";

export default function Home() {
  // State to store inputs
  const [formData, setFormData] = useState({
    current_age: 30,
    retirement_age: 60,
    current_savings: 50000,
    monthly_contribution: 2000,
    annual_return: 8,
  });

  const [result, setResult] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);

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