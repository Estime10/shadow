"use client";

import Link from "next/link";

export function HeaderAuthLoggedOut() {
  return (
    <Link
      href="/login"
      className="font-display text-xs font-bold uppercase tracking-wider text-(--text)"
    >
      Connexion
    </Link>
  );
}
