"use client";

type AddEventFormTitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const labelClass =
  "block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1";
const inputClass =
  "w-full rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:border-accent focus:outline-none";

export function AddEventFormTitleField({ value, onChange }: AddEventFormTitleFieldProps) {
  return (
    <div>
      <label htmlFor="add-event-title" className={labelClass}>
        Titre
      </label>
      <input
        id="add-event-title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex. Réunion équipe"
        className={inputClass}
        required
        autoFocus
      />
    </div>
  );
}
