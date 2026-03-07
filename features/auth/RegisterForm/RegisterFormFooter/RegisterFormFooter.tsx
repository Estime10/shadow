"use client";

import Link from "next/link";

export function RegisterFormFooter() {
  return (
    <p className="mt-6 text-center text-sm text-(--text-muted)">
      Déjà un compte ?{" "}
      <Link href="/login" className="font-display font-bold uppercase tracking-wider text-accent">
        Se connecter
      </Link>
    </p>
  );
}
