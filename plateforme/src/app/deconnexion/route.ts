import { NextResponse } from "next/server";
import { endSession } from "@/lib/auth/session";

/** Ferme la session, puis renvoie à la connexion. Sert quand le compte derrière un cookie n'existe plus. */
export async function GET(request: Request) {
  await endSession();
  return NextResponse.redirect(new URL("/connexion", request.url));
}
