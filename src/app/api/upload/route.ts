import { randomUUID } from "node:crypto";
import { can } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { getMember } from "@/lib/db/establishments";
import { adminStorage } from "@/lib/firebase/admin";

/*
 * L'envoi d'une photo (ARCHITECTURE.md §17). Le navigateur l'a déjà réduite en
 * deux tailles ; le serveur vérifie les droits, puis range les deux fichiers
 * dans Storage. Le navigateur n'écrit donc jamais dans Storage lui-même.
 */

const MAX_BYTES = 1_500_000;
const EXTENSIONS: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg" };
const KINDS = ["item", "logo", "cover"];

function refuse(status: number, message: string) {
  return Response.json({ message }, { status });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.emailVerified) return refuse(401, "Connectez-vous pour envoyer une photo.");

  const form = await request.formData().catch(() => null);
  const establishmentId = form?.get("establishmentId");
  const kind = form?.get("kind");
  const files = { thumb: form?.get("thumb"), large: form?.get("large") };
  if (typeof establishmentId !== "string" || typeof kind !== "string" || !KINDS.includes(kind)) {
    return refuse(400, "Envoi incomplet.");
  }
  if (!(files.thumb instanceof Blob) || !(files.large instanceof Blob)) return refuse(400, "Envoi incomplet.");

  const member = session.superAdmin ? { role: "owner" as const } : await getMember(establishmentId, session.userId);
  if (!member || !can(member.role, kind === "item" ? "menu.edit" : "page.edit")) {
    return refuse(403, "Vous n'avez pas le droit de modifier cet établissement.");
  }

  const id = randomUUID();
  const saved: Record<string, string> = {};
  for (const [size, file] of Object.entries(files) as ["thumb" | "large", Blob][]) {
    const extension = EXTENSIONS[file.type];
    if (!extension) return refuse(415, "Seules les images sont acceptées.");
    if (file.size > MAX_BYTES) return refuse(413, "Cette image est trop lourde.");
    const path = `establishments/${establishmentId}/${kind}/${id}-${size}.${extension}`;
    await adminStorage()
      .bucket()
      .file(path)
      .save(Buffer.from(await file.arrayBuffer()), { contentType: file.type, resumable: false });
    saved[size] = `/api/photo/${path}`;
  }
  return Response.json(saved);
}
