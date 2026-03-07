"use client";

import { LogOut } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal/ConfirmModal";

type HeaderAuthLoggedInProps = {
  username: string | null;
  onLogoutClick: () => void;
  showLogoutModal: boolean;
  onCloseLogoutModal: () => void;
  onConfirmLogout: () => void;
};

export function HeaderAuthLoggedIn({
  username,
  onLogoutClick,
  showLogoutModal,
  onCloseLogoutModal,
  onConfirmLogout,
}: HeaderAuthLoggedInProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-display text-xs font-bold uppercase tracking-wider text-(--text)"
        title="Connecté"
      >
        {username ?? "Profil"}
      </span>
      <button
        type="button"
        onClick={onLogoutClick}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text)"
        aria-label="Se déconnecter"
      >
        <LogOut className="h-4 w-4" aria-hidden />
      </button>
      <ConfirmModal
        open={showLogoutModal}
        onClose={onCloseLogoutModal}
        onConfirm={onConfirmLogout}
        title="Déconnexion"
        message="Tu veux te déconnecter ?"
        confirmLabel="Déconnecter"
      />
    </div>
  );
}
