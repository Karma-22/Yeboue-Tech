import type { CSSProperties } from "react";
import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { cn } from "@/lib/utils/cn";
import { formatPhone } from "@/lib/utils/phone";
import { TemplateStyle } from "../kit/style";
import { byPhoto } from "../kit/text";
import { bareAmount, ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "../parts";
import type { Template, TemplateData, TemplateItem } from "../types";
import { EnseigneMotion } from "./motion";
import { FONTS, STYLE } from "./style";

/** Le prix d'un article en photo : dans une étoile s'il a un prix, sur une étiquette sinon (« Gratuit », « Rupture »). */
function Price({ item, data }: { item: TemplateItem; data: TemplateData }) {
  if (!item.available) return <span className="ens-tag">{data.labels.soldOut}</span>;
  if (item.price === null) return item.note ? <span className="ens-tag">{item.note}</span> : null;
  return (
    <span className="ens-star" data-long={item.price >= 10_000 ? "" : undefined}>
      {bareAmount(item)}
      <small>F</small>
    </span>
  );
}

/**
 * Enseigne (n° 12) : l'enseigne du quartier, peinte à la main. Une devanture
 * au nom du lieu, puis un panneau par catégorie, accroché un peu de travers :
 * lettres épaisses à ombre portée, photos en médaillons ovales, prix en étoile.
 */
export const Enseigne: Template = ({ data }) => (
  <div data-template="enseigne" data-theme="light" className="ens">
    <TemplateStyle css={STYLE} fonts={FONTS} preload="bowlby-one-400.woff2" />
    <EnseigneMotion />

    <header className={cn("ens-front", data.coverUrl && "ens-front-open")}>
      <div className="ens-top">
        {data.logoUrl && <Photo src={data.logoUrl} alt="" className="ens-logo" />}
        <div className="ens-chips">
          {data.tableLabel && <p className="ens-chip">{data.tableLabel}</p>}
          <LanguageLink data={data} className="ens-chip" />
        </div>
      </div>
      <p className="ens-ribbon">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
      <h1 className="ens-name">{data.name}</h1>
      {data.description && (
        <p className="ens-slogan">
          <span aria-hidden="true" className="ens-arrow" />
          {data.description}
        </p>
      )}
      {data.coverUrl && <Photo eager src={data.coverUrl} className="ens-cover" />}
    </header>

    <div className="ens-bar">
      <CategoryNav
        categories={navOf(data)}
        offset={56}
        className="ens-nav"
        linkClassName="ens-nav-link"
        activeClassName="ens-nav-on"
      />
    </div>

    <main className="ens-main">
      {data.categories.map((category) => {
        const { withPhoto, plain } = byPhoto(category);
        const longest = Math.max(4, ...category.name.split(/\s+/).map((word) => word.length));
        return (
          <section key={category.id} id={sectionId(category)} className="ens-panel">
            <h2 className="ens-title" style={{ "--len": longest } as CSSProperties}>
              <span aria-hidden="true" className="ens-arrow" />
              <span className="ens-title-text">{category.name}</span>
            </h2>
            <span aria-hidden="true" className="ens-rule" />

            {withPhoto.length > 0 && (
              <ul className="ens-rows">
                {withPhoto.map((item) => (
                  <li key={item.id} className="ens-li">
                    <ItemTrigger item={item} className="ens-row">
                      <span className="ens-oval">
                        <Photo src={item.photo!.thumb} />
                        {item.price !== null && item.available && <Price item={item} data={data} />}
                      </span>
                      <span className="ens-what">
                        <span className="ens-item">{item.name}</span>
                        {item.description && <span className="ens-desc">{item.description}</span>}
                        {(item.price === null || !item.available) && <Price item={item} data={data} />}
                      </span>
                    </ItemTrigger>
                    <QuickAdd item={item} className="ens-add" />
                  </li>
                ))}
              </ul>
            )}

            {plain.length > 0 && (
              <ul className="ens-lines">
                {plain.map((item) => (
                  <li key={item.id}>
                    <ItemTrigger item={item} className="ens-line">
                      <span aria-hidden="true" className="ens-arrow" />
                      <span className="ens-line-text">
                        <span className="ens-item">{item.name}</span>
                        {item.description && <span className="ens-desc">{item.description}</span>}
                      </span>
                      <span className="ens-tag">{item.available ? priceOf(item) : data.labels.soldOut}</span>
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

    <footer className="ens-foot">
      <p className="ens-thanks">{data.labels.thanks}</p>
      {data.phone && (
        <a href={`tel:+${data.phone}`} className="ens-tel">
          <small>{data.labels.call}</small>
          {formatPhone(data.phone).replace("+225 ", "")}
        </a>
      )}
      <div className="ens-where">
        {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
        {data.hours && <p>{data.hours}</p>}
      </div>
      <ContactLinks data={{ ...data, phone: "" }} className="ens-contact" />
      <PoweredBy data={data} className="ens-by" />
    </footer>
  </div>
);
