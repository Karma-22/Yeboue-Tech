import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { cn } from "@/lib/utils/cn";
import { caveat } from "./fonts";
import { bareAmount, ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, sectionId } from "./parts";
import type { Template } from "./types";

/** Une poussière de craie, dessinée par le navigateur : aucun fichier à télécharger. */
const DUST = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 -.16'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const CHALK = "font-(family-name:--font-caveat)";

/** Un trait de craie, tiré à main levée. */
function Stroke({ className, hero = false }: { className?: string; hero?: boolean }) {
  return (
    <svg viewBox="0 0 240 16" fill="none" aria-hidden="true" className={cn("h-4", className)}>
      <path
        d="M3 9.5C38 3 71 13.5 112 7.5S196 3.5 237 9"
        stroke="var(--brand-text-dark)"
        strokeWidth="3.5"
        strokeLinecap="round"
        pathLength={hero ? 1 : undefined}
        className={hero ? "animate-draw [stroke-dasharray:1]" : undefined}
        data-draw={hero ? undefined : ""}
      />
    </svg>
  );
}

/**
 * Ardoise : le tableau noir du maquis. Tout est écrit à la craie, les prix
 * s'alignent au bout de pointillés, une rupture se raye d'un trait.
 */
export const Ardoise: Template = ({ data }) => (
  <div
    data-template="ardoise"
    data-theme="dark"
    className={cn(
      caveat.variable,
      "relative isolate min-h-dvh bg-[#1F2725] bg-[radial-gradient(ellipse_at_18%_0%,rgb(255_255_255/0.09),transparent_55%),radial-gradient(ellipse_at_90%_45%,rgb(255_255_255/0.05),transparent_50%)] pb-28 text-[#EDE9DD]",
    )}
  >
    <TemplateMotion />
    <div aria-hidden="true" style={{ backgroundImage: DUST }} className="pointer-events-none fixed inset-0 -z-10 opacity-60" />

    <div className="mx-auto max-w-2xl">
      <header className="px-6 pt-5 pb-9 text-center">
        <div className="flex min-h-9 items-center justify-between gap-3">
          {data.tableLabel ? (
            <p className={cn(CHALK, "-rotate-1 rounded-[0.6rem] border-2 border-[#EDE9DD]/60 px-3 py-0.5 text-xl")}>
              {data.tableLabel}
            </p>
          ) : (
            <span />
          )}
          <LanguageLink data={data} className="rounded-full border border-[#EDE9DD]/40" />
        </div>

        {data.logoUrl && (
          <Photo src={data.logoUrl} alt="" className="mx-auto mt-6 size-16 rounded-full ring-2 ring-[#EDE9DD]/60" />
        )}
        <p className="mt-7 animate-rise text-xs font-semibold tracking-[0.3em] text-[#EDE9DD]/60 uppercase">
          {[data.typeLabel, data.district].filter(Boolean).join(" · ")}
        </p>
        <h1
          className={cn(
            CHALK,
            "mt-3 -rotate-2 animate-rise text-[clamp(4rem,19vw,7.5rem)] leading-[0.8] font-bold text-balance [animation-delay:80ms]",
          )}
        >
          {data.name}
        </h1>
        <Stroke hero className="mx-auto mt-4 w-56" />
        {data.description && (
          <p className={cn(CHALK, "mx-auto mt-5 max-w-sm animate-rise text-2xl leading-[1.15] text-[#EDE9DD]/80 [animation-delay:160ms]")}>
            {data.description}
          </p>
        )}

        {data.coverUrl && (
          <figure className="relative mx-auto mt-10 w-64 animate-wobble bg-[#F4F1E8] p-2.5 pb-3 shadow-lg [--tilt:3deg] [animation-delay:250ms]">
            <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-[#EDE9DD]/40" />
            <Photo eager src={data.coverUrl} className="aspect-[4/3] w-full" />
            <figcaption className={cn(CHALK, "pt-2 text-xl leading-none text-[#2A2A28]")}>
              {data.hours || placeOf(data)}
            </figcaption>
          </figure>
        )}
      </header>

      <div className="sticky top-0 z-20 border-y border-dashed border-[#EDE9DD]/25 bg-[#1F2725]/95 backdrop-blur-sm">
        <CategoryNav
          categories={navOf(data)}
          offset={56}
          className="gap-1 px-4"
          linkClassName={cn(CHALK, "flex h-13 items-center px-3 text-[1.65rem] leading-none")}
          activeClassName="text-(--brand-text-dark) underline decoration-wavy decoration-2 underline-offset-[9px]"
          idleClassName="text-[#EDE9DD]/65"
        />
      </div>

      <main className="px-6">
        {data.categories.map((category) => (
          <section key={category.id} id={sectionId(category)} className="scroll-mt-16 pt-10">
            <h2 className={cn(CHALK, "text-[3.25rem] leading-none font-bold")}>{category.name}</h2>
            <Stroke className="mt-1 w-36" />
            <ul data-reveal-group="write" className="mt-4">
              {category.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <ItemTrigger item={item} className="group/item flex min-w-0 flex-1 items-center gap-3.5">
                    {item.photo && (
                      <Photo
                        src={item.photo.thumb}
                        className="size-13 shrink-0 rounded-full ring-2 ring-[#EDE9DD]/55 group-data-soldout/item:opacity-40 group-data-soldout/item:grayscale"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2.5">
                        <span
                          className={cn(
                            CHALK,
                            "text-[1.8rem] leading-none font-semibold decoration-[3px] group-data-soldout/item:text-[#EDE9DD]/50 group-data-soldout/item:line-through",
                          )}
                        >
                          {item.name}
                        </span>
                        <span aria-hidden="true" className="min-w-4 flex-1 border-b-[3px] border-dotted border-[#EDE9DD]/25" />
                        <span className={cn(CHALK, "shrink-0 text-[1.8rem] leading-none font-bold text-(--brand-text-dark) tabular-nums")}>
                          {item.available ? bareAmount(item) : data.labels.soldOut}
                        </span>
                      </span>
                      {item.description && (
                        <span className="mt-1.5 block text-sm leading-snug text-[#EDE9DD]/60">{item.description}</span>
                      )}
                    </span>
                  </ItemTrigger>
                  <QuickAdd item={item} className="size-10 border-2 border-[#EDE9DD]/70 bg-transparent text-[#EDE9DD]" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <footer data-reveal="fade" className="mx-5 mt-14 rounded-[1.5rem] border-2 border-dashed border-[#EDE9DD]/30 px-6 py-8 text-center">
        <p className={cn(CHALK, "-rotate-2 text-[2.75rem] leading-none font-bold")}>{data.labels.thanks} !</p>
        <div className="mt-5 grid gap-1 text-sm text-[#EDE9DD]/70">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks
          data={data}
          className="mt-6 justify-center"
          linkClassName="h-11 rounded-full border-2 border-[#EDE9DD]/55 px-4 text-sm font-semibold"
        />
        <PoweredBy data={data} className="mt-7 text-[#EDE9DD]/50" />
      </footer>
    </div>
  </div>
);
