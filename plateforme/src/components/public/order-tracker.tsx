"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Check, ChefHat, Star, Utensils, X } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/db/types";
import { cn } from "@/lib/utils/cn";
import { accentStyle } from "@/lib/utils/color";
import { formatPrice } from "@/lib/utils/format";

/* Le suivi d'une commande par le client (ARCHITECTURE.md §9) : l'état change sous ses yeux, sans recharger. */

const COPY = {
  fr: {
    status: {
      new: ["Commande envoyée", "Le comptoir l'a bien reçue. Vous n'avez plus rien à faire."],
      accepted: ["En préparation", "La cuisine s'en occupe."],
      ready: ["Votre commande est prête", "Elle arrive à votre table."],
      served: ["Bon appétit !", "Merci pour votre commande."],
      rejected: ["Commande refusée", "Adressez-vous au personnel."],
      cancelled: ["Commande annulée", "Adressez-vous au personnel."],
    } satisfies Record<OrderStatus, [string, string]>,
    steps: ["Envoyée", "En préparation", "Prête", "Servie"],
    live: "Suivi en direct",
    total: "Total",
    note: "Votre remarque",
    back: "Retour à la carte",
    reviewTitle: "Comment c'était ?",
    reviewPlaceholder: "Un mot pour l'équipe (facultatif)",
    reviewSend: "Envoyer mon avis",
    reviewThanks: "Merci pour votre avis.",
    google: "Le dire aussi sur Google",
    stars: (count: number) => `${count} sur 5`,
  },
  en: {
    status: {
      new: ["Order sent", "The counter has it. There is nothing else to do."],
      accepted: ["Being prepared", "The kitchen is on it."],
      ready: ["Your order is ready", "It is on its way to your table."],
      served: ["Enjoy!", "Thank you for your order."],
      rejected: ["Order declined", "Please ask a member of staff."],
      cancelled: ["Order cancelled", "Please ask a member of staff."],
    } satisfies Record<OrderStatus, [string, string]>,
    steps: ["Sent", "Preparing", "Ready", "Served"],
    live: "Live tracking",
    total: "Total",
    note: "Your request",
    back: "Back to the menu",
    reviewTitle: "How was it?",
    reviewPlaceholder: "A word for the team (optional)",
    reviewSend: "Send my review",
    reviewThanks: "Thank you for your review.",
    google: "Say it on Google too",
    stars: (count: number) => `${count} out of 5`,
  },
};

const STEP: Record<OrderStatus, number> = { new: 0, accepted: 1, ready: 2, served: 3, rejected: -1, cancelled: -1 };

interface OrderTrackerProps {
  establishmentId: string;
  establishmentName: string;
  accent: string;
  initial: Order;
  lang: "fr" | "en";
  backHref: string;
  /** Les avis sont ouverts, et celui de cette commande n'a pas encore été donné. */
  canReview: boolean;
  googleReviewUrl: string;
  sendReview: (rating: number, comment: string) => Promise<{ ok: boolean; message: string }>;
}

export function OrderTracker({
  establishmentId,
  establishmentName,
  accent,
  initial,
  lang,
  backHref,
  canReview,
  googleReviewUrl,
  sendReview,
}: OrderTrackerProps) {
  const copy = COPY[lang];
  const [order, setOrder] = useState(initial);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewed, setReviewed] = useState<string | null>(null);
  const [sending, startSending] = useTransition();
  const vars = useMemo(() => accentStyle(accent) as React.CSSProperties, [accent]);
  const seen = useRef(initial.status);

  // L'écoute en direct n'est téléchargée qu'après l'affichage : la page se lit tout de suite.
  useEffect(() => {
    let cancelled = false;
    let stop = () => {};
    import("@/lib/db/live").then(({ watchOrder }) => {
      if (cancelled) return;
      stop = watchOrder(establishmentId, initial.id, (next) => {
        if (!next) return;
        // Un petit signal quand l'état change, pour qui a posé son téléphone.
        if (next.status !== seen.current) navigator.vibrate?.(180);
        seen.current = next.status;
        setOrder(next);
      });
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [establishmentId, initial.id]);

  const step = STEP[order.status];
  const failed = step === -1;
  const [title, subtitle] = copy.status[order.status];
  const Icon = failed ? X : order.status === "served" ? Utensils : order.status === "new" ? Check : ChefHat;

  const submitReview = () => {
    startSending(async () => {
      const result = await sendReview(rating, comment);
      setReviewed(result.message);
    });
  };

  return (
    <main data-theme="light" style={vars} className="min-h-dvh bg-surface px-5 py-8 text-fg">
      <div className="mx-auto max-w-md">
        <p className="flex items-center justify-between gap-3 text-sm font-semibold">
          <span className="truncate">{establishmentName}</span>
          <span className="shrink-0 rounded-full bg-surface-sunken px-3 py-1">{order.tableLabel}</span>
        </p>

        <div className="mt-10 text-center">
          <div
            key={order.status}
            className={cn(
              "mx-auto grid size-20 animate-rise place-items-center rounded-full",
              failed ? "bg-danger-soft text-danger-text" : "bg-(--brand) text-(--on-brand)",
            )}
          >
            <Icon aria-hidden="true" strokeWidth={2.25} className="size-9" />
          </div>
          <h1 key={title} role="status" className="type-display-3 mt-6 animate-rise">
            {title}
          </h1>
          <p className="mt-2 text-fg-muted">{failed && order.rejectReason ? order.rejectReason : subtitle}</p>
          {!failed && order.status !== "served" && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-signal-text">
              <span className="size-2 animate-live rounded-full bg-current" />
              {copy.live}
            </p>
          )}
        </div>

        {!failed && (
          <ol className="mt-10 grid grid-cols-4 gap-1.5">
            {copy.steps.map((label, index) => (
              <li key={label} aria-current={index === step ? "step" : undefined} className="text-center">
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-colors duration-500",
                    index <= step ? "bg-(--brand)" : "bg-line",
                  )}
                />
                <span
                  className={cn(
                    "mt-2 block text-[0.6875rem] leading-tight font-semibold",
                    index <= step ? "text-fg" : "text-fg-subtle",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-10 rounded-lg border border-line bg-surface-raised p-5">
          <ul className="grid gap-2.5">
            {order.lines.map((line) => (
              <li key={line.itemId} className="flex justify-between gap-4">
                <span>
                  {line.quantity} × {line.name}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          {order.note && (
            <p className="mt-4 border-t border-line pt-3 text-sm text-fg-muted">
              <span className="font-semibold text-fg">{copy.note} :</span> {order.note}
            </p>
          )}
          <p className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-fg-muted">{copy.total}</span>
            <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(order.total)}</span>
          </p>
        </div>

        {order.status === "served" && canReview && (
          <div className="mt-6 animate-rise rounded-lg border border-line bg-surface-raised p-5">
            {reviewed ? (
              <div className="text-center">
                <p className="font-semibold">{reviewed}</p>
                {rating >= 4 && googleReviewUrl && (
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block font-semibold underline underline-offset-4"
                  >
                    {copy.google}
                  </a>
                )}
              </div>
            ) : (
              <>
                <p className="font-display text-lg font-bold">{copy.reviewTitle}</p>
                <div className="mt-3 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={copy.stars(value)}
                      aria-pressed={rating === value}
                      className="grid size-11 place-items-center rounded-md transition-transform active:scale-90"
                    >
                      <Star
                        aria-hidden="true"
                        className={cn("size-8", value <= rating ? "fill-warning text-warning" : "text-line-strong")}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value.slice(0, 500))}
                  rows={2}
                  placeholder={copy.reviewPlaceholder}
                  className="mt-3 block w-full rounded-md border border-line-strong bg-surface-raised px-3.5 py-2.5 text-base placeholder:text-fg-subtle focus-visible:border-fg focus-visible:outline-hidden"
                />
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={rating === 0 || sending}
                  className="mt-3 h-12 w-full rounded-md bg-fg font-semibold text-surface disabled:opacity-40"
                >
                  {copy.reviewSend}
                </button>
              </>
            )}
          </div>
        )}

        <p className="mt-8 text-center">
          <Link href={backHref} className="font-semibold underline underline-offset-4">
            {copy.back}
          </Link>
        </p>
      </div>
    </main>
  );
}
