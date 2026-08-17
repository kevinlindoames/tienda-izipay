import { NextResponse } from "next/server";

import type { CurrentAdmin } from "@/features/admin/auth/admin-auth.types";
import { setAdminSessionCookie } from "@/features/admin/auth/admin-session-cookie.server";
import { ApiHttpError, apiPost } from "@/lib/api/api-client.server";

interface LoginBackendResponse {
  admin: CurrentAdmin;
  sessionToken: string;
  expiresAt: string;
}

function isCurrentAdmin(value: unknown): value is CurrentAdmin {
  if (!value || typeof value !== "object") {
    return false;
  }

  const admin = value as Partial<CurrentAdmin>;

  return (
    typeof admin.id === "string" &&
    typeof admin.email === "string" &&
    typeof admin.firstName === "string" &&
    typeof admin.lastName === "string" &&
    (admin.role === "OWNER" || admin.role === "ADMIN")
  );
}

function isLoginBackendResponse(value: unknown): value is LoginBackendResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LoginBackendResponse>;

  return (
    isCurrentAdmin(candidate.admin) &&
    typeof candidate.sessionToken === "string" &&
    candidate.sessionToken.length > 0 &&
    typeof candidate.expiresAt === "string"
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await apiPost("/admin/auth/login", body);

    if (!isLoginBackendResponse(result)) {
      throw new Error("Admin backend returned an invalid login payload.");
    }

    await setAdminSessionCookie(result.sessionToken, result.expiresAt);

    return NextResponse.json({
      admin: result.admin,
    });
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 401) {
      return NextResponse.json(
        {
          message: "Correo o contraseña incorrectos.",
        },
        {
          status: 401,
        },
      );
    }

    if (error instanceof ApiHttpError && error.status === 400) {
      return NextResponse.json(
        {
          message: "Revisa los datos ingresados.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "No se pudo iniciar sesión.",
      },
      {
        status: 502,
      },
    );
  }
}
