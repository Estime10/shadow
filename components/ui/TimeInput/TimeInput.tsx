"use client";

import { useTimeInput } from "./useTimeInput/useTimeInput";
import { TimeInputSteppers } from "./TimeInputSteppers/TimeInputSteppers";

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
  const {
    displayValue,
    handleInputChange,
    handleBlur,
    handleKeyDown,
    handleStepUp,
    handleStepDown,
  } = useTimeInput({ value, onChange, stepMinutes });

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
      <TimeInputSteppers onStepUp={handleStepUp} onStepDown={handleStepDown} disabled={disabled} />
    </div>
  );
}
