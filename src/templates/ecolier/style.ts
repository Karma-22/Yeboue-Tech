import { css, type FontFile } from "../kit/style";

export const FONTS: FontFile[] = [
  { family: "Playwrite FR Moderne", file: "playwrite-fr-moderne-400.woff2" },
  { family: "Patrick Hand", file: "patrick-hand-400.woff2" },
];

export const STYLE = css`
.ecl {
  --ink: #1d3c9c;
  --red: #d42f33;
  --pencil: #46526a;
  --paper: #fbfaf2;
  --card: #fffef8;
  --rule: rgb(84 120 200 / 0.2);
  --rule-strong: rgb(92 104 196 / 0.4);
  --margin: 2.75rem;
  /* La couverture cartonnée : la couleur du lieu, son grain, et le dos toilé à gauche */
  --cover:
    linear-gradient(90deg, rgb(0 0 0 / 0.3) 0 1.1rem, rgb(0 0 0 / 0.12) 1.1rem 1.22rem, transparent 1.22rem),
    repeating-linear-gradient(0deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 3px),
    var(--brand);
  min-height: 100dvh;
  padding-bottom: 7rem;
  overflow-x: clip;
  background: var(--brand-soft);
  color: var(--ink);
  font-family: "Patrick Hand", var(--font-hanken), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.5rem;
}
.ecl-book { max-width: 48rem; margin: 0 auto; background: var(--paper); }
.ecl-hand { font-family: "Playwrite FR Moderne", "Patrick Hand", cursive; font-weight: 400; }

/* La couverture, et l'étiquette où l'on écrit son nom */
.ecl-cover { position: relative; padding: 1rem 1rem 2rem 2.1rem; background: var(--cover); color: var(--on-brand); }
.ecl-top { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; min-height: 2.25rem; }
.ecl-logo { width: 3.25rem; height: 3.25rem; border-radius: 50%; border: 0.2rem solid var(--card); }
.ecl-chips { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.ecl-chip { display: inline-flex; align-items: center; height: 2.25rem; padding: 0 0.85rem; border-radius: 0.3rem; background: var(--card); color: var(--ink); font-size: 1.0625rem; box-shadow: 0 0.12rem 0 rgb(0 0 0 / 0.18); }
.ecl-label {
  position: relative; margin-top: 1.4rem; padding: 1.4rem 1.3rem 1.5rem; border-radius: 0.45rem; background: var(--card); color: var(--ink);
  box-shadow: 0 0.18rem 0 rgb(0 0 0 / 0.2); transform: rotate(-1deg);
  animation: ecl-stick 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2) backwards;
}
.ecl-label::before { content: ""; position: absolute; inset: 0.45rem; border: 3px double color-mix(in srgb, var(--ink) 50%, transparent); border-radius: 0.25rem; pointer-events: none; }
@keyframes ecl-stick { from { opacity: 0; transform: rotate(-5deg) scale(1.12); } }
.ecl-kind { font: 700 0.6875rem/1.2 var(--font-hanken), sans-serif; letter-spacing: 0.18em; text-transform: uppercase; color: var(--pencil); }
/* Le nom s'écrit : la ligne se découvre de gauche à droite, comme sous la plume */
.ecl-name {
  margin-top: 0.35rem; font: 400 clamp(1.9rem, 8.6vw, 3.4rem)/1.55 "Playwrite FR Moderne", "Patrick Hand", cursive; text-wrap: balance; overflow-wrap: anywhere;
  animation: ecl-write 1.1s cubic-bezier(0.4, 0, 0.3, 1) 0.45s backwards;
}
@keyframes ecl-write { from { clip-path: inset(-10% 100% -10% 0); } to { clip-path: inset(-10% -5% -10% 0); } }
.ecl-intro { margin-top: 0.5rem; color: var(--pencil); animation: ecl-write 1.2s cubic-bezier(0.4, 0, 0.3, 1) 1.2s backwards; }

/* Une image collée : son cadre blanc, son bout de ruban adhésif */
.ecl-snap { position: relative; display: block; padding: 0.3rem; background: #fff; box-shadow: 0 0.12rem 0.4rem rgb(20 30 60 / 0.28); transform: rotate(2deg); }
.ecl-snap img { display: block; width: 100%; height: 100%; }
.ecl-snap::before {
  content: ""; position: absolute; z-index: 1; left: 50%; top: -0.6rem; width: 3.6rem; height: 1.15rem; margin-left: -1.8rem; transform: rotate(-3deg);
  background: linear-gradient(90deg, rgb(255 255 255 / 0.35), transparent 12% 88%, rgb(255 255 255 / 0.35)), rgb(246 232 170 / 0.82);
  box-shadow: 0 1px 0 rgb(0 0 0 / 0.08);
}
.ecl-cover-photo { width: min(84%, 22rem); aspect-ratio: 4 / 3; margin: 1.9rem auto 0; animation: ecl-stick 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2) 0.3s backwards; }

/* Les intercalaires : un onglet par catégorie, qui dépasse du cahier */
.ecl-tabs { position: sticky; top: 0; z-index: 20; padding-top: 0.5rem; background: var(--cover); }
.ecl-nav { align-items: flex-end; gap: 0.3rem; padding: 0 0.6rem 0 1.6rem; }
.ecl-tab {
  display: flex; align-items: center; height: 2.3rem; padding: 0 0.95rem; border-radius: 0.65rem 0.65rem 0 0; color: var(--ink); font-size: 1.0625rem;
  background: color-mix(in srgb, var(--brand-alt) 45%, var(--paper));
}
.ecl-tab:nth-child(3n + 2) { background: color-mix(in srgb, var(--brand-alt-2) 32%, var(--paper)); }
.ecl-tab:nth-child(3n + 3) { background: color-mix(in srgb, var(--brand) 26%, var(--paper)); }
.ecl .ecl-tab-on { height: 2.75rem; background: var(--paper); box-shadow: inset 0 0.3rem 0 var(--brand-alt); }

/* La page à grands carreaux : interlignes, lignes fortes, verticales, et la marge rouge */
.ecl-page {
  position: relative; padding: 1.5rem 0.9rem 2.5rem calc(var(--margin) + 0.65rem);
  background:
    linear-gradient(90deg, transparent calc(var(--margin) - 1px), rgb(214 47 51 / 0.62) calc(var(--margin) - 1px) calc(var(--margin) + 1px), transparent calc(var(--margin) + 1px)),
    linear-gradient(var(--rule-strong) 1px, transparent 1px) 0 0 / 100% 2rem,
    linear-gradient(var(--rule) 1px, transparent 1px) 0 0 / 100% 0.5rem,
    linear-gradient(90deg, var(--rule) 1px, transparent 1px) var(--margin) 0 / 2rem 100%,
    var(--paper);
}
/* Les trous du classeur */
.ecl-page::before {
  content: ""; position: absolute; left: 0.3rem; top: 0; bottom: 0; width: 0.9rem; pointer-events: none;
  background: radial-gradient(circle, #dedacb 0 0.3rem, rgb(0 0 0 / 0.2) 0.32rem 0.37rem, transparent 0.39rem) 0 5rem / 100% 24rem repeat-y;
}
/* La date du jour, soulignée à la règle : ici, les horaires */
.ecl-date { display: inline-block; margin-bottom: 0.5rem; border-bottom: 2px solid var(--red); font: 400 0.9375rem/2rem "Playwrite FR Moderne", "Patrick Hand", cursive; }

.ecl-part { scroll-margin-top: 3.75rem; padding-top: 1.5rem; }
.ecl-title { font: 400 1.5rem/2.5rem "Playwrite FR Moderne", "Patrick Hand", cursive; }
/* Le coup de surligneur. --hl le fait avancer, de 0 % à 100 %. */
.ecl-hl {
  margin-left: -0.35rem; padding: 0 0.4rem; -webkit-box-decoration-break: clone; box-decoration-break: clone;
  background: linear-gradient(transparent 44%, color-mix(in srgb, var(--brand-alt) 78%, transparent) 44% 88%, transparent 88%) 0 0 / var(--hl, 100%) 100% no-repeat;
}

/* Une ligne par article. Son numéro est dans la marge, à l'encre rouge. */
.ecl-list { counter-reset: line; margin-top: 0.5rem; }
.ecl-line { counter-increment: line; position: relative; display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.5rem 0; }
.ecl-line::before {
  content: counter(line); position: absolute; right: calc(100% + 0.95rem); top: 0.5rem; color: var(--red);
  font: 400 0.875rem/2rem "Playwrite FR Moderne", "Patrick Hand", cursive;
}
.ecl-go { display: grid; flex: 1; min-width: 0; grid-template-columns: minmax(0, 1fr) auto; column-gap: 0.75rem; align-items: start; }
.ecl-item { display: block; font: 400 1rem/2rem "Playwrite FR Moderne", "Patrick Hand", cursive; overflow-wrap: anywhere; }
.ecl-desc { display: block; color: var(--pencil); }
/* Le prix, entouré au stylo rouge comme une note */
.ecl-mark { position: relative; margin: 0.25rem 0.7rem 0 0.4rem; padding: 0 0.1rem; color: var(--red); font-size: 1.3125rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
.ecl-ring { position: absolute; left: -0.7rem; top: -0.4rem; width: calc(100% + 1.4rem); height: calc(100% + 0.8rem); overflow: visible; pointer-events: none; }
.ecl-ring path { fill: none; stroke: var(--red); stroke-width: 2; stroke-linecap: round; vector-effect: non-scaling-stroke; }
/* Avec une photo : le texte à gauche, l'image collée à droite, de travers */
.ecl-go-photo { grid-template-columns: minmax(0, 1fr) 7.25rem; grid-template-areas: "text snap" "mark snap"; grid-template-rows: auto 1fr; }
.ecl-go-photo .ecl-text { grid-area: text; }
.ecl-go-photo .ecl-mark { grid-area: mark; justify-self: start; margin: 0.55rem 0 0.4rem 0.7rem; }
.ecl-go-photo .ecl-snap { grid-area: snap; width: 7.25rem; height: 7.25rem; margin-top: 0.5rem; }
.ecl-line:nth-child(even) .ecl-snap { transform: rotate(-2.5deg); }
.ecl-go[data-soldout] .ecl-item { text-decoration: line-through; text-decoration-color: var(--red); text-decoration-thickness: 2px; }
.ecl-go[data-soldout] .ecl-desc { opacity: 0.6; }
.ecl-go[data-soldout] .ecl-snap img { filter: grayscale(1); opacity: 0.75; }
/* Le bouton : une gommette */
.ecl .ecl-add { margin-top: 0.15rem; box-shadow: 0 0 0 2px #fff, 0 1px 3px rgb(0 0 0 / 0.3); }
.ecl-line-photo .ecl-add { position: absolute; right: -0.35rem; bottom: 0.1rem; margin: 0; }

/* Le dos du cahier : là où s'imprime l'emploi du temps */
.ecl-back { padding: 2.25rem 1rem 2.25rem 2.1rem; background: var(--cover); color: var(--on-brand); }
.ecl-sheet { position: relative; max-width: 30rem; margin: 0 auto; padding: 1.4rem 1.2rem 1.3rem; border-radius: 0.45rem; background: var(--card); color: var(--ink); box-shadow: 0 0.18rem 0 rgb(0 0 0 / 0.2); transform: rotate(0.6deg); text-align: center; }
.ecl-thanks { font: 400 1.4rem/2.5rem "Playwrite FR Moderne", "Patrick Hand", cursive; }
.ecl-grid { margin-top: 0.75rem; border: 1.5px solid color-mix(in srgb, var(--ink) 55%, transparent); text-align: left; }
.ecl-grid div { display: grid; grid-template-columns: 6.25rem minmax(0, 1fr); }
.ecl-grid div + div { border-top: 1.5px solid color-mix(in srgb, var(--ink) 55%, transparent); }
.ecl-grid dt { padding: 0.45rem 0.6rem; border-right: 1.5px solid color-mix(in srgb, var(--ink) 55%, transparent); font: 700 0.6875rem/1.5rem var(--font-hanken), sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: var(--pencil); }
.ecl-grid dd { padding: 0.45rem 0.7rem; }
.ecl-contact { justify-content: center; margin-top: 1.1rem; }
.ecl-contact a { height: 2.75rem; padding: 0 1.1rem; border: 2px solid var(--ink); border-radius: 999px; font-size: 1.0625rem; }
.ecl-by { margin-top: 1.2rem; font-family: var(--font-hanken), sans-serif; color: var(--pencil); }

@media (min-width: 48rem) {
  .ecl { --margin: 4.5rem; padding-top: 1.5rem; }
  .ecl-book { border-radius: 0.5rem 1rem 1rem 0.5rem; box-shadow: 0 1rem 2.5rem rgb(20 30 60 / 0.18); }
  .ecl-cover { display: grid; grid-template-columns: minmax(0, 1fr) 19rem; column-gap: 2rem; align-items: center; padding: 1.5rem 2rem 2.5rem 3rem; border-radius: 0.5rem 1rem 0 0; }
  .ecl-top { grid-column: 1 / -1; }
  .ecl-cover-photo { width: 100%; margin-top: 1.4rem; }
  .ecl-nav { padding-left: 2.6rem; }
  .ecl-page { padding: 2rem 2.5rem 3rem calc(var(--margin) + 1.25rem); }
  .ecl-page::before { left: 1.2rem; }
  .ecl-line::before { right: calc(100% + 1.75rem); }
  .ecl-go-photo { grid-template-columns: minmax(0, 1fr) 9.5rem; }
  .ecl-go-photo .ecl-snap { width: 9.5rem; height: 9.5rem; }
  .ecl-back { padding: 2.5rem 2rem 2.75rem 3rem; border-radius: 0 0 1rem 0.5rem; }
}
`;
