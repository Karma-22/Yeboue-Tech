import type { CSSProperties } from "react";
import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { TemplateStyle } from "../kit/style";
import { byPhoto, two } from "../kit/text";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "../parts";
import type { Template } from "../types";
import { StadeMotion } from "./motion";
import { FONTS, STYLE } from "./style";

/* Les mots du stade, dans la langue de la page. */
const WORDS = {
  fr: { live: "En direct", sections: "Rubriques", items: "À la carte" },
  en: { live: "Live", sections: "Sections", items: "On the menu" },
};

/** Un compteur à volets. Chaque chiffre est écrit en quatre moitiés : deux fixes, deux qui basculent (motion.tsx). */
function Flaps({ value }: { value: number }) {
  return (
    <span className="std-digits">
      <span className="sr-only">{value}</span>
      {[...two(Math.min(value, 99))].map((digit, index) => (
        <span key={index} aria-hidden="true" className="std-flap" data-digit={digit}>
          {(["h-top", "h-bot", "f-top", "f-bot"] as const).map((half) => (
            <span key={half} className={`std-${half}`}>
              <i>{digit}</i>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/*
 * Trois tracés du terrain, pour ouvrir les catégories à tour de rôle : le rond
 * central, la surface de réparation et son arc, la surface de but.
 * `line` est la hauteur de la ligne qui traverse tout l'écran.
 */
const MARKS = [
  {
    line: "50%",
    draw: (
      <>
        <circle cx="120" cy="60" r="46" pathLength={1} />
        <circle cx="120" cy="60" r="3" className="std-spot" />
      </>
    ),
  },
  {
    line: "8%",
    draw: (
      <>
        <path d="M24 9.6v64h192v-64" pathLength={1} />
        <path d="M82 73.6a44 44 0 0 0 76 0" pathLength={1} />
        <circle cx="120" cy="50" r="3" className="std-spot" />
      </>
    ),
  },
  {
    line: "8%",
    draw: (
      <>
        <path d="M10 9.6v90h220v-90" pathLength={1} />
        <path d="M76 9.6v36h88v-36" pathLength={1} />
        <circle cx="120" cy="72" r="3" className="std-spot" />
      </>
    ),
  },
];

/**
 * Stade (n° 17) : le jour de match. Un écran géant et son tableau à volets en
 * haut ; la carte se lit sur la pelouse, entre les lignes de touche : les
 * articles en photo sont des vignettes d'album, les autres une feuille de
 * match, chacun avec son numéro de maillot.
 */
export const Stade: Template = ({ data }) => {
  const words = WORDS[data.lang];
  const total = data.categories.reduce((sum, category) => sum + category.items.length, 0);
  const ticker = [data.name, [data.typeLabel, placeOf(data)].filter(Boolean).join(" · "), data.hours, data.description].filter(Boolean);

  return (
    <div data-template="stade" data-theme="dark" className="std">
      <TemplateStyle css={STYLE} fonts={FONTS} preload="big-shoulders-display-var.woff2" />
      <StadeMotion />

      <div className="std-live">
        <b>{words.live}</b>
        <div className="std-live-track">
          {/* Le texte est écrit deux fois pour défiler sans couture ; une seule lecture suffit. */}
          {[0, 1].map((copy) =>
            ticker.map((text, index) => (
              <span key={`${copy}-${index}`} aria-hidden={copy === 1 ? "true" : undefined}>
                {text}
              </span>
            )),
          )}
        </div>
      </div>

      <header className="std-hero">
        {(data.logoUrl || data.tableLabel || data.languageSwitch) && (
          <div className="std-top">
            {data.logoUrl && <Photo src={data.logoUrl} alt="" className="std-logo" />}
            <div className="std-chips">
              {data.tableLabel && <p className="std-chip">{data.tableLabel}</p>}
              <LanguageLink data={data} className="std-chip" />
            </div>
          </div>
        )}
        <div className="std-jumbo">
          {data.coverUrl && (
            <span className="std-screen">
              <Photo eager src={data.coverUrl} />
              <span aria-hidden="true" className="std-tag">
                {words.live}
              </span>
            </span>
          )}
          <div className="std-panel">
            <p className="std-kind">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
            <h1 className="std-name">{data.name}</h1>
            {data.description && <p className="std-intro">{data.description}</p>}
            <div className="std-score">
              <p className="std-side">
                <small>{words.sections}</small>
                <Flaps value={data.categories.length} />
              </p>
              <span aria-hidden="true" className="std-colon">
                :
              </span>
              <p className="std-side">
                <small>{words.items}</small>
                <Flaps value={total} />
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="std-bar">
        <CategoryNav
          categories={navOf(data)}
          offset={52}
          className="std-nav"
          linkClassName="std-nav-link"
          activeClassName="std-nav-on"
        />
        <span aria-hidden="true" className="std-ball" />
      </div>

      <main className="std-pitch">
        {data.categories.map((category, order) => {
          const { withPhoto, plain } = byPhoto(category);
          const mark = MARKS[order % MARKS.length];
          return (
            <section key={category.id} id={sectionId(category)} className="std-part">
              <header className="std-kick" style={{ "--line": mark.line } as CSSProperties}>
                <svg aria-hidden="true" viewBox="0 0 240 120" className="std-lines">
                  {mark.draw}
                </svg>
                <h2 className="std-title">
                  <span>{category.name}</span>
                  <small>{two(category.items.length)}</small>
                </h2>
              </header>

              {withPhoto.length > 0 && (
                <ul className="std-album">
                  {withPhoto.map((item, index) => (
                    <li key={item.id} className="std-card">
                      <ItemTrigger item={item} className="std-stick">
                        <span className="std-shot">
                          <Photo src={item.photo!.thumb} />
                          <span aria-hidden="true" className="std-shirt">
                            {index + 1}
                          </span>
                          {!item.available && <span className="std-out">{data.labels.soldOut}</span>}
                        </span>
                        <span className="std-cap">
                          <span className="std-item">{item.name}</span>
                          {priceOf(item) && <span className="std-price">{priceOf(item)}</span>}
                        </span>
                      </ItemTrigger>
                      <QuickAdd item={item} className="std-add" />
                    </li>
                  ))}
                </ul>
              )}

              {plain.length > 0 && (
                <ul className="std-sheet">
                  {plain.map((item, index) => (
                    <li key={item.id} className="std-row">
                      <ItemTrigger item={item} className="std-go">
                        <span aria-hidden="true" className="std-shirt">
                          {withPhoto.length + index + 1}
                        </span>
                        <span className="std-text">
                          <span className="std-item">{item.name}</span>
                          {item.description && <span className="std-desc">{item.description}</span>}
                        </span>
                        <span className="std-price">{item.available ? priceOf(item) : data.labels.soldOut}</span>
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

      <footer className="std-goal">
        <p className="std-thanks">{data.labels.thanks}</p>
        <div className="std-where">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        <ContactLinks data={data} className="std-contact" />
        <PoweredBy data={data} className="std-by" />
      </footer>
    </div>
  );
};
