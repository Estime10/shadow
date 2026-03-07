"use client";

const labelClass =
  "block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1";
const inputClass =
  "w-full rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) focus:border-accent focus:outline-none";

type EventDetailModalFormTitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EventDetailModalFormTitleField({
  value,
  onChange,
}: EventDetailModalFormTitleFieldProps) {
  return (
    <div>
      <label htmlFor="edit-event-title" className={labelClass}>
        Titre
      </label>
      <input
        id="edit-event-title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        required
      />
    </div>
  );
}
