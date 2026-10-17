import type { Metadata } from "next";
import { NewEstablishmentForm } from "@/components/dashboard/forms";
import { AccountBar } from "@/components/dashboard/page-header";
import { Steps } from "@/components/dashboard/steps";
import { siteHost } from "@/config/site";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Créer mon établissement" };

/** Premier écran de la création guidée (ARCHITECTURE.md §6.1). Les trois suivants sont sous /app/{id}/creation. */
export default async function NewEstablishmentPage() {
  const { user, session } = await requireUser();
  return (
    <>
      <AccountBar admin={session.superAdmin} />
      <main className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
        <Steps current={1} />
        <h1 className="type-display-3 mt-8">Parlez-nous de votre établissement.</h1>
        <p className="mt-2 mb-8 text-fg-muted">
          Quatre écrans, une dizaine de minutes. Vous pourrez tout modifier ensuite.
        </p>
        <NewEstablishmentForm phone={user.phone} siteHost={siteHost} />
      </main>
    </>
  );
}
