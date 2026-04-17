"use client";
import { useState, useEffect, useRef } from "react";

interface InputGroupProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
}

export default function InputGroup({
  label, name, value, onChange, hint, tooltip, min, max, step = 1, showSlider = false,
}: InputGroupProps) {
  // Local string state allows empty/partial input while typing
  const [displayValue, setDisplayValue] = useState(String(value));
  const isFocused = useRef(false);

  // Sync display with external value changes (e.g., presets, sliders)
  // but only when the text input isn't focused — avoids overwriting mid-edit
  useEffect(() => {
    if (!isFocused.current) {
      setDisplayValue(String(value));
    }
  }, [value]);

  const fireChange = (numericValue: number) => {
    // Create a synthetic-like event that matches what page.tsx expects
    const syntheticEvent = {
      target: { name, value: String(numericValue) },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);

    // If the field is empty or just a minus sign, don't fire a change yet
    if (raw === "" || raw === "-" || raw === ".") return;

    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      fireChange(parsed);
    }
  };

  const handleFocus = () => {
    isFocused.current = true;
  };

  const handleBlur = () => {
    isFocused.current = false;
    // On blur, if the field is empty or invalid, reset to the current value
    const parsed = parseFloat(displayValue);
    if (displayValue === "" || isNaN(parsed)) {
      setDisplayValue(String(value));
    } else {
      // Normalize display (e.g., "05" → "5")
      setDisplayValue(String(parsed));
      // Ensure parent has the final value
      fireChange(parsed);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center">
          <label className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
            {label}
          </label>
          {tooltip && (
            <span className="tooltip-trigger">
              ?
              <span className="tooltip-content">{tooltip}</span>
            </span>
          )}
        </div>
        {hint && (
          <span className="text-xs text-indigo-400 font-mono font-medium">{hint}</span>
        )}
      </div>
      <input
        type="number"
        name={name}
        value={displayValue}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        step={step}
        className="input-field"
      />
      {showSlider && min !== undefined && max !== undefined && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          name={name}
        />
      )}
    </div>
  );
}
