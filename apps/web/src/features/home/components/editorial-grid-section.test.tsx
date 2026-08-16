import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { EditorialGridSection } from "./editorial-grid-section";

vi.mock("@/components/ui/reveal", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("EditorialGridSection", () => {
  it("renderiza heading y dos tarjetas editoriales", () => {
    render(
      <EditorialGridSection
        content={{
          eyebrow: "Usos",
          title: "Casos de uso",
          description: "Descripcion editorial",
          items: [
            {
              id: "a",
              title: "Escenario A",
              body: "Detalle A",
              media: {
                id: "test-media",
                desktopSrc: null,
                alt: "Media A",
              },
              mediaPosition: "left",
            },
            {
              id: "b",
              title: "Escenario B",
              body: "Detalle B",
              media: {
                id: "test-media",
                desktopSrc: null,
                alt: "Media B",
              },
              mediaPosition: "right",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Casos de uso" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Media A" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Media B" })).toBeInTheDocument();
  });
});
