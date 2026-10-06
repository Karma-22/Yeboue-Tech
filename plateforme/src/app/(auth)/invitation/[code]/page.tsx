import type { Metadata } from "next";
import Link from "next/link";
import { acceptInvitation, continueInvitation } from "@/app/(auth)/actions";
import { Button, buttonStyles } from "@/components/ui/button";
import { ROLE_HINTS, ROLE_LABELS } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { getInvitation } from "@/lib/db/admin";

export const metadata: Metadata = { title: "Rejoindre une équipe", robots: { index: false } };

async function usable(code: string) {
  const invitation = await getInvitation(code);
  return invitation && invitation.usedAt === null && invitation.expiresAt > Date.now() ? invitation : null;
}

/** Accepter une invitation dans l'équipe d'un établissement (ARCHITECTURE.md §6.8). */
export default async function InvitationPage({ params, searchParams }: PageProps<"/invitation/[code]">) {
  const [{ code }, { erreur }] = await Promise.all([params, searchParams]);
  const [invitation, session] = await Promise.all([usable(code), getSession()]);

  if (!invitation) {
    return (
      <>
        <h1 className="type-display-3">Cette invitation n&apos;est plus valable.</h1>
        <p className="mt-3 text-fg-muted">
          Elle a déjà servi, ou elle a plus de sept jours. Demandez-en une nouvelle au propriétaire de l&apos;établissement.
        </p>
        <Link href="/connexion" className={buttonStyles({ variant: "outline", className: "mt-8 self-start" })}>
          Me connecter
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="type-display-3">Rejoindre {invitation.establishmentName}.</h1>
      <p className="mt-3 text-fg-muted">
        Vous êtes invité en tant que <strong className="text-fg">{ROLE_LABELS[invitation.role]}</strong> :{" "}
        {ROLE_HINTS[invitation.role].toLowerCase()}
      </p>
      {erreur === "complet" && (
        <p role="alert" className="mt-6 rounded-md bg-danger-soft px-4 py-3 text-sm font-medium text-danger-text">
          L&apos;équipe est au complet pour l&apos;offre de cet établissement. Prévenez son propriétaire.
        </p>
      )}

      {session?.emailVerified ? (
        <form action={acceptInvitation.bind(null, code)} className="mt-8">
          <Button type="submit" size="lg" block>
            Rejoindre l&apos;équipe
          </Button>
          <p className="mt-3 text-center text-sm text-fg-muted">Connecté avec {session.email}.</p>
        </form>
      ) : (
        <div className="mt-8 grid gap-3">
          <form action={continueInvitation.bind(null, code, "/inscription")}>
            <Button type="submit" size="lg" block>
              Créer mon compte
            </Button>
          </form>
          <form action={continueInvitation.bind(null, code, "/connexion")}>
            <Button type="submit" size="lg" variant="outline" block>
              J&apos;ai déjà un compte
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
