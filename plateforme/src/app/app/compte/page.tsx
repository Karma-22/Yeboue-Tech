import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/(auth)/actions";
import { ProfileForm } from "@/components/dashboard/forms";
import { AccountBar, PageHeader, Section } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Mon compte" };

export default async function AccountPage() {
  const { user, session } = await requireUser();
  return (
    <>
      <AccountBar admin={session.superAdmin} />
      <main className="mx-auto grid max-w-2xl gap-6 px-5 py-10 sm:px-8">
        <PageHeader title="Mon compte" className="mb-2" />
        <Section title="Mon profil">
          <ProfileForm user={user} />
        </Section>
        <Section title="Mot de passe" description="Vous recevrez un code par e-mail pour en choisir un nouveau.">
          <Link href="/mot-de-passe-oublie" className="font-semibold underline underline-offset-4">
            Changer mon mot de passe
          </Link>
        </Section>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Me déconnecter
          </Button>
        </form>
      </main>
    </>
  );
}
