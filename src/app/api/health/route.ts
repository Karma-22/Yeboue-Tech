import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    hasProjectId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? null,
    hasClientEmail: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
    hasPrivateKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
    hasApiKey: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  };

  let firebaseAdminImportError: string | null = null;
  try {
    const admin = await import("firebase-admin/app");
    firebaseAdminImportError = admin ? null : "empty admin";
  } catch (err: unknown) {
    firebaseAdminImportError = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  }

  return NextResponse.json({
    status: "ok",
    nodeVersion: process.version,
    envCheck,
    firebaseAdminImportError,
  });
}
