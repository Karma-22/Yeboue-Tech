import { CategoryNav } from "@/components/public/category-nav";
import { ItemTrigger, QuickAdd } from "@/components/public/menu-shell";
import { cn } from "@/lib/utils/cn";
import { formatPhone } from "@/lib/utils/phone";
import { TemplateStyle } from "../kit/style";
import { byPhoto, firstPhotos, two } from "../kit/text";
import { ContactLinks, LanguageLink, navOf, Photo, placeOf, PoweredBy, priceOf, sectionId } from "../parts";
import type { Template } from "../types";
import { GbakaMotion } from "./motion";
import { FONTS, STYLE } from "./style";

/** Les deux roues d'un car. Elles tournent : voir motion.tsx. */
function Wheels() {
  return (
    <>
      <span aria-hidden="true" className="gbk-wheel gbk-wheel-a" />
      <span aria-hidden="true" className="gbk-wheel gbk-wheel-b" />
    </>
  );
}

/**
 * Gbaka (n° 11) : la gare routière. Le nom du lieu est peint sur le premier
 * car ; chaque catégorie est un car, ses articles en photo sont ses vitres,
 * et ses roues tournent quand on fait défiler les vitres du doigt.
 */
export const Gbaka: Template = ({ data }) => {
  const windows = firstPhotos(data.categories, 3);
  const slogan = data.description || data.labels.welcome;

  return (
    <div data-template="gbaka" data-theme="light" className="gbk">
      <TemplateStyle css={STYLE} fonts={FONTS} preload="kanit-800-italic.woff2" />
      <GbakaMotion />

      <header className="gbk-hero">
        <div className="gbk-top">
          {data.logoUrl && <Photo src={data.logoUrl} alt="" className="gbk-logo" />}
          <div className="gbk-chips">
            {data.tableLabel && <p className="gbk-chip">{data.tableLabel}</p>}
            <LanguageLink data={data} className="gbk-chip" />
          </div>
        </div>

        <div className="gbk-bus gbk-lead">
          <p className="gbk-board">{[data.typeLabel, data.district].filter(Boolean).join(" · ")}</p>
          {(data.coverUrl || windows.length > 0) && (
            <div aria-hidden="true" className="gbk-windows">
              {data.coverUrl && (
                <span className="gbk-seat gbk-seat-wide">
                  <span className="gbk-glass">
                    <Photo eager src={data.coverUrl} />
                  </span>
                </span>
              )}
              {windows.map((item) => (
                <span key={item.id} className="gbk-seat">
                  <span className="gbk-glass">
                    <Photo src={item.photo!.thumb} />
                  </span>
                </span>
              ))}
            </div>
          )}
          <span aria-hidden="true" className="gbk-stripe" />
          <h1 className="gbk-name">{data.name}</h1>
          <span aria-hidden="true" className="gbk-stripe gbk-stripe-thin" />
          <div className="gbk-slogan">
            <div className="gbk-slogan-track">
              <p>{slogan}</p>
              {/* Le slogan est répété pour défiler sans couture ; une seule lecture suffit. */}
              {[1, 2, 3].map((copy) => (
                <p key={copy} aria-hidden="true">
                  {slogan}
                </p>
              ))}
            </div>
          </div>
          <Wheels />
        </div>
        <div aria-hidden="true" className="gbk-road" />
      </header>

      <div className="gbk-plate">
        <CategoryNav
          categories={navOf(data)}
          offset={52}
          className="gbk-nav"
          linkClassName="gbk-nav-link"
          activeClassName="gbk-nav-on"
        />
      </div>

      <main className="gbk-main">
        {data.categories.map((category, index) => {
          const { withPhoto, plain } = byPhoto(category);
          return (
            <section key={category.id} id={sectionId(category)} className="gbk-line">
              {/* Sur grand écran, un car qui a des vitres et des tarifs les range côte à côte. */}
              <div className={cn("gbk-bus", withPhoto.length > 0 && plain.length > 0 && "gbk-bus-both")}>
                <h2 className="gbk-board">
                  <span aria-hidden="true" className="gbk-num">
                    {two(index + 1)}
                  </span>
                  {category.name}
                  <span className="gbk-count">{category.items.length}</span>
                </h2>

                {withPhoto.length > 0 && (
                  <ul className="gbk-windows">
                    {withPhoto.map((item) => (
                      <li key={item.id} className="gbk-seat">
                        <ItemTrigger item={item} className="gbk-win">
                          <span className="gbk-glass">
                            <Photo src={item.photo!.thumb} />
                            {!item.available && <span className="gbk-full">{data.labels.soldOut}</span>}
                          </span>
                          <span className="gbk-what">
                            <span className="gbk-item">{item.name}</span>
                            {item.description && <span className="gbk-desc">{item.description}</span>}
                            <span className="gbk-fare">{priceOf(item)}</span>
                          </span>
                        </ItemTrigger>
                        <QuickAdd item={item} className="gbk-add" />
                      </li>
                    ))}
                  </ul>
                )}

                <span aria-hidden="true" className="gbk-stripe" />
                <span aria-hidden="true" className="gbk-stripe gbk-stripe-thin" />

                {plain.length > 0 && (
                  <ul className="gbk-fares">
                    {plain.map((item) => (
                      <li key={item.id}>
                        <ItemTrigger item={item} className="gbk-fare-row">
                          <span className="gbk-fare-top">
                            <span className="gbk-item">{item.name}</span>
                            <span className="gbk-fare">{item.available ? priceOf(item) : data.labels.soldOut}</span>
                          </span>
                          {item.description && <span className="gbk-desc">{item.description}</span>}
                        </ItemTrigger>
                        <QuickAdd item={item} />
                      </li>
                    ))}
                  </ul>
                )}
                <Wheels />
              </div>
            </section>
          );
        })}
      </main>

      <footer className="gbk-rear">
        <p className="gbk-thanks">{data.labels.thanks}</p>
        <div className="gbk-where">
          {(data.address || placeOf(data)) && <p>{data.address || placeOf(data)}</p>}
          {data.hours && <p>{data.hours}</p>}
        </div>
        {data.phone && (
          <a href={`tel:+${data.phone}`} className="gbk-tag" aria-label={`${data.labels.call} : ${formatPhone(data.phone)}`}>
            <b>CI</b>
            <span>{formatPhone(data.phone).replace("+225 ", "")}</span>
          </a>
        )}
        <ContactLinks data={{ ...data, phone: "" }} className="gbk-contact" />
        <PoweredBy data={data} className="gbk-by" />
      </footer>
    </div>
  );
};
