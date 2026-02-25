"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/logout/logoutAction/logoutAction";
import type { CurrentUserProfile } from "@/lib/supabase/getCurrentUserProfile";
import { ConfirmModal } from "@/components/ui/ConfirmModal/ConfirmModal";

type HeaderAuthProps = {
  profile: CurrentUserProfile | null;
};

export function HeaderAuth({ profile }: HeaderAuthProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogoutClick() {
    setShowLogoutModal(true);
  }

  function handleLogoutConfirm() {
    setShowLogoutModal(false);
    void logoutAction();
  }

  if (profile) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="font-display text-xs font-bold uppercase tracking-wider text-(--text)"
          title="Connecté"
        >
          {profile.username ?? "Profil"}
        </span>
        <button
          type="button"
          onClick={handleLogoutClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text)"
          aria-label="Se déconnecter"
        >
          <LogOut className="h-4 w-4" aria-hidden />
        </button>
        <ConfirmModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
          title="Déconnexion"
          message="Tu veux te déconnecter ?"
          confirmLabel="Déconnecter"
        />
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="font-display text-xs font-bold uppercase tracking-wider text-(--text)"
    >
      Connexion
    </Link>
  );
}
