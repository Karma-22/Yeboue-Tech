import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { cn } from "@/lib/utils/cn";
import { anton } from "./fonts";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "./parts";
import type { Template } from "./types";

const POSTER = "font-(family-name:--font-anton)";

/** Une rangée de dents de scie, qui prolonge un aplat de couleur vers le bas ou vers le haut. */
function Teeth({ direction }: { direction: "down" | "up" }) {
  const [first, second, position] =
    direction === "down" ? ["135deg", "225deg", "-12px 0"] : ["45deg", "315deg", "-12px -12px"];
  return (
    <div
      aria-hidden="true"
      className="h-3"
      style={{
        background: `linear-gradient(${first}, var(--brand) 25%, transparent 25%) ${position} / 24px 24px repeat-x, linear-gradient(${second}, var(--brand) 25%, transparent 25%) ${position} / 24px 24px repeat-x`,
      }}
    />
  );
}

/**
 * Marché : l'affiche du marché. Un grand aplat de la couleur du lieu, des
 * capitales serrées, des étiquettes collées de travers, des cartes au contour
 * épais et des prix sur étiquette.
 */
export const Marche: Template = ({ data }) => {
  const band = Array.from({ length: 3 }).flatMap(() => [data.name, ...data.categories.map((category) => category.name)]);

  return (
    <div data-template="marche" data-theme="light" className={cn(anton.variable, "min-h-dvh bg-[#FFF8EA] text-[#141414]")}>
      <TemplateMotion />

      <header className="bg-(--brand) px-5 pt-5 pb-9 text-(--on-brand) sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-9 items-center justify-between gap-3">
            {data.logoUrl ? (
              <Photo src={data.logoUrl} alt="" className="size-12 rounded-full border-[3px] border-(--on-brand)" />
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              {data.tableLabel && (
                <p className="flex h-9 items-center rounded-full border-[2.5px] border-(--on-brand) px-3.5 text-sm font-bold">
                  {data.tableLabel}
                </p>
              )}
              <LanguageLink data={data} className="rounded-full border-[2.5px] border-(--on-brand) font-bold" />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                POSTER,
                "animate-wobble border-[3px] border-[#141414] bg-[#FFF8EA] px-3 py-1 text-lg leading-tight text-[#141414] uppercase shadow-[3px_3px_0_#141414] [--tilt:-5deg]",
              )}
            >
              {data.typeLabel}
            </span>
            {data.district && (
              <span
                className={cn(
                  POSTER,
                  "animate-wobble rounded-full bg-[#141414] px-4 py-1.5 text-lg leading-tight text-[#FFF8EA] uppercase [--tilt:4deg] [animation-delay:130ms]",
                )}
              >
                {data.district}
              </span>
            )}
          </div>
          <h1 className={cn(POSTER, "mt-5 animate-rise text-[clamp(4rem,23vw,11rem)] leading-[0.88] [overflow-wrap:anywhere] uppercase")}>
            {data.name}
          </h1>
          {data.description && (
            <p className="mt-4 max-w-md animate-rise text-lg leading-snug font-semibold [animation-delay:120ms]">
              {data.description}
            </p>
          )}
          {data.coverUrl && (
            <div className="mt-8 animate-wobble overflow-hidden rounded-[1.1rem] border-[3px] border-(--on-brand) shadow-[6px_6px_0_var(--on-brand)] [--tilt:1.5deg] [animation-delay:240ms]">
              <Photo eager src={data.coverUrl} className="aspect-[16/10] w-full sm:aspect-[21/9]" />
            </div>
          )}
        </div>
      </header>
      <Teeth direction="down" />

      <div aria-hidden="true" className="mt-5 overflow-hidden bg-[#141414] py-2.5 text-[#FFF8EA]">
        <div className={cn(POSTER, "flex w-max animate-marquee text-xl uppercase")}>
          {[...band, ...band].map((name, index) => (
            <span key={index} className="flex items-center gap-5 pr-5">
              {name}
              <span className="text-(--brand-text-dark)">★</span>
            </span>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-20 border-b-[3px] border-[#141414] bg-[#FFF8EA]/95 backdrop-blur-sm">
        <CategoryNav
          categories={navOf(data)}
          offset={68}
          className="mx-auto max-w-5xl gap-2 px-5 py-3 sm:px-10"
          linkClassName="flex h-10 items-center rounded-full border-2 border-[#141414] px-4 text-sm font-bold uppercase"
          activeClassName="bg-[#141414] text-[#FFF8EA]"
          idleClassName="bg-white"
        />
      </div>

      <main>
        {data.categories.map((category) => (
          <section key={category.id} id={sectionId(category)} className="scroll-mt-20 pt-10">
            <h2 className={cn(POSTER, "mx-auto flex max-w-5xl items-center gap-3 px-5 text-[3rem] leading-none uppercase sm:px-10")}>
              <span className="text-(--brand-text)">✦</span>
              {category.name}
              <span className="h-[3px] min-w-6 flex-1 bg-[#141414]" />
            </h2>
            <ul
              data-reveal-group="pop"
              className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-x-3.5 gap-y-5 px-5 sm:grid-cols-3 sm:px-10 lg:grid-cols-4"
            >
              {category.items.map((item) => (
                <li key={item.id} className="relative">
                  <ItemTrigger
                    item={item}
                    className="flex size-full flex-col overflow-hidden rounded-[1.1rem] border-[3px] border-[#141414] bg-white shadow-[4px_4px_0_#141414] transition-transform active:translate-x-0.5 active:translate-y-0.5 data-soldout:opacity-55"
                  >
                    {item.photo ? (
                      <Photo src={item.photo.thumb} className="aspect-square w-full border-b-[3px] border-[#141414]" />
                    ) : (
                      <span className="grid aspect-square w-full place-items-center border-b-[3px] border-[#141414] bg-(--brand-soft) bg-[radial-gradient(var(--brand)_1.5px,transparent_1.5px)] bg-size-[14px_14px]">
                        <span className={cn(POSTER, "text-7xl text-(--brand-text) uppercase")}>{item.name.charAt(0)}</span>
                      </span>
                    )}
                    <span className="flex flex-1 flex-col p-3">
                      <span className={cn(POSTER, "text-[1.3rem] leading-[1.04] uppercase")}>{item.name}</span>
                      {item.description && (
                        <span className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-snug text-[#141414]/65">
                          {item.description}
                        </span>
                      )}
                    </span>
                  </ItemTrigger>
                  <span
                    className={cn(
                      POSTER,
                      "pointer-events-none absolute -top-2.5 -right-1.5 rotate-6 border-[2.5px] border-[#141414] bg-(--brand) px-2 py-0.5 text-[1.05rem] leading-tight text-(--on-brand) uppercase shadow-[2px_2px_0_#141414]",
                    )}
                  >
                    {item.available ? priceOf(item) : data.labels.soldOut}
                  </span>
                  {/* Un calque de la taille de la photo, pour poser le bouton dans son angle. */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 block aspect-square">
                    <QuickAdd
                      item={item}
                      className="pointer-events-auto absolute right-2.5 bottom-2.5 size-10 rounded-[0.7rem] border-[2.5px] border-[#141414] shadow-[2px_2px_0_#141414]"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <div className="mt-16">
        <Teeth direction="up" />
        <footer className="bg-(--brand) px-5 pt-10 pb-28 text-(--on-brand) sm:px-10">
          <div className="mx-auto max-w-5xl">
            <p data-reveal="pop" className={cn(POSTER, "text-[clamp(3.25rem,17vw,8rem)] leading-[0.88] uppercase")}>
              {data.labels.thanks} !
            </p>
            <div className="mt-6 grid gap-1 font-semibold">
              {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
              {data.hours && <p>{data.hours}</p>}
            </div>
            <ContactLinks
              data={data}
              className="mt-6"
              linkClassName="h-11 rounded-full border-[2.5px] border-(--on-brand) px-4 text-sm font-bold uppercase"
            />
            <PoweredBy data={data} className="mt-8 opacity-70" />
          </div>
        </footer>
      </div>
    </div>
  );
};
