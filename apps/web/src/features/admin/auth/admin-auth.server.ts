import "server-only";

import { ApiHttpError, apiGet } from "@/lib/api/api-client.server";

import type { CurrentAdmin } from "./admin-auth.types";
import { getAdminSessionToken } from "./admin-session-cookie.server";

function isCurrentAdmin(value: unknown): value is CurrentAdmin {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CurrentAdmin>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.firstName === "string" &&
    typeof candidate.lastName === "string" &&
    (candidate.role === "OWNER" || candidate.role === "ADMIN")
  );
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const token = await getAdminSessionToken();

  if (!token) {
    return null;
  }

  try {
    const result = await apiGet("/admin/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!isCurrentAdmin(result)) {
      throw new Error("Admin backend returned an invalid session payload.");
    }

    return result;
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 401) {
      return null;
    }

    throw error;
  }
}
