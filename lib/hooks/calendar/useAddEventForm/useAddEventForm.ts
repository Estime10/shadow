import { useState, useCallback } from "react";
import type { CalendarEvent } from "@/features/calendar/types";
import { buildEventFromForm } from "@/features/calendar/utils";

const DEFAULT_TIME = "12:00";

export type UseAddEventFormParams = {
  selectedDate: Date;
  onSubmit: (event: CalendarEvent) => void;
  onClose: () => void;
};

export type UseAddEventFormReturn = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function useAddEventForm({
  selectedDate,
  onSubmit,
  onClose,
}: UseAddEventFormParams): UseAddEventFormReturn {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(DEFAULT_TIME);

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setTime(DEFAULT_TIME);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const t = title.trim();
      if (!t) return;
      const event = buildEventFromForm(selectedDate, { title: t, description, time });
      onSubmit(event);
      reset();
      onClose();
    },
    [title, description, time, selectedDate, onSubmit, onClose, reset]
  );

  return {
    title,
    setTitle,
    description,
    setDescription,
    time,
    setTime,
    handleSubmit,
    onCancel: onClose,
  };
}
