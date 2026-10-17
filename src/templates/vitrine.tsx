import { ChevronDown } from "lucide-react";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { Reel } from "@/components/public/reel";
import { ContactLinks, LanguageLink, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template, TemplateData, TemplateItem } from "./types";

const two = (value: number) => String(value).padStart(2, "0");
const HIDDEN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Une image de la suite : la photo en plein écran, le nom et le prix posés dessus. */
function Slide({ item, data }: { item: TemplateItem; data: TemplateData }) {
  return (
    <>
      {item.photo ? (
        <Photo
          src={item.photo.large}
          className="absolute inset-0 size-full group-data-active/slide:animate-kenburns"
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden bg-(--brand-deep)">
          <div className="absolute -top-24 -right-24 size-96 rounded-full bg-(--brand) opacity-45 blur-3xl" />
          <span
            aria-hidden="true"
            className="absolute top-[18%] left-5 font-display text-[16rem] leading-none font-extrabold text-transparent [-webkit-text-stroke:2px_var(--brand-text-dark)]"
          >
            {item.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-black/45" />

      <div className="absolute inset-x-0 bottom-0 flex translate-y-5 items-end gap-4 p-6 pb-24 opacity-0 transition-[translate,opacity] duration-500 ease-emphasized group-data-active/slide:translate-y-0 group-data-active/slide:opacity-100">
        <ItemTrigger item={item} className="min-w-0 flex-1">
          {!item.available && (
            <span className="mb-3 inline-block bg-white px-2.5 py-1 text-xs font-bold tracking-[0.16em] text-black uppercase">
              {data.labels.soldOut}
            </span>
          )}
          <span className="block font-display text-[2.5rem] leading-[0.95] font-bold tracking-[-0.02em] text-balance">
            {item.name}
          </span>
          {item.description && (
            <span className="mt-2.5 line-clamp-3 leading-snug text-white/80">{item.description}</span>
          )}
          <span className="mt-4 inline-flex h-10 items-center rounded-full bg-(--brand) px-4 font-display text-lg font-bold text-(--on-brand) tabular-nums">
            {priceOf(item)}
          </span>
        </ItemTrigger>
        <QuickAdd item={item} className="size-14 ring-4 ring-white/25" />
      </div>
    </>
  );
}

/**
 * Vitrine : la carte en plein écran. On descend d'une catégorie à l'autre, et
 * dans chaque catégorie on feuillette les plats de gauche à droite, une photo
 * à la fois. Sur ordinateur, la page garde la forme d'un téléphone.
 */
export const Vitrine: Template = ({ data }) => (
  <div data-template="vitrine" data-theme="dark" className="relative isolate grid h-(--screen,100dvh) place-items-center overflow-hidden bg-[#0B0B0C] text-white">
    {data.coverUrl && (
      <Photo src={data.coverUrl} className="absolute inset-0 -z-10 hidden size-full scale-110 opacity-35 blur-3xl sm:block" />
    )}

    <div className={`h-(--screen,100dvh) w-full max-w-[30rem] snap-y snap-mandatory overflow-y-auto overscroll-y-contain ${HIDDEN_SCROLLBAR}`}>
      <section className="relative isolate flex h-(--screen,100dvh) snap-start flex-col justify-between overflow-hidden p-6">
        {data.coverUrl ? (
          <Photo eager src={data.coverUrl} className="absolute inset-0 -z-20 size-full animate-kenburns" />
        ) : (
          <div className="absolute inset-0 -z-20 bg-(--brand-deep)" />
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/30 to-black/45" />

        <div className="flex items-center justify-between gap-3">
          {data.logoUrl ? (
            <Photo src={data.logoUrl} alt="" className="size-12 rounded-full ring-2 ring-white/70" />
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {data.tableLabel && (
              <p className="flex h-9 items-center rounded-full bg-white px-3.5 text-sm font-semibold text-black">
                {data.tableLabel}
              </p>
            )}
            <LanguageLink data={data} className="rounded-full bg-black/40 backdrop-blur-sm" />
          </div>
        </div>

        <div className="pb-16">
          <p className="animate-rise text-xs font-bold tracking-[0.22em] text-(--brand-text-dark) uppercase">
            {[data.typeLabel, data.district].filter(Boolean).join(" · ")}
          </p>
          <h1 className="mt-3 animate-rise font-display text-[clamp(3rem,15vw,4.75rem)] leading-[0.9] font-bold tracking-[-0.03em] text-balance [animation-delay:90ms] [font-stretch:90%]">
            {data.name}
          </h1>
          {data.description && (
            <p className="mt-4 animate-rise leading-snug text-white/80 [animation-delay:180ms]">{data.description}</p>
          )}
          <p className="mt-8 flex items-center gap-2 text-sm font-semibold">
            <span className="grid size-9 animate-nudge place-items-center rounded-full bg-(--brand) text-(--on-brand)">
              <ChevronDown aria-hidden="true" className="size-5" />
            </span>
            {data.labels.menu}
          </p>
        </div>
      </section>

      {data.categories.map((category, index) => (
        <section key={category.id} id={sectionId(category)} className="h-(--screen,100dvh) snap-start">
          <Reel
            label={
              <p className="flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] uppercase">
                <span className="text-(--brand-text-dark)">
                  {two(index + 1)}/{two(data.categories.length)}
                </span>
                {category.name}
              </p>
            }
            slides={category.items.map((item) => (
              <Slide key={item.id} item={item} data={data} />
            ))}
          />
        </section>
      ))}

      <section className="flex min-h-(--screen,100dvh) snap-start flex-col justify-center bg-(--brand-deep) p-8 pb-32">
        <p className="font-display text-[2.75rem] leading-[0.95] font-bold tracking-[-0.02em]">{data.labels.thanks}.</p>
        <p className="mt-3 text-lg font-semibold text-(--brand-text-dark)">{data.name}</p>
        <div className="mt-6 grid gap-1 text-white/75">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks
          data={data}
          className="mt-7"
          linkClassName="h-11 rounded-full border border-white/30 px-4 text-sm font-semibold"
        />
        <PoweredBy data={data} className="mt-10 text-white/45" />
      </section>
    </div>
  </div>
);
