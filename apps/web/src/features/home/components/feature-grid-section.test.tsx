import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { FeatureGridSection } from "./feature-grid-section";

vi.mock("@/components/ui/reveal", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("FeatureGridSection", () => {
  it("renderiza el numero esperado de caracteristicas", () => {
    render(
      <FeatureGridSection
        heading={{
          eyebrow: "Features",
          title: "Caracteristicas",
          description: "Descripcion",
        }}
        items={[
          {
            id: "a",
            title: "Feature A",
            description: "Detalle A",
            iconKey: "view",
          },
          {
            id: "b",
            title: "Feature B",
            iconKey: "unknown",
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Caracteristicas",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Detalle A")).toBeInTheDocument();
    expect(screen.queryByText("Detalle B")).not.toBeInTheDocument();
  });

  it("admite una lista vacia sin romper la seccion", () => {
    render(
      <FeatureGridSection
        heading={{
          title: "Sin caracteristicas",
        }}
        items={[]}
      />,
    );

    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
