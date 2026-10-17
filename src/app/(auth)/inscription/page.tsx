import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/auth-forms";
import { TRIAL } from "@/config/plans";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Créer mon compte" };

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect(session.emailVerified ? "/app" : "/verification");

  return (
    <>
      <p className="type-eyebrow text-accent-text">Étape 1 sur 2</p>
      <h1 className="type-display-3 mt-3">Créez votre compte.</h1>
      <p className="mt-3 text-fg-muted">
        Ensuite, quinze minutes pour mettre votre carte en ligne. L&apos;essai de {TRIAL.days} jours est
        gratuit, sans rien payer aujourd&apos;hui.
      </p>
      <div className="mt-8">
        <SignUpForm />
      </div>
      <p className="mt-8 text-sm text-fg-muted">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-fg underline underline-offset-4">
          Se connecter
        </Link>
      </p>
    </>
  );
}
