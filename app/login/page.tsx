import Link from "next/link";
import { LoginForm } from "@/features/auth/LoginForm/LoginForm";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Connexion",
  description: "Connectez-vous à votre compte",
});

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--bg) px-4 py-12">
      <div className="mb-8 flex w-full max-w-md justify-center">
        <Link
          href="/"
          className="font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) hover:text-accent transition-colors"
        >
          ← Retour à l’accueil
        </Link>
      </div>
      {registered === "1" ? (
        <p className="mb-4 w-full max-w-md text-center text-sm text-accent" role="status">
          Compte créé. Connectez-vous.
        </p>
      ) : null}
      <LoginForm />
    </div>
  );
}
