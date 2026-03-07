"use client";

import { useState, useCallback, useEffect } from "react";
import { stepTimeString, normalizeTimeString } from "@/lib/functions";

export type UseTimeInputParams = {
  value: string;
  onChange: (value: string) => void;
  stepMinutes: number;
};

export function useTimeInput({ value, onChange, stepMinutes }: UseTimeInputParams) {
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

  return {
    displayValue,
    handleInputChange,
    handleBlur: commitTime,
    handleKeyDown: useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commitTime();
        }
      },
      [commitTime]
    ),
    handleStepUp,
    handleStepDown,
  };
}
