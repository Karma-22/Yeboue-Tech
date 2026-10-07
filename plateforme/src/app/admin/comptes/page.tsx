import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { listUsers } from "@/lib/db/users";
import { formatDate } from "@/lib/utils/format";
import { formatPhone, whatsappLink } from "@/lib/utils/phone";

export const metadata: Metadata = { title: "Comptes" };

export default async function AdminAccountsPage() {
  const users = await listUsers(500);
  return (
    <>
      <PageHeader title="Comptes" description={`${users.length} compte${users.length > 1 ? "s" : ""}, du plus récent au plus ancien.`} />
      {users.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong p-8 text-center text-fg-muted">Aucun compte pour l&apos;instant.</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface-raised">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <span className="min-w-0">
                <span className="block truncate font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="block truncate text-sm text-fg-muted">
                  {user.email} · inscrit le {formatDate(user.createdAt)} · {user.establishmentIds.length} établissement
                  {user.establishmentIds.length > 1 ? "s" : ""}
                </span>
              </span>
              {user.phone && (
                <a href={whatsappLink(user.phone, "")} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm font-semibold underline underline-offset-4">
                  {formatPhone(user.phone)}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
