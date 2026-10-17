import { Plus } from "lucide-react";
import { Fold, Folds } from "@/components/public/fold";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { cn } from "@/lib/utils/cn";
import { cormorant } from "./fonts";
import { ContactLinks, LanguageLink, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template, TemplateData } from "./types";

const DISPLAY = "font-(family-name:--font-cormorant)";
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Le blason : le logo du lieu, ou à défaut son initiale dans un cercle fin. */
function Crest({ data, className }: { data: TemplateData; className?: string }) {
  if (data.logoUrl) return <Photo src={data.logoUrl} alt="" className={cn("size-16 rounded-full", className)} />;
  return (
    <span
      aria-hidden="true"
      className={cn(
        DISPLAY,
        "grid size-16 place-items-center rounded-full border border-(--brand-text-dark) text-[2rem] leading-none text-(--brand-text-dark)",
        className,
      )}
    >
      {data.name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Palace : sobre et raffiné. Un en-tête profond, la photo dans son filet blanc,
 * puis les services rangés en volets numérotés qui s'ouvrent un à un.
 */
export const Palace: Template = ({ data }) => (
  <div
    data-template="palace"
    data-theme="light"
    className={cn(cormorant.variable, "min-h-dvh bg-[#F5F2EC] pb-28 text-[#1E1B16]")}
  >
    <TemplateMotion />

    <header className={cn("bg-(--brand-deep) px-6 pt-5 text-center text-[#F5F2EC]", data.coverUrl ? "pb-24" : "pb-12")}>
      <div className="mx-auto flex min-h-9 max-w-3xl items-center justify-between gap-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#F5F2EC]/70 uppercase">
        <span>{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</span>
        <LanguageLink data={data} className="h-8 border border-[#F5F2EC]/35 text-[0.6875rem] tracking-[0.2em]" />
      </div>
      <Crest data={data} className="mx-auto mt-9 animate-rise" />
      <h1
        className={cn(
          DISPLAY,
          "mt-6 animate-rise text-[clamp(2.6rem,11vw,4.75rem)] leading-none font-medium tracking-[0.01em] text-balance [animation-delay:100ms]",
        )}
      >
        {data.name}
      </h1>
      <span className="mx-auto mt-6 block h-px w-16 bg-(--brand-text-dark)" />
      {data.tableLabel && (
        <p className="mt-6 animate-rise text-[0.75rem] font-semibold tracking-[0.3em] uppercase [animation-delay:180ms]">
          {data.labels.welcome} · {data.tableLabel}
        </p>
      )}
      {data.description && (
        <p
          className={cn(
            DISPLAY,
            "mx-auto mt-5 max-w-md animate-rise text-[1.375rem] leading-snug text-[#F5F2EC]/80 italic [animation-delay:240ms]",
          )}
        >
          {data.description}
        </p>
      )}
    </header>

    {data.coverUrl && (
      <div className="mx-auto -mt-14 max-w-3xl px-4">
        <div className="relative aspect-[16/10] overflow-hidden shadow-lg">
          <div data-parallax="0.12" className="absolute inset-x-0 -top-[20%] h-[120%]">
            <Photo eager src={data.coverUrl} className="size-full" />
          </div>
          <span className="pointer-events-none absolute inset-3 border border-white/65" />
        </div>
      </div>
    )}

    <main className="mx-auto max-w-3xl px-5 pt-10">
      <Folds defaultOpen={data.categories.slice(0, 1).map((category) => category.id)} className="border-t border-[#1E1B16]/20">
        {data.categories.map((category, index) => (
          <Fold
            key={category.id}
            value={category.id}
            id={sectionId(category)}
            className="border-b border-[#1E1B16]/20"
            triggerClassName="gap-4 py-6"
            header={
              <>
                <span className={cn(DISPLAY, "w-8 shrink-0 text-xl text-(--brand-text) italic")}>
                  {ROMAN[index] ?? index + 1}
                </span>
                <span className={cn(DISPLAY, "flex-1 text-[1.875rem] leading-none font-medium")}>{category.name}</span>
                <span className="text-xs tracking-[0.2em] text-[#1E1B16]/50 tabular-nums">{category.items.length}</span>
                <Plus
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-5 shrink-0 text-(--brand-text) transition-transform duration-300 ease-emphasized group-data-[state=open]:rotate-45"
                />
              </>
            }
          >
            <ul className="pb-5 sm:pl-12">
              {category.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 border-t border-[#1E1B16]/10 first:border-t-0">
                  <ItemTrigger item={item} className="flex min-w-0 flex-1 items-center gap-4 py-4 data-soldout:opacity-50">
                    {item.photo && (
                      <Photo src={item.photo.thumb} className="size-16 shrink-0 ring-1 ring-[#1E1B16]/15" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={cn(DISPLAY, "block text-[1.375rem] leading-tight font-semibold")}>{item.name}</span>
                      {item.description && (
                        <span className="mt-0.5 block text-sm leading-snug text-[#1E1B16]/65">{item.description}</span>
                      )}
                    </span>
                    <span
                      className={
                        item.price !== null && item.available
                          ? "shrink-0 text-[0.9375rem] font-semibold text-(--brand-text) tabular-nums"
                          : cn(DISPLAY, "shrink-0 text-lg text-(--brand-text) italic")
                      }
                    >
                      {item.available ? priceOf(item) : data.labels.soldOut}
                    </span>
                  </ItemTrigger>
                  <QuickAdd item={item} className="rounded-none border border-(--brand-text) bg-transparent text-(--brand-text)" />
                </li>
              ))}
            </ul>
          </Fold>
        ))}
      </Folds>
    </main>

    <footer data-reveal="up" className="mx-auto mt-14 max-w-3xl px-5">
      <div className="bg-(--brand-deep) px-7 py-10 text-center text-[#F5F2EC]">
        <p className={cn(DISPLAY, "text-[2rem] leading-none font-medium")}>{data.name}</p>
        <span className="mx-auto mt-5 block h-px w-12 bg-(--brand-text-dark)" />
        <div className="mt-5 grid gap-1.5 text-[0.75rem] leading-relaxed tracking-[0.18em] text-[#F5F2EC]/75 uppercase">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks
          data={data}
          className="mt-7 justify-center"
          linkClassName="h-11 border border-[#F5F2EC]/35 px-4 text-[0.75rem] font-semibold tracking-[0.14em] uppercase"
        />
        <PoweredBy data={data} className="mt-8 text-[#F5F2EC]/50" />
      </div>
    </footer>
  </div>
);
