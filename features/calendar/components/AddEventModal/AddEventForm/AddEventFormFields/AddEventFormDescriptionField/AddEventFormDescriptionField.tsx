"use client";

type AddEventFormDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const labelClass =
  "block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1";
const textareaClass =
  "w-full resize-none rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:border-accent focus:outline-none";

export function AddEventFormDescriptionField({
  value,
  onChange,
}: AddEventFormDescriptionFieldProps) {
  return (
    <div>
      <label htmlFor="add-event-description" className={labelClass}>
        Description <span className="text-(--text-muted) font-normal">(optionnel)</span>
      </label>
      <textarea
        id="add-event-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Détails…"
        rows={3}
        className={textareaClass}
      />
    </div>
  );
}
