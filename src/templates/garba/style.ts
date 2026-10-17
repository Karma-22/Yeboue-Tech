import { css, type FontFile } from "../kit/style";

export const FONTS: FontFile[] = [{ family: "Baloo 2", file: "baloo-2-var.woff2", weight: "400 800" }];

export const STYLE = css`
.grb {
  --ink: #1d2430;
  --tray: #fff7e6;
  --check: color-mix(in srgb, var(--brand) 24%, transparent);
  min-height: 100dvh;
  padding-bottom: 7rem;
  overflow-x: clip;
  /* La toile cirée à carreaux, dans la couleur du lieu */
  background:
    linear-gradient(90deg, var(--check) 50%, transparent 50%) 0 0 / 2.5rem 2.5rem,
    linear-gradient(var(--check) 50%, transparent 50%) 0 0 / 2.5rem 2.5rem,
    #fffaf0;
  color: var(--ink);
  font-family: "Baloo 2", var(--font-hanken), system-ui, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.35;
}

/* Une assiette émaillée : blanche, avec son liseré de couleur */
.grb-plate {
  position: relative; display: block; aspect-ratio: 1; padding: 9%; border-radius: 50%; background: #fff;
  box-shadow: inset 0 -0.35rem 0.7rem rgb(29 36 48 / 0.1), 0 0.45rem 0 rgb(29 36 48 / 0.16);
}
.grb-plate::before { content: ""; position: absolute; inset: 0.3rem; border: 0.14rem solid var(--brand); border-radius: 50%; pointer-events: none; }
.grb-plate img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 0.12rem rgb(29 36 48 / 0.12); }
/* Sans photo : l'assiette vide, le prix écrit au fond */
.grb-well {
  display: grid; place-content: center; width: 100%; height: 100%; border-radius: 50%; text-align: center;
  background: radial-gradient(circle at 38% 32%, #fff, #f3eee2 62%, #e6e0d0);
  font-weight: 800; font-size: clamp(1.15rem, 5.4vw, 1.6rem); line-height: 1; color: var(--brand-text); font-variant-numeric: tabular-nums;
}
.grb-well small { display: block; margin-top: 0.15rem; font-size: 0.6em; }
/* Le prix : une pastille collée au bord de l'assiette */
.grb-coin {
  position: absolute; top: -3%; right: -4%; z-index: 1; display: grid; place-content: center; width: 3.6rem; height: 3.6rem; border-radius: 50%;
  background: var(--brand); color: var(--on-brand); text-align: center; rotate: 9deg; box-shadow: 0 0.2rem 0 rgb(29 36 48 / 0.22);
  font-weight: 800; font-size: 1rem; line-height: 0.95; font-variant-numeric: tabular-nums; white-space: nowrap;
}
.grb-coin[data-long] { font-size: 0.82rem; }
.grb-coin small { display: block; font-size: 0.68em; }
.grb-coin-off { background: var(--ink); color: #fff; font-size: 0.72rem; rotate: -8deg; }

/* Le haut : la grande assiette du jour, d'où monte la vapeur */
.grb-hero { position: relative; padding: 1rem 1rem 0; }
.grb-top { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; min-height: 2.25rem; }
.grb-logo { width: 3.25rem; height: 3.25rem; border-radius: 50%; border: 0.2rem solid #fff; object-fit: cover; box-shadow: 0 0.2rem 0 rgb(29 36 48 / 0.16); }
.grb-chips { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.grb-chip { display: inline-flex; align-items: center; height: 2.25rem; padding: 0.1rem 0.9rem 0; border-radius: 999px; background: #fff; font-weight: 700; font-size: 0.9375rem; box-shadow: 0 0.2rem 0 rgb(29 36 48 / 0.14); }
.grb-day { position: relative; width: min(74vw, 21rem); margin: 2.75rem auto 0; }
.grb-day .grb-plate { animation: grb-serve 1s cubic-bezier(0.2, 0.9, 0.3, 1.15) backwards; }
@keyframes grb-serve { from { opacity: 0; transform: translateX(60%) rotate(200deg) scale(0.7); } }
.grb-steam { position: absolute; left: 50%; bottom: 84%; width: 34%; translate: -50% 0; pointer-events: none; overflow: visible; }
.grb-steam path {
  fill: none; stroke: #fff; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 34 100; stroke-dashoffset: 34; opacity: 0;
  filter: drop-shadow(0 0 0.15rem rgb(29 36 48 / 0.25));
  animation: grb-steam 3.6s ease-in-out 1.1s infinite;
}
.grb-steam path:nth-child(2) { animation-delay: 1.9s; }
.grb-steam path:nth-child(3) { animation-delay: 2.7s; }
@keyframes grb-steam {
  0% { stroke-dashoffset: 34; opacity: 0; }
  25% { opacity: 0.9; }
  100% { stroke-dashoffset: -100; opacity: 0; }
}
.grb-sign {
  position: relative; max-width: 34rem; margin: -1.75rem auto 0; padding: 1.4rem 1.25rem 1.3rem; border-radius: 1.5rem;
  background: var(--tray); text-align: center; box-shadow: 0 0.45rem 0 rgb(29 36 48 / 0.14);
  animation: grb-up 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s backwards;
}
.grb-sign-alone { margin-top: 2rem; }
@keyframes grb-up { from { opacity: 0; transform: translateY(1.5rem); } }
.grb-kind { display: inline-block; padding: 0.15rem 0.8rem 0; border-radius: 999px; background: var(--brand); color: var(--on-brand); font-weight: 700; font-size: 0.875rem; }
.grb-name { margin-top: 0.5rem; font-weight: 800; font-size: clamp(2.5rem, 12.5vw, 4.75rem); line-height: 0.95; letter-spacing: -0.01em; text-wrap: balance; overflow-wrap: anywhere; }
.grb-intro { margin-top: 0.6rem; font-weight: 500; color: rgb(29 36 48 / 0.75); }

/* Les catégories */
.grb-bar { position: sticky; top: 0; z-index: 20; margin-top: 1.25rem; background: var(--tray); box-shadow: 0 0.2rem 0 rgb(29 36 48 / 0.1); }
.grb-nav { gap: 0.4rem; padding: 0.55rem 0.75rem; }
.grb-nav-link { display: flex; align-items: center; height: 2.5rem; padding: 0.1rem 1rem 0; border-radius: 999px; background: #fff; font-weight: 700; color: rgb(29 36 48 / 0.7); }
.grb-nav-on { background: var(--brand); color: var(--on-brand); }

/* Une catégorie : un plateau, et ses assiettes en quinconce */
.grb-main { max-width: 62rem; margin: 0 auto; }
.grb-tray { scroll-margin-top: 4.25rem; margin: 1.5rem 0.75rem 0; padding: 1.25rem 1rem 2rem; border-radius: 1.75rem; background: var(--tray); box-shadow: 0 0.45rem 0 rgb(29 36 48 / 0.12); }
.grb-title { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; padding-bottom: 0.4rem; border-bottom: 0.3rem solid var(--brand); font-weight: 800; font-size: 2rem; line-height: 1.05; }
.grb-title small { font-weight: 700; font-size: 0.9375rem; color: rgb(29 36 48 / 0.55); }
.grb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 1rem; padding-top: 1.5rem; }
.grb-cell { position: relative; }
.grb-cell:nth-child(even) { margin-top: 2.5rem; }
.grb-go { display: block; width: 100%; text-align: center; }
.grb-go[data-soldout] img { filter: grayscale(1) opacity(0.6); }
.grb-go[data-soldout] .grb-item { text-decoration: line-through; opacity: 0.6; }
.grb-item { display: block; margin-top: 0.7rem; font-weight: 700; font-size: 1.125rem; line-height: 1.15; overflow-wrap: anywhere; }
.grb-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 0.2rem; font-family: var(--font-hanken), sans-serif; font-size: 0.8125rem; line-height: 1.35; color: rgb(29 36 48 / 0.68); }
.grb .grb-add { position: absolute; left: -2%; top: calc(100cqw - 2.6rem); width: 2.75rem; height: 2.75rem; border: 0.2rem solid var(--tray); }
.grb-cell { container-type: inline-size; }

/* Le bas */
.grb-foot { max-width: 34rem; margin: 2.5rem 0.75rem 0; padding: 1.5rem 1.25rem; border-radius: 1.75rem; background: var(--tray); text-align: center; box-shadow: 0 0.45rem 0 rgb(29 36 48 / 0.12); }
.grb-thanks { font-weight: 800; font-size: 1.75rem; line-height: 1.1; color: var(--brand-text); }
.grb-where { margin-top: 0.6rem; font-family: var(--font-hanken), sans-serif; font-size: 0.9375rem; line-height: 1.5; color: rgb(29 36 48 / 0.75); }
.grb-contact { justify-content: center; margin-top: 1rem; }
.grb-contact a { height: 2.75rem; padding: 0.1rem 1.1rem 0; border-radius: 999px; background: var(--brand); color: var(--on-brand); font-weight: 700; }
.grb-by { margin-top: 1.25rem; font-family: var(--font-hanken), sans-serif; color: rgb(29 36 48 / 0.55); }

@media (min-width: 44rem) {
  .grb-hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 0 2rem; max-width: 62rem; margin: 0 auto; padding-top: 1.5rem; }
  .grb-top { grid-column: 1 / -1; }
  .grb-day { order: 2; width: min(100%, 24rem); margin-top: 3rem; }
  .grb-sign { margin: 3rem 0 0; text-align: left; }
  .grb-grid { grid-template-columns: repeat(4, 1fr); gap: 2rem 1.5rem; }
  .grb-tray { padding: 1.75rem 1.75rem 2.5rem; }
  .grb-foot { margin-inline: auto; }
}
`;
