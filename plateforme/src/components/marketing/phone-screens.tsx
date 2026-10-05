import Image, { type StaticImageData } from "next/image";
import { Check } from "lucide-react";
import { Viewfinder } from "@/components/brand/viewfinder";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import bissap from "@/assets/photos/boisson-bissap.jpg";
import cover from "@/assets/photos/maquis-poisson-braise.jpg";
import alloco from "@/assets/photos/plat-alloco.jpg";
import skewers from "@/assets/photos/plat-brochettes.jpg";
import qrTable from "@/assets/photos/qr-table.jpg";

/*
 * Les écrans montrés dans le téléphone du site vitrine. Ce sont des dessins de
 * la page d'un établissement, avec un maquis d'exemple : rien n'est branché.
 * Les éléments marqués `data-item` entrent l'un après l'autre dans l'animation.
 */

interface Dish {
  name: string;
  detail: string;
  price: number;
  photo: StaticImageData;
}

const DISHES: Dish[] = [
  { name: "Poisson braisé", detail: "Carpe, oignons, piment", price: 4500, photo: cover },
  { name: "Brochettes de poulet", detail: "Servies avec du riz gras", price: 3500, photo: skewers },
  { name: "Alloco", detail: "Banane plantain frite", price: 1000, photo: alloco },
  { name: "Bissap maison", detail: "Le verre", price: 500, photo: bissap },
];

/** 1. L'appareil photo vise le QR Code posé sur la table. */
export function ScanScreen() {
  return (
    <div className="relative h-full bg-ink text-ivory">
      <Image src={qrTable} alt="" fill sizes="272px" placeholder="blur" className="object-cover" />
      <div className="absolute inset-0 bg-ink/35" />
      <div className="absolute inset-0 grid place-items-center">
        <Viewfinder scanning cornerClassName="size-6" className="size-36 rounded-lg" />
      </div>
      <p className="absolute inset-x-0 bottom-8 text-center">
        <span className="rounded-full bg-ink/70 px-3 py-1.5 text-[0.625rem] font-semibold">
          Visez le QR Code de la table
        </span>
      </p>
    </div>
  );
}

/** 2. Le menu s'ouvre. */
export function MenuScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-30 shrink-0">
        <Image src={cover} alt="" fill sizes="272px" placeholder="blur" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-ink/10" />
        <div className="absolute inset-x-3 bottom-2.5 text-ivory">
          <p className="font-display text-base leading-tight font-bold">Chez Tantie</p>
          <p className="text-[0.625rem] opacity-85">Maquis · Cocody · Ouvert jusqu&apos;à 23 h</p>
        </div>
      </div>

      <div className="flex gap-1.5 px-3 pt-3 pb-2 text-[0.625rem] font-semibold">
        <span className="rounded-full bg-fg px-2.5 py-1 text-surface">Grillades</span>
        <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-fg-muted">Plats</span>
        <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-fg-muted">Boissons</span>
      </div>

      <ul className="grid gap-1.5 px-3">
        {DISHES.map((dish) => (
          <li
            key={dish.name}
            data-item
            className="flex items-center gap-2.5 rounded-md bg-surface-raised p-1.5 shadow-xs"
          >
            <span className="relative size-11 shrink-0 overflow-hidden rounded-sm">
              <Image src={dish.photo} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{dish.name}</span>
              <span className="block truncate text-[0.625rem] text-fg-muted">{dish.detail}</span>
            </span>
            <span className="pr-1 font-semibold tabular-nums">{formatPrice(dish.price)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto p-3">
        <div className="flex items-center justify-between rounded-md bg-accent px-3 py-2.5 font-semibold text-on-accent">
          <span>Voir mon panier</span>
          <span className="tabular-nums">{formatPrice(4500)}</span>
        </div>
      </div>
    </div>
  );
}

/** 3. Le client ouvre un plat. */
export function DishScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-52 shrink-0">
        <Image src={skewers} alt="" fill sizes="272px" placeholder="blur" className="object-cover" />
      </div>
      <div className="-mt-4 flex flex-1 flex-col rounded-t-xl bg-surface p-4">
        <p data-item className="font-display text-lg leading-tight font-bold">
          Brochettes de poulet
        </p>
        <p data-item className="mt-1.5 text-fg-muted">
          Poulet mariné, poivrons et oignons, grillés au charbon. Servies avec du riz gras et la
          sauce de la maison.
        </p>
        <p data-item className="mt-3 font-display text-base font-bold tabular-nums">
          {formatPrice(3500)}
        </p>

        <div data-item className="mt-auto flex items-center gap-2">
          <span className="flex h-9 items-center gap-3 rounded-md border border-line-strong px-3 font-semibold tabular-nums">
            <span aria-hidden="true">−</span>1<span aria-hidden="true">+</span>
          </span>
          <span className="grid h-9 flex-1 place-items-center rounded-md bg-accent font-semibold text-on-accent">
            Ajouter au panier
          </span>
        </div>
      </div>
    </div>
  );
}

/** 4. La commande est partie : le client suit son avancement. */
export function OrderScreen() {
  const stages = ["Envoyée", "En préparation", "Prête"];
  return (
    <div className="flex h-full flex-col px-4 pt-14 pb-4">
      <span
        data-item
        className="grid size-12 place-items-center rounded-full bg-success-soft text-success-text"
      >
        <Check aria-hidden="true" strokeWidth={3} className="size-6" />
      </span>
      <p data-item className="mt-4 font-display text-lg leading-tight font-bold">
        Commande envoyée
      </p>
      <p data-item className="mt-1 text-fg-muted">
        Table 12 · Chez Tantie
      </p>

      <ul data-item className="mt-4 grid gap-1.5 rounded-md bg-surface-raised p-3 shadow-xs">
        <li className="flex justify-between gap-3">
          <span>1 × Brochettes de poulet</span>
          <span className="tabular-nums">{formatPrice(3500)}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span>1 × Alloco</span>
          <span className="tabular-nums">{formatPrice(1000)}</span>
        </li>
        <li className="mt-1 flex justify-between gap-3 border-t border-line pt-2 font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(4500)}</span>
        </li>
      </ul>

      <ol data-item className="mt-5 grid gap-2.5">
        {stages.map((stage, index) => (
          <li key={stage} className="flex items-center gap-2.5">
            <span
              className={cn(
                "size-2.5 rounded-full",
                index === 0 ? "bg-success" : "border border-line-strong",
              )}
            />
            <span className={cn(index === 0 ? "font-semibold" : "text-fg-subtle")}>{stage}</span>
          </li>
        ))}
      </ol>

      <p data-item className="mt-auto flex items-center gap-1.5 text-[0.625rem] font-semibold text-signal-text">
        <span className="size-1.5 animate-live rounded-full bg-current" />
        Suivi en direct
      </p>
    </div>
  );
}

/** Ce que voit le comptoir au même moment : la commande qui vient d'arriver. */
export function CounterTicket({ className }: { className?: string }) {
  return (
    <div
      data-theme="light"
      className={cn(
        "rounded-lg border border-line bg-surface-raised p-3.5 text-xs text-fg shadow-lg",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base leading-tight font-bold">Table 12</p>
          <p className="text-fg-muted">À l&apos;instant</p>
        </div>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-accent-text">
          Nouvelle
        </span>
      </div>
      <ul className="mt-3 grid gap-1 border-t border-line pt-2.5">
        <li>1 × Brochettes de poulet</li>
        <li>1 × Alloco</li>
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-2 font-semibold">
        <span className="grid h-8 place-items-center rounded-sm border border-line-strong">Refuser</span>
        <span className="grid h-8 place-items-center rounded-sm bg-accent text-on-accent">Accepter</span>
      </div>
    </div>
  );
}
