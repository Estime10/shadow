"use client";

const labelClass =
  "block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1";
const textareaClass =
  "w-full resize-none rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) focus:border-accent focus:outline-none";

type EventDetailModalFormDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EventDetailModalFormDescriptionField({
  value,
  onChange,
}: EventDetailModalFormDescriptionFieldProps) {
  return (
    <div>
      <label htmlFor="edit-event-description" className={labelClass}>
        Description <span className="font-normal">(optionnel)</span>
      </label>
      <textarea
        id="edit-event-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={textareaClass}
      />
    </div>
  );
}
