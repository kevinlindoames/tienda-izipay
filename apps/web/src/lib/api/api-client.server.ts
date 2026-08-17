import "server-only";

const API_TIMEOUT_MS = 8_000;

export class ApiHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
  ) {
    super(`API request failed with HTTP ${status} for ${path}.`);
    this.name = "ApiHttpError";
  }
}

function getApiBaseUrl(): string {
  const rawValue = process.env.API_BASE_URL?.trim();

  if (!rawValue) {
    throw new Error("API_BASE_URL is required by the Next.js server.");
  }

  let baseUrl: URL;

  try {
    baseUrl = new URL(rawValue);
  } catch {
    throw new Error("API_BASE_URL must be a valid absolute URL.");
  }

  if (baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") {
    throw new Error("API_BASE_URL must use http or https.");
  }

  if (baseUrl.username || baseUrl.password) {
    throw new Error("API_BASE_URL must not contain credentials.");
  }

  if (baseUrl.search || baseUrl.hash) {
    throw new Error(
      "API_BASE_URL must not contain query parameters or a hash.",
    );
  }

  return baseUrl.toString().replace(/\/+$/, "");
}

function assertSafeApiPath(path: string): void {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("API path must start with exactly one slash.");
  }
}

async function parseJsonResponse(
  response: Response,
  path: string,
): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new Error(`API returned invalid JSON for ${path}.`);
  }
}

export async function apiGet(path: string): Promise<unknown> {
  assertSafeApiPath(path);

  const requestUrl = `${getApiBaseUrl()}${path}`;

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch {
    throw new Error(`API request could not reach the backend for ${path}.`);
  }

  if (!response.ok) {
    throw new ApiHttpError(response.status, path);
  }

  return parseJsonResponse(response, path);
}

export async function apiPost(path: string, body: unknown): Promise<unknown> {
  assertSafeApiPath(path);

  const requestUrl = `${getApiBaseUrl()}${path}`;

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch {
    throw new Error(`API request could not reach the backend for ${path}.`);
  }

  if (!response.ok) {
    throw new ApiHttpError(response.status, path);
  }

  return parseJsonResponse(response, path);
}
