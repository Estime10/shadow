"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";
import type { Profile } from "@/lib/supabase/CRUD";
import { getInitial } from "@/features/messages/utils";
import { FALLBACK_USERNAME } from "@/features/messages/constants";

type CreateConversationModalProps = {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredProfiles: Profile[];
  onSelectUser: (profile: Profile) => void | Promise<void>;
  /** Id du profil en cours de création (désactive le bouton, évite double clic). */
  creatingForProfileId?: string | null;
  /** Message d'erreur à afficher (ex. échec création conversation). */
  error?: string | null;
};

export function CreateConversationModal({
  open,
  onClose,
  searchQuery,
  onSearchChange,
  searchInputRef,
  filteredProfiles,
  onSelectUser,
  creatingForProfileId = null,
  error = null,
}: CreateConversationModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-conversation-modal-title"
          className="fixed inset-0 z-10000 grid min-h-dvh place-items-center p-4"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: ANIMATION_EASING }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
          <motion.div
            className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col rounded-xl border-2 border-(--border) bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: ANIMATION_EASING }}
          >
            <div className="shrink-0 border-b-2 border-(--border) p-4">
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="create-conversation-modal-title"
                  className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
                >
                  Créer une conversation
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2">
                <Search className="h-4 w-4 shrink-0 text-(--text-muted)" aria-hidden />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher un utilisateur…"
                  className="min-w-0 flex-1 bg-transparent font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none"
                  aria-label="Rechercher un utilisateur"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {error ? (
                <p
                  className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-(--error)"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
              {filteredProfiles.length === 0 ? (
                <p className="py-8 text-center font-display text-sm text-(--text-muted)">
                  {searchQuery.trim() ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
                </p>
              ) : (
                <ul className="space-y-1" role="list">
                  {filteredProfiles.map((profile) => {
                    const isCreating = creatingForProfileId === profile.id;
                    return (
                      <li key={profile.id}>
                        <button
                          type="button"
                          onClick={() => onSelectUser(profile)}
                          disabled={creatingForProfileId !== null}
                          className="flex w-full items-center gap-3 rounded-xl content-px py-3 text-left transition-colors hover:bg-(--bg) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 disabled:pointer-events-none"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--bg) font-display text-sm font-bold uppercase text-accent">
                            {isCreating ? (
                              <LoadingSpinner size={20} aria-label="Création de la conversation…" />
                            ) : (
                              getInitial(profile.username)
                            )}
                          </span>
                          <span className="min-w-0 truncate font-display text-sm font-bold uppercase tracking-wider text-(--text)">
                            {profile.username ?? FALLBACK_USERNAME}
                          </span>
                          {isCreating ? (
                            <span className="ml-auto shrink-0 text-xs text-(--text-muted)">
                              Création…
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
