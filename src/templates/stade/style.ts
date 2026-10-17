import { css, type FontFile } from "../kit/style";

export const FONTS: FontFile[] = [{ family: "Big Shoulders Display", file: "big-shoulders-display-var.woff2", weight: "100 900" }];

export const STYLE = css`
.std {
  --turf: #0e3a2b;
  --turf-2: #124634;
  --chalk: rgb(255 255 255 / 0.86);
  --board: #0b0f14;
  --frame: #1c232c;
  --led: #ffd166;
  min-height: 100dvh;
  padding-bottom: 7rem;
  overflow-x: clip;
  /* La pelouse, tondue en bandes */
  background: repeating-linear-gradient(180deg, var(--turf) 0 5.5rem, var(--turf-2) 5.5rem 11rem);
  color: #fff;
  font-family: var(--font-hanken), system-ui, sans-serif;
}
.std-big { font-family: "Big Shoulders Display", var(--font-hanken), sans-serif; text-transform: uppercase; }

/* Le bandeau « en direct », qui défile en haut de l'écran */
.std-live { display: flex; height: 2.25rem; overflow: hidden; background: var(--brand); color: var(--on-brand); font: 800 1rem/2.25rem "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.06em; text-transform: uppercase; }
.std-live b { position: relative; z-index: 1; flex: none; display: flex; align-items: center; gap: 0.45rem; padding: 0 0.8rem; background: var(--board); color: #fff; font-weight: 800; }
.std-live b::before, .std-tag::before { content: ""; width: 0.55rem; height: 0.55rem; border-radius: 50%; background: #ff3b30; animation: std-blink 1.3s steps(2, jump-none) infinite; }
@keyframes std-blink { to { opacity: 0.15; } }
.std-live-track { display: flex; width: max-content; animation: std-slide 30s linear infinite; }
.std-live-track span { flex: none; padding: 0 1.25rem; white-space: nowrap; }
.std-live-track span::after { content: "●"; margin-left: 2.5rem; font-size: 0.5em; vertical-align: middle; opacity: 0.6; }
@keyframes std-slide { to { transform: translateX(-50%); } }

/* L'écran géant du stade : l'image en haut, le tableau d'affichage dessous */
.std-hero { padding: 1rem 0.75rem 1.4rem; }
.std-top { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; max-width: 60rem; margin: 0 auto 0.9rem; }
.std-logo { width: 3rem; height: 3rem; border-radius: 50%; border: 0.18rem solid #fff; }
.std-chips { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.std-chip { display: inline-flex; align-items: center; height: 2.25rem; padding: 0 0.8rem; border-radius: 0.25rem; background: var(--board); color: var(--led); font: 800 1.05rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.08em; text-transform: uppercase; }
.std-jumbo { position: relative; max-width: 60rem; margin: 0 auto; padding: 0.55rem; border-radius: 0.6rem; background: var(--board); box-shadow: 0 0 0 0.2rem var(--frame); animation: std-rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
@keyframes std-rise { from { opacity: 0; transform: translateY(1.5rem); } }
/* Les deux poteaux qui portent l'écran */
.std-jumbo::before, .std-jumbo::after { content: ""; position: absolute; top: calc(100% + 0.2rem); width: 0.7rem; height: 1.4rem; background: var(--frame); }
.std-jumbo::before { left: 16%; }
.std-jumbo::after { right: 16%; }
.std-screen { position: relative; display: block; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 0.3rem; background: #000; }
.std-screen img { width: 100%; height: 100%; }
/* Les points lumineux de l'écran, et la ligne de balayage qui descend */
.std-screen::before { content: ""; position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle, transparent 0 42%, rgb(0 0 0 / 0.42) 58%) 0 0 / 4px 4px; pointer-events: none; }
.std-screen::after { content: ""; position: absolute; inset: 0 0 auto; z-index: 1; height: 28%; background: linear-gradient(transparent, rgb(255 255 255 / 0.1), transparent); animation: std-scan 4.5s linear infinite; pointer-events: none; }
@keyframes std-scan { from { transform: translateY(-100%); } to { transform: translateY(460%); } }
.std-tag { position: absolute; left: 0.6rem; top: 0.6rem; z-index: 2; display: flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.55rem 0.2rem; border-radius: 0.2rem; background: var(--board); font: 800 0.875rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.1em; text-transform: uppercase; }
.std-panel { padding: 0.95rem 0.5rem 0.55rem; text-align: center; }
.std-kind { color: var(--brand-text-dark); font: 800 1rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.16em; text-transform: uppercase; }
.std-name { margin-top: 0.35rem; font: 900 clamp(2.7rem, 13.5vw, 5.5rem)/0.9 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.01em; text-transform: uppercase; text-wrap: balance; overflow-wrap: anywhere; }
.std-intro { max-width: 32rem; margin: 0.6rem auto 0; font-size: 0.9375rem; line-height: 1.45; color: rgb(255 255 255 / 0.72); }

/* Le score : deux compteurs à volets, comme sur les vieux tableaux d'affichage */
.std-score { display: flex; align-items: flex-end; justify-content: center; gap: 0.7rem; margin-top: 1rem; }
.std-side { display: grid; justify-items: center; gap: 0.35rem; min-width: 5.5rem; }
.std-side small { font: 700 0.8125rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: rgb(255 255 255 / 0.62); }
.std-colon { padding-bottom: 0.45rem; font: 800 2.2rem/1 "Big Shoulders Display", sans-serif; color: rgb(255 255 255 / 0.45); }
.std-digits { display: flex; gap: 0.22rem; }
.std-flap { position: relative; display: block; width: 2.15rem; height: 3rem; perspective: 10rem; color: var(--led); font: 800 2.55rem/3rem "Big Shoulders Display", var(--font-hanken), sans-serif; text-align: center; }
.std-flap > span { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background: #1a2029; backface-visibility: hidden; }
.std-flap i { display: block; height: 3rem; font-style: normal; }
.std-h-top, .std-f-top { top: 0; border-radius: 0.25rem 0.25rem 0 0; transform-origin: 50% 100%; }
.std-h-bot, .std-f-bot { bottom: 0; border-radius: 0 0 0.25rem 0.25rem; transform-origin: 50% 0; }
.std-h-bot i, .std-f-bot i { margin-top: -1.5rem; }
/* La charnière du volet */
.std-flap::after { content: ""; position: absolute; inset: calc(50% - 0.5px) 0 auto; z-index: 1; height: 1px; background: #000; }

/* Les catégories : les panneaux du bord du terrain. Le ballon avance avec la lecture (--p, de 0 à 1). */
.std-bar { position: sticky; top: 0; z-index: 20; background: var(--board); border-bottom: 2px solid var(--chalk); }
.std-nav { gap: 0.25rem; padding: 0 0.5rem; }
.std-nav-link { display: flex; align-items: center; height: 3rem; padding: 0 0.9rem; color: rgb(255 255 255 / 0.62); font: 800 1.2rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.06em; text-transform: uppercase; }
.std-nav-on { background: var(--brand); color: var(--on-brand); }
.std-ball {
  position: absolute; bottom: -0.75rem; left: calc(var(--p, 0) * (100% - 1.3rem)); width: 1.3rem; height: 1.3rem; border-radius: 50%; pointer-events: none;
  rotate: calc(var(--p, 0) * 1800deg); box-shadow: 0 0.12rem 0.2rem rgb(0 0 0 / 0.45);
  background:
    radial-gradient(circle at 50% 50%, #151a20 0 19%, transparent 21%),
    radial-gradient(circle at 50% 2%, #151a20 0 15%, transparent 17%),
    radial-gradient(circle at 96% 36%, #151a20 0 15%, transparent 17%),
    radial-gradient(circle at 78% 92%, #151a20 0 15%, transparent 17%),
    radial-gradient(circle at 22% 92%, #151a20 0 15%, transparent 17%),
    radial-gradient(circle at 4% 36%, #151a20 0 15%, transparent 17%),
    #fff;
}

/* Le terrain : les lignes de touche de part et d'autre */
.std-pitch { max-width: 62rem; margin: 0 0.75rem; padding: 0 0.75rem 1rem; border-inline: 2px solid var(--chalk); }
.std-part { scroll-margin-top: 3.4rem; padding-top: 1.75rem; }
/* Le tracé à la chaux qui ouvre chaque catégorie, et sa plaque, penchée comme un habillage de télévision */
.std-kick { position: relative; display: grid; place-items: center; min-height: 7.5rem; margin: 0 -0.75rem; }
.std-kick::before { content: ""; position: absolute; inset: var(--line, 50%) 0 auto; height: 2px; background: var(--chalk); transform: scaleX(var(--drawn, 1)); }
.std-lines { position: absolute; left: 50%; top: 0; width: 15rem; height: 7.5rem; margin-left: -7.5rem; overflow: visible; pointer-events: none; }
.std-lines path, .std-lines circle { fill: none; stroke: var(--chalk); stroke-width: 2; vector-effect: non-scaling-stroke; }
.std-lines .std-spot { fill: var(--chalk); stroke: none; }
.std-title { position: relative; display: flex; align-items: stretch; transform: skewX(-9deg); box-shadow: 0 0.3rem 0 rgb(0 0 0 / 0.3); font: 900 1.9rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.02em; text-transform: uppercase; }
.std-title span { padding: 0.5rem 1rem 0.4rem; background: var(--brand); color: var(--on-brand); }
.std-title small { display: grid; place-items: center; padding: 0 0.7rem; background: var(--board); color: var(--led); font-size: 0.75em; font-variant-numeric: tabular-nums; }

/* Le maillot et son numéro */
.std-shirt {
  display: grid; place-items: center; flex: none; width: 2.7rem; height: 2.5rem; padding-top: 0.45rem; background: var(--brand); color: var(--on-brand);
  font: 800 1.15rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; font-variant-numeric: tabular-nums;
  clip-path: polygon(30% 0, 40% 9%, 60% 9%, 70% 0, 100% 15%, 92% 40%, 78% 33%, 78% 100%, 22% 100%, 22% 33%, 8% 40%, 0 15%);
}

/* Les articles en photo : des vignettes à coller dans l'album */
.std-album { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 0.8rem; margin-top: 1.1rem; }
.std-card { position: relative; }
.std-stick { display: block; width: 100%; padding: 0.3rem 0.3rem 0; border-radius: 0.5rem; background: #fff; color: #10151c; box-shadow: 0 0.25rem 0.6rem rgb(0 0 0 / 0.35); transform: rotate(-1.2deg); text-align: center; }
.std-card:nth-child(even) .std-stick { transform: rotate(1.4deg); }
.std-shot { position: relative; display: block; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 0.3rem; background: var(--brand); }
.std-shot img { width: 100%; height: 100%; }
/* Le reflet du papier brillant */
.std-shot::after { content: ""; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 30%, rgb(255 255 255 / 0.28) 44%, transparent 56%); pointer-events: none; }
.std-shot .std-shirt { position: absolute; left: 0.35rem; top: 0.35rem; z-index: 1; filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.5)); }
.std-stick[data-soldout] img { filter: grayscale(1) brightness(0.8); }
.std-out { position: absolute; inset: auto 0 0.5rem; z-index: 1; padding: 0.2rem; background: var(--board); color: #fff; font: 800 0.95rem/1.2 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.12em; text-transform: uppercase; }
.std-cap { display: block; padding: 0.45rem 0.25rem 0.55rem; }
.std-item { display: block; font: 800 1.2rem/1.05 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.01em; text-transform: uppercase; overflow-wrap: anywhere; }
.std-price { display: inline-block; margin-top: 0.35rem; padding: 0.15rem 0.5rem 0.1rem; border-radius: 0.2rem; background: var(--board); color: var(--led); font: 800 1.1rem/1.15 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.std .std-add { position: absolute; top: 0.6rem; right: 0.6rem; box-shadow: 0 0 0 2px #fff; }

/* Les autres : la feuille de match */
.std-sheet { margin-top: 1.1rem; }
.std-row { display: flex; align-items: center; gap: 0.7rem; border-bottom: 1px solid rgb(255 255 255 / 0.22); }
.std-row:first-child { border-top: 1px solid rgb(255 255 255 / 0.22); }
.std-go { display: grid; flex: 1; min-width: 0; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0 0.75rem; padding: 0.65rem 0; }
.std-go[data-soldout] { opacity: 0.55; }
.std-text { min-width: 0; }
.std-go .std-item { font-size: 1.25rem; }
.std-desc { display: block; margin-top: 0.15rem; font-size: 0.8125rem; line-height: 1.35; color: rgb(255 255 255 / 0.72); }

/* Le bas : la cage, sa barre et son filet */
.std-goal {
  max-width: 40rem; margin: 3rem 0.75rem 0; padding: 2.25rem 1rem 2rem; border: 0.4rem solid #fff; border-bottom: 0; text-align: center;
  background:
    repeating-linear-gradient(45deg, rgb(255 255 255 / 0.17) 0 1px, transparent 1px 0.8rem),
    repeating-linear-gradient(-45deg, rgb(255 255 255 / 0.17) 0 1px, transparent 1px 0.8rem),
    rgb(0 0 0 / 0.3);
}
.std-thanks { font: 900 2.4rem/1 "Big Shoulders Display", var(--font-hanken), sans-serif; letter-spacing: 0.02em; text-transform: uppercase; }
.std-where { margin-top: 0.75rem; font-size: 0.9375rem; line-height: 1.5; color: rgb(255 255 255 / 0.8); }
.std-contact { justify-content: center; margin-top: 1.1rem; }
.std-contact a { height: 2.75rem; padding: 0 1.1rem; border-radius: 0.25rem; background: var(--brand); color: var(--on-brand); font-weight: 700; font-size: 0.875rem; }
.std-by { margin-top: 1.4rem; color: rgb(255 255 255 / 0.6); }

@media (min-width: 52rem) {
  .std-hero { padding: 1.5rem 1.5rem 2rem; }
  .std-jumbo { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); align-items: center; padding: 0.7rem; }
  .std-panel { padding: 1rem 1.5rem; }
  .std-pitch { margin-inline: auto; padding-inline: 1.5rem; }
  .std-kick { margin-inline: -1.5rem; }
  .std-album { grid-template-columns: repeat(4, 1fr); gap: 1.4rem 1.2rem; }
  .std-sheet { display: grid; grid-template-columns: 1fr 1fr; column-gap: 2.5rem; }
  .std-row:nth-child(2) { border-top: 1px solid rgb(255 255 255 / 0.22); }
  .std-goal { margin-inline: auto; }
}
`;
