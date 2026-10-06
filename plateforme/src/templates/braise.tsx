import { Clock, MapPin } from "lucide-react";
import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template } from "./types";

/**
 * Braise : une couverture généreuse, puis les plats en grandes cartes photo.
 * Les articles sans photo suivent, en liste, sous les cartes de leur catégorie.
 */
export const Braise: Template = ({ data }) => (
  <div data-template="braise" data-theme="light" className="min-h-dvh bg-[#FBF7F0] pb-28 text-[#1B1612]">
    <TemplateMotion />

    <header className="relative isolate flex min-h-[26rem] flex-col justify-between overflow-hidden bg-(--brand-deep) px-5 pt-5 pb-14 text-white sm:min-h-[30rem] sm:px-10">
      {data.coverUrl && (
        <div data-parallax="0.16" className="absolute inset-x-0 -top-[20%] -z-20 h-[120%]">
          <Photo eager src={data.coverUrl} className="size-full animate-kenburns" />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/35 to-black/25" />

      <div className="flex items-center justify-between gap-3">
        {data.logoUrl ? (
          <Photo src={data.logoUrl} alt={data.name} className="size-12 rounded-full ring-2 ring-white/80" />
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          {data.tableLabel && (
            <p className="flex h-9 items-center gap-2 rounded-full bg-white/95 px-3.5 text-sm font-semibold text-[#1B1612]">
              <span className="size-2 rounded-full bg-(--brand)" />
              {data.tableLabel}
            </p>
          )}
          <LanguageLink data={data} className="rounded-full bg-black/35 text-white backdrop-blur-sm" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <p className="inline-flex h-7 animate-rise items-center rounded-full bg-(--brand) px-3 text-xs font-bold tracking-[0.08em] text-(--on-brand) uppercase">
          {[data.typeLabel, data.district].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-4 animate-rise font-display text-[clamp(2.75rem,12vw,5.5rem)] leading-[0.92] font-bold tracking-[-0.025em] text-balance [animation-delay:90ms] [font-stretch:92%]">
          {data.name}
        </h1>
        {data.description && (
          <p className="mt-4 max-w-md animate-rise text-[1.0625rem] leading-snug text-white/85 [animation-delay:180ms]">
            {data.description}
          </p>
        )}
      </div>
    </header>

    <div className="relative -mt-7 rounded-t-[1.75rem] bg-[#FBF7F0]">
      <div className="sticky top-0 z-20 rounded-t-[1.75rem] bg-[#FBF7F0]/92 backdrop-blur-md">
        <CategoryNav
          categories={navOf(data)}
          className="mx-auto max-w-5xl gap-2 px-5 py-3.5 sm:px-10"
          linkClassName="flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors"
          activeClassName="bg-[#1B1612] text-[#FBF7F0]"
          idleClassName="bg-[#1B1612]/7 text-[#1B1612]/75"
        />
      </div>

      <main className="mx-auto max-w-5xl px-5 sm:px-10">
        {data.categories.map((category) => {
          const withPhoto = category.items.filter((item) => item.photo);
          const plain = category.items.filter((item) => !item.photo);
          return (
            <section key={category.id} id={sectionId(category)} className="scroll-mt-20 pt-9">
              <h2 className="flex items-baseline gap-3 font-display text-[2rem] leading-none font-bold tracking-[-0.02em]">
                {category.name}
                <span className="h-1.5 w-9 translate-y-[-0.2em] rounded-full bg-(--brand)" />
              </h2>

              {withPhoto.length > 0 && (
                <ul data-reveal-group="up" className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {withPhoto.map((item) => (
                    <li
                      key={item.id}
                      className="group relative overflow-hidden rounded-[1.25rem] bg-white shadow-sm ring-1 ring-[#1B1612]/6"
                    >
                      <ItemTrigger item={item} className="group/item block w-full data-soldout:opacity-60">
                        <span className="relative block aspect-[16/11] overflow-hidden bg-[#1B1612]/6">
                          <Photo
                            src={item.photo!.thumb}
                            className="size-full transition-transform duration-700 ease-emphasized group-hover:scale-105 group-data-soldout/item:grayscale"
                          />
                          {!item.available && (
                            <span className="absolute top-3 left-3 rounded-full bg-[#1B1612] px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                              {data.labels.soldOut}
                            </span>
                          )}
                        </span>
                        <span className="block p-4 pr-16">
                          <span className="block font-display text-[1.1875rem] leading-tight font-bold tracking-[-0.01em]">
                            {item.name}
                          </span>
                          {item.description && (
                            <span className="mt-1 line-clamp-2 text-sm leading-snug text-[#1B1612]/65">
                              {item.description}
                            </span>
                          )}
                          <span className="mt-2.5 block font-display text-lg font-bold text-(--brand-text) tabular-nums">
                            {priceOf(item)}
                          </span>
                        </span>
                      </ItemTrigger>
                      <QuickAdd item={item} className="absolute right-4 bottom-4 size-11 shadow-md" />
                    </li>
                  ))}
                </ul>
              )}

              {plain.length > 0 && (
                <ul data-reveal-group="up" className="mt-4 overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-[#1B1612]/6">
                  {plain.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 border-b border-[#1B1612]/8 pr-4 last:border-b-0">
                      <ItemTrigger item={item} className="min-w-0 flex-1 py-3.5 pl-4 data-soldout:opacity-50">
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="font-semibold">{item.name}</span>
                          <span className="shrink-0 font-display font-bold text-(--brand-text) tabular-nums">
                            {item.available ? priceOf(item) : data.labels.soldOut}
                          </span>
                        </span>
                        {item.description && (
                          <span className="mt-0.5 line-clamp-2 block text-sm leading-snug text-[#1B1612]/60">
                            {item.description}
                          </span>
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

      <footer data-reveal="up" className="mx-auto mt-14 max-w-5xl px-3 sm:px-10">
        <div className="rounded-[1.75rem] bg-[#1B1612] p-7 text-[#FBF7F0] sm:p-10">
          <p className="font-display text-3xl leading-none font-bold tracking-[-0.02em]">{data.name}</p>
          <dl className="mt-6 grid gap-4 text-[0.9375rem] sm:grid-cols-2">
            {(data.address || placeOf(data)) && (
              <div className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-(--brand-text-dark)" />
                <div>
                  <dt className="sr-only">{data.labels.address}</dt>
                  <dd className="text-[#FBF7F0]/85">{data.address || placeOf(data)}</dd>
                </div>
              </div>
            )}
            {data.hours && (
              <div className="flex gap-3">
                <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-(--brand-text-dark)" />
                <div>
                  <dt className="sr-only">{data.labels.hours}</dt>
                  <dd className="text-[#FBF7F0]/85">{data.hours}</dd>
                </div>
              </div>
            )}
          </dl>
          <ContactLinks
            data={data}
            className="mt-7"
            linkClassName="h-11 rounded-full bg-[#FBF7F0]/10 px-4 text-sm font-semibold transition-colors hover:bg-[#FBF7F0]/18"
          />
          <PoweredBy data={data} className="mt-8 text-[#FBF7F0]/55" />
        </div>
      </footer>
    </div>
  </div>
);
