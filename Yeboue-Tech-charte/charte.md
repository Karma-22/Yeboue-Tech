# Yéboué Tech

Plateforme ivoirienne de menus de restaurant par QR Code. Cette charte réunit le logo, les trois couleurs et la police de la marque. Elle part du brief « Le repère » et ne contient pour l'instant que l'identité (pas encore de composants d'interface).

## L'idée du logo : « le repère »

Aux coins de tout QR Code, il y a un carré arrondi avec une forme pleine au centre : c'est un repère. Vu de dessus, ce même signe est aussi une assiette posée sur une table. Le symbole dit donc deux choses à la fois : le QR Code et le repas.

Le symbole tient en trois formes, sur une grille `viewBox="0 0 64 64"` :

| Forme | Géométrie | Couleur |
|---|---|---|
| Anneau (carré extérieur) | `x=4 y=4 w=56 h=56`, arrondi `radius-mark-outer` (16) | `ink` |
| Espace intérieur | `x=14 y=14 w=36 h=36`, arrondi `radius-mark-inner` (9) | `ivory` |
| Assiette | cercle `cx=32 cy=32 r=9` | `ember` |

Ce qui ne change jamais : trois formes, deux couleurs plus l'ivoire, une symétrie parfaite.

## Les fichiers du logo

À ranger dans le dossier `image/` du site.

| Fichier | Quand l'utiliser |
|---|---|
| `logo-mark.svg` | Le symbole seul, en couleurs : favicon, avatar, icône d'application. |
| `logo-full.svg` | Symbole + nom, sur fond clair (`ivory`, blanc). |
| `logo-full-light.svg` | Symbole + nom, sur fond sombre (`ink`, photos sombres). L'anneau et le nom passent en `ivory`, l'espace intérieur en `ink`. |
| `logo-mark-mono.svg` | Le symbole en une seule couleur (`ink`), centre transparent : tampon, gravure, impression une couleur, noir sur blanc. |

Le nom « Yéboué Tech » est en Bricolage Grotesque 700, interlettrage −0,02 em, converti en tracés : il s'affiche pareil partout, même sans la police installée. Sa hauteur de capitale (28) vaut la moitié du symbole.

## Règles d'usage

- **Zone de protection** (recommandation) : laisser autour du logo au moins l'épaisseur de l'anneau, soit 10/64 de la hauteur du symbole.
- **Taille minimale** : le symbole reste lisible à 16 px (testé). Le logo complet reste lisible à partir d'environ 150 px de large.
- **Choisir la bonne version** : `logo-full` sur fond clair, `logo-full-light` sur fond sombre. Ne jamais poser `logo-full` sur `ink` : l'anneau disparaîtrait.
- **Ne pas** ajouter de dégradé, d'ombre, de contour, de reflet, de 3D ; ne pas ajouter de fourchette, de toque, de flamme ou de grille de pixels ; ne pas déformer ni recolorer en dehors des trois couleurs.

## Couleurs

| Token | Nom | Code | Rôle |
|---|---|---|---|
| `ink` | Encre | `#14213D` | Anneau, nom sur fond clair, fonds sombres. |
| `ember` | Braise | `#F2622E` | L'assiette ; accent. Contraste 3:1 sur ivoire : formes et grands titres seulement, jamais de petit texte. |
| `ivory` | Ivoire | `#FAF6EF` | Espace intérieur, fonds clairs, nom sur fond sombre. |

Tokens de thème : `surface` (fond de page), `text` (texte et anneau) et `accent` s'inversent automatiquement entre les thèmes clair et sombre.

## Typographie

**Bricolage Grotesque**, graisse 700, gratuite sur Google Fonts. Utilisée pour le nom dans le logo (style `wordmark`). Les accents aigus des deux « é » doivent rester bien visibles. Les styles de texte de l'interface (titres, paragraphes) restent à définir.
