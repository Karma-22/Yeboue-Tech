/*
 * La réduction des photos, dans le navigateur (ARCHITECTURE.md §6.3) : une
 * photo de téléphone pèse plusieurs mégaoctets ; on n'envoie que deux petites
 * versions, déjà à la bonne taille.
 */

export const THUMB_WIDTH = 640;
export const LARGE_WIDTH = 1200;

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function draw(file: File, maxWidth: number): Promise<HTMLCanvasElement> {
  // « from-image » redresse les photos prises téléphone tourné.
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Ce navigateur ne sait pas réduire les images.");
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas;
}

/** Réduit une photo à `maxWidth` pixels de large, en WebP ; en JPEG si le navigateur ne sait pas écrire du WebP. */
export async function resizeImage(file: File, maxWidth: number, quality = 0.8): Promise<Blob> {
  const canvas = await draw(file, maxWidth);
  const webp = await toBlob(canvas, "image/webp", quality);
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await toBlob(canvas, "image/jpeg", quality);
  if (!jpeg) throw new Error("Cette image n'a pas pu être lue.");
  return jpeg;
}

export interface UploadedPhoto {
  thumb: string;
  large: string;
}

/** Réduit une photo en deux tailles et les envoie au serveur. Rend leurs adresses. */
export async function uploadPhoto(
  file: File,
  establishmentId: string,
  kind: "item" | "logo" | "cover",
): Promise<UploadedPhoto> {
  if (!file.type.startsWith("image/")) throw new Error("Choisissez une image.");
  const [thumb, large] = await Promise.all([
    // La vignette est vue en petit, dans une liste : un peu plus de compression ne se remarque pas.
    resizeImage(file, kind === "logo" ? 256 : THUMB_WIDTH, 0.72),
    resizeImage(file, kind === "logo" ? 512 : LARGE_WIDTH),
  ]);
  const body = new FormData();
  body.set("establishmentId", establishmentId);
  body.set("kind", kind);
  body.set("thumb", thumb);
  body.set("large", large);
  const response = await fetch("/api/upload", { method: "POST", body });
  const result = (await response.json().catch(() => null)) as (UploadedPhoto & { message?: string }) | null;
  if (!response.ok || !result) throw new Error(result?.message ?? "L'image n'a pas pu être envoyée. Réessayez.");
  return { thumb: result.thumb, large: result.large };
}
