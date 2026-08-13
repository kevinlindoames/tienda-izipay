import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { MediaTextSection } from "./media-text-section";

vi.mock("@/components/ui/reveal", () => ({
  Reveal: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

describe("MediaTextSection", () => {
  it("mantiene texto antes de media en DOM y alterna a izquierda en desktop", () => {
    const { container } = render(
      <MediaTextSection
        content={{
          id: "demo-left",
          title: "Texto primero",
          body: "Contenido",
          media: {
            desktopSrc: null,
            alt: "Media demo",
          },
          mediaPosition: "left",
          tone: "light",
        }}
      />,
    );

    const grid = container.querySelector(".grid");

    expect(grid?.children[0]).toHaveClass("order-1");
    expect(grid?.children[0]).toHaveClass("lg:order-2");
    expect(grid?.children[1]).toHaveClass("order-2");
    expect(grid?.children[1]).toHaveClass("lg:order-1");
    expect(screen.getByRole("img", { name: "Media demo" })).toBeInTheDocument();
  });

  it("soporta media derecha y tono dark", () => {
    const { container } = render(
      <MediaTextSection
        content={{
          id: "demo-right",
          title: "Seccion oscura",
          body: "Contenido dark",
          media: {
            desktopSrc: null,
            alt: "Media dark",
          },
          mediaPosition: "right",
          tone: "dark",
        }}
      />,
    );

    expect(container.firstElementChild).toHaveClass("bg-[var(--color-dark)]");

    expect(
      screen.getByRole("heading", { level: 2, name: "Seccion oscura" }),
    ).toHaveClass("text-white");
  });

  it("usa tone light por defecto", () => {
    const { container } = render(
      <MediaTextSection
        content={{
          id: "default-tone",
          title: "Default",
          body: "Contenido",
          media: {
            desktopSrc: null,
            alt: "Media default",
          },
          mediaPosition: "right",
        }}
      />,
    );

    expect(container.firstElementChild).toHaveClass("bg-[var(--color-page)]");
  });
});
