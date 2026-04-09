"use client";

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
        value={value}
        onChange={onChange}
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
