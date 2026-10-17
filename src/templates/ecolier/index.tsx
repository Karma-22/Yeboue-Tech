import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { cn } from "@/lib/utils/cn";
import { formatPhone } from "@/lib/utils/phone";
import { TemplateStyle } from "../kit/style";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "../parts";
import type { Template } from "../types";
import { EcolierMotion } from "./motion";
import { FONTS, STYLE } from "./style";

/* Trois tours de stylo : aucun prix n'est entouré tout à fait comme son voisin. */
const RINGS = [
  "M9 28C6 12 34 4 60 5c26 1 36 11 33 24-3 13-32 18-55 17C14 45 2 38 9 23c3-7 13-12 25-15",
  "M12 20C20 6 52 3 74 8c18 4 24 17 16 28-9 12-40 13-60 9C10 41 3 31 11 19c4-5 9-8 17-10",
  "M8 30C4 15 30 5 56 4c28-1 40 10 37 23-3 14-30 20-54 19C16 45 5 39 7 27c1-8 8-14 20-18",
];

/**
 * Écolier (n° 16) : le cahier d'écolier. La couverture porte l'étiquette au nom
 * du lieu ; la carte est écrite à l'encre bleue sur une page à grands carreaux,
 * les images sont collées, et les prix entourés au stylo rouge comme une note.
 */
export const Ecolier: Template = ({ data }) => (
  <div data-template="ecolier" data-theme="light" className="ecl">
    <TemplateStyle css={STYLE} fonts={FONTS} preload="playwrite-fr-moderne-400.woff2" />
    <EcolierMotion />

    <div className="ecl-book">
      <header className="ecl-cover">
        <div className="ecl-top">
          {data.logoUrl && <Photo src={data.logoUrl} alt="" className="ecl-logo" />}
          <div className="ecl-chips">
            {data.tableLabel && <p className="ecl-chip">{data.tableLabel}</p>}
            <LanguageLink data={data} className="ecl-chip" />
          </div>
        </div>
        <div className="ecl-label">
          <p className="ecl-kind">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
          <h1 className="ecl-name">{data.name}</h1>
          {data.description && <p className="ecl-intro">{data.description}</p>}
        </div>
        {data.coverUrl && (
          <span className="ecl-snap ecl-cover-photo">
            <Photo eager src={data.coverUrl} />
          </span>
        )}
      </header>

      <div className="ecl-tabs">
        <CategoryNav
          categories={navOf(data)}
          offset={60}
          className="ecl-nav"
          linkClassName="ecl-tab"
          activeClassName="ecl-tab-on"
        />
      </div>

      <main className="ecl-page">
        {data.hours && <p className="ecl-date">{data.hours}</p>}
        {data.categories.map((category, order) => (
          <section key={category.id} id={sectionId(category)} className="ecl-part">
            <h2 className="ecl-title">
              <span className="ecl-hl">{category.name}</span>
            </h2>
            <ol className="ecl-list">
              {category.items.map((item, index) => {
                const mark = item.available ? priceOf(item) : data.labels.soldOut;
                return (
                  <li key={item.id} className={cn("ecl-line", item.photo && "ecl-line-photo")}>
                    <ItemTrigger item={item} className={cn("ecl-go", item.photo && "ecl-go-photo")}>
                      <span className="ecl-text">
                        <span className="ecl-item">{item.name}</span>
                        {item.description && <span className="ecl-desc">{item.description}</span>}
                      </span>
                      {mark && (
                        <span className="ecl-mark">
                          {mark}
                          {item.available && (
                            <svg aria-hidden="true" viewBox="0 0 100 50" preserveAspectRatio="none" className="ecl-ring">
                              <path d={RINGS[(order + index) % RINGS.length]} />
                            </svg>
                          )}
                        </span>
                      )}
                      {item.photo && (
                        <span className="ecl-snap">
                          <Photo src={item.photo.thumb} />
                        </span>
                      )}
                    </ItemTrigger>
                    <QuickAdd item={item} className="ecl-add" />
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>

      <footer className="ecl-back">
        <div className="ecl-sheet">
          <p className="ecl-thanks">{data.labels.thanks}</p>
          <dl className="ecl-grid">
            {(data.address || placeOf(data)) && (
              <div>
                <dt>{data.labels.address}</dt>
                <dd>{data.address || placeOf(data)}</dd>
              </div>
            )}
            {data.hours && (
              <div>
                <dt>{data.labels.hours}</dt>
                <dd>{data.hours}</dd>
              </div>
            )}
            {data.phone && (
              <div>
                <dt>{data.labels.call}</dt>
                <dd>{formatPhone(data.phone)}</dd>
              </div>
            )}
          </dl>
          <ContactLinks data={data} className="ecl-contact" />
          <PoweredBy data={data} className="ecl-by" />
        </div>
      </footer>
    </div>
  </div>
);
