import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { ApiHttpError, apiGet } from "./api-client.server";

const originalApiBaseUrl = process.env.API_BASE_URL;

describe("apiGet", () => {
  beforeEach(() => {
    process.env.API_BASE_URL = "http://127.0.0.1:3001/api/v1/";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    if (originalApiBaseUrl === undefined) {
      delete process.env.API_BASE_URL;
    } else {
      process.env.API_BASE_URL = originalApiBaseUrl;
    }
  });

  it("performs a server GET with no-store cache", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "ok",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(apiGet("/health")).resolves.toEqual({
      status: "ok",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3001/api/v1/health",
      expect.objectContaining({
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }),
    );
  });

  it("preserves the HTTP status for API errors", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    const request = apiGet("/products/no-existe");

    await expect(request).rejects.toBeInstanceOf(ApiHttpError);

    await expect(request).rejects.toMatchObject({
      status: 404,
      path: "/products/no-existe",
    });
  });

  it("fails clearly when API_BASE_URL is missing", async () => {
    delete process.env.API_BASE_URL;

    await expect(apiGet("/health")).rejects.toThrow("API_BASE_URL is required");
  });

  it("rejects unsafe API protocols", async () => {
    process.env.API_BASE_URL = "file:///tmp/api";

    await expect(apiGet("/health")).rejects.toThrow(
      "API_BASE_URL must use http or https",
    );
  });
});
