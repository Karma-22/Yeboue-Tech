"use client";

import { createContext, useContext, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import { accentStyle } from "@/lib/utils/color";
import { formatPrice } from "@/lib/utils/format";
import { whatsappLink } from "@/lib/utils/phone";
import type { TemplateItem } from "@/templates/types";
import type { ShellLabels } from "./shell-labels";

/*
 * Ce qui est commun à tous les modèles de page (ARCHITECTURE.md §10) : la fiche
 * d'un article, le panier et l'envoi de la commande. Les modèles ne dessinent
 * que la page ; ils ouvrent une fiche ou ajoutent au panier par `ItemTrigger`
 * et `QuickAdd`.
 */

/** Comment le client peut commander sur cette page. */
export type Ordering =
  /** Depuis une table : la commande part au comptoir. */
  | { mode: "table"; slug: string; /** Ce qui suit l'adresse du suivi : « ?lang=en », ou rien. */ query: string }
  /** À emporter : le panier devient un message WhatsApp. */
  | { mode: "whatsapp"; slug: string; whatsapp: string }
  /** Aperçu d'un modèle : le panier fonctionne, rien n'est envoyé. */
  | { mode: "preview" }
  /** Consultation seule. */
  | { mode: "none" };

/** Ce que renvoie le serveur après une commande. */
export type PlaceOrderResult = { ok: true; orderId: string } | { ok: false; message: string };

interface MenuContextValue {
  canOrder: boolean;
  addLabel: string;
  quantity: (itemId: string) => number;
  add: (itemId: string) => void;
  remove: (itemId: string) => void;
  open: (item: TemplateItem) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu(): MenuContextValue {
  const value = useContext(MenuContext);
  if (!value) throw new Error("ItemTrigger et QuickAdd doivent être placés dans un MenuShell.");
  return value;
}

/** Un article peut-il aller dans le panier ? Il lui faut un prix, et ne pas être en rupture. */
function orderable(item: TemplateItem): boolean {
  return item.available && item.price !== null;
}

interface MenuShellProps {
  /** La couleur choisie par le gérant. */
  accent: string;
  ordering: Ordering;
  /** Tous les articles de la page, pour retrouver ceux du panier. */
  items: TemplateItem[];
  labels: ShellLabels;
  /** Envoie la commande au serveur. Fourni seulement quand `ordering.mode` vaut « table ». */
  placeOrder?: (cart: { itemId: string; quantity: number }[], note: string) => Promise<PlaceOrderResult>;
  className?: string;
  children: React.ReactNode;
}

export function MenuShell({ accent, ordering, items, labels, placeOrder, className, children }: MenuShellProps) {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [openItem, setOpenItem] = useState<TemplateItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, startSending] = useTransition();
  const canOrder = ordering.mode !== "none";
  // Les fenêtres s'ouvrent hors de la page : elles reçoivent la couleur à part.
  const vars = useMemo(() => accentStyle(accent) as React.CSSProperties, [accent]);

  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const lines = Object.entries(cart)
    .map(([itemId, quantity]) => ({ item: byId.get(itemId), quantity }))
    .filter((line): line is { item: TemplateItem; quantity: number } => line.item !== undefined && line.quantity > 0);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + (line.item.price ?? 0) * line.quantity, 0);

  const context = useMemo<MenuContextValue>(
    () => ({
      canOrder,
      addLabel: labels.add,
      quantity: (itemId) => cart[itemId] ?? 0,
      add: (itemId) => setCart((current) => ({ ...current, [itemId]: Math.min((current[itemId] ?? 0) + 1, 50) })),
      remove: (itemId) =>
        setCart((current) => {
          const next = { ...current, [itemId]: (current[itemId] ?? 0) - 1 };
          if (next[itemId] <= 0) delete next[itemId];
          return next;
        }),
      open: setOpenItem,
    }),
    [canOrder, cart, labels.add],
  );

  const send = () => {
    setError(null);
    if (ordering.mode === "preview") {
      setError(labels.previewNotice);
      return;
    }
    if (ordering.mode === "whatsapp") {
      const message = [
        labels.whatsappHello,
        ...lines.map((line) => `${line.quantity} × ${line.item.name}`),
        note.trim() ? `(${note.trim()})` : null,
        `${labels.total} : ${formatPrice(total)}`,
      ]
        .filter(Boolean)
        .join("\n");
      // Un simple compteur, pour les statistiques du gérant : la commande elle-même n'est pas enregistrée.
      navigator.sendBeacon?.(`/api/scan?slug=${encodeURIComponent(ordering.slug)}&kind=whatsapp`);
      window.location.assign(whatsappLink(ordering.whatsapp, message));
      return;
    }
    if (ordering.mode === "table" && placeOrder) {
      const payload = lines.map((line) => ({ itemId: line.item.id, quantity: line.quantity }));
      startSending(async () => {
        try {
          const result = await placeOrder(payload, note);
          if (result.ok) router.push(`/${ordering.slug}/commande/${result.orderId}${ordering.query}`);
          else setError(result.message);
        } catch {
          setError(labels.error);
        }
      });
    }
  };

  return (
    <MenuContext.Provider value={context}>
      <div style={vars} className={className}>
        {children}

        {/* La barre du panier, collée en bas dès qu'il contient quelque chose */}
        <div
          className={cn(
            "pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-[translate,opacity] duration-300 ease-emphasized",
            count > 0 ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          )}
        >
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            tabIndex={count > 0 ? 0 : -1}
            aria-hidden={count === 0}
            className="pointer-events-auto flex h-14 w-full max-w-md items-center justify-between gap-3 rounded-lg bg-(--brand) px-5 font-sans font-semibold text-(--on-brand) shadow-lg ring-1 ring-black/10 active:translate-y-px"
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag aria-hidden="true" className="size-5" />
              {labels.viewCart}
              <span className="grid size-6 place-items-center rounded-full bg-(--on-brand) text-xs text-(--brand) tabular-nums">
                {count}
              </span>
            </span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </button>
        </div>
      </div>

      {/* La fiche d'un article */}
      <Dialog open={openItem !== null} onOpenChange={(open) => !open && setOpenItem(null)}>
        {openItem && (
          <DialogContent data-theme="light" style={vars} className="gap-0 overflow-hidden p-0 pb-0 sm:max-w-lg sm:pb-0">
            {openItem.photo && (
              // Photo déjà réduite à l'envoi : pas besoin de l'optimiseur d'images.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={openItem.photo.large} alt="" className="aspect-4/3 w-full bg-surface-sunken object-cover" />
            )}
            <div className="grid gap-3 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6">
              <DialogTitle>{openItem.name}</DialogTitle>
              <DialogDescription className={cn("whitespace-pre-line", !openItem.description && "sr-only")}>
                {openItem.description || openItem.name}
              </DialogDescription>
              <p className="font-display text-xl font-bold tabular-nums">
                {openItem.price !== null ? formatPrice(openItem.price) : openItem.note}
              </p>
              {!openItem.available ? (
                <p className="rounded-md bg-surface-sunken px-4 py-3 text-sm font-semibold text-fg-muted">
                  {labels.soldOut}
                </p>
              ) : (
                canOrder &&
                orderable(openItem) && (
                  <div className="mt-2 flex items-center gap-3">
                    <Stepper
                      labels={labels}
                      quantity={context.quantity(openItem.id)}
                      onAdd={() => context.add(openItem.id)}
                      onRemove={() => context.remove(openItem.id)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (context.quantity(openItem.id) === 0) context.add(openItem.id);
                        setOpenItem(null);
                      }}
                      className="h-12 flex-1 rounded-md bg-(--brand) px-4 font-semibold text-(--on-brand) transition-[filter] hover:brightness-105 active:translate-y-px"
                    >
                      {labels.add}
                    </button>
                  </div>
                )
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Le panier */}
      <Dialog open={cartOpen && count > 0} onOpenChange={setCartOpen}>
        <DialogContent data-theme="light" style={vars} className="sm:max-w-lg">
          <DialogTitle>{labels.cartTitle}</DialogTitle>
          <DialogDescription>
            {ordering.mode === "whatsapp" ? labels.cartHintWhatsapp : labels.cartHintTable}
          </DialogDescription>
          <ul className="grid gap-3 border-y border-line py-4">
            {lines.map(({ item, quantity }) => (
              <li key={item.id} className="flex items-center gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{item.name}</span>
                  <span className="text-sm text-fg-muted tabular-nums">
                    {formatPrice((item.price ?? 0) * quantity)}
                  </span>
                </span>
                <Stepper
                  labels={labels}
                  quantity={quantity}
                  onAdd={() => context.add(item.id)}
                  onRemove={() => context.remove(item.id)}
                />
              </li>
            ))}
          </ul>
          <label className="grid gap-1.5 text-sm font-semibold">
            {labels.note}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value.slice(0, 200))}
              rows={2}
              placeholder={labels.notePlaceholder}
              className="rounded-md border border-line-strong bg-surface-raised px-3.5 py-2.5 text-base font-normal placeholder:text-fg-subtle focus-visible:border-fg focus-visible:outline-hidden"
            />
          </label>
          <p className="flex items-baseline justify-between">
            <span className="text-fg-muted">{labels.total}</span>
            <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(total)}</span>
          </p>
          {error && (
            <p role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-sm font-medium text-danger-text">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="h-13 rounded-md bg-(--brand) px-4 text-base font-semibold text-(--on-brand) transition-[filter] hover:brightness-105 active:translate-y-px disabled:opacity-60"
          >
            {sending ? labels.sending : ordering.mode === "whatsapp" ? labels.sendWhatsapp : labels.send}
          </button>
        </DialogContent>
      </Dialog>
    </MenuContext.Provider>
  );
}

function Stepper({
  labels,
  quantity,
  onAdd,
  onRemove,
}: {
  labels: ShellLabels;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <span className="flex h-12 shrink-0 items-center rounded-md border border-line-strong">
      <button
        type="button"
        onClick={onRemove}
        disabled={quantity === 0}
        aria-label={labels.remove}
        className="grid h-full w-11 place-items-center rounded-l-md disabled:opacity-30"
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <span className="w-6 text-center font-semibold tabular-nums">{quantity}</span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={labels.add}
        className="grid h-full w-11 place-items-center rounded-r-md"
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </span>
  );
}

/** Ouvre la fiche d'un article. Le modèle met dedans ce qu'il veut : une ligne, une carte, une photo. */
export function ItemTrigger({
  item,
  className,
  children,
}: {
  item: TemplateItem;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useMenu();
  return (
    <button
      type="button"
      onClick={() => open(item)}
      data-soldout={item.available ? undefined : ""}
      className={cn("text-left", className)}
    >
      {children}
    </button>
  );
}

/** Le petit bouton « + » qui met un article au panier sans ouvrir sa fiche. N'apparaît que s'il est commandable. */
export function QuickAdd({ item, className }: { item: TemplateItem; className?: string }) {
  const { canOrder, add, quantity, addLabel } = useMenu();
  if (!canOrder || !orderable(item)) return null;
  const count = quantity(item.id);
  return (
    <button
      type="button"
      onClick={() => add(item.id)}
      aria-label={`${addLabel} : ${item.name}`}
      className={cn(
        "relative grid size-9 shrink-0 place-items-center rounded-full bg-(--brand) text-(--on-brand) transition-transform active:scale-90",
        className,
      )}
    >
      <Plus aria-hidden="true" strokeWidth={2.5} className="size-4" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-(--on-brand) text-[0.6875rem] font-bold text-(--brand) tabular-nums ring-2 ring-(--brand)">
          {count}
        </span>
      )}
    </button>
  );
}
