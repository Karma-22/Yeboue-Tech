import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { cn } from "@/lib/utils/cn";
import { TemplateStyle } from "../kit/style";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "../parts";
import type { Template } from "../types";
import { PagneMotion } from "./motion";
import { FONTS, STYLE } from "./style";

const MOTIFS = 5;

/**
 * Le texte de la lisière, écrit le long du bord du tissu. Il est dessiné dans
 * une petite image qui se répète : une ligne de code, quelle que soit la
 * longueur de la page.
 */
function selvedge(text: string): string {
  const safe = text.replace(/[<>&'"]/g, "").toUpperCase();
  const height = 28 + Math.round(safe.length * 8.4);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='${height}'><text transform='rotate(-90)' x='-${height - 14}' y='16' font-family='Arial,Helvetica,sans-serif' font-size='9' font-weight='700' letter-spacing='2.2' fill='#17202b'>${safe}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Pagne (n° 13) : le wax. Cinq motifs dessinés par le code dans la couleur du
 * lieu et sa couleur compagne ; les catégories sont des bandes de tissu, les
 * articles des cartes cousues, les photos des coupons coupés aux ciseaux cranteurs.
 */
export const Pagne: Template = ({ data }) => (
  <div data-template="pagne" data-theme="light" className="pgn">
    <TemplateStyle css={STYLE} fonts={FONTS} preload="rammetto-one-400.woff2" />
    <PagneMotion />
    <div
      aria-hidden="true"
      className="pgn-edge"
      style={{ backgroundImage: selvedge(`${data.name} · ${[data.typeLabel, placeOf(data)].filter(Boolean).join(" · ")} ·`) }}
    />

    <header className={cn("pgn-hero pgn-m4", data.coverUrl && "pgn-hero-open")}>
      <div className="pgn-top">
        {data.logoUrl && <Photo src={data.logoUrl} alt="" className="pgn-logo" />}
        <div className="pgn-chips">
          {data.tableLabel && <p className="pgn-chip">{data.tableLabel}</p>}
          <LanguageLink data={data} className="pgn-chip" />
        </div>
      </div>
      <div className="pgn-label">
        <p className="pgn-kind">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
        <h1 className="pgn-name">{data.name}</h1>
        {data.description && <p className="pgn-intro">{data.description}</p>}
      </div>
      {data.coverUrl && (
        <span className="pgn-swatch pgn-cover">
          <Photo eager src={data.coverUrl} />
        </span>
      )}
    </header>

    <div className="pgn-bar">
      <CategoryNav
        categories={navOf(data)}
        offset={60}
        className="pgn-nav"
        linkClassName="pgn-nav-link"
        activeClassName="pgn-nav-on"
      />
    </div>

    <main className="pgn-main">
      {data.categories.map((category, index) => {
        const motif = `pgn-m${index % MOTIFS}`;
        return (
          <section key={category.id} id={sectionId(category)} className="pgn-part">
            <span aria-hidden="true" className={cn("pgn-band", motif)} />
            <h2 className="pgn-tab">{category.name}</h2>
            <ul className="pgn-cards">
              {category.items.map((item) => (
                <li key={item.id} className="pgn-card">
                  <ItemTrigger item={item} className="pgn-go">
                    {item.photo ? (
                      <span className="pgn-swatch pgn-pic">
                        <Photo src={item.photo.thumb} />
                      </span>
                    ) : (
                      <span aria-hidden="true" className={cn("pgn-chipmotif", motif)} />
                    )}
                    <span className="pgn-text">
                      <span className="pgn-item">{item.name}</span>
                      {item.description && <span className="pgn-desc">{item.description}</span>}
                      <span className="pgn-price">{item.available ? priceOf(item) : data.labels.soldOut}</span>
                    </span>
                  </ItemTrigger>
                  <QuickAdd item={item} className="pgn-add" />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>

    <footer className="pgn-foot">
      <span aria-hidden="true" className="pgn-band pgn-m1" />
      <div className="pgn-foot-label">
        <p className="pgn-thanks">{data.labels.thanks}</p>
        <div className="pgn-where">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks data={data} className="pgn-contact" />
        <PoweredBy data={data} className="pgn-by" />
      </div>
    </footer>
  </div>
);
