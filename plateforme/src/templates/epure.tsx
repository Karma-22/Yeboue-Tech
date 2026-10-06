import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template } from "./types";

/**
 * Épure : presque rien. Une liste nette, une seule touche de couleur, aucune
 * animation à télécharger : c'est le modèle le plus rapide à lire et à charger.
 */
export const Epure: Template = ({ data }) => (
  <div data-template="epure" data-theme="light" className="min-h-dvh bg-white pb-28 text-[#16181D]">
    <div className="mx-auto max-w-xl">
      <header className="px-5 pt-6 pb-5">
        <div className="flex min-h-8 items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-[#16181D]/60">
            <span className="size-2 rounded-full bg-(--brand)" />
            {[data.typeLabel, placeOf(data)].filter(Boolean).join(" · ")}
          </p>
          <LanguageLink data={data} className="h-8 rounded-full border border-[#16181D]/15 text-xs" />
        </div>
        <div className="mt-5 flex animate-rise items-center gap-3.5">
          {data.logoUrl && <Photo src={data.logoUrl} alt="" className="size-12 shrink-0 rounded-full" />}
          <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em]">{data.name}</h1>
        </div>
        {data.description && (
          <p className="mt-2 text-[0.9375rem] leading-snug text-[#16181D]/65">{data.description}</p>
        )}
        {data.tableLabel && (
          <p className="mt-4 inline-flex h-8 items-center rounded-full bg-(--brand-soft) px-3 text-sm font-medium text-(--brand-text)">
            {data.tableLabel}
          </p>
        )}
      </header>

      <div className="sticky top-0 z-20 border-b border-[#16181D]/10 bg-white/95 backdrop-blur-sm">
        <CategoryNav
          categories={navOf(data)}
          offset={48}
          className="gap-6 px-5"
          linkClassName="flex h-12 items-center border-b-2 text-[0.9375rem]"
          activeClassName="border-(--brand) font-semibold"
          idleClassName="border-transparent text-[#16181D]/55"
        />
      </div>

      <main className="px-5">
        {data.categories.map((category) => (
          <section key={category.id} id={sectionId(category)} className="scroll-mt-14 pt-7">
            <h2 className="pb-1 text-xs font-semibold tracking-[0.14em] text-[#16181D]/50 uppercase">{category.name}</h2>
            <ul>
              {category.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 border-b border-[#16181D]/8 last:border-b-0">
                  <ItemTrigger item={item} className="flex min-w-0 flex-1 items-start gap-3 py-3.5 data-soldout:opacity-45">
                    <span className="min-w-0 flex-1">
                      <span className="block leading-snug font-medium">{item.name}</span>
                      {item.description && (
                        <span className="mt-0.5 line-clamp-2 text-sm leading-snug text-[#16181D]/60">
                          {item.description}
                        </span>
                      )}
                      <span className="mt-1 block text-[0.9375rem] font-medium tabular-nums">
                        {item.available ? priceOf(item) : data.labels.soldOut}
                      </span>
                    </span>
                    {item.photo && <Photo src={item.photo.thumb} className="size-14 shrink-0 rounded-[0.6rem]" />}
                  </ItemTrigger>
                  <QuickAdd item={item} className="size-8" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <footer className="mx-5 mt-10 border-t border-[#16181D]/10 pt-6 text-sm leading-relaxed text-[#16181D]/65">
        <p className="font-semibold text-[#16181D]">{data.name}</p>
        {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
        {data.hours && <p>{data.hours}</p>}
        <ContactLinks
          data={data}
          className="mt-3 gap-x-5"
          linkClassName="font-medium text-[#16181D] underline underline-offset-4"
        />
        <PoweredBy data={data} className="mt-6 text-[#16181D]/45" />
      </footer>
    </div>
  </div>
);
