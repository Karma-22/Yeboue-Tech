import { recordScan, recordWhatsappOrder } from "@/lib/db/orders";
import { loadPublicPage } from "@/lib/public/load";
import { publicView } from "@/lib/public/view";
import { allow, clientKey } from "@/lib/utils/rate-limit";

/**
 * Compte un scan, ou une commande partie sur WhatsApp, dans les statistiques du
 * jour de l'établissement (ARCHITECTURE.md §6.5 et §6.7). Rien d'autre n'est enregistré.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!allow(`scan:${await clientKey()}`, 30, 60_000)) return new Response(null, { status: 429 });

  const page = await loadPublicPage(searchParams.get("slug") ?? "");
  if (page && publicView(page.establishment, false).online) {
    const record = searchParams.get("kind") === "whatsapp" ? recordWhatsappOrder : recordScan;
    await record(page.establishment.id);
  }
  return new Response(null, { status: 204 });
}
