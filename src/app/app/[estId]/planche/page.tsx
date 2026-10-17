import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { QrSheet } from "@/components/dashboard/qr-sheet";
import { publicUrl } from "@/config/site";
import { requireAccess } from "@/lib/auth/session";
import { getFloor } from "@/lib/db/tables";

export const metadata: Metadata = { title: "QR Codes à imprimer" };

/** Tous les QR Codes de l'établissement sur une planche à imprimer : le général, puis un par table. */
export default async function QrSheetPage({ params }: PageProps<"/app/[estId]/planche">) {
  const { estId } = await params;
  const { establishment } = await requireAccess(estId, "tables.edit");
  if (establishment.subscription === null) redirect(`/app/${estId}/creation`);
  const { tables } = await getFloor(estId);
  const rooms = establishment.type === "hotel" || establishment.type === "residence";

  return (
    <QrSheet
      establishmentName={establishment.name}
      accent={establishment.accentColor}
      invitation={rooms ? "Scannez pour voir nos services" : "Scannez pour voir la carte et commander"}
      codes={[
        { label: rooms ? "Nos services" : "Notre carte", url: publicUrl(establishment.slug) },
        ...tables.map((table) => ({ label: table.label, url: publicUrl(establishment.slug, table.number) })),
      ]}
    />
  );
}
