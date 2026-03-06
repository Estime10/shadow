"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { stepTimeString, normalizeTimeString } from "@/lib/functions";

const DEFAULT_STEP_MINUTES = 15;

export type TimeInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  stepMinutes?: number;
  disabled?: boolean;
  className?: string;
};

export function TimeInput({
  id,
  value,
  onChange,
  stepMinutes = DEFAULT_STEP_MINUTES,
  disabled = false,
  className = "",
}: TimeInputProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleStepUp = useCallback(() => {
    onChange(stepTimeString(value, stepMinutes, 1));
  }, [value, stepMinutes, onChange]);

  const handleStepDown = useCallback(() => {
    onChange(stepTimeString(value, stepMinutes, -1));
  }, [value, stepMinutes, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const allowed = raw.replace(/[^\d:hH]/g, "");
    setDisplayValue(allowed);
  }, []);

  const commitTime = useCallback(() => {
    const normalized = normalizeTimeString(displayValue);
    if (normalized !== null) {
      setDisplayValue(normalized);
      onChange(normalized);
    } else {
      setDisplayValue(value);
    }
  }, [displayValue, value, onChange]);

  const handleBlur = useCallback(() => {
    commitTime();
  }, [commitTime]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitTime();
      }
    },
    [commitTime]
  );

  return (
    <div
      id={id}
      role="group"
      aria-label="Heure"
      className={`flex items-stretch overflow-hidden rounded-lg border-2 border-(--border) bg-(--bg) focus-within:border-accent ${className}`}
    >
      <input
        type="text"
        placeholder="HH:mm"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="time-input__field"
        aria-label="Heure (saisie manuelle)"
      />
      <div className="flex shrink-0 flex-col border-l-2 border-(--border)">
        <button
          type="button"
          onClick={handleStepUp}
          disabled={disabled}
          className="time-input__stepper-btn"
          aria-label="Augmenter l'heure"
        >
          <ChevronUp className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={handleStepDown}
          disabled={disabled}
          className="time-input__stepper-btn"
          aria-label="Diminuer l'heure"
        >
          <ChevronDown className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
