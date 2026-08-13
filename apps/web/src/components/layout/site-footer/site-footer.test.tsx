import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("renderiza columnas, contacto, newsletter, redes y legal", () => {
    const { container } = render(
      <SiteFooter
        content={{
          brandName: "Marca demo",
          summary: "Resumen",
          columns: [
            {
              title: "Productos",
              links: [{ label: "Catalogo", href: "/productos" }],
            },
          ],
          contactEmail: "demo@ejemplo.com",
          newsletter: {
            title: "Novedades",
            description: "Newsletter visual",
            statusLabel: "Pendiente",
          },
          socialLabels: ["Red A", "Red B"],
          copyright: "Copyright demo",
        }}
      />,
    );

    expect(screen.getByText("Marca demo")).toBeInTheDocument();

    const contactLine = screen.getByText(/Correo provisional:/);
    expect(contactLine).toHaveTextContent("demo@ejemplo.com");

    expect(screen.getByText("Newsletter visual")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText("Red A")).toBeInTheDocument();
    expect(screen.getByText("Copyright demo")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Catalogo" })).toHaveAttribute(
      "href",
      "/productos",
    );

    expect(container.querySelector("#purchase")).toBeInTheDocument();
    expect(container.querySelector('a[href="#"]')).not.toBeInTheDocument();
  });

  it("funciona sin email y con columnas vacias", () => {
    render(
      <SiteFooter
        content={{
          brandName: "Marca minima",
          summary: "Resumen minimo",
          columns: [],
          newsletter: {
            title: "Newsletter",
            description: "Pendiente",
            statusLabel: "No activo",
          },
          socialLabels: [],
          copyright: "Legal",
        }}
      />,
    );

    expect(screen.getByText("Marca minima")).toBeInTheDocument();
    expect(screen.queryByText(/Correo provisional:/)).not.toBeInTheDocument();
  });
});
