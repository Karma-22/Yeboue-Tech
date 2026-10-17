import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/auth-forms";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Connexion" };

export default async function SignInPage({ searchParams }: PageProps<"/connexion">) {
  const session = await getSession();
  if (session) redirect(session.emailVerified ? "/app" : "/verification");
  const { motdepasse } = await searchParams;

  return (
    <>
      <h1 className="type-display-3">Bon retour.</h1>
      <p className="mt-3 text-fg-muted">Connectez-vous pour gérer votre établissement.</p>

      {motdepasse === "change" && (
        <p role="status" className="mt-6 rounded-md bg-success-soft px-4 py-3 text-sm font-medium text-success-text">
          Votre mot de passe est changé. Connectez-vous avec le nouveau.
        </p>
      )}

      <div className="mt-8">
        <SignInForm />
      </div>
      <p className="mt-8 text-sm text-fg-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-fg underline underline-offset-4">
          Créer mon compte
        </Link>
      </p>
    </>
  );
}
