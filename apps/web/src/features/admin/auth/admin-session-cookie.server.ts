import "server-only";

import { cookies } from "next/headers";

function getAdminCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? "__Host-admin_session"
    : "admin_session";
}

export async function getAdminSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(getAdminCookieName())?.value ?? null;
}

export async function setAdminSessionCookie(
  token: string,
  expiresAt: string,
): Promise<void> {
  const expires = new Date(expiresAt);

  if (Number.isNaN(expires.getTime())) {
    throw new Error("Invalid admin session expiration.");
  }

  const cookieStore = await cookies();

  cookieStore.set(getAdminCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(getAdminCookieName());
}
