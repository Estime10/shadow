import Link from "next/link";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 py-12">
      <div className="mb-8 flex w-full max-w-md justify-center">
        <Link
          href="/"
          className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          ← Retour à l’accueil
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
