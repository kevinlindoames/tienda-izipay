import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCartStore } from "@/features/cart/stores/cart.store";

import { createOrder } from "../api/orders.client";
import { useCheckoutDraftStore } from "../stores/checkout-draft.store";
import { CheckoutForm } from "./checkout-form";

vi.mock("../api/orders.client", () => ({
  createOrder: vi.fn(),
}));

const createOrderMock = vi.mocked(createOrder);

describe("CheckoutForm", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [
        {
          productId: "product-1",
          slug: "producto-1",
          sku: "SKU-001",
          name: "Producto 1",
          unitPrice: {
            minorAmount: 12990,
            currency: "PEN",
          },
          image: null,
          quantity: 2,
        },
      ],
      hasHydrated: true,
    });

    useCheckoutDraftStore.setState({
      draft: null,
    });

    createOrderMock.mockReset();
  });

  it("sends productId and quantity without cart prices", async () => {
    createOrderMock.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-20260817-ABC",
      status: "PENDING_PAYMENT",
      currency: "PEN",
      subtotalMinor: 25980,
      deliveryFeeMinor: 0,
      totalMinor: 25980,
      createdAt: "2026-08-17T04:30:00.000Z",
    });

    const onOrderCreated = vi.fn();

    render(<CheckoutForm onOrderCreated={onOrderCreated} />);

    fireEvent.change(screen.getByLabelText(/nombres/i), {
      target: {
        value: "Kevin",
      },
    });

    fireEvent.change(screen.getByLabelText(/apellidos/i), {
      target: {
        value: "Lindo",
      },
    });

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: {
        value: "kevin@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText(/telefono/i), {
      target: {
        value: "999999999",
      },
    });

    fireEvent.change(screen.getByLabelText(/departamento/i), {
      target: {
        value: "Lima",
      },
    });

    fireEvent.change(screen.getByLabelText(/provincia/i), {
      target: {
        value: "Lima",
      },
    });

    fireEvent.change(screen.getByLabelText(/distrito/i), {
      target: {
        value: "Lima",
      },
    });

    fireEvent.change(screen.getByLabelText(/direccion/i), {
      target: {
        value: "Av. Ejemplo 123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /crear pedido/i,
      }),
    );

    await waitFor(() => {
      expect(createOrderMock).toHaveBeenCalledTimes(1);
    });

    const request = createOrderMock.mock.calls[0]?.[0];

    expect(request).toBeDefined();

    if (!request) {
      throw new Error("Expected createOrder to be called.");
    }

    expect(request.items).toEqual([
      {
        productId: "product-1",
        quantity: 2,
      },
    ]);

    expect(JSON.stringify(request)).not.toContain("unitPrice");
    expect(JSON.stringify(request)).not.toContain("12990");

    await waitFor(() => {
      expect(onOrderCreated).toHaveBeenCalledTimes(1);
    });

    expect(useCartStore.getState().items).toEqual([]);
    expect(useCheckoutDraftStore.getState().draft).toBeNull();
  });

  it("does not clear cart or draft when order creation fails", async () => {
    createOrderMock.mockRejectedValue(
      new Error("Uno o mas productos ya no tienen stock suficiente."),
    );

    useCheckoutDraftStore.setState({
      draft: {
        firstName: "Kevin",
        lastName: "Lindo",
        email: "kevin@example.com",
        phone: "999999999",
        deliveryMode: "pickup",
      },
    });

    render(<CheckoutForm onOrderCreated={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/modalidad de entrega/i), {
      target: {
        value: "pickup",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /crear pedido/i,
      }),
    );

    await screen.findByRole("alert");

    expect(screen.getByRole("alert")).toHaveTextContent("stock suficiente");

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCheckoutDraftStore.getState().draft).not.toBeNull();
  });
});
