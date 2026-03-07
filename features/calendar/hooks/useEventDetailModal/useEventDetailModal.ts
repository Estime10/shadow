"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useClientUserId } from "@/lib/hooks/messages";
import { updateEventAction, deleteEventAction } from "@/features/calendar/actions";
import type { CalendarEvent } from "@/features/calendar/types";
import { formatEventTime, buildEventDateFromTime } from "@/features/calendar/utils";

export type UseEventDetailModalParams = {
  event: CalendarEvent | null;
  onClose: () => void;
  onDeleteSuccess?: () => void;
  onUpdateSuccess?: () => void;
};

export type UseEventDetailModalReturn = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  confirmDeleteOpen: boolean;
  setConfirmDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editDescription: string;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  editTime: string;
  setEditTime: React.Dispatch<React.SetStateAction<string>>;
  isCreator: boolean;
  openEditMode: () => void;
  handleOverlayClick: (e: React.MouseEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  handleSaveEdit: (e: React.FormEvent) => Promise<void>;
  handleCancelEdit: () => void;
};

export function useEventDetailModal({
  event,
  onClose,
  onDeleteSuccess,
  onUpdateSuccess,
}: UseEventDetailModalParams): UseEventDetailModalReturn {
  const currentUserId = useClientUserId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTime, setEditTime] = useState("12:00");
  const menuRef = useRef<HTMLDivElement>(null);

  const isCreator = event != null && currentUserId != null && event.createdBy === currentUserId;

  const openEditMode = useCallback(() => {
    if (!event) return;
    setEditTitle(event.title);
    setEditDescription(event.description ?? "");
    setEditTime(formatEventTime(event.eventDate));
    setEditing(true);
    setMenuOpen(false);
  }, [event]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).hasAttribute("data-backdrop")) onClose();
    },
    [onClose]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!event) return;
    const { error } = await deleteEventAction(event.id);
    setConfirmDeleteOpen(false);
    if (!error) {
      onClose();
      onDeleteSuccess?.();
    }
  }, [event, onClose, onDeleteSuccess]);

  const handleSaveEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!event) return;
      const { error } = await updateEventAction(event.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        eventDate: buildEventDateFromTime(event.eventDate, editTime),
      });
      if (!error) {
        setEditing(false);
        setMenuOpen(false);
        onUpdateSuccess?.();
      }
    },
    [event, editTitle, editDescription, editTime, onUpdateSuccess]
  );

  const handleCancelEdit = useCallback(() => {
    setEditing(false);
    if (event) {
      setEditTitle(event.title);
      setEditDescription(event.description ?? "");
      setEditTime(formatEventTime(event.eventDate));
    }
  }, [event]);

  return {
    menuOpen,
    setMenuOpen,
    menuRef,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    editing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editTime,
    setEditTime,
    isCreator,
    openEditMode,
    handleOverlayClick,
    handleConfirmDelete,
    handleSaveEdit,
    handleCancelEdit,
  };
}
