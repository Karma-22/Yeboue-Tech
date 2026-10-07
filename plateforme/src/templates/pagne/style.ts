import { css, type FontFile } from "../kit/style";

export const FONTS: FontFile[] = [{ family: "Rammetto One", file: "rammetto-one-400.woff2" }];

/*
 * Les cinq motifs du pagne, dessinés par des dégradés : aucune image à
 * télécharger. --g est le fond (la couleur du lieu), --a sa compagne claire,
 * --d l'encre sombre, --c l'écru.
 */
export const STYLE = css`
.pgn {
  --ink: #17202b;
  --c: #fbf3df;
  --g: var(--brand);
  --a: var(--brand-alt);
  --d: var(--brand-deep);
  position: relative;
  min-height: 100dvh;
  padding: 0 0 7rem 1.5rem;
  overflow-x: clip;
  background: #efe5cc;
  color: var(--ink);
  font-family: var(--font-hanken), system-ui, sans-serif;
}
.pgn-title { font-family: "Rammetto One", var(--font-hanken), sans-serif; font-weight: 400; }

/* La lisière : le bord du tissu, avec son texte imprimé qui se répète */
.pgn-edge { position: absolute; inset: 0 auto 0 0; width: 1.5rem; background-color: var(--c); background-repeat: repeat-y; border-right: 0.12rem solid var(--d); }

/* Les motifs */
.pgn-m0 {
  background:
    radial-gradient(circle, var(--c) 0 9%, var(--d) 9% 15%, var(--a) 15% 30%, var(--d) 30% 35%, transparent 35%) 0 0 / 4rem 4rem,
    radial-gradient(circle, var(--a) 0 7%, var(--d) 7% 12%, transparent 12%) 2rem 2rem / 4rem 4rem,
    var(--g);
}
.pgn-m1 {
  background:
    linear-gradient(135deg, var(--a) 25%, transparent 25%) -1rem 0 / 2rem 2rem,
    linear-gradient(225deg, var(--a) 25%, transparent 25%) -1rem 0 / 2rem 2rem,
    linear-gradient(315deg, var(--d) 25%, transparent 25%) 0 0 / 2rem 2rem,
    linear-gradient(45deg, var(--d) 25%, transparent 25%) 0 0 / 2rem 2rem,
    var(--g);
}
.pgn-m2 {
  background:
    radial-gradient(circle at 100% 150%, var(--g) 24%, var(--a) 24% 28%, var(--g) 28% 36%, var(--a) 36% 40%, transparent 40%),
    radial-gradient(circle at 0 150%, var(--g) 24%, var(--a) 24% 28%, var(--g) 28% 36%, var(--a) 36% 40%, transparent 40%),
    radial-gradient(circle at 50% 100%, var(--a) 10%, var(--g) 10% 23%, var(--a) 23% 30%, var(--g) 30% 43%, var(--a) 43% 50%, var(--g) 50% 63%, var(--a) 63% 71%, transparent 71%),
    radial-gradient(circle at 100% 50%, var(--a) 5%, var(--g) 5% 15%, var(--a) 15% 20%, var(--g) 20% 29%, var(--a) 29% 34%, var(--g) 34% 44%, var(--a) 44% 49%, transparent 49%),
    radial-gradient(circle at 0 50%, var(--a) 5%, var(--g) 5% 15%, var(--a) 15% 20%, var(--g) 20% 29%, var(--a) 29% 34%, var(--g) 34% 44%, var(--a) 44% 49%, transparent 49%),
    var(--d);
  background-size: 5rem 2.5rem;
}
.pgn-m3 {
  background:
    linear-gradient(45deg, var(--a) 25%, transparent 25% 75%, var(--a) 75%) 0 0 / 2.5rem 2.5rem,
    linear-gradient(45deg, var(--d) 25%, transparent 25% 75%, var(--d) 75%) 1.25rem 1.25rem / 2.5rem 2.5rem,
    var(--g);
}
.pgn-m4 {
  background:
    radial-gradient(circle, var(--c) 0 10%, var(--g) 10% 20%, transparent 20%) 0 0 / 4.5rem 4.5rem,
    radial-gradient(circle, transparent 0 60%, var(--g) 60%) 0 0 / 4.5rem 4.5rem,
    repeating-conic-gradient(var(--a) 0 15deg, var(--d) 15deg 30deg) 0 0 / 4.5rem 4.5rem;
}

/* Le haut : le tissu déroulé, et son étiquette cousue */
.pgn-hero { position: relative; padding: 1rem 1rem 2.25rem; animation: pgn-unroll 0.95s cubic-bezier(0.65, 0, 0.25, 1) backwards; }
@keyframes pgn-unroll { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 -6rem 0); } }
.pgn-top { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; min-height: 2.25rem; }
.pgn-logo { width: 3.25rem; height: 3.25rem; border-radius: 50%; border: 0.2rem solid var(--c); object-fit: cover; }
.pgn-chips { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.pgn-chip {
  display: inline-flex; align-items: center; height: 2.25rem; padding: 0 0.8rem; border-radius: 0.35rem;
  background: var(--c); color: var(--ink); font-weight: 700; font-size: 0.875rem;
  outline: 0.1rem dashed var(--d); outline-offset: -0.28rem;
}
.pgn-label {
  position: relative; max-width: 30rem; margin: 2.25rem auto 0; padding: 1.5rem 1.25rem 1.4rem; border-radius: 0.6rem;
  background: var(--c); text-align: center; rotate: -1.4deg; box-shadow: 0 0.4rem 0 rgb(23 32 43 / 0.22);
  outline: 0.12rem dashed var(--g); outline-offset: -0.45rem;
  animation: pgn-sewn 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.3) 0.55s backwards;
}
@keyframes pgn-sewn { from { opacity: 0; transform: scale(0.86) rotate(-5deg); } }
.pgn-kind { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brand-text); }
.pgn-name { margin-top: 0.5rem; font: 400 clamp(2.4rem, 11.5vw, 4.5rem)/1.02 "Rammetto One", var(--font-hanken), sans-serif; text-wrap: balance; overflow-wrap: anywhere; }
.pgn-intro { margin-top: 0.75rem; font-size: 1rem; line-height: 1.4; color: rgb(23 32 43 / 0.75); }
/* Les photos sont des coupons de tissu, coupés aux ciseaux cranteurs */
.pgn-swatch { display: block; filter: drop-shadow(0 0.3rem 0 rgb(23 32 43 / 0.2)); }
.pgn-swatch img {
  display: block; width: 100%; height: 100%; object-fit: cover;
  -webkit-mask:
    conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / 0.7rem 51% repeat-x,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 0.7rem 51% repeat-x;
  mask:
    conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / 0.7rem 51% repeat-x,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 0.7rem 51% repeat-x;
}
.pgn-cover { width: min(72vw, 20rem); aspect-ratio: 4 / 3; margin: 1.5rem auto -5.5rem; rotate: 2.5deg; animation: pgn-drop 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2) 0.85s backwards; }
@keyframes pgn-drop { from { opacity: 0; transform: translateY(-1.5rem) rotate(8deg); } }
.pgn-hero-open { margin-bottom: 4.25rem; }

/* Les catégories */
.pgn-bar { position: sticky; top: 0; z-index: 20; background: var(--c); border-bottom: 0.14rem dashed var(--g); }
.pgn-nav { gap: 0.35rem; padding: 0.5rem 0.75rem; }
.pgn-nav-link { display: flex; align-items: center; height: 2.4rem; padding: 0 0.85rem; border-radius: 0.35rem; font-weight: 700; font-size: 0.9375rem; color: rgb(23 32 43 / 0.68); }
.pgn-nav-on { background: var(--g); color: var(--on-brand); outline: 0.1rem dashed var(--on-brand); outline-offset: -0.28rem; }

.pgn-main { max-width: 62rem; margin: 0 auto; }
.pgn-part { scroll-margin-top: 3.75rem; padding-top: 1.75rem; }
/* La bande de motif, crantée en bas */
.pgn-band {
  display: block; height: 4.5rem;
  -webkit-mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 0.9rem 100%;
  mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 0.9rem 100%;
}
.pgn-tab {
  position: relative; display: inline-block; margin: -1.7rem 0 0 1rem; padding: 0.4rem 1.1rem 0.45rem; border-radius: 0.4rem;
  background: var(--c); font: 400 1.6rem/1.15 "Rammetto One", var(--font-hanken), sans-serif; rotate: -2deg;
  box-shadow: 0 0.25rem 0 rgb(23 32 43 / 0.2); outline: 0.1rem dashed var(--g); outline-offset: -0.3rem;
}

/* Un article : une carte cousue. --sew est l'avancée de la couture, de 0 à 360 degrés. */
.pgn-cards { display: grid; gap: 0.9rem; padding: 1.1rem 1rem 0; }
.pgn-card { --sew: 360deg; position: relative; border-radius: 0.9rem; background: var(--c); box-shadow: 0 0.25rem 0 rgb(23 32 43 / 0.14); }
.pgn-card::before {
  content: ""; position: absolute; inset: 0.4rem; pointer-events: none; border: 0.13rem dashed var(--g); border-radius: 0.6rem;
  -webkit-mask: conic-gradient(from -90deg, #000 var(--sew), #0000 0);
  mask: conic-gradient(from -90deg, #000 var(--sew), #0000 0);
}
.pgn-go { display: flex; align-items: center; gap: 0.95rem; width: 100%; padding: 1rem 1rem 1rem 1.05rem; }
.pgn-go[data-soldout] { opacity: 0.6; }
.pgn-pic { flex: none; width: 5.5rem; height: 5.5rem; rotate: -2.5deg; }
.pgn-card:nth-child(even) .pgn-pic { rotate: 2deg; }
.pgn-go[data-soldout] .pgn-pic { filter: grayscale(1) drop-shadow(0 0.3rem 0 rgb(23 32 43 / 0.2)); }
/* Sans photo : un petit carré du motif de la catégorie */
.pgn-chipmotif { flex: none; width: 2.75rem; height: 2.75rem; border-radius: 0.5rem; background-size: 1.6rem 1.6rem; rotate: -4deg; box-shadow: 0 0.2rem 0 rgb(23 32 43 / 0.18); }
.pgn-text { min-width: 0; flex: 1; padding-right: 2.4rem; }
.pgn-item { display: block; font: 400 1.0625rem/1.2 "Rammetto One", var(--font-hanken), sans-serif; overflow-wrap: anywhere; }
.pgn-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 0.25rem; font-size: 0.875rem; line-height: 1.35; color: rgb(23 32 43 / 0.7); }
/* Le prix : une étiquette tissée */
.pgn-price {
  display: inline-block; margin-top: 0.5rem; padding: 0.2rem 0.6rem; border-radius: 0.25rem; background: var(--g); color: var(--on-brand);
  font-weight: 800; font-size: 0.9375rem; font-variant-numeric: tabular-nums; white-space: nowrap;
  outline: 0.07rem dashed var(--on-brand); outline-offset: -0.2rem;
}
.pgn .pgn-add { position: absolute; right: 0.9rem; bottom: 0.9rem; width: 2.4rem; height: 2.4rem; }

/* Le bas : la dernière bande, et l'étiquette des contacts */
.pgn-foot { margin-top: 3rem; }
.pgn-foot .pgn-band { height: 3.5rem; }
.pgn-foot-label { position: relative; max-width: 30rem; margin: -1rem 1rem 0; padding: 1.5rem 1.25rem; border-radius: 0.6rem; background: var(--c); text-align: center; rotate: 1deg; box-shadow: 0 0.4rem 0 rgb(23 32 43 / 0.2); outline: 0.12rem dashed var(--g); outline-offset: -0.45rem; }
.pgn-thanks { font: 400 1.6rem/1.2 "Rammetto One", var(--font-hanken), sans-serif; color: var(--brand-text); }
.pgn-where { margin-top: 0.75rem; font-size: 0.9375rem; line-height: 1.5; color: rgb(23 32 43 / 0.75); }
.pgn-contact { justify-content: center; margin-top: 1rem; }
.pgn-contact a { height: 2.75rem; padding: 0 1rem; border-radius: 0.35rem; background: var(--g); color: var(--on-brand); font-weight: 700; font-size: 0.875rem; }
.pgn-by { margin-top: 1.25rem; color: rgb(23 32 43 / 0.55); }

@media (min-width: 44rem) {
  .pgn-hero { padding: 1.5rem 2rem 3rem; }
  .pgn-cards { grid-template-columns: 1fr 1fr; padding-inline: 1.5rem; }
  .pgn-tab { margin-left: 1.5rem; }
  .pgn-foot-label { margin-inline: auto; }
}
`;
