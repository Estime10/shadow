"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

type TimeInputSteppersProps = {
  onStepUp: () => void;
  onStepDown: () => void;
  disabled: boolean;
};

export function TimeInputSteppers({ onStepUp, onStepDown, disabled }: TimeInputSteppersProps) {
  return (
    <div className="flex shrink-0 flex-col border-l-2 border-(--border)">
      <button
        type="button"
        onClick={onStepUp}
        disabled={disabled}
        className="time-input__stepper-btn"
        aria-label="Augmenter l'heure"
      >
        <ChevronUp className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onStepDown}
        disabled={disabled}
        className="time-input__stepper-btn"
        aria-label="Diminuer l'heure"
      >
        <ChevronDown className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
