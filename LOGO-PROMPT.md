# Logo Yéboué Tech — brief et prompt

## 1. L'idée

**« Le repère ».** Aux coins de tout QR Code se trouve un carré arrondi avec une forme pleine au centre. Vu de dessus, c'est aussi **une assiette posée sur une table**. Le logo est ce signe, seul : il dit le QR Code et le repas en même temps.

Le logo se compose de deux parties :
- **le symbole** : le repère ;
- **le nom** : « Yéboué Tech », écrit à côté.

---

## 2. Le format attendu

**Du SVG vectoriel.** Attention : la plupart des générateurs d'images (Midjourney, DALL·E, Gemini…) produisent du PNG ou du JPG, pas du vrai SVG. Un fichier `.svg` qui contient simplement une image collée dedans ne convient pas.

Trois façons d'obtenir un vrai SVG :
1. Un générateur qui exporte en vectoriel (Recraft, par exemple).
2. Générer une image, puis la redessiner dans Figma ou Inkscape (gratuits). La forme est si simple que cela prend quelques minutes.
3. Partir directement du croquis de la section 5 et l'ajuster.

### Fichiers à fournir
| Fichier | Contenu |
|---|---|
| `logo-mark.svg` | Le symbole seul, en couleurs |
| `logo-full.svg` | Symbole + nom, à l'horizontale, pour fond clair |
| `logo-full-light.svg` | La même chose pour fond sombre (texte ivoire) |
| `logo-mark-mono.svg` | Le symbole en une seule couleur |

### Exigences techniques
- Symbole dans un carré, `viewBox="0 0 64 64"`.
- Uniquement des formes pleines : pas de dégradé, pas d'ombre, pas de flou, pas d'image incorporée.
- Trois formes au maximum dans le symbole.
- Le nom converti en tracés (pour ne pas dépendre de la police installée).
- Fond transparent.
- Poids du fichier : quelques kilo-octets.

### Tests à passer
- Lisible à **16 pixels** de côté (icône d'onglet).
- Reconnaissable en **noir sur blanc**, sans aucune couleur.
- Net une fois imprimé sur un chevalet de table.

---

## 3. Les couleurs et la police

| Nom | Code | Emploi dans le logo |
|---|---|---|
| Encre | `#14213D` | Le carré extérieur, le nom |
| Braise | `#F2622E` | La forme centrale (l'assiette) |
| Ivoire | `#FAF6EF` | L'espace entre les deux ; le nom sur fond sombre |

Police du nom : **Bricolage Grotesque**, graisse 700, gratuite sur Google Fonts. « Yéboué » et « Tech » sur une seule ligne, avec l'accent aigu bien visible sur les deux « é ».

---

## 4. Le prompt

À coller dans le générateur. Il est en anglais, car ces outils le comprennent mieux.

```
Minimal flat vector logo mark for "Yéboué Tech", a restaurant QR-code menu
platform from Côte d'Ivoire.

Concept: a single QR code finder pattern (the corner marker of a QR code)
that also reads as a plate seen from directly above on a table.

Shape: one thick rounded-square ring with generous corner radius, in deep
navy blue #14213D. Inside it, centered, with clear empty space all around,
one solid circle in warm orange #F2622E. Nothing else. Three shapes maximum.

Style: geometric, bold, flat solid fills, perfectly symmetrical, even stroke
weight, generous negative space, Swiss graphic design, timeless, confident.
Must stay legible at 16 pixels and work in a single colour.

Composition: the mark centered on a plain warm off-white background #FAF6EF,
square format, large margins, front view, no perspective.
```

### Variante avec le nom
```
Horizontal logo lockup. On the left, the mark described above. On the right,
the wordmark "Yéboué Tech" on a single line, in a bold contemporary grotesque
sans-serif similar to Bricolage Grotesque, deep navy #14213D, tight letter
spacing, the acute accents on both "é" clearly visible. The wordmark height
equals about half the mark height. Plain warm off-white background #FAF6EF.
```

### À exclure (prompt négatif)
```
gradient, shadow, glow, neon, 3D, bevel, emboss, texture, photo, mockup,
circuit board, wires, nodes, technology lines, full QR code, pixels grid,
fork, spoon, knife, chef hat, flame, leaf, letter Y monogram, extra shapes,
thin lines, outline only, multiple colours beyond navy and orange,
watermark, signature, border, frame, tagline, small text
```

### Conseils
- Générer plusieurs essais et garder **le plus simple**, pas le plus spectaculaire.
- Si l'outil ajoute des détails (traits fins, reflets, motifs), les retirer à la main.
- Les générateurs écrivent souvent mal les accents : vérifier « Yéboué » lettre par lettre, ou générer le symbole seul et ajouter le nom ensuite dans Figma.

---

## 5. Croquis de référence

La géométrie exacte de l'idée, pour servir de point de départ ou de comparaison. Enregistré dans un fichier `.svg`, il s'ouvre dans un navigateur, Figma ou Inkscape.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="4" y="4" width="56" height="56" rx="16" fill="#14213D"/>
  <rect x="14" y="14" width="36" height="36" rx="9" fill="#FAF6EF"/>
  <circle cx="32" cy="32" r="9" fill="#F2622E"/>
</svg>
```

Ce qui peut être ajusté : l'épaisseur de l'anneau, l'arrondi des coins, la taille du cercle. Ce qui ne doit pas changer : trois formes, deux couleurs, une symétrie parfaite.

---

## 6. Où déposer les fichiers

Dans le dossier `image/` du projet, avec les noms de la section 2.
