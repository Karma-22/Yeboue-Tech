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

  let getSessionError: string | null = null;
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    getSessionError = session ? "session found" : "no session (null)";
  } catch (err: unknown) {
    getSessionError = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  }

  let adminAuthError: string | null = null;
  try {
    const { adminAuth } = await import("@/lib/firebase/admin");
    adminAuth();
  } catch (err: unknown) {
    adminAuthError = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  }

  let authActionsError: string | null = null;
  try {
    const actions = await import("@/app/(auth)/actions");
    authActionsError = actions ? "imported actions ok" : "actions empty";
  } catch (err: unknown) {
    authActionsError = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  }

  return NextResponse.json({
    status: "ok",
    nodeVersion: process.version,
    envCheck,
    firebaseAdminImportError,
    getSessionError,
    adminAuthError,
    authActionsError,
  });
}
