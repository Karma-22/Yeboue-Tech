import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm, ResetRequestForm } from "@/components/auth/auth-forms";
import { pendingDevCode } from "@/lib/auth/codes";
import { adminAuth } from "@/lib/firebase/admin";

export const metadata: Metadata = { title: "Mot de passe oublié" };

/** En développement seulement : retrouve le code en attente pour l'afficher. */
async function devCodeFor(email: string): Promise<string | null> {
  try {
    const user = await adminAuth().getUserByEmail(email);
    return await pendingDevCode(user.uid, "reset");
  } catch {
    return null;
  }
}

export default async function ForgotPasswordPage({ searchParams }: PageProps<"/mot-de-passe-oublie">) {
  const params = await searchParams;
  const address = typeof params?.email === "string" ? params.email : null;
  const devCode = address ? await devCodeFor(address) : null;

  return (
    <>
      <h1 className="type-display-3">{address ? "Choisissez un nouveau mot de passe." : "Mot de passe oublié ?"}</h1>
      <p className="mt-3 text-fg-muted">
        {address ? (
          <>
            Si un compte existe pour <strong className="text-fg">{address}</strong>, un code à six chiffres
            vient d&apos;y être envoyé. Il est valable 10 minutes.
          </>
        ) : (
          "Indiquez l'adresse de votre compte : nous vous envoyons un code pour en choisir un nouveau."
        )}
      </p>

      {devCode && (
        <p className="mt-6 rounded-md border border-dashed border-line-strong bg-surface-sunken px-4 py-3 text-sm">
          <strong>Mode développement :</strong> aucun e-mail ne part. Votre code est{" "}
          <strong className="font-display text-lg tracking-widest tabular-nums">{devCode}</strong>.
        </p>
      )}

      <div className="mt-8">{address ? <ResetForm email={address} /> : <ResetRequestForm />}</div>

      <p className="mt-8 text-sm text-fg-muted">
        <Link href="/connexion" className="font-semibold text-fg underline underline-offset-4">
          Retour à la connexion
        </Link>
      </p>
    </>
  );
}
