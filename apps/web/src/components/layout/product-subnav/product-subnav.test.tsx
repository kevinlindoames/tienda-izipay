import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductSubnav } from "./product-subnav";

describe("ProductSubnav", () => {
  it("renderiza producto, codigo, tabs y CTA con estrategia responsive", () => {
    render(
      <ProductSubnav
        content={{
          productName: "Producto demo",
          productCode: "SKU demo",
          items: [
            { label: "Overview", href: "#overview" },
            { label: "Features", href: "#features" },
          ],
          primaryAction: {
            label: "Comprar",
            href: "/checkout",
            external: true,
          },
          secondaryAction: {
            label: "Informacion",
            href: "#contact",
          },
        }}
      />,
    );

    expect(screen.getByText("Producto demo")).toHaveAttribute(
      "title",
      "Producto demo",
    );
    expect(screen.getByText("SKU demo")).toBeInTheDocument();

    expect(
      screen.getByRole("navigation", {
        name: "Navegacion del producto",
      }),
    ).toHaveTextContent("Features");

    const primaryAction = screen.getByRole("link", {
      name: "Comprar",
    });

    expect(primaryAction).toHaveAttribute("target", "_blank");
    expect(primaryAction).not.toHaveClass("hidden");
    expect(primaryAction).toHaveClass("shrink-0");

    const secondaryAction = screen.getByRole("link", {
      name: "Informacion",
    });

    expect(secondaryAction).not.toHaveAttribute("target");
    expect(secondaryAction).toHaveClass("hidden");
    expect(secondaryAction).toHaveClass("lg:inline-flex");
  });

  it("funciona sin codigo ni CTA secundario", () => {
    render(
      <ProductSubnav
        content={{
          productName: "Producto simple",
          items: [],
          primaryAction: {
            label: "Continuar",
            href: "/continuar",
          },
        }}
      />,
    );

    expect(screen.getByText("Producto simple")).toBeInTheDocument();
    expect(screen.queryByText("SKU demo")).not.toBeInTheDocument();

    const primaryAction = screen.getByRole("link", {
      name: "Continuar",
    });

    expect(primaryAction).not.toHaveAttribute("target");
    expect(primaryAction).not.toHaveClass("hidden");
  });
});
