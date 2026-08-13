import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { DarkHighlightSection } from "./dark-highlight-section";

vi.mock("@/components/ui/reveal", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("DarkHighlightSection", () => {
  it("renderiza heading inverse y media informativa", () => {
    render(
      <DarkHighlightSection
        content={{
          eyebrow: "Tecnologia",
          title: "Highlight",
          body: "Descripcion destacada",
          media: {
            desktopSrc: null,
            alt: "Grafico informativo",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Highlight" }),
    ).toHaveClass("text-white");

    expect(
      screen.getByRole("img", { name: "Grafico informativo" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Descripcion destacada")).toBeInTheDocument();
  });
});
