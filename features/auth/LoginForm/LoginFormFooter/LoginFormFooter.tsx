"use client";

import Link from "next/link";

export function LoginFormFooter() {
  return (
    <p className="mt-6 text-center text-sm text-(--text-muted)">
      Pas de compte ?{" "}
      <Link
        href="/register"
        className="font-display font-bold uppercase tracking-wider text-accent"
      >
        S&apos;inscrire
      </Link>
    </p>
  );
}
