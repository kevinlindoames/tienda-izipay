import { afterEach, describe, expect, it, vi } from "vitest";

import { createOrder } from "./orders.client";

describe("createOrder", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends only the supplied trusted request shape to the Next.js route", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          order: {
            id: "order-1",
            orderNumber: "ORD-20260817-ABC",
            status: "PENDING_PAYMENT",
            currency: "PEN",
            subtotalMinor: 25980,
            deliveryFeeMinor: 0,
            totalMinor: 25980,
            createdAt: "2026-08-17T04:30:00.000Z",
          },
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    const request = {
      firstName: "Kevin",
      lastName: "Lindo",
      email: "kevin@example.com",
      phone: "999999999",
      deliveryMode: "DELIVERY" as const,
      department: "Lima",
      province: "Lima",
      district: "Lima",
      address: "Av. Ejemplo 123",
      items: [
        {
          productId: "product-1",
          quantity: 2,
        },
      ],
    };

    const result = await createOrder(request);

    expect(result.totalMinor).toBe(25980);

    expect(fetchMock).toHaveBeenCalledWith("/api/orders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    expect(JSON.stringify(request)).not.toContain("unitPrice");
    expect(JSON.stringify(request)).not.toContain("subtotalMinor");
    expect(JSON.stringify(request)).not.toContain("totalMinor");
  });

  it("keeps a stock conflict as a controlled user error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response("{}", {
          status: 409,
        }),
      ),
    );

    await expect(
      createOrder({
        firstName: "Kevin",
        lastName: "Lindo",
        email: "kevin@example.com",
        phone: "999999999",
        deliveryMode: "PICKUP",
        items: [
          {
            productId: "product-1",
            quantity: 1,
          },
        ],
      }),
    ).rejects.toThrow("stock suficiente");
  });
});
