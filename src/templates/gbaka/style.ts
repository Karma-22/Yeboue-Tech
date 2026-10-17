import { css, type FontFile } from "../kit/style";

export const FONTS: FontFile[] = [
  { family: "Kanit", file: "kanit-800-italic.woff2", weight: "800", style: "italic" },
  { family: "Kanit", file: "kanit-600-italic.woff2", weight: "600", style: "italic" },
  { family: "Yellowtail", file: "yellowtail-400.woff2" },
];

export const STYLE = css`
.gbk {
  --ink: #101826;
  --body: #f6f3ea;
  --road: #262b33;
  min-height: 100dvh;
  padding-bottom: 7rem;
  overflow-x: clip;
  background: var(--brand-soft);
  color: var(--ink);
  font-family: var(--font-hanken), system-ui, sans-serif;
}
.gbk-kanit { font-family: "Kanit", var(--font-hanken), sans-serif; font-style: italic; text-transform: uppercase; }

/* Le haut : la plaque du lieu, la table, la langue */
.gbk-hero { padding-top: 1rem; }
.gbk-top { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; min-height: 2.25rem; padding: 0 1rem; }
.gbk-logo { width: 3rem; height: 3rem; border-radius: 50%; border: 3px solid var(--ink); object-fit: cover; }
.gbk-chips { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.gbk-chip {
  display: inline-flex; align-items: center; height: 2.25rem; padding: 0 0.875rem;
  border-radius: 0.5rem; background: var(--ink); color: var(--body);
  font: italic 600 0.9375rem/1 "Kanit", sans-serif; letter-spacing: 0.03em; text-transform: uppercase;
}

/* Un car : la carrosserie, sa plaque, ses vitres, ses bandes, ses roues */
.gbk-bus {
  position: relative;
  max-width: 62rem;
  margin: 1.25rem 0.75rem 0;
  padding: 1rem 0 2.75rem;
  background: var(--body);
  border: 3px solid var(--ink);
  border-radius: 1.75rem 1.1rem 1rem 1rem;
  box-shadow: 0 0.4rem 0 rgb(16 24 38 / 0.14);
}
.gbk-board {
  display: flex; align-items: center; gap: 0.625rem;
  margin: 0 1rem; padding: 0.5rem 0.875rem;
  border-radius: 0.5rem; background: var(--ink); color: var(--body);
  font: italic 600 1rem/1.15 "Kanit", sans-serif; letter-spacing: 0.04em; text-transform: uppercase;
}
h2.gbk-board { font-size: 1.375rem; }
.gbk-num {
  display: grid; place-items: center; flex: none; width: 2.1rem; height: 2.1rem;
  border-radius: 50%; background: var(--brand); color: var(--on-brand);
  font: italic 800 1.0625rem/1 "Kanit", sans-serif;
}
.gbk-count { margin-left: auto; font-size: 0.8125rem; opacity: 0.6; font-variant-numeric: tabular-nums; }

.gbk-windows {
  display: flex; gap: 0.625rem; margin-top: 0.875rem; padding: 0 1rem 0.25rem;
  overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-left: 1rem; scrollbar-width: none;
}
.gbk-windows::-webkit-scrollbar { display: none; }
.gbk-seat { --w: min(62vw, 13.5rem); position: relative; flex: none; width: var(--w); scroll-snap-align: start; container-type: inline-size; }
.gbk-win { display: block; width: 100%; }
.gbk-glass {
  position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden;
  border: 5px solid var(--ink); border-radius: 1.4rem 1.4rem 0.8rem 0.8rem; background: #1c2634;
}
.gbk-glass img { width: 100%; height: 100%; object-fit: cover; }
/* Le reflet sur la vitre */
.gbk-glass::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg, rgb(255 255 255 / 0.3) 0 11%, transparent 11% 21%, rgb(255 255 255 / 0.14) 21% 26%, transparent 26%);
}
.gbk-win[data-soldout] img { filter: grayscale(1) brightness(0.75); }
.gbk-full {
  position: absolute; left: -12%; right: -12%; top: 36%; z-index: 1; transform: rotate(-8deg);
  background: var(--ink); color: var(--body); text-align: center;
  font: italic 800 0.9375rem/1.9 "Kanit", sans-serif; letter-spacing: 0.16em; text-transform: uppercase;
}
.gbk-what { display: block; padding: 0.5rem 0.125rem 0; }
.gbk-item { display: block; font-weight: 700; font-size: 1rem; line-height: 1.2; }
.gbk-desc {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  margin-top: 0.2rem; font-size: 0.8125rem; line-height: 1.3; color: rgb(16 24 38 / 0.66);
}
/* Le prix : la vignette du tarif, penchée comme les lettres */
.gbk-fare {
  display: inline-block; margin-top: 0.45rem; padding: 0.2rem 0.6rem; border-radius: 0.2rem;
  background: var(--brand); color: var(--on-brand); transform: skewX(-10deg);
  font: italic 800 1.0625rem/1.15 "Kanit", sans-serif; font-variant-numeric: tabular-nums; white-space: nowrap;
}
/* Le bouton tient dans le coin de la vitre, quelle que soit sa largeur (la vitre est en 4/3 : 75cqw de haut) */
.gbk .gbk-add {
  position: absolute; right: 0.5rem; top: calc(75cqw - 2.85rem);
  width: 2.5rem; height: 2.5rem; border: 3px solid var(--body);
}

.gbk-stripe {
  display: block; width: 88%; height: 0.75rem; margin-top: 0.875rem; background: var(--brand);
  clip-path: polygon(0 0, calc(100% - 0.75rem) 0, 100% 100%, 0 100%); transform-origin: left;
}
.gbk-stripe-thin { width: 70%; height: 0.3rem; margin-top: 0.3rem; background: var(--brand-deep); }

.gbk-wheel {
  position: absolute; bottom: -1.65rem; width: 3.4rem; height: 3.4rem; border-radius: 50%;
  background: radial-gradient(circle, var(--body) 0 17%, var(--ink) 18% 23%, #cbc8bf 24% 52%, var(--ink) 53%);
  box-shadow: 0 0 0 0.22rem var(--body);
}
/* Les rayons : sans eux, on ne verrait pas la roue tourner */
.gbk-wheel::before {
  content: ""; position: absolute; inset: 25%; border-radius: 50%;
  background: conic-gradient(var(--ink) 0 7%, transparent 7% 20%, var(--ink) 20% 27%, transparent 27% 40%, var(--ink) 40% 47%, transparent 47% 60%, var(--ink) 60% 67%, transparent 67% 80%, var(--ink) 80% 87%, transparent 87%);
}
.gbk-wheel-a { left: 11%; }
.gbk-wheel-b { right: 13%; }

/* Le premier car : celui qui porte le nom */
.gbk-lead { animation: gbk-arrive 1s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
.gbk-lead .gbk-wheel { animation: gbk-roll 1s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
@keyframes gbk-arrive {
  from { transform: translateX(-108%) skewX(-8deg); }
  72% { transform: translateX(1.5%) skewX(2deg); }
}
@keyframes gbk-roll { from { transform: rotate(-720deg); } }
.gbk-lead .gbk-seat { --w: min(46vw, 13.5rem); }
.gbk-lead .gbk-seat-wide { --w: min(74vw, 19rem); }
.gbk-lead .gbk-glass { aspect-ratio: auto; height: clamp(6.5rem, 30vw, 10.5rem); }
.gbk-name {
  margin: 0.5rem 1rem 0;
  font: italic 800 clamp(3rem, 15.5vw, 6.75rem)/0.86 "Kanit", var(--font-hanken), sans-serif;
  letter-spacing: -0.01em; text-transform: uppercase; text-wrap: balance; overflow-wrap: anywhere;
  text-shadow: 0.045em 0.045em 0 var(--brand);
}
/* Le slogan peint sur le bas de caisse, qui file */
.gbk-slogan { margin-top: 0.875rem; overflow: hidden; background: var(--brand); color: var(--on-brand); padding: 0.3rem 0 0.2rem; }
.gbk-slogan-track { display: flex; width: max-content; animation: gbk-slide 32s linear infinite; }
.gbk-slogan-track p { flex: none; padding-right: 3rem; font: 400 1.5rem/1.3 "Yellowtail", cursive; white-space: nowrap; }
@keyframes gbk-slide { to { transform: translateX(-50%); } }
.gbk-road {
  height: 1.6rem; margin-top: 1.5rem;
  background: repeating-linear-gradient(90deg, #e9e4d6 0 1.4rem, transparent 1.4rem 2.8rem) center / 100% 0.18rem no-repeat, var(--road);
}

/* La plaque des destinations : les catégories */
.gbk-plate { position: sticky; top: 0; z-index: 20; background: var(--ink); }
.gbk-nav { padding: 0 0.5rem; }
.gbk-nav-link {
  display: flex; align-items: center; height: 3rem; padding: 0 0.875rem;
  border-bottom: 0.25rem solid transparent; color: rgb(246 243 234 / 0.62);
  font: italic 600 1rem/1 "Kanit", sans-serif; letter-spacing: 0.04em; text-transform: uppercase;
}
.gbk-nav-on { border-bottom-color: var(--brand); color: var(--body); }

.gbk-main { max-width: 64rem; margin: 0 auto; }
.gbk-line { scroll-margin-top: 3.5rem; padding-top: 1.5rem; }

/* Les articles sans photo : le tableau des tarifs */
.gbk-fares { margin: 1rem 1rem 0; border-top: 2px dashed rgb(16 24 38 / 0.25); }
.gbk-fares li { display: flex; align-items: center; gap: 0.75rem; border-bottom: 2px dashed rgb(16 24 38 / 0.25); }
.gbk-fare-row { flex: 1; min-width: 0; padding: 0.7rem 0; }
.gbk-fare-row[data-soldout] { opacity: 0.5; }
.gbk-fare-top { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.gbk-fare-top .gbk-fare { margin-top: 0; }

/* L'arrière du car : les feux, la plaque, les contacts */
.gbk-rear {
  position: relative; max-width: 62rem; margin: 3.25rem 0.75rem 0; padding: 2.25rem 1.25rem 1.5rem;
  border-radius: 1.25rem 1.25rem 0.6rem 0.6rem; background: var(--ink); color: var(--body); text-align: center;
}
.gbk-rear::before, .gbk-rear::after {
  content: ""; position: absolute; top: 1rem; width: 2.75rem; height: 0.9rem; border-radius: 0.3rem;
  background: var(--brand); box-shadow: 0 0 1rem var(--brand);
}
.gbk-rear::before { left: 1rem; }
.gbk-rear::after { right: 1rem; }
.gbk-thanks { font: 400 2.25rem/1.15 "Yellowtail", cursive; color: var(--brand-text-dark); }
.gbk-where { margin-top: 0.75rem; font-size: 0.9375rem; line-height: 1.5; color: rgb(246 243 234 / 0.72); }
.gbk-tag {
  display: inline-flex; align-items: stretch; overflow: hidden; margin-top: 1.25rem;
  border: 2px solid #111; border-radius: 0.4rem; background: #fff; color: #111;
  font: italic 800 1.375rem/1 "Kanit", sans-serif; letter-spacing: 0.05em; font-variant-numeric: tabular-nums;
}
.gbk-tag b { display: grid; place-items: center; padding: 0 0.45rem; background: var(--brand); color: var(--on-brand); font-size: 0.75rem; letter-spacing: 0; }
.gbk-tag span { padding: 0.55rem 0.8rem; }
.gbk-contact { justify-content: center; margin-top: 1rem; }
.gbk-contact a { height: 2.75rem; padding: 0 1rem; border: 2px solid rgb(246 243 234 / 0.4); border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; }
.gbk-by { margin-top: 1.5rem; color: rgb(246 243 234 / 0.5); }

@media (min-width: 48rem) {
  .gbk-hero { padding-top: 1.5rem; }
  .gbk-top, .gbk-bus, .gbk-rear { margin-inline: auto; }
  .gbk-top { max-width: 62rem; }
  .gbk-bus { padding-bottom: 3.25rem; }
  .gbk-wheel { width: 4.25rem; height: 4.25rem; bottom: -2.05rem; }
  .gbk-windows { flex-wrap: wrap; overflow: visible; }
  .gbk-lead .gbk-windows { flex-wrap: nowrap; overflow: hidden; }
  .gbk-line .gbk-seat { --w: 15.5rem; }
}
/* Sur grand écran : les vitres à gauche, le tableau des tarifs à droite ; un car sans vitres aligne ses tarifs sur deux colonnes */
@media (min-width: 60rem) {
  .gbk-bus-both { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); align-items: start; }
  .gbk-bus-both > .gbk-board, .gbk-bus-both > .gbk-stripe { grid-column: 1 / -1; }
  .gbk-bus-both > .gbk-windows { grid-area: 2 / 1; }
  .gbk-bus-both > .gbk-fares { grid-area: 2 / 2; margin: 0.875rem 1rem 0 0.5rem; }
  .gbk-bus-both > .gbk-stripe { grid-row: 3; }
  .gbk-bus-both > .gbk-stripe-thin { grid-row: 4; }
  .gbk-bus-both .gbk-seat { --w: calc(50% - 0.3125rem); }
  .gbk-bus:not(.gbk-bus-both) > .gbk-fares { display: grid; grid-template-columns: 1fr 1fr; column-gap: 2.5rem; }
}
`;
