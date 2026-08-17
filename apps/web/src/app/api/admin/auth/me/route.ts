import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/features/admin/auth/admin-auth.server";

export async function GET(): Promise<Response> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        message: "Authentication required.",
      },
      {
        status: 401,
      },
    );
  }

  return NextResponse.json({
    admin,
  });
}
