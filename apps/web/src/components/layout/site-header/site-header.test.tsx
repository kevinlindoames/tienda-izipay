import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("muestra marca, navegacion desktop y accion derecha", () => {
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
    expect(screen.getByRole("link", { name: "Soporte" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("tolera una navegacion vacia", () => {
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
      screen.getByRole("navigation", { name: "Navegacion principal" }),
    ).toBeEmptyDOMElement();
  });
});
