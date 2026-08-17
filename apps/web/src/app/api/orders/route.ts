import { NextResponse } from "next/server";

import { ApiHttpError, apiPost } from "@/lib/api/api-client.server";

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
    const result = await apiPost("/orders", body);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ApiHttpError) {
      if (
        error.status === 400 ||
        error.status === 404 ||
        error.status === 409
      ) {
        return NextResponse.json(
          {
            message: "Order request rejected by backend.",
          },
          {
            status: error.status,
          },
        );
      }

      return NextResponse.json(
        {
          message: "Order backend returned an unexpected response.",
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Order backend is unavailable.",
      },
      {
        status: 502,
      },
    );
  }
}
