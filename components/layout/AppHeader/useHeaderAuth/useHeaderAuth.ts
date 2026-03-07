"use client";

import { useState, useCallback } from "react";
import { logoutAction } from "@/features/auth/logout/logoutAction/logoutAction";
import type { CurrentUserProfile } from "@/lib/supabase/CRUD";

export type UseHeaderAuthReturn = {
  profile: CurrentUserProfile | null;
  showLogoutModal: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  confirmLogout: () => void;
};

export function useHeaderAuth(profile: CurrentUserProfile | null): UseHeaderAuthReturn {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = useCallback(() => setShowLogoutModal(true), []);
  const closeLogoutModal = useCallback(() => setShowLogoutModal(false), []);

  const confirmLogout = useCallback(() => {
    setShowLogoutModal(false);
    void logoutAction();
  }, []);

  return {
    profile,
    showLogoutModal,
    openLogoutModal,
    closeLogoutModal,
    confirmLogout,
  };
}
