import type { CSSProperties } from "react";
import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateStyle } from "../kit/style";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "../parts";
import type { Template } from "../types";
import { GuirlandeMotion } from "./motion";
import { FONTS, STYLE } from "./style";

/** Une ampoule : sa place le long du fil (`--t`), son rang (`--i`) qui décale son balancement, et sa couleur. */
function Bulb({ at, index }: { at: number; index: number }) {
  return (
    <span className="gld-bulb" data-c={index % 3} style={{ "--t": at.toFixed(4), "--i": index } as CSSProperties}>
      <i />
    </span>
  );
}

/** La guirlande : un fil tendu d'un bord à l'autre, qui pend au milieu. */
function Garland({ bulbs }: { bulbs: number }) {
  return (
    <div aria-hidden="true" className="gld-string">
      {/* Une parabole : la même que celle qui place les ampoules dans la feuille de style. */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="gld-wire">
        <path d="M0 0Q50 200 100 0" />
      </svg>
      {Array.from({ length: bulbs }, (_, index) => (
        <Bulb key={index} at={(index + 0.5) / bulbs} index={index} />
      ))}
    </div>
  );
}

const LAMPS = [0.16, 0.5, 0.84];

/**
 * Guirlande (n° 15) : le marché de nuit. Une guirlande d'ampoules s'allume en
 * haut de la page ; chaque catégorie est un étal, sous son auvent rayé et ses
 * trois lampes, qui ouvre quand on arrive devant.
 */
export const Guirlande: Template = ({ data }) => (
  <div data-template="guirlande" data-theme="dark" className="gld">
    <TemplateStyle css={STYLE} fonts={FONTS} preload="amatic-sc-700.woff2" />
    <GuirlandeMotion />
    <div aria-hidden="true" className="gld-flies">
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>

    <header className="gld-hero">
      <Garland bulbs={21} />
      {(data.logoUrl || data.tableLabel || data.languageSwitch) && (
        <div className="gld-top">
          {data.logoUrl && <Photo src={data.logoUrl} alt="" className="gld-logo" />}
          <div className="gld-chips">
            {data.tableLabel && <p className="gld-chip">{data.tableLabel}</p>}
            <LanguageLink data={data} className="gld-chip" />
          </div>
        </div>
      )}
      <p className="gld-kind">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
      <h1 className="gld-name">{data.name}</h1>
      {data.description && <p className="gld-intro">{data.description}</p>}
      {data.coverUrl && <Photo eager src={data.coverUrl} className="gld-cover" />}
    </header>

    <div className="gld-bar">
      <CategoryNav
        categories={navOf(data)}
        offset={60}
        className="gld-nav"
        linkClassName="gld-nav-link"
        activeClassName="gld-nav-on"
      />
    </div>

    <main className="gld-main">
      {data.categories.map((category, order) => (
        <section key={category.id} id={sectionId(category)} className="gld-stall">
          <div aria-hidden="true" className="gld-roof">
            <span className="gld-awning" />
          </div>
          <div aria-hidden="true" className="gld-lamps">
            {LAMPS.map((at, index) => (
              <Bulb key={at} at={at} index={order * LAMPS.length + index} />
            ))}
          </div>
          <div className="gld-board">
            <h2 className="gld-sign">{category.name}</h2>
            <ul className="gld-rows">
              {category.items.map((item) => (
                <li key={item.id}>
                  <ItemTrigger item={item} className="gld-go">
                    {item.photo ? (
                      <Photo src={item.photo.thumb} className="gld-pic" />
                    ) : (
                      <span aria-hidden="true" className="gld-dot" />
                    )}
                    <span className="gld-text">
                      <span className="gld-item">{item.name}</span>
                      {item.description && <span className="gld-desc">{item.description}</span>}
                    </span>
                    <span className="gld-price">{item.available ? priceOf(item) : data.labels.soldOut}</span>
                  </ItemTrigger>
                  <QuickAdd item={item} className="gld-add" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </main>

    <footer className="gld-foot">
      <Garland bulbs={21} />
      <div className="gld-foot-in">
        <p className="gld-thanks">{data.labels.thanks}</p>
        <div className="gld-where">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks data={data} className="gld-contact" />
        <PoweredBy data={data} className="gld-by" />
      </div>
    </footer>
  </div>
);
