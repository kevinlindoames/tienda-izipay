import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CompatibilitySection } from "./compatibility-section";

vi.mock("@/components/ui/reveal", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("CompatibilitySection", () => {
  it("renderiza texto y tarjetas genericas sin logos", () => {
    render(
      <CompatibilitySection
        content={{
          eyebrow: "Compatibilidad",
          title: "Herramientas",
          paragraphs: ["Parrafo uno", "Parrafo dos"],
          items: [
            {
              id: "a",
              title: "Computadoras",
              description: "Detalle",
              iconKey: "resolution",
            },
            {
              id: "b",
              title: "Conexion",
              iconKey: "plug",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Herramientas" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByText("Parrafo uno Parrafo dos")).toBeInTheDocument();
    expect(screen.getByText("Detalle")).toBeInTheDocument();
  });

  it("admite lista vacia", () => {
    render(
      <CompatibilitySection
        content={{
          title: "Sin items",
          paragraphs: [],
          items: [],
        }}
      />,
    );

    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
