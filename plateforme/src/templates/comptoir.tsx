import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { cn } from "@/lib/utils/cn";
import { syne } from "./fonts";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template } from "./types";

const WIDE = "font-(family-name:--font-syne)";

/**
 * Comptoir : la nuit. Fond sombre, halos de la couleur du lieu, nom en grandes
 * capitales dont le dernier mot n'est qu'un contour, et les cocktails en
 * hautes cartes qui glissent sous le pouce.
 */
export const Comptoir: Template = ({ data }) => {
  const words = data.name.trim().split(/\s+/);
  const outlined = words.length > 1 ? words.pop() : null;
  // La bande qui défile : les catégories, répétées assez pour remplir un grand écran.
  const band = Array.from({ length: 4 }).flatMap(() => data.categories.map((category) => category.name));

  return (
    <div
      data-template="comptoir"
      data-theme="dark"
      className={cn(syne.variable, "min-h-dvh bg-[#0A0A0F] pb-28 text-[#F2EFEA]")}
    >
      <TemplateMotion />

      <header className="relative isolate overflow-hidden px-5 pt-5 pb-9 sm:px-10">
        {data.coverUrl && (
          <Photo eager src={data.coverUrl} className="absolute inset-0 -z-30 size-full animate-kenburns opacity-60" />
        )}
        <div className="absolute inset-0 -z-20 bg-linear-to-b from-[#0A0A0F]/30 via-[#0A0A0F]/65 to-[#0A0A0F]" />
        <div aria-hidden="true" className="absolute -top-28 -left-24 -z-10 size-80 animate-glow rounded-full bg-(--brand) blur-3xl" />
        <div
          aria-hidden="true"
          className="absolute top-44 -right-28 -z-10 size-72 animate-glow rounded-full bg-(--brand) blur-3xl [animation-delay:-3.5s]"
        />

        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          {data.logoUrl ? (
            <Photo src={data.logoUrl} alt="" className="size-12 rounded-full ring-1 ring-white/40" />
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {data.tableLabel && (
              <p className="flex h-9 items-center rounded-full border border-white/25 bg-black/40 px-3.5 text-sm font-semibold backdrop-blur-sm">
                {data.tableLabel}
              </p>
            )}
            <LanguageLink data={data} className="rounded-full border border-white/25 bg-black/40 backdrop-blur-sm" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl pt-[26svh]">
          <p className="flex animate-rise items-center gap-2.5 text-xs font-semibold tracking-[0.24em] text-(--brand-text-dark) uppercase">
            <span className="size-1.5 animate-live rounded-full bg-current" />
            {[data.typeLabel, data.district].filter(Boolean).join(" · ")}
          </p>
          <h1
            className={cn(
              WIDE,
              "mt-4 text-[clamp(2.25rem,11.5vw,6rem)] leading-[0.88] font-extrabold tracking-[-0.03em] [overflow-wrap:anywhere] uppercase",
            )}
          >
            <span className="block animate-rise [animation-delay:80ms]">{words.join(" ")}</span>
            {outlined && (
              <span className="block animate-rise text-transparent [-webkit-text-stroke:1.5px_var(--brand-text-dark)] [animation-delay:170ms]">
                {outlined}
              </span>
            )}
          </h1>
          {data.description && (
            <p className="mt-5 max-w-md animate-rise leading-snug text-white/75 [animation-delay:260ms]">
              {data.description}
            </p>
          )}
          {data.hours && <p className="mt-4 text-sm font-semibold text-white/55">{data.hours}</p>}
        </div>
      </header>

      <div aria-hidden="true" className="overflow-hidden border-y border-white/10 py-3.5">
        <div className={cn(WIDE, "flex w-max animate-marquee text-sm font-bold tracking-[0.3em] text-white/40 uppercase")}>
          {[...band, ...band].map((name, index) => (
            <span key={index} className="flex items-center gap-7 pr-7">
              {name}
              <span className="text-(--brand-text-dark)">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0A0A0F]/88 backdrop-blur-md">
        <CategoryNav
          categories={navOf(data)}
          offset={56}
          className="mx-auto max-w-5xl gap-7 px-5 sm:px-10"
          linkClassName="flex h-13 items-center border-b-2 text-[0.8125rem] font-bold tracking-[0.16em] uppercase"
          activeClassName="border-(--brand) text-white"
          idleClassName="border-transparent text-white/50"
        />
      </div>

      <main>
        {data.categories.map((category) => {
          const withPhoto = category.items.filter((item) => item.photo);
          const plain = category.items.filter((item) => !item.photo);
          return (
            <section key={category.id} id={sectionId(category)} className="scroll-mt-16 pt-10">
              <div className="mx-auto flex max-w-5xl items-end justify-between gap-4 px-5 sm:px-10">
                <h2 className={cn(WIDE, "text-[2rem] leading-none font-extrabold tracking-[-0.02em] uppercase")}>
                  {category.name}
                </h2>
                <span className="text-sm font-semibold text-(--brand-text-dark) tabular-nums">
                  {String(category.items.length).padStart(2, "0")}
                </span>
              </div>

              {withPhoto.length > 0 && (
                <ul
                  data-reveal-group="right"
                  className="mx-auto mt-5 flex max-w-5xl snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:scroll-px-10 sm:px-10 [&::-webkit-scrollbar]:hidden"
                >
                  {withPhoto.map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        "group relative shrink-0 snap-start overflow-hidden rounded-[1.25rem] bg-white/5",
                        // Seule de sa rangée, la carte s'élargit plutôt que de laisser un vide à côté d'elle.
                        withPhoto.length === 1 ? "aspect-[16/11] w-full sm:max-w-xl" : "aspect-[3/4] w-[66vw] max-w-64",
                      )}
                    >
                      <ItemTrigger item={item} className="group/item absolute inset-0 block size-full">
                        <Photo
                          src={item.photo!.thumb}
                          className="size-full transition-transform duration-700 ease-emphasized group-hover:scale-105 group-data-soldout/item:opacity-50 group-data-soldout/item:grayscale"
                        />
                        <span className="absolute inset-0 bg-linear-to-t from-black/90 via-black/15 to-transparent" />
                        {!item.available && (
                          <span className="absolute top-4 left-4 -rotate-6 border-2 border-white/80 px-2.5 py-1 text-xs font-bold tracking-[0.2em] uppercase">
                            {data.labels.soldOut}
                          </span>
                        )}
                        <span className="absolute inset-x-4 bottom-4 block pr-12">
                          <span className={cn(WIDE, "block text-[1.25rem] leading-[1.05] font-bold")}>{item.name}</span>
                          <span className="mt-1.5 block font-semibold text-(--brand-text-dark) tabular-nums">
                            {priceOf(item)}
                          </span>
                        </span>
                      </ItemTrigger>
                      <QuickAdd item={item} className="absolute right-3.5 bottom-3.5 size-11" />
                    </li>
                  ))}
                </ul>
              )}

              {plain.length > 0 && (
                <ul data-reveal-group="up" className="mx-auto mt-3 max-w-5xl px-5 sm:px-10">
                  {plain.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 border-t border-white/10 first:border-t-0">
                      <ItemTrigger item={item} className="min-w-0 flex-1 py-4 data-soldout:opacity-45">
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="font-semibold">{item.name}</span>
                          <span className="shrink-0 font-semibold text-(--brand-text-dark) tabular-nums">
                            {item.available ? priceOf(item) : data.labels.soldOut}
                          </span>
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block text-sm leading-snug text-white/55">{item.description}</span>
                        )}
                      </ItemTrigger>
                      <QuickAdd item={item} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </main>

      <footer data-reveal="up" className="mx-auto mt-16 max-w-5xl border-t border-white/10 px-5 pt-10 sm:px-10">
        <p
          className={cn(
            WIDE,
            "text-[clamp(2rem,10vw,4.5rem)] leading-[0.9] font-extrabold text-transparent uppercase [-webkit-text-stroke:1px_rgb(255_255_255/0.4)] [overflow-wrap:anywhere]",
          )}
        >
          {data.name}
        </p>
        <div className="mt-6 grid gap-1 text-sm text-white/65">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks
          data={data}
          className="mt-6"
          linkClassName="h-11 rounded-full border border-white/20 px-4 text-sm font-semibold transition-colors hover:border-(--brand-text-dark)"
        />
        <PoweredBy data={data} className="mt-8 text-white/40" />
      </footer>
    </div>
  );
};
