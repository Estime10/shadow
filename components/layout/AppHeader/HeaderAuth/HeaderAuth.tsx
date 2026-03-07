"use client";

import { useHeaderAuth } from "../useHeaderAuth/useHeaderAuth";
import type { CurrentUserProfile } from "@/lib/supabase/CRUD";
import { HeaderAuthLoggedIn } from "./HeaderAuthLoggedIn/HeaderAuthLoggedIn";
import { HeaderAuthLoggedOut } from "./HeaderAuthLoggedOut/HeaderAuthLoggedOut";

type HeaderAuthProps = {
  profile: CurrentUserProfile | null;
};

export function HeaderAuth({ profile }: HeaderAuthProps) {
  const {
    profile: _profile,
    showLogoutModal,
    openLogoutModal,
    closeLogoutModal,
    confirmLogout,
  } = useHeaderAuth(profile);

  if (_profile) {
    return (
      <HeaderAuthLoggedIn
        username={_profile.username}
        onLogoutClick={openLogoutModal}
        showLogoutModal={showLogoutModal}
        onCloseLogoutModal={closeLogoutModal}
        onConfirmLogout={confirmLogout}
      />
    );
  }

  return <HeaderAuthLoggedOut />;
}
