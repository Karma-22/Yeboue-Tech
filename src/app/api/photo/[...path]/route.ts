import { adminStorage } from "@/lib/firebase/admin";

/*
 * Sert une photo rangée dans Storage. Chaque fichier a un nom unique et ne
 * change jamais : le navigateur et les relais peuvent le garder un an.
 */

const PATH = /^establishments\/[A-Za-z0-9_-]+\/(item|logo|cover)\/[a-f0-9-]+-(thumb|large)\.(webp|jpg)$/;

export async function GET(_request: Request, { params }: RouteContext<"/api/photo/[...path]">) {
  const path = (await params).path.join("/");
  if (!PATH.test(path)) return new Response(null, { status: 404 });

  try {
    const [content] = await adminStorage().bucket().file(path).download();
    return new Response(new Uint8Array(content), {
      headers: {
        "Content-Type": path.endsWith(".webp") ? "image/webp" : "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
