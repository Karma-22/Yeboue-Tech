import Image, { type StaticImageData } from "next/image";
import { Check, ChevronRight } from "lucide-react";
import { Viewfinder } from "@/components/brand/viewfinder";
import type { ScreensCopy } from "@/i18n/types";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { SolutionMedia } from "./solution-media";

/*
 * Les écrans montrés dans le téléphone du site vitrine. Ce sont des dessins de
 * la page d'un établissement d'exemple : rien n'est branché. Les textes
 * viennent des dictionnaires, les photos de solution-media.ts.
 * Les éléments marqués `data-item` entrent l'un après l'autre dans l'animation.
 */

/** 1. L'appareil photo vise le QR Code. */
export function ScanScreen({ copy, photo }: { copy: ScreensCopy["scan"]; photo: StaticImageData }) {
  return (
    <div className="relative h-full bg-ink text-ivory">
      <Image src={photo} alt="" fill sizes="272px" className="object-cover" />
      <div className="absolute inset-0 bg-ink/35" />
      <div className="absolute inset-0 grid place-items-center">
        <Viewfinder scanning cornerClassName="size-6" className="size-36 rounded-lg" />
      </div>
      <p className="absolute inset-x-0 bottom-8 text-center">
        <span className="rounded-full bg-ink/70 px-3 py-1.5 text-[0.625rem] font-semibold">
          {copy.hint}
        </span>
      </p>
    </div>
  );
}

/** 2. La page de l'établissement s'ouvre : sa carte, ou ses services. */
export function ListScreen({
  copy,
  cover,
  photos,
}: {
  copy: ScreensCopy["list"];
  cover: StaticImageData;
  photos: SolutionMedia["items"];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-30 shrink-0">
        <Image src={cover} alt="" fill sizes="272px" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-ink/10" />
        <div className="absolute inset-x-3 bottom-2.5 text-ivory">
          <p className="font-display text-base leading-tight font-bold">{copy.title}</p>
          <p className="text-[0.625rem] opacity-85">{copy.subtitle}</p>
        </div>
      </div>

      <div className="flex gap-1.5 px-3 pt-3 pb-2 text-[0.625rem] font-semibold">
        {copy.tabs.map((tab, index) => (
          <span
            key={tab}
            className={cn(
              "rounded-full px-2.5 py-1",
              index === 0 ? "bg-fg text-surface" : "bg-surface-sunken text-fg-muted",
            )}
          >
            {tab}
          </span>
        ))}
      </div>

      <ul className="grid gap-1.5 px-3">
        {copy.items.map((item, index) => {
          const photo = photos[index];
          return (
            <li
              key={item.name}
              data-item
              className="flex items-center gap-2.5 rounded-md bg-surface-raised p-1.5 shadow-xs"
            >
              <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-sm bg-surface-sunken font-display text-sm font-bold text-fg-muted">
                {photo ? (
                  <Image src={photo} alt="" fill sizes="48px" className="object-cover" />
                ) : (
                  item.name.charAt(0)
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{item.name}</span>
                <span className="block truncate text-[0.625rem] text-fg-muted">{item.detail}</span>
              </span>
              <span className="shrink-0 pr-1 font-semibold tabular-nums">
                {item.price !== undefined ? (
                  formatPrice(item.price)
                ) : item.note ? (
                  <span className="text-[0.625rem] text-success-text">{item.note}</span>
                ) : (
                  <ChevronRight aria-hidden="true" className="size-3.5 text-fg-subtle" />
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto p-3">
        <div className="flex items-center justify-between rounded-md bg-accent px-3 py-2.5 font-semibold text-on-accent">
          <span>{copy.action}</span>
          {copy.amount !== undefined && <span className="tabular-nums">{formatPrice(copy.amount)}</span>}
        </div>
      </div>
    </div>
  );
}

/** 3. Le client ouvre un plat ou un service. */
export function DetailScreen({ copy, photo }: { copy: ScreensCopy["detail"]; photo: StaticImageData }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-52 shrink-0">
        <Image src={photo} alt="" fill sizes="272px" className="object-cover" />
      </div>
      <div className="-mt-4 flex flex-1 flex-col rounded-t-xl bg-surface p-4">
        <p data-item className="font-display text-lg leading-tight font-bold">
          {copy.title}
        </p>
        <p data-item className="mt-1.5 text-fg-muted">
          {copy.text}
        </p>
        <p data-item className="mt-3 font-display text-base font-bold tabular-nums">
          {formatPrice(copy.price)}
        </p>

        <div data-item className="mt-auto flex items-center gap-2">
          <span className="flex h-9 items-center gap-3 rounded-md border border-line-strong px-3 font-semibold tabular-nums">
            <span aria-hidden="true">−</span>1<span aria-hidden="true">+</span>
          </span>
          <span className="grid h-9 flex-1 place-items-center rounded-md bg-accent px-2 text-center font-semibold text-on-accent">
            {copy.action}
          </span>
        </div>
      </div>
    </div>
  );
}

/** 4. La commande ou la demande est partie : le client suit son avancement. */
export function ConfirmScreen({ copy }: { copy: ScreensCopy["confirm"] }) {
  return (
    <div className="flex h-full flex-col px-4 pt-14 pb-4">
      <span
        data-item
        className="grid size-12 place-items-center rounded-full bg-success-soft text-success-text"
      >
        <Check aria-hidden="true" strokeWidth={3} className="size-6" />
      </span>
      <p data-item className="mt-4 font-display text-lg leading-tight font-bold">
        {copy.title}
      </p>
      <p data-item className="mt-1 text-fg-muted">
        {copy.subtitle}
      </p>

      <ul data-item className="mt-4 grid gap-1.5 rounded-md bg-surface-raised p-3 shadow-xs">
        {copy.lines.map((line) => (
          <li key={line.label} className="flex justify-between gap-3">
            <span className={cn(line.amount === undefined && "text-fg-muted")}>{line.label}</span>
            {line.amount !== undefined && (
              <span className="tabular-nums">{formatPrice(line.amount)}</span>
            )}
          </li>
        ))}
        <li className="mt-1 flex justify-between gap-3 border-t border-line pt-2 font-semibold">
          <span>{copy.totalLabel}</span>
          <span className="tabular-nums">{formatPrice(copy.total)}</span>
        </li>
      </ul>

      <ol data-item className="mt-5 grid gap-2.5">
        {copy.stages.map((stage, index) => (
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

      <p
        data-item
        className="mt-auto flex items-center gap-1.5 text-[0.625rem] font-semibold text-signal-text"
      >
        <span className="size-1.5 animate-live rounded-full bg-current" />
        {copy.live}
      </p>
    </div>
  );
}

/** Ce que voit le comptoir ou la réception au même moment : la demande qui vient d'arriver. */
export function CounterTicket({ copy, className }: { copy: ScreensCopy["ticket"]; className?: string }) {
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
          <p className="font-display text-base leading-tight font-bold">{copy.title}</p>
          <p className="text-fg-muted">{copy.when}</p>
        </div>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-accent-text">
          {copy.badge}
        </span>
      </div>
      <ul className="mt-3 grid gap-1 border-t border-line pt-2.5">
        {copy.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-2 font-semibold">
        <span className="grid h-8 place-items-center rounded-sm border border-line-strong">
          {copy.refuse}
        </span>
        <span className="grid h-8 place-items-center rounded-sm bg-accent text-on-accent">
          {copy.accept}
        </span>
      </div>
    </div>
  );
}

/** Les quatre écrans d'un type d'établissement, dans l'ordre de l'histoire. */
export function solutionScreens(copy: ScreensCopy, media: SolutionMedia): React.ReactNode[] {
  return [
    <ScanScreen key="scan" copy={copy.scan} photo={media.scan} />,
    <ListScreen key="list" copy={copy.list} cover={media.cover} photos={media.items} />,
    <DetailScreen key="detail" copy={copy.detail} photo={media.detail} />,
    <ConfirmScreen key="confirm" copy={copy.confirm} />,
  ];
}
