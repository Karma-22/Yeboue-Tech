import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateMotion } from "@/components/public/template-motion";
import { cn } from "@/lib/utils/cn";
import { formatPhone } from "@/lib/utils/phone";
import { mono } from "./fonts";
import { bareAmount, ContactLinks, LanguageLink, navOf, Photo, PoweredBy, sectionId } from "./parts";
import type { Template } from "./types";

const PAPER = "#FFFEF9";

/** Le bord déchiré du ticket : une rangée de petites dents de papier. */
const TORN = `linear-gradient(135deg, ${PAPER} 25%, transparent 25%) -6px 0 / 12px 12px repeat-x, linear-gradient(225deg, ${PAPER} 25%, transparent 25%) -6px 0 / 12px 12px repeat-x`;

const BARCODE =
  "repeating-linear-gradient(90deg, #1A1A1A 0 2px, transparent 2px 4px, #1A1A1A 4px 5px, transparent 5px 9px, #1A1A1A 9px 12px, transparent 12px 14px, #1A1A1A 14px 15px, transparent 15px 18px)";

function Rule() {
  return <div aria-hidden="true" className="my-4 border-t border-dashed border-[#1A1A1A]/50" />;
}

/**
 * Carnet : le ticket de caisse. Il sort de l'imprimante à l'ouverture de la
 * page ; tout est en caractères de machine, les prix s'alignent au bout des
 * pointillés, et la seule couleur est celle d'un coup de tampon.
 */
export const Carnet: Template = ({ data }) => (
  <div
    data-template="carnet"
    data-theme="light"
    className={cn(mono.variable, "min-h-dvh bg-[#D9D4C7] pb-28 font-mono text-[#1A1A1A]")}
  >
    <TemplateMotion />
    <div className="mx-auto max-w-[27rem] px-3">
      {/* La fente de l'imprimante, d'où sort le papier. */}
      <div aria-hidden="true" className="relative z-10 h-4 rounded-b-lg bg-[#1A1A1A] shadow-md" />

      <div className="-mt-1 overflow-clip px-1.5">
        <div className="animate-print">
          <div className="relative bg-[#FFFEF9] px-5 pt-8 pb-7 text-[0.8125rem] leading-relaxed uppercase shadow-md">
            <header className="text-center">
              {data.logoUrl && <Photo src={data.logoUrl} alt="" className="mx-auto mb-3 size-14 rounded-full grayscale" />}
              <h1 className="text-[1.6rem] leading-tight font-extrabold tracking-[0.12em] [overflow-wrap:anywhere]">
                {data.name}
              </h1>
              <p className="mt-1.5">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
              {data.address && <p>{data.address}</p>}
              {data.hours && <p>{data.hours}</p>}
              {data.phone && <p>Tél {formatPhone(data.phone)}</p>}
            </header>
            {/* Le coup de tampon : la seule couleur du ticket. */}
            <p
              aria-hidden="true"
              className="mt-3 -mb-7 ml-auto w-fit -rotate-6 rounded-[0.3rem] border-[3px] border-(--brand-text) px-2 py-0.5 leading-tight font-extrabold tracking-[0.16em] text-(--brand-text) opacity-85"
            >
              {data.labels.welcome}
            </p>

            {data.tableLabel && (
              <>
                <Rule />
                <p className="flex justify-between gap-4 font-bold">
                  <span>N°</span>
                  <span className="text-right">{data.tableLabel}</span>
                </p>
              </>
            )}
            {data.description && (
              <>
                <Rule />
                <p className="text-[#1A1A1A]/70 normal-case">{data.description}</p>
              </>
            )}

            <div className="sticky top-0 z-20 -mx-5 mt-4 flex items-center border-y border-dashed border-[#1A1A1A]/50 bg-[#FFFEF9] px-3">
              <CategoryNav
                categories={navOf(data)}
                offset={48}
                className="min-w-0 flex-1 gap-1 py-1.5"
                linkClassName="flex h-8 items-center px-2 text-[0.75rem] font-bold tracking-[0.06em]"
                activeClassName="bg-(--brand) text-(--on-brand)"
              />
              <LanguageLink data={data} className="h-8 shrink-0 border border-[#1A1A1A] px-2 text-[0.75rem]" />
            </div>

            {data.categories.map((category) => (
              <section key={category.id} id={sectionId(category)} className="scroll-mt-14 pt-6">
                <h2 className="flex items-center gap-2 font-extrabold tracking-[0.1em]">
                  <span aria-hidden="true">==</span>
                  {category.name}
                  <span aria-hidden="true" className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-[#1A1A1A]/40">
                    ========================================
                  </span>
                </h2>
                <ul data-reveal-group="fade" className="mt-2">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2.5 py-1.5">
                      <ItemTrigger item={item} className="group/item flex min-w-0 flex-1 items-center gap-3 data-soldout:text-[#1A1A1A]/50">
                        {item.photo && (
                          <Photo src={item.photo.thumb} className="size-11 shrink-0 contrast-125 grayscale" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-1.5">
                            <span className="font-bold group-data-soldout/item:line-through">{item.name}</span>
                            <span aria-hidden="true" className="min-w-3 flex-1 border-b border-dotted border-[#1A1A1A]/45" />
                            <span className="shrink-0 font-bold tabular-nums">
                              {item.available ? bareAmount(item) : data.labels.soldOut}
                            </span>
                          </span>
                          {item.description && (
                            <span className="block text-[0.75rem] leading-snug text-[#1A1A1A]/60 normal-case">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </ItemTrigger>
                      <QuickAdd item={item} className="size-8 rounded-[0.3rem]" />
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <Rule />
            <p className="text-center font-extrabold tracking-[0.1em]">*** {data.labels.thanks} ***</p>
            <div aria-hidden="true" style={{ backgroundImage: BARCODE }} className="mx-auto mt-4 h-12 w-52" />
            {(data.whatsapp || data.phone) && (
              <p aria-hidden="true" className="mt-1 text-center text-[0.6875rem] tracking-[0.3em]">
                {data.whatsapp || data.phone}
              </p>
            )}
            <ContactLinks
              data={data}
              className="mt-5 justify-center"
              linkClassName="h-10 border border-dashed border-[#1A1A1A]/60 px-3 text-[0.75rem] font-bold"
            />
            <PoweredBy data={data} className="mt-5 text-center text-[#1A1A1A]/55 normal-case" />
          </div>
          <div aria-hidden="true" className="h-1.5" style={{ background: TORN }} />
        </div>
      </div>
    </div>
  </div>
);
