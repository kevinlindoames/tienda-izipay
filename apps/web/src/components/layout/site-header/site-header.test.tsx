import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "@/features/cart/stores/cart.store";

import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      items: [],
      hasHydrated: false,
    });
  });

  it("shows brand, desktop navigation, action and cart", () => {
    render(
      <SiteHeader
        content={{
          brandName: "Marca demo",
          navigation: [
            { label: "Productos", href: "#features" },
            { label: "Soluciones", href: "#use-cases" },
            { label: "Soporte", href: "#contact" },
          ],
        }}
      />,
    );

    expect(screen.getByText("Marca demo")).toHaveAttribute("href", "#overview");

    const navigation = screen.getByRole("navigation", {
      name: "Navegacion principal",
    });

    expect(navigation).toHaveTextContent("Productos");
    expect(navigation).toHaveTextContent("Soluciones");

    expect(
      screen.getByRole("link", {
        name: "Soporte",
      }),
    ).toHaveAttribute("href", "#contact");

    expect(
      screen.getByRole("link", {
        name: "Carrito, 0 unidades",
      }),
    ).toHaveAttribute("href", "/carrito");
  });

  it("supports empty navigation while keeping cart access", () => {
    render(
      <SiteHeader
        content={{
          brandName: "Marca sin enlaces",
          navigation: [],
        }}
      />,
    );

    expect(screen.getByText("Marca sin enlaces")).toBeInTheDocument();

    expect(
      screen.getByRole("navigation", {
        name: "Navegacion principal",
      }),
    ).toBeEmptyDOMElement();

    expect(
      screen.getByRole("link", {
        name: "Carrito, 0 unidades",
      }),
    ).toBeInTheDocument();
  });
});
