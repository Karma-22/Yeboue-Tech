import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { cn } from "@/lib/utils/cn";
import { TemplateStyle } from "../kit/style";
import { bareAmount, ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, sectionId } from "../parts";
import type { Template, TemplateData, TemplateItem } from "../types";
import { GarbaMotion } from "./motion";
import { FONTS, STYLE } from "./style";

/** Une assiette : la photo du plat, ou, sans photo, le prix écrit au fond. Sa pastille de prix est collée au bord. */
function Plate({ item, data }: { item: TemplateItem; data: TemplateData }) {
  const priced = item.price !== null;
  return (
    <span className="grb-plate">
      {item.photo ? (
        <Photo src={item.photo.thumb} />
      ) : (
        <span className="grb-well">
          {priced ? bareAmount(item) : item.note}
          {priced && <small>F</small>}
        </span>
      )}
      {!item.available ? (
        <span className="grb-coin grb-coin-off">{data.labels.soldOut}</span>
      ) : (
        item.photo &&
        (priced || item.note) && (
          <span className="grb-coin" data-long={!priced || (item.price ?? 0) >= 10_000 ? "" : undefined}>
            {priced ? bareAmount(item) : item.note}
            {priced && <small>F</small>}
          </span>
        )
      )}
    </span>
  );
}

/**
 * Garba (n° 14) : le garbadrome. Une toile cirée à carreaux dans la couleur du
 * lieu, des plateaux, et les plats dans de grandes assiettes émaillées posées
 * en quinconce, le prix sur une pastille.
 */
export const Garba: Template = ({ data }) => (
  <div data-template="garba" data-theme="light" className="grb">
    <TemplateStyle css={STYLE} fonts={FONTS} preload="baloo-2-var.woff2" />
    <GarbaMotion />

    <header className="grb-hero">
      <div className="grb-top">
        {data.logoUrl && <Photo src={data.logoUrl} alt="" className="grb-logo" />}
        <div className="grb-chips">
          {data.tableLabel && <p className="grb-chip">{data.tableLabel}</p>}
          <LanguageLink data={data} className="grb-chip" />
        </div>
      </div>

      {data.coverUrl && (
        <div className="grb-day">
          <svg aria-hidden="true" viewBox="0 0 90 80" className="grb-steam">
            <path pathLength="100" d="M18 78c-9-13 9-21 0-34s9-21 0-34" />
            <path pathLength="100" d="M45 78c-9-13 9-21 0-34s9-21 0-34" />
            <path pathLength="100" d="M72 78c-9-13 9-21 0-34s9-21 0-34" />
          </svg>
          <span className="grb-plate">
            <Photo eager src={data.coverUrl} />
          </span>
        </div>
      )}

      <div className={cn("grb-sign", !data.coverUrl && "grb-sign-alone")}>
        <p className="grb-kind">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
        <h1 className="grb-name">{data.name}</h1>
        {data.description && <p className="grb-intro">{data.description}</p>}
      </div>
    </header>

    <div className="grb-bar">
      <CategoryNav
        categories={navOf(data)}
        offset={64}
        className="grb-nav"
        linkClassName="grb-nav-link"
        activeClassName="grb-nav-on"
      />
    </div>

    <main className="grb-main">
      {data.categories.map((category) => (
        <section key={category.id} id={sectionId(category)} className="grb-tray">
          <h2 className="grb-title">
            {category.name}
            <small>{category.items.length}</small>
          </h2>
          <ul className="grb-grid">
            {category.items.map((item) => (
              <li key={item.id} className="grb-cell">
                <ItemTrigger item={item} className="grb-go">
                  <Plate item={item} data={data} />
                  <span className="grb-item">{item.name}</span>
                  {item.description && <span className="grb-desc">{item.description}</span>}
                </ItemTrigger>
                <QuickAdd item={item} className="grb-add" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>

    <footer className="grb-foot">
      <p className="grb-thanks">{data.labels.thanks}</p>
      <div className="grb-where">
        {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
        {data.hours && <p>{data.hours}</p>}
      </div>
      <ContactLinks data={data} className="grb-contact" />
      <PoweredBy data={data} className="grb-by" />
    </footer>
  </div>
);
