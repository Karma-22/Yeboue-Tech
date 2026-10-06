import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { OtpForm } from "@/components/auth/otp-form";
import { pendingDevCode } from "@/lib/auth/codes";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Vérifier mon adresse" };

export default async function VerificationPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (session.emailVerified) redirect("/app");
  const devCode = await pendingDevCode(session.userId, "verify");

  return (
    <>
      <p className="type-eyebrow text-accent-text">Étape 2 sur 2</p>
      <h1 className="type-display-3 mt-3">Entrez le code reçu par e-mail.</h1>
      <p className="mt-3 text-fg-muted">
        Nous avons envoyé un code à six chiffres à <strong className="text-fg">{session.email}</strong>.
        Il est valable 10 minutes.
      </p>

      {devCode && (
        <p className="mt-6 rounded-md border border-dashed border-line-strong bg-surface-sunken px-4 py-3 text-sm">
          <strong>Mode développement :</strong> aucun e-mail ne part. Votre code est{" "}
          <strong className="font-display text-lg tracking-widest tabular-nums">{devCode}</strong>.
        </p>
      )}

      <div className="mt-8">
        <OtpForm />
      </div>

      <form action={signOut} className="mt-10 text-sm text-fg-muted">
        Mauvaise adresse ?{" "}
        <button type="submit" className="rounded-sm font-semibold text-fg underline underline-offset-4">
          Recommencer avec une autre
        </button>
      </form>
    </>
  );
}
