import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { cn } from "@/lib/utils/cn";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template } from "./types";

const two = (value: number) => String(value).padStart(2, "0");

/**
 * Magazine : la carte mise en page comme une revue. Un titre immense, des
 * rubriques numérotées en chiffres creux, un plat à la une par rubrique, puis
 * les autres, photo à gauche, photo à droite.
 */
export const Magazine: Template = ({ data }) => (
  <div data-template="magazine" data-theme="light" className="min-h-dvh bg-[#F7F5F0] text-[#111111]">
    <TemplateMotion />

    <header className="mx-auto max-w-5xl px-5 pt-5 sm:px-10">
      <div className="flex min-h-9 items-center justify-between gap-3 border-b-2 border-[#111111] pb-3 text-[0.6875rem] font-bold tracking-[0.18em] uppercase">
        <span>{[data.typeLabel, data.district, data.city].filter(Boolean).join(" — ")}</span>
        <span className="flex shrink-0 items-center gap-2">
          {data.tableLabel && <span className="bg-[#111111] px-2 py-1.5 leading-none text-[#F7F5F0]">{data.tableLabel}</span>}
          <LanguageLink data={data} className="h-7 border-2 border-[#111111] px-2 text-[0.6875rem]" />
        </span>
      </div>
      <h1 className="mt-6 animate-rise font-display text-[clamp(3.5rem,19vw,10rem)] leading-[0.82] font-extrabold tracking-[-0.045em] [overflow-wrap:anywhere] [font-stretch:88%]">
        {data.name}
      </h1>
      <div className="mt-7 grid gap-5 sm:grid-cols-[1fr_2fr] sm:items-end">
        <span className="block h-2 w-24 bg-(--brand)" />
        {data.description && (
          <p className="max-w-xl animate-rise text-xl leading-snug font-medium text-pretty [animation-delay:120ms]">
            {data.description}
          </p>
        )}
      </div>
    </header>

    {data.coverUrl && (
      <figure className="mx-auto mt-8 max-w-5xl sm:px-10">
        <div className="aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
          <Photo eager src={data.coverUrl} className="size-full animate-curtain" />
        </div>
        <figcaption className="flex justify-between gap-4 px-5 pt-2.5 text-xs text-[#111111]/60 sm:px-0">
          <span>{data.address || placeOf(data)}</span>
          <span className="text-right">{data.hours}</span>
        </figcaption>
      </figure>
    )}

    <div className="sticky top-0 z-20 mt-8 border-y border-[#111111]/15 bg-[#F7F5F0]/95 backdrop-blur-sm">
      <CategoryNav
        categories={navOf(data).map((category, index) => ({ ...category, name: `${two(index + 1)}  ${category.name}` }))}
        offset={52}
        className="mx-auto max-w-5xl gap-7 px-5 sm:px-10"
        linkClassName="flex h-12 items-center border-b-[3px] text-sm font-bold whitespace-pre"
        activeClassName="border-(--brand)"
        idleClassName="border-transparent text-[#111111]/50"
      />
    </div>

    <main>
      {data.categories.map((category, index) => {
        const lead = category.items.find((item) => item.photo && item.available) ?? null;
        const others = category.items.filter((item) => item !== lead);
        return (
          <section key={category.id} id={sectionId(category)} className="scroll-mt-14 overflow-hidden pt-12">
            <div className="mx-auto max-w-5xl px-5 sm:px-10">
              <span
                aria-hidden="true"
                data-parallax="-0.1"
                className="block font-display text-[clamp(7rem,38vw,15rem)] leading-[0.78] font-extrabold tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_#111111] [font-stretch:80%]"
              >
                {two(index + 1)}
              </span>
              <h2 className="mt-3 flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase">
                <span className="h-0.5 w-10 bg-(--brand)" />
                {category.name}
              </h2>
            </div>

            {lead && (
              <article className="mx-auto mt-7 max-w-5xl sm:px-10">
                <ItemTrigger item={lead} className="block w-full">
                  <span data-reveal="clip" className="block aspect-[4/3] overflow-hidden sm:aspect-[2/1]">
                    <Photo src={lead.photo!.large} className="size-full" />
                  </span>
                  <span className="block px-5 pt-4 sm:px-0">
                    <span className="block font-display text-[2.5rem] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance">
                      {lead.name}
                    </span>
                    {lead.description && (
                      <span className="mt-2 block max-w-xl text-[1.0625rem] leading-snug text-[#111111]/70">
                        {lead.description}
                      </span>
                    )}
                  </span>
                </ItemTrigger>
                <div className="mx-5 mt-4 flex items-center justify-between border-t-2 border-[#111111] pt-3 sm:mx-0">
                  <span className="font-display text-2xl font-extrabold tabular-nums">{priceOf(lead)}</span>
                  <QuickAdd item={lead} className="size-11 rounded-none" />
                </div>
              </article>
            )}

            <ul className="mx-auto mt-6 grid max-w-5xl gap-x-12 px-5 sm:grid-cols-2 sm:px-10">
              {others.map((item, position) => (
                <li key={item.id} data-reveal="up" className="flex items-center gap-3 border-t border-[#111111]/20">
                  <ItemTrigger
                    item={item}
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-4 py-5 data-soldout:opacity-45",
                      position % 2 === 1 && "flex-row-reverse",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[1.375rem] leading-none font-extrabold tracking-[-0.02em]">
                        {item.name}
                      </span>
                      {item.description && (
                        <span className="mt-1.5 line-clamp-3 text-sm leading-snug text-[#111111]/65">
                          {item.description}
                        </span>
                      )}
                      <span className="mt-2 block font-bold tabular-nums">
                        {item.available ? priceOf(item) : data.labels.soldOut}
                      </span>
                    </span>
                    {item.photo && (
                      <span className="block size-26 shrink-0 overflow-hidden">
                        <Photo src={item.photo.thumb} className="size-full" />
                      </span>
                    )}
                  </ItemTrigger>
                  <QuickAdd item={item} className="rounded-none" />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>

    <footer className="mt-16 bg-[#111111] pb-28 text-[#F7F5F0]">
      <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-10">
        <p
          data-reveal="up"
          className="font-display text-[clamp(3rem,16vw,8rem)] leading-[0.84] font-extrabold tracking-[-0.045em] [overflow-wrap:anywhere] [font-stretch:88%]"
        >
          {data.name}
        </p>
        <div className="mt-8 grid gap-6 border-t-2 border-[#F7F5F0] pt-5 text-sm sm:grid-cols-3">
          {(data.address || placeOf(data)) && (
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.18em] text-[#F7F5F0]/50 uppercase">{data.labels.address}</p>
              <p className="mt-1.5">{data.address || placeOf(data)}</p>
            </div>
          )}
          {data.hours && (
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.18em] text-[#F7F5F0]/50 uppercase">{data.labels.hours}</p>
              <p className="mt-1.5">{data.hours}</p>
            </div>
          )}
          <ContactLinks
            data={data}
            className="flex-col items-start gap-2"
            linkClassName="font-semibold underline underline-offset-4"
          />
        </div>
        <PoweredBy data={data} className="mt-8 text-[#F7F5F0]/50" />
      </div>
    </footer>
  </div>
);
