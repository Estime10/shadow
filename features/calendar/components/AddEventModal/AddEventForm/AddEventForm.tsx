"use client";

import { TimeInput } from "@/components/ui/TimeInput";

export type AddEventFormProps = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function AddEventForm({
  title,
  setTitle,
  description,
  setDescription,
  time,
  setTime,
  onSubmit,
  onCancel,
}: AddEventFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 content-px py-4">
      <div>
        <label
          htmlFor="add-event-title"
          className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
        >
          Titre
        </label>
        <input
          id="add-event-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex. Réunion équipe"
          className="w-full rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:border-accent focus:outline-none"
          required
          autoFocus
        />
      </div>
      <div>
        <label
          htmlFor="add-event-time"
          className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
        >
          Heure
        </label>
        <TimeInput id="add-event-time" value={time} onChange={setTime} stepMinutes={15} />
      </div>
      <div>
        <label
          htmlFor="add-event-description"
          className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
        >
          Description <span className="text-(--text-muted) font-normal">(optionnel)</span>
        </label>
        <textarea
          id="add-event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails…"
          rows={3}
          className="w-full resize-none rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:border-accent focus:outline-none"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border-2 border-(--border) py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--text) transition-colors hover:bg-(--surface-hover)"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-accent py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--bg) transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}
