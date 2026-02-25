import Link from "next/link";
import { RegisterForm } from "@/features/auth/RegisterForm/RegisterForm";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Inscription",
  description: "Créez votre compte",
});

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--bg) content-px py-12">
      <div className="mb-8 flex w-full max-w-md justify-center">
        <Link
          href="/"
          className="font-display text-xs font-bold uppercase tracking-wider text-(--text)"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
}
