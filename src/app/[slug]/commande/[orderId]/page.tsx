import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sendReview } from "@/app/[slug]/actions";
import { Unavailable } from "@/components/public/establishment-view";
import { OrderTracker } from "@/components/public/order-tracker";
import { getOrder, getReviewOf } from "@/lib/db/orders";
import { loadPublicPage } from "@/lib/public/load";
import { publicView } from "@/lib/public/view";

/* Le suivi d'une commande (ARCHITECTURE.md §6.5) : le client y arrive juste après l'avoir envoyée. */

export const metadata: Metadata = { title: "Votre commande", robots: { index: false } };

export default async function OrderPage({ params, searchParams }: PageProps<"/[slug]/commande/[orderId]">) {
  const [{ slug, orderId }, { lang }] = await Promise.all([params, searchParams]);
  const page = await loadPublicPage(slug);
  if (!page) notFound();
  const { establishment } = page;
  const view = publicView(establishment, true);
  if (!view.online) return <Unavailable name={establishment.name} />;

  const order = await getOrder(establishment.id, orderId);
  if (!order) notFound();
  const alreadyReviewed = view.reviews ? (await getReviewOf(establishment.id, order.id)) !== null : true;

  const english = lang === "en" && establishment.english;
  const table = page.tables.find((entry) => entry.id === order.tableId);
  const back = table ? `/${establishment.slug}/t/${table.number}` : `/${establishment.slug}`;

  return (
    <OrderTracker
      establishmentId={establishment.id}
      establishmentName={establishment.name}
      accent={establishment.accentColor}
      initial={order}
      lang={english ? "en" : "fr"}
      backHref={english ? `${back}?lang=en` : back}
      canReview={view.reviews && !alreadyReviewed}
      googleReviewUrl={establishment.googleReviewUrl}
      sendReview={sendReview.bind(null, establishment.slug, order.id)}
    />
  );
}
