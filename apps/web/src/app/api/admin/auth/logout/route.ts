import {
  clearAdminSessionCookie,
  getAdminSessionToken,
} from "@/features/admin/auth/admin-session-cookie.server";
import { apiPostNoContent } from "@/lib/api/api-client.server";

export async function POST(): Promise<Response> {
  const token = await getAdminSessionToken();

  if (token) {
    try {
      await apiPostNoContent(
        "/admin/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch {
      // Local logout must still remove the browser session.
    }
  }

  await clearAdminSessionCookie();

  return new Response(null, {
    status: 204,
  });
}
