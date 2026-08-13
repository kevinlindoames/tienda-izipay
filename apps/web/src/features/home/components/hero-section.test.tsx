import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { HeroSection } from "./hero-section";

vi.mock("@/components/ui/reveal", () => ({
  Reveal: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

describe("HeroSection", () => {
  it("renderiza un unico h1, eyebrow, subtitle y placeholder", () => {
    render(
      <HeroSection
        content={{
          eyebrow: "Producto",
          title: "Hero principal",
          subtitle: "Descripcion del hero",
          media: {
            desktopSrc: null,
            mobileSrc: null,
            alt: "Media del hero",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Hero principal" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("Producto")).toBeInTheDocument();
    expect(screen.getByText("Descripcion del hero")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Media del hero" }),
    ).toBeInTheDocument();
  });

  it("funciona sin eyebrow ni subtitle", () => {
    render(
      <HeroSection
        content={{
          title: "Hero minimo",
          media: {
            desktopSrc: null,
            alt: "Media minima",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Hero minimo" }),
    ).toBeInTheDocument();

    expect(screen.queryByText("Descripcion del hero")).not.toBeInTheDocument();
  });
});
