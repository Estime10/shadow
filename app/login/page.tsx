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
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--bg) content-px py-12">
      {registered === "1" ? (
        <p className="mb-4 w-full max-w-md text-center text-sm text-accent" role="status">
          Compte créé. Connectez-vous.
        </p>
      ) : null}
      <LoginForm />
    </div>
  );
}
