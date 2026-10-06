import type { Metadata } from "next";
import { revokeInvitation } from "@/app/app/[estId]/actions";
import { ActionButton, CopyButton, MemberControl } from "@/components/dashboard/controls";
import { InviteForm } from "@/components/dashboard/forms";
import { PageHeader, Section } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/config/plans";
import { site } from "@/config/site";
import { ROLE_HINTS, ROLE_LABELS } from "@/lib/auth/permissions";
import { requireAccess } from "@/lib/auth/session";
import { panelState } from "@/lib/billing/panel";
import { listInvitations } from "@/lib/db/admin";
import { listMembers } from "@/lib/db/establishments";

export const metadata: Metadata = { title: "Équipe" };

export default async function TeamPage({ params }: PageProps<"/app/[estId]/equipe">) {
  const { estId } = await params;
  const { establishment } = await requireAccess(estId, "team.manage");
  const panel = panelState(establishment);
  const [members, invitations] = await Promise.all([listMembers(estId), listInvitations(estId)]);
  const plan = panel.plan ?? PLANS.menu;

  return (
    <>
      <PageHeader
        title="Équipe"
        description={`Chaque personne a son propre compte et son rôle. Votre offre donne ${plan.maxMembers} accès ; ${members.length + invitations.length} sont pris.`}
      />
      <div className="grid gap-6">
        <Section title="Les membres">
          <ul className="divide-y divide-line">
            {members.map((member) => (
              <li key={member.userId} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{member.name || member.email}</p>
                  <p className="truncate text-sm text-fg-muted">{member.email}</p>
                </div>
                {member.role === "owner" ? (
                  <Badge tone="solid">{ROLE_LABELS.owner}</Badge>
                ) : (
                  <MemberControl establishmentId={estId} userId={member.userId} role={member.role} />
                )}
              </li>
            ))}
          </ul>
        </Section>

        {panel.editable && (
          <Section title="Inviter quelqu'un" description="Vous obtenez un lien à lui envoyer. Il crée son compte, et rejoint votre équipe.">
            <InviteForm establishmentId={estId} />
            <dl className="mt-5 grid gap-1.5 text-sm text-fg-muted">
              {(["manager", "waiter", "kitchen"] as const).map((role) => (
                <div key={role} className="flex gap-2">
                  <dt className="font-semibold text-fg">{ROLE_LABELS[role]} :</dt>
                  <dd>{ROLE_HINTS[role]}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {invitations.length > 0 && (
          <Section title="Invitations en attente" description="Chaque lien est valable sept jours, pour une seule personne.">
            <ul className="grid gap-4">
              {invitations.map((invitation) => {
                const link = `${site.url}/invitation/${invitation.code}`;
                return (
                  <li key={invitation.code} className="rounded-md border border-line p-4">
                    <p className="font-semibold">
                      {invitation.email} <span className="font-normal text-fg-muted">· {ROLE_LABELS[invitation.role]}</span>
                    </p>
                    <p className="mt-1 truncate text-sm text-fg-muted">{link}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <CopyButton text={link} label="Copier le lien" />
                      <ActionButton variant="ghost" size="sm" className="text-danger-text" action={revokeInvitation.bind(null, estId, invitation.code)}>
                        Annuler
                      </ActionButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}
      </div>
    </>
  );
}
