"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useClientUserId } from "@/lib/hooks/messages";
import { useToast } from "@/lib/contexts/ToastContext/ToastContext";
import { deleteEventAction } from "@/features/calendar/actions";
import type { CalendarEvent } from "@/features/calendar/types";

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
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isCreator: boolean;
  openEditMode: () => void;
  handleOverlayClick: (e: React.MouseEvent) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCancelEdit: () => void;
};

export function useEventDetailModal({
  event,
  onClose,
  onDeleteSuccess,
}: UseEventDetailModalParams): UseEventDetailModalReturn {
  const currentUserId = useClientUserId();
  const { addToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCreator = event != null && currentUserId != null && event.createdBy === currentUserId;

  const openEditMode = useCallback(() => {
    setEditing(true);
    setMenuOpen(false);
  }, []);

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
      addToast("success", "Événement supprimé");
      onClose();
      onDeleteSuccess?.();
    }
  }, [event, onClose, onDeleteSuccess, addToast]);

  const handleCancelEdit = useCallback(() => {
    setEditing(false);
  }, []);

  return {
    menuOpen,
    setMenuOpen,
    menuRef,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    editing,
    setEditing,
    isCreator,
    openEditMode,
    handleOverlayClick,
    handleConfirmDelete,
    handleCancelEdit,
  };
}
