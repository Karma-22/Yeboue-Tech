import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { cn } from "@/lib/utils/cn";
import { fraunces } from "./fonts";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template } from "./types";

const SERIF = "font-(family-name:--font-fraunces)";

/** Le fleuron des cartes de restaurant : deux filets, deux volutes, un losange. */
function Ornament({ className, hero = false }: { className?: string; hero?: boolean }) {
  const line = hero
    ? { pathLength: 1, className: "animate-draw [stroke-dasharray:1]" }
    : { "data-draw": "" };
  return (
    <svg viewBox="0 0 220 20" fill="none" aria-hidden="true" className={cn("h-5 w-52", className)}>
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.55">
        <path d="M94 10H4" {...line} />
        <path d="M126 10h90" {...line} />
        <path d="M86 10c2.5-6 9-6 11 0M134 10c-2.5 6-9 6-11 0" />
      </g>
      <path d="M110 3.5 116.5 10 110 16.5 103.5 10z" fill="var(--brand)" />
    </svg>
  );
}

/**
 * Table d'hôte : la carte classique. Papier ivoire, double filet, tout est
 * centré ; les titres sont en italique, les prix en petites capitales.
 */
export const TableDhote: Template = ({ data }) => (
  <div
    data-template="table-dhote"
    data-theme="light"
    className={cn(fraunces.variable, "min-h-dvh bg-[#F6EFE0] p-2.5 pb-28 text-[#2A2118]")}
  >
    <TemplateMotion />
    <div className="mx-auto max-w-2xl border border-[#2A2118]/45 outline-1 [outline-offset:-6px] outline-[#2A2118]/20">
      <header className="px-7 pt-5 pb-10 text-center">
        <div className="flex min-h-9 items-center justify-between gap-3 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase">
          <span>{data.tableLabel}</span>
          <LanguageLink data={data} className="h-8 border border-[#2A2118]/40 text-[0.6875rem] tracking-[0.2em]" />
        </div>

        {data.logoUrl && <Photo src={data.logoUrl} alt="" className="mx-auto mt-6 size-16 rounded-full" />}
        <p className="mt-8 flex animate-rise items-center justify-center gap-3 text-[0.6875rem] font-semibold tracking-[0.34em] uppercase">
          <span className="size-1.5 rotate-45 bg-(--brand)" />
          {data.typeLabel}
          <span className="size-1.5 rotate-45 bg-(--brand)" />
        </p>
        <h1
          className={cn(
            SERIF,
            "mt-5 animate-rise text-[clamp(2.9rem,13vw,5.25rem)] leading-[0.95] font-normal text-balance italic [animation-delay:90ms]",
          )}
        >
          {data.name}
        </h1>
        <Ornament hero className="mx-auto mt-6" />
        {data.description && (
          <p
            className={cn(
              SERIF,
              "mx-auto mt-6 max-w-sm animate-rise text-[1.1875rem] leading-snug text-[#2A2118]/75 italic [animation-delay:180ms]",
            )}
          >
            {data.description}
          </p>
        )}
        {data.coverUrl && (
          <div className="mx-auto mt-9 w-52 rounded-t-full border border-[#2A2118]/40 p-1.5">
            <Photo eager src={data.coverUrl} className="aspect-[3/4] w-full animate-curtain rounded-t-full" />
          </div>
        )}
        <div className="mt-7 grid gap-1 text-[0.6875rem] leading-relaxed tracking-[0.22em] text-[#2A2118]/65 uppercase">
          <p>{placeOf(data)}</p>
          {data.hours && <p>{data.hours}</p>}
        </div>
      </header>

      <div className="sticky top-0 z-20 border-y border-[#2A2118]/25 bg-[#F6EFE0]/95 backdrop-blur-sm">
        <CategoryNav
          categories={navOf(data)}
          offset={52}
          className="mx-auto w-max max-w-full gap-7 px-6"
          linkClassName="flex h-12 items-center border-b-2 text-[0.75rem] font-semibold tracking-[0.2em] uppercase"
          activeClassName="border-(--brand-text) text-(--brand-text)"
          idleClassName="border-transparent text-[#2A2118]/60"
        />
      </div>

      <main>
        {data.categories.map((category) => (
          <section key={category.id} id={sectionId(category)} className="scroll-mt-14 px-7 pt-12">
            <h2 data-reveal="fade" className={cn(SERIF, "flex items-center gap-4 text-[2.25rem] leading-none italic")}>
              <span className="h-px flex-1 bg-[#2A2118]/30" />
              {category.name}
              <span className="h-px flex-1 bg-[#2A2118]/30" />
            </h2>
            <ul data-reveal-group="up" className="mt-3">
              {category.items.map((item) => (
                <li
                  key={item.id}
                  className="relative py-6 text-center after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-10 after:-translate-x-1/2 after:bg-[#2A2118]/25 last:after:hidden"
                >
                  <ItemTrigger item={item} className="group/item block w-full text-center">
                    <span className={cn(SERIF, "block text-[1.4375rem] leading-tight group-data-soldout/item:text-[#2A2118]/45")}>
                      {item.name}
                    </span>
                    {item.description && (
                      <span className={cn(SERIF, "mx-auto mt-1.5 block max-w-xs text-[0.9875rem] leading-snug text-[#2A2118]/65 italic")}>
                        {item.description}
                      </span>
                    )}
                    <span className="mt-2.5 block text-[0.8125rem] font-semibold tracking-[0.2em] text-(--brand-text) tabular-nums uppercase group-data-soldout/item:text-[#2A2118]/55">
                      {item.available ? priceOf(item) : data.labels.soldOut}
                    </span>
                  </ItemTrigger>
                  <QuickAdd item={item} className="mx-auto mt-3.5 border border-(--brand-text) bg-transparent text-(--brand-text)" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <footer data-reveal="fade" className="px-7 pt-14 pb-10 text-center">
        <Ornament className="mx-auto" />
        <p className={cn(SERIF, "mt-7 text-3xl italic")}>{data.labels.thanks}</p>
        <div className="mt-5 grid gap-1.5 text-[0.75rem] leading-relaxed tracking-[0.18em] text-[#2A2118]/70 uppercase">
          {data.address && <p>{data.address}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks
          data={data}
          className="mt-6 justify-center"
          linkClassName="h-11 border border-[#2A2118]/45 px-4 text-[0.75rem] font-semibold tracking-[0.14em] uppercase"
        />
        <PoweredBy data={data} className="mt-8 text-[#2A2118]/55" />
      </footer>
    </div>
  </div>
);
