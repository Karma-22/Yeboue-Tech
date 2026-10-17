import { css, type FontFile } from "../kit/style";

export const FONTS: FontFile[] = [
  { family: "Bowlby One", file: "bowlby-one-400.woff2" },
  { family: "Kaushan Script", file: "kaushan-script-400.woff2" },
];

export const STYLE = css`
.ens {
  --ink: #17202b;
  --cream: #fff4d6;
  /* flow-root : la marge de la devanture reste dans le mur, au lieu de le décoller du haut de l'écran */
  display: flow-root;
  min-height: 100dvh;
  padding-bottom: 7rem;
  overflow-x: clip;
  background: #e7d9b6;
  color: var(--ink);
  font-family: var(--font-hanken), system-ui, sans-serif;
}
.ens-block { font-family: "Bowlby One", var(--font-hanken), sans-serif; font-weight: 400; text-transform: uppercase; }
.ens-script { font-family: "Kaushan Script", cursive; font-weight: 400; }

/* La devanture : le grand panneau au nom du lieu */
.ens-front {
  position: relative; max-width: 60rem; margin: 0.75rem; padding: 1.5rem 1.25rem 1.75rem;
  border-radius: 0.6rem; background: var(--brand); color: var(--on-brand);
  box-shadow: 0 0.55rem 0 rgb(23 32 43 / 0.2);
  animation: ens-paint 0.9s cubic-bezier(0.6, 0, 0.3, 1) backwards;
}
/* Le filet peint qui borde chaque panneau */
.ens-front::before, .ens-panel::before {
  content: ""; position: absolute; inset: 0.45rem; pointer-events: none;
  border: 0.16rem solid currentColor; border-radius: 0.3rem; opacity: 0.9;
}
@keyframes ens-paint { from { clip-path: inset(-1rem 100% -1rem -1rem); } to { clip-path: inset(-1rem -1rem -1rem -1rem); } }
.ens-top { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; min-height: 2.25rem; }
.ens-logo { width: 3.25rem; height: 3.25rem; border-radius: 50%; border: 0.2rem solid var(--on-brand); object-fit: cover; }
.ens-chips { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.ens-chip {
  display: inline-flex; align-items: center; height: 2.25rem; padding: 0 0.8rem; border-radius: 0.3rem;
  background: var(--on-brand); color: var(--brand); font: 400 0.8125rem/1 "Bowlby One", sans-serif; letter-spacing: 0.04em; text-transform: uppercase;
}
/* Le ruban du métier : « Maquis · Cocody » */
.ens-ribbon {
  position: relative; display: inline-block; margin-top: 1.25rem; padding: 0.4rem 1.4rem 0.35rem;
  background: var(--on-brand); color: var(--brand);
  font: 400 0.875rem/1.2 "Bowlby One", sans-serif; letter-spacing: 0.1em; text-transform: uppercase;
  clip-path: polygon(0 0, 100% 0, calc(100% - 0.7rem) 50%, 100% 100%, 0 100%, 0.7rem 50%);
}
.ens-name {
  position: relative; margin-top: 0.9rem;
  font: 400 clamp(3rem, 15vw, 6.5rem)/0.94 "Bowlby One", var(--font-hanken), sans-serif;
  letter-spacing: 0.005em; text-transform: uppercase; text-wrap: balance; overflow-wrap: anywhere;
  text-shadow: 0.035em 0.035em 0 var(--brand-relief), 0.07em 0.07em 0 var(--brand-relief), 0.105em 0.105em 0 var(--brand-relief);
  animation: ens-drop 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2) 0.45s backwards;
}
@keyframes ens-drop { from { opacity: 0; transform: translateY(35%) rotate(-3deg); } }
.ens-slogan {
  position: relative; display: flex; align-items: center; gap: 0.7rem; max-width: 30rem; margin-top: 1.1rem;
  font: 400 1.5rem/1.2 "Kaushan Script", cursive; rotate: -1.5deg;
  animation: ens-drop 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2) 0.65s backwards;
}
/* La flèche peinte, celle qui montre la porte */
.ens-arrow {
  flex: none; display: block; width: 2.3rem; height: 1.4rem; background: currentColor;
  clip-path: polygon(0 28%, 58% 28%, 58% 0, 100% 50%, 58% 100%, 58% 72%, 0 72%);
}
.ens-cover {
  position: relative; display: block; width: min(78vw, 21rem); aspect-ratio: 4 / 3; margin: 1.5rem auto -4.75rem;
  border-radius: 50%; border: 0.4rem solid var(--cream); box-shadow: 0 0 0 0.22rem var(--ink), 0 0.6rem 0 rgb(23 32 43 / 0.22);
  object-fit: cover; animation: ens-pop 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.4) 0.8s backwards;
}
@keyframes ens-pop { from { opacity: 0; transform: scale(0.6) rotate(-8deg); } }
.ens-front-open { margin-bottom: 4.5rem; }

/* Les catégories, sur une bande peinte */
.ens-bar { position: sticky; top: 0; z-index: 20; margin-top: 1.25rem; border-block: 0.2rem solid var(--ink); background: var(--cream); }
.ens-nav { padding: 0 0.5rem; }
.ens-nav-link {
  display: flex; align-items: center; height: 3rem; padding: 0 0.9rem; color: rgb(23 32 43 / 0.62);
  font: 400 0.875rem/1 "Bowlby One", sans-serif; letter-spacing: 0.05em; text-transform: uppercase;
}
.ens-nav-on { background: var(--brand); color: var(--on-brand); }

/* Un panneau par catégorie, accroché au mur par deux clous, un peu de travers */
.ens-main { max-width: 60rem; margin: 0 auto; }
.ens-panel {
  --relief: var(--brand); --ring: var(--ink);
  position: relative; scroll-margin-top: 4.25rem; margin: 2.25rem 0.75rem 0; padding: 1.6rem 1.2rem 1.4rem;
  border-radius: 0.5rem; background: var(--cream); color: var(--ink); box-shadow: 0 0.55rem 0 rgb(23 32 43 / 0.2); rotate: -0.5deg;
}
.ens-panel:nth-child(even) { rotate: 0.45deg; }
.ens-panel:nth-child(3n + 2) { --ring: var(--cream); background: var(--ink); color: var(--cream); }
.ens-panel:nth-child(3n + 3) { background: var(--brand-soft); }
.ens-panel::after {
  content: ""; position: absolute; top: -0.3rem; left: 1.4rem; right: 1.4rem; height: 0.6rem; pointer-events: none;
  background:
    radial-gradient(circle at 0.3rem 50%, #2b2f36 0 0.24rem, transparent 0.27rem),
    radial-gradient(circle at calc(100% - 0.3rem) 50%, #2b2f36 0 0.24rem, transparent 0.27rem);
}
/* Le peintre fait tenir le mot sur sa planche : la taille des lettres suit le mot le plus long (--len) */
.ens-title {
  position: relative; display: flex; align-items: center; gap: 0.7rem;
  font: 400 3.4rem/0.98 "Bowlby One", var(--font-hanken), sans-serif; text-transform: uppercase; overflow-wrap: anywhere;
  font-size: min(3.4rem, 11vw, calc((100vw - 7.4rem) / (var(--len, 8) * 0.72)));
  text-shadow: 0.04em 0.04em 0 var(--relief), 0.08em 0.08em 0 var(--relief);
}
.ens-title .ens-arrow { background: var(--brand); }
.ens-rule { display: block; height: 0.5rem; margin-top: 0.75rem; border-block: 0.14rem solid currentColor; opacity: 0.85; }

/* Un article en photo : le médaillon ovale, le nom en capitales, le prix dans une étoile */
.ens-li { position: relative; }
.ens-row { position: relative; display: grid; grid-template-columns: 6.75rem minmax(0, 1fr); align-items: center; gap: 1.25rem; width: 100%; padding: 1.1rem 0 0.9rem; }
.ens-li:nth-child(even) .ens-row { grid-template-columns: minmax(0, 1fr) 6.75rem; }
.ens-li:nth-child(even) .ens-oval { order: 2; }
.ens-oval { position: relative; display: block; width: 6.75rem; height: 8.25rem; }
.ens-oval img { width: 100%; height: 100%; border-radius: 50%; border: 0.3rem solid var(--cream); box-shadow: 0 0 0 0.18rem var(--ring); object-fit: cover; }
.ens-row[data-soldout] .ens-oval img { filter: grayscale(1); }
.ens-star {
  position: absolute; right: -1.15rem; bottom: -0.5rem; display: grid; place-content: center; justify-items: center; width: 5rem; height: 5rem;
  background: var(--brand); color: var(--on-brand); rotate: -9deg; text-align: center;
  font: 400 1.05rem/0.95 "Bowlby One", sans-serif; font-variant-numeric: tabular-nums; white-space: nowrap;
  clip-path: polygon(50% 0%, 61% 14%, 79% 9%, 81% 27%, 98% 35%, 88% 50%, 98% 65%, 81% 73%, 79% 91%, 61% 86%, 50% 100%, 39% 86%, 21% 91%, 19% 73%, 2% 65%, 12% 50%, 2% 35%, 19% 27%, 21% 9%, 39% 14%);
}
.ens-star[data-long] { font-size: 0.84rem; }
.ens-star small { display: block; font-size: 0.7em; }
.ens-li:nth-child(even) .ens-star { right: auto; left: -1.15rem; rotate: 8deg; }
.ens-item { display: block; font: 400 1.25rem/1.08 "Bowlby One", var(--font-hanken), sans-serif; text-transform: uppercase; overflow-wrap: anywhere; }
.ens-desc { display: block; margin-top: 0.35rem; font-size: 0.875rem; line-height: 1.35; opacity: 0.78; }
.ens-what { display: block; padding-bottom: 2.6rem; }
.ens-tag {
  display: inline-block; margin-top: 0.5rem; padding: 0.2rem 0.6rem 0.15rem; border-radius: 0.3rem; background: var(--brand); color: var(--on-brand);
  font: 400 0.9375rem/1.25 "Bowlby One", sans-serif; font-variant-numeric: tabular-nums; white-space: nowrap; rotate: -3deg;
}
.ens .ens-add { position: absolute; bottom: 0.9rem; left: 8rem; width: 2.5rem; height: 2.5rem; box-shadow: 0 0 0 0.18rem var(--ring); }
.ens-li:nth-child(even) .ens-add { left: 0; }

/* Un article sans photo : une ligne peinte, la flèche devant */
.ens-lines { margin-top: 0.5rem; }
.ens-lines li { display: flex; align-items: center; gap: 0.7rem; border-top: 0.14rem dashed color-mix(in srgb, currentColor 45%, transparent); }
.ens-line { display: flex; flex: 1; min-width: 0; align-items: center; gap: 0.7rem; padding: 0.8rem 0; }
.ens-line[data-soldout] { opacity: 0.55; }
.ens-line .ens-arrow { width: 1.5rem; height: 0.95rem; background: var(--brand); }
.ens-line .ens-item { font-size: 1.0625rem; }
.ens-line .ens-tag { margin: 0 0 0 auto; }
.ens-line-text { min-width: 0; flex: 1; }

/* Le bas du mur : le téléphone en gros chiffres, comme sur toutes les enseignes */
.ens-foot {
  position: relative; max-width: 60rem; margin: 2.75rem 0.75rem 0; padding: 1.75rem 1.25rem 1.5rem; border-radius: 0.5rem;
  background: var(--ink); color: var(--cream); text-align: center; box-shadow: 0 0.55rem 0 rgb(23 32 43 / 0.2);
}
.ens-thanks { font: 400 2.1rem/1.15 "Kaushan Script", cursive; color: var(--brand-text-dark); rotate: -2deg; }
.ens-tel { display: inline-block; margin-top: 1.1rem; font: 400 clamp(1.5rem, 7.4vw, 2.4rem)/1 "Bowlby One", sans-serif; font-variant-numeric: tabular-nums; text-shadow: 0.05em 0.05em 0 var(--brand); }
.ens-tel small { display: block; margin-bottom: 0.35rem; font-size: 0.8125rem; letter-spacing: 0.16em; text-shadow: none; opacity: 0.7; }
.ens-where { margin-top: 1rem; font-size: 0.9375rem; line-height: 1.5; opacity: 0.78; }
.ens-contact { justify-content: center; margin-top: 1.1rem; }
.ens-contact a { height: 2.75rem; padding: 0 1rem; border: 0.14rem solid currentColor; border-radius: 0.3rem; font-weight: 700; font-size: 0.875rem; }
.ens-by { margin-top: 1.4rem; opacity: 0.55; }

@media (min-width: 48rem) {
  .ens-front, .ens-foot { margin-inline: auto; }
  .ens-front { margin-top: 1.5rem; padding: 2rem 2.25rem 2.25rem; }
  .ens-cover { position: absolute; right: 2.25rem; top: 50%; width: 20rem; margin: -7.5rem 0 0; }
  .ens-front-open { margin-bottom: 0; }
  .ens-name, .ens-slogan { max-width: calc(100% - 22rem); }
  .ens-panel { margin-inline: 0.75rem; padding: 2rem 2rem 1.75rem; }
  .ens-rows { display: grid; grid-template-columns: 1fr 1fr; column-gap: 3rem; }
  .ens-lines { display: grid; grid-template-columns: 1fr 1fr; column-gap: 3rem; }
}
`;
