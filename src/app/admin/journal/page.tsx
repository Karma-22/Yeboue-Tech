import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { listAdminLogs } from "@/lib/db/admin";
import { formatDateTime } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Journal" };

/** Tout ce qui a été fait depuis l'administration (ARCHITECTURE.md §12). Rien ne s'y efface. */
export default async function AdminLogPage() {
  const logs = await listAdminLogs(300);
  return (
    <>
      <PageHeader title="Journal" description="Chaque action faite depuis l'administration, la plus récente en premier." />
      {logs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong p-8 text-center text-fg-muted">Rien pour l&apos;instant.</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface-raised">
          {logs.map((log) => (
            <li key={log.id} className="grid gap-0.5 px-5 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <span className="text-sm text-fg-muted tabular-nums">{formatDateTime(log.createdAt)}</span>
              <span>
                <span className="font-semibold">{log.action}</span>
                {log.details && (
                  <>
                    {" — "}
                    <Link href={`/admin/etablissements/${log.targetId}`} className="underline underline-offset-4">
                      {log.details}
                    </Link>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
