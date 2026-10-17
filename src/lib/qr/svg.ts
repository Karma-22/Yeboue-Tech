import QRCode from "qrcode";

/*
 * Dessine un QR Code en SVG, aux couleurs de la marque : modules arrondis, et
 * les trois repères des angles dessinés comme le symbole Yéboué Tech (anneau
 * arrondi, centre plein). Le calcul du code vient de la bibliothèque libre
 * `qrcode` ; seul le dessin est fait ici. Un test relit le résultat avec un
 * vrai décodeur.
 */

/** Marge blanche autour du code, en modules. La norme en demande quatre. */
const QUIET_ZONE = 4;
const FINDER_SIZE = 7;

export interface QrOptions {
  /** Couleur des modules. */
  dark?: string;
  /** Couleur du fond. */
  light?: string;
  /** Couleur du centre des trois repères. */
  accent?: string;
}

interface Matrix {
  size: number;
  isDark: (row: number, column: number) => boolean;
}

function matrixOf(text: string): Matrix {
  // Niveau de correction « M » : le code reste lisible même un peu abîmé ou taché.
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  return { size: modules.size, isDark: (row, column) => modules.get(row, column) === 1 };
}

function inFinder(matrix: Matrix, row: number, column: number): boolean {
  const { size } = matrix;
  const top = row < FINDER_SIZE;
  const left = column < FINDER_SIZE;
  const bottom = row >= size - FINDER_SIZE;
  const right = column >= size - FINDER_SIZE;
  return (top && left) || (top && right) || (bottom && left);
}

/** Un repère d'angle : l'anneau arrondi de 7 modules, et son centre de 3 modules. */
function finder(x: number, y: number, dark: string, light: string, accent: string): string {
  return [
    `<rect x="${x}" y="${y}" width="7" height="7" rx="2" fill="${dark}"/>`,
    `<rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="1.15" fill="${light}"/>`,
    `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="1" fill="${accent}"/>`,
  ].join("");
}

/** Le QR Code d'une adresse, en SVG. Net à n'importe quelle taille d'impression. */
export function qrSvg(text: string, options: QrOptions = {}): string {
  const dark = options.dark ?? "#14213D";
  const light = options.light ?? "#FFFFFF";
  const accent = options.accent ?? dark;
  const matrix = matrixOf(text);
  const total = matrix.size + QUIET_ZONE * 2;

  const dots: string[] = [];
  for (let row = 0; row < matrix.size; row += 1) {
    for (let column = 0; column < matrix.size; column += 1) {
      if (!matrix.isDark(row, column) || inFinder(matrix, row, column)) continue;
      // Des carrés à peine arrondis : le dessin est plus doux, la lecture reste sûre.
      dots.push(
        `<rect x="${column + QUIET_ZONE + 0.04}" y="${row + QUIET_ZONE + 0.04}" width="0.92" height="0.92" rx="0.28"/>`,
      );
    }
  }

  const far = QUIET_ZONE + matrix.size - FINDER_SIZE;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="geometricPrecision">`,
    `<rect width="${total}" height="${total}" fill="${light}"/>`,
    `<g fill="${dark}">${dots.join("")}</g>`,
    finder(QUIET_ZONE, QUIET_ZONE, dark, light, accent),
    finder(far, QUIET_ZONE, dark, light, accent),
    finder(QUIET_ZONE, far, dark, light, accent),
    "</svg>",
  ].join("");
}
