import { css, type FontFile } from "../kit/style";

export const FONTS: FontFile[] = [{ family: "Amatic SC", file: "amatic-sc-700.woff2", weight: "700" }];

/*
 * Tout le mouvement de ce modèle passe par cinq réglages que le script fait
 * varier, et que le dessin lit :
 *   --on    une ampoule, d'éteinte (0) à allumée (1) ;
 *   --swing le balancement d'une rangée d'ampoules, en degrés ;
 *   --gust  le coup de vent sur une ampoule, en degrés ;
 *   --open  un auvent, de replié (0) à déplié (1) ;
 *   --lit   la lumière sur un étal, de 0 à 1.
 * Sans script, chacun garde sa valeur de repos : tout est allumé et ouvert.
 */
export const STYLE = css`
.gld {
  --board: #1b2132;
  --cream: #fff5e0;
  --warm: #ffd9a0;
  --off: #54483a;
  --wire: #4a5064;
  position: relative;
  min-height: 100dvh;
  padding-bottom: 7rem;
  overflow-x: clip;
  background: radial-gradient(90% 26rem at 50% 0, rgb(255 190 110 / 0.2), transparent 70%), linear-gradient(#0f1422, #141a2c 60%, #0f1422);
  color: var(--cream);
  font-family: var(--font-hanken), system-ui, sans-serif;
}

/* La guirlande : un fil qui pend, et ses ampoules. --t est la place de l'ampoule le long du fil, de 0 à 1 ;
   le fil est une parabole, et l'ampoule s'y accroche par le même calcul. */
.gld-string { --sag: 3.4rem; position: relative; height: calc(var(--sag) + 2.4rem); pointer-events: none; }
.gld-wire { position: absolute; inset: 0 0 auto; width: 100%; height: var(--sag); overflow: visible; }
.gld-wire path { fill: none; stroke: var(--wire); stroke-width: 2; vector-effect: non-scaling-stroke; }
.gld-bulb {
  --glow: var(--warm);
  position: absolute; left: calc(var(--t) * 100%);
  top: calc(var(--sag) * (1 - (2 * var(--t) - 1) * (2 * var(--t) - 1)));
  width: 0.95rem; height: calc(1.9rem + var(--drop, 0rem)); margin-left: -0.475rem;
  transform-origin: 50% 0; rotate: calc((var(--swing, 0) + var(--gust, 0)) * 1deg);
}
.gld-bulb[data-c="1"] { --glow: var(--brand-text-dark); }
.gld-bulb[data-c="2"] { --glow: var(--brand-alt); }
/* Le bout de fil, quand l'ampoule pend plus bas (--drop) */
.gld-bulb i {
  position: absolute; inset: 0; transform-origin: 50% 0;
  background: linear-gradient(var(--wire) 0 0) 50% 0 / 2px var(--drop, 0rem) no-repeat;
  animation: gld-sway 3.4s ease-in-out calc(var(--i) * -0.37s) infinite alternate;
}
/* La douille, puis le verre */
.gld-bulb i::before { content: ""; position: absolute; left: 50%; top: var(--drop, 0rem); width: 0.42rem; height: 0.5rem; margin-left: -0.21rem; border-radius: 0.1rem; background: #2c3140; }
.gld-bulb i::after {
  content: ""; position: absolute; inset: calc(var(--drop, 0rem) + 0.45rem) 0 0; border-radius: 50% 50% 50% 50% / 38% 38% 62% 62%;
  background: color-mix(in srgb, var(--glow) calc(var(--on, 1) * 100%), var(--off));
  box-shadow: 0 0 0.9rem 0.25rem color-mix(in srgb, var(--glow) calc(var(--on, 1) * 60%), transparent);
}
@keyframes gld-sway { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
/* Une ampoule qui s'allume hésite deux fois avant de tenir */
@keyframes gld-on { 0%, 29%, 46%, 58% { --on: 0; } 30%, 45%, 59%, 100% { --on: 1; } }

/* Les lucioles */
.gld-flies { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.gld-flies i { position: absolute; width: 0.3rem; height: 0.3rem; border-radius: 50%; background: var(--warm); box-shadow: 0 0 0.6rem 0.15rem rgb(255 217 160 / 0.6); opacity: 0; animation: gld-fly 9s ease-in-out infinite; }
.gld-flies i:nth-child(1) { left: 12%; top: 26rem; }
.gld-flies i:nth-child(2) { left: 86%; top: 40rem; animation-delay: -3s; animation-duration: 11s; }
.gld-flies i:nth-child(3) { left: 46%; top: 62rem; animation-delay: -6s; }
.gld-flies i:nth-child(4) { left: 72%; top: 88rem; animation-delay: -1.5s; animation-duration: 12s; }
.gld-flies i:nth-child(5) { left: 20%; top: 112rem; animation-delay: -4.5s; }
@keyframes gld-fly {
  0%, 100% { opacity: 0; transform: translate(0, 0); }
  20% { opacity: 0.9; }
  50% { opacity: 0.5; transform: translate(1.5rem, -2.5rem); }
  80% { opacity: 0.9; transform: translate(-1rem, -4.5rem); }
}

/* Le haut : la guirlande s'allume, une ampoule après l'autre, puis le nom paraît */
.gld-hero { position: relative; padding: 0 1rem; text-align: center; }
.gld-hero .gld-string { margin: 0 -1rem; }
.gld-hero .gld-bulb i { animation: gld-sway 3.4s ease-in-out calc(var(--i) * -0.37s) infinite alternate, gld-on 0.7s linear calc(0.2s + var(--i) * 0.09s) backwards; }
.gld-top { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin: -0.5rem 0 1.5rem; }
.gld-logo { width: 3rem; height: 3rem; border-radius: 50%; box-shadow: 0 0 0 0.13rem rgb(255 217 160 / 0.55), 0 0 1rem rgb(255 190 110 / 0.35); }
.gld-chips { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.gld-chip { display: inline-flex; align-items: center; height: 2.25rem; padding: 0 0.85rem; border: 1px solid rgb(255 245 224 / 0.3); border-radius: 999px; background: rgb(15 20 34 / 0.7); font-weight: 600; font-size: 0.875rem; }
.gld-kind { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.26em; text-transform: uppercase; color: var(--warm); animation: gld-rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s backwards; }
.gld-name {
  margin-top: 0.4rem;
  font: 700 clamp(4.5rem, 24vw, 9.5rem)/0.86 "Amatic SC", var(--font-hanken), sans-serif;
  letter-spacing: 0.02em; text-transform: uppercase; text-wrap: balance; overflow-wrap: anywhere;
  text-shadow: 0 0 1.4rem color-mix(in srgb, var(--brand) 75%, transparent), 0 0 0.3rem color-mix(in srgb, var(--warm) 60%, transparent);
  animation: gld-rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s backwards;
}
.gld-intro { max-width: 30rem; margin: 0.9rem auto 0; line-height: 1.45; color: rgb(255 245 224 / 0.78); animation: gld-rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s backwards; }
@keyframes gld-rise { from { opacity: 0; transform: translateY(1.25rem); } }
.gld-cover {
  display: block; width: 100%; max-width: 34rem; aspect-ratio: 16 / 10; margin: 1.5rem auto 0; border-radius: 1.25rem;
  box-shadow: 0 0 0 0.14rem rgb(255 217 160 / 0.5), 0 0 2.75rem rgb(255 190 110 / 0.3);
  animation: gld-rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s backwards;
}

/* Les catégories */
.gld-bar { position: sticky; top: 0; z-index: 20; margin-top: 1.75rem; border-block: 1px solid rgb(255 245 224 / 0.12); background: rgb(15 20 34 / 0.92); backdrop-filter: blur(8px); }
.gld-nav { gap: 0.25rem; padding: 0 0.6rem; }
.gld-nav-link { position: relative; display: flex; align-items: center; height: 3.25rem; padding: 0 0.8rem; font: 700 1.7rem/1 "Amatic SC", var(--font-hanken), sans-serif; letter-spacing: 0.05em; text-transform: uppercase; color: rgb(255 245 224 / 0.6); -webkit-text-stroke: 0.025em currentColor; }
.gld-nav-on { color: var(--cream); text-shadow: 0 0 0.9rem var(--brand); }
/* La catégorie affichée a son ampoule allumée */
.gld-nav-on::after { content: ""; position: absolute; left: 50%; bottom: 0.3rem; width: 0.4rem; height: 0.4rem; margin-left: -0.2rem; border-radius: 50%; background: var(--warm); box-shadow: 0 0 0.6rem 0.15rem rgb(255 217 160 / 0.7); }

/* Un étal par catégorie. D'un étal à l'autre, la toile et l'ordre des lampes changent. */
.gld-main { display: grid; gap: 0 1.5rem; max-width: 64rem; margin: 0 auto; padding: 0 0.9rem; }
.gld-stall {
  --l0: var(--warm); --l1: var(--brand-text-dark); --l2: var(--brand-alt); --stripe-a: var(--brand); --stripe-b: var(--cream);
  position: relative; scroll-margin-top: 4.5rem; margin-top: 2.5rem;
}
.gld-stall:nth-child(3n + 2) { --l0: var(--brand-alt); --l1: var(--warm); --l2: var(--brand-text-dark); --stripe-a: var(--brand-alt-2); }
.gld-stall:nth-child(3n + 3) { --l0: var(--brand-text-dark); --l1: var(--brand-alt); --l2: var(--warm); --stripe-b: var(--brand-alt); }
/* L'auvent : une toile rayée au bord festonné, inclinée vers nous. Elle se rabat depuis le haut. */
.gld-roof { position: relative; z-index: 1; height: 4.2rem; margin: 0 5.6%; perspective: 24rem; perspective-origin: 50% 0; pointer-events: none; }
.gld-awning {
  display: block; height: 100%; transform-origin: 50% 0;
  transform: rotateX(calc(96deg - var(--open, 1) * 56deg));
  opacity: clamp(0, calc(var(--open, 1) * 4), 1);
  background: linear-gradient(rgb(0 0 0 / 0.32), rgb(0 0 0 / 0) 75%), linear-gradient(90deg, var(--stripe-a) 50%, var(--stripe-b) 50%) 50% 0 / 3.5rem 100%;
  -webkit-mask: linear-gradient(#000 0 0) top / 100% calc(100% - 0.875rem) no-repeat, radial-gradient(circle at 50% 0, #000 0.85rem, transparent 0.875rem) calc(50% + 0.875rem) 100% / 1.75rem 0.875rem repeat-x;
  mask: linear-gradient(#000 0 0) top / 100% calc(100% - 0.875rem) no-repeat, radial-gradient(circle at 50% 0, #000 0.85rem, transparent 0.875rem) calc(50% + 0.875rem) 100% / 1.75rem 0.875rem repeat-x;
}
/* Trois lampes pendent sous l'auvent */
.gld-lamps { --sag: 0rem; position: absolute; inset: 3.4rem 6% auto; z-index: 2; height: 0; pointer-events: none; }
.gld-lamps .gld-bulb { scale: 0.92; }
.gld-lamps .gld-bulb:nth-child(1) { --glow: var(--l0); --drop: 0.55rem; }
.gld-lamps .gld-bulb:nth-child(2) { --glow: var(--l1); --drop: 1rem; }
.gld-lamps .gld-bulb:nth-child(3) { --glow: var(--l2); --drop: 0.3rem; }
.gld-board {
  position: relative; margin-top: -1.3rem; padding: 4.1rem 1rem 0.5rem;
  border: 1px solid rgb(255 245 224 / 0.09); border-radius: 0.5rem 0.5rem 1.1rem 1.1rem; background: var(--board);
}
/* La lumière des trois lampes sur la planche, chacune de sa couleur */
.gld-board::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: var(--lit, 1);
  background:
    radial-gradient(11rem 11rem at 18% 0, color-mix(in srgb, var(--l0) 26%, transparent), transparent 70%),
    radial-gradient(12rem 12rem at 50% 0, color-mix(in srgb, var(--l1) 26%, transparent), transparent 70%),
    radial-gradient(11rem 11rem at 82% 0, color-mix(in srgb, var(--l2) 26%, transparent), transparent 70%);
}
/* Tant que l'étal n'est pas éclairé, sa carte reste lisible, dans la pénombre */
.gld-sign, .gld-rows { position: relative; opacity: calc(0.4 + 0.6 * var(--lit, 1)); }
.gld-sign { font: 700 2.9rem/0.95 "Amatic SC", var(--font-hanken), sans-serif; letter-spacing: 0.04em; text-transform: uppercase; text-align: center; text-wrap: balance; text-shadow: 0 0 0.9rem color-mix(in srgb, var(--brand) 75%, transparent); }
.gld-rows { margin-top: 0.5rem; }
.gld-rows li { position: relative; border-top: 1px dashed rgb(255 245 224 / 0.16); }
.gld-rows li:first-child { border-top: 0; }
.gld-go { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0 0.85rem; width: 100%; min-height: 6rem; padding: 0.85rem 0; }
.gld-go[data-soldout] { opacity: 0.5; }
/* Une photo : un lampion */
.gld-pic { width: 4.2rem; height: 4.2rem; border-radius: 50%; box-shadow: 0 0 0 0.13rem rgb(255 217 160 / 0.55), 0 0 1.1rem rgb(255 190 110 / 0.35); }
/* Sans photo : une petite flamme */
.gld-dot { width: 4.2rem; height: 4.2rem; border-radius: 50%; background: radial-gradient(circle, #fff3d6 0 6%, rgb(255 200 120 / 0.55) 8% 20%, rgb(255 190 110 / 0.16) 40%, transparent 68%); }
.gld-text { min-width: 0; }
.gld-item { display: block; font-weight: 700; line-height: 1.25; overflow-wrap: anywhere; }
.gld-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 0.15rem; font-size: 0.8125rem; line-height: 1.35; color: rgb(255 245 224 / 0.66); }
/* Les lettres de cette écriture sont fines : un filet les épaissit là où elles sont petites */
.gld-price { align-self: start; min-width: 2.6rem; text-align: right; font: 700 2rem/1 "Amatic SC", var(--font-hanken), sans-serif; letter-spacing: 0.04em; text-transform: uppercase; color: var(--brand-text-dark); white-space: nowrap; font-variant-numeric: tabular-nums; -webkit-text-stroke: 0.03em currentColor; }
/* Le liseré garde le bouton visible quand la couleur du lieu est aussi sombre que la nuit */
.gld .gld-add { position: absolute; right: 0; bottom: 0.75rem; box-shadow: 0 0 0 1px rgb(255 245 224 / 0.3); }

/* Le bas : une seconde guirlande, d'un bord à l'autre */
.gld-foot { margin-top: 3.5rem; text-align: center; }
.gld-foot .gld-string { --sag: 2.6rem; }
.gld-foot-in { max-width: 34rem; margin: 0 auto; padding: 0 1rem; }
.gld-thanks { font: 700 3.2rem/1 "Amatic SC", var(--font-hanken), sans-serif; letter-spacing: 0.03em; text-transform: uppercase; text-shadow: 0 0 1rem color-mix(in srgb, var(--brand) 70%, transparent); }
.gld-where { margin-top: 0.75rem; font-size: 0.9375rem; line-height: 1.5; color: rgb(255 245 224 / 0.72); }
.gld-contact { justify-content: center; margin-top: 1.1rem; }
.gld-contact a { height: 2.75rem; padding: 0 1.1rem; border: 1px solid rgb(255 217 160 / 0.5); border-radius: 999px; font-weight: 600; font-size: 0.875rem; }
.gld-by { margin-top: 1.4rem; color: rgb(255 245 224 / 0.5); }

/* Sur un téléphone, une ampoule sur deux suffit */
@media (max-width: 51.99rem) {
  .gld-string .gld-bulb:nth-child(odd) { display: none; }
}
@media (min-width: 52rem) {
  .gld-main { grid-template-columns: 1fr 1fr; align-items: start; }
  .gld-string { --sag: 4.5rem; }
  .gld-foot .gld-string { --sag: 3.4rem; }
  .gld-top { margin-inline: 0.5rem; }
}
/* Sur un grand écran, l'allée du marché : trois étals de front */
@media (min-width: 80rem) {
  .gld-main { grid-template-columns: repeat(3, 1fr); max-width: 78rem; }
}
`;
