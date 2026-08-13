import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import type { HTMLAttributes, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Reveal } from "./reveal";

const useReducedMotionMock = vi.fn<() => boolean | null>();

vi.mock("motion/react", () => ({
  useReducedMotion: () => useReducedMotionMock(),
  motion: {
    div: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    } & HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="motion-reveal" className={className}>
        {children}
      </div>
    ),
  },
}));

describe("Reveal", () => {
  beforeEach(() => {
    useReducedMotionMock.mockReset();
  });

  it("mantiene Motion cuando Reduced Motion esta desactivado", () => {
    useReducedMotionMock.mockReturnValue(false);

    render(<Reveal className="demo">Contenido</Reveal>);

    expect(screen.getByTestId("motion-reveal")).toHaveClass("demo");
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("retira Motion en cliente si Reduced Motion esta activo", () => {
    useReducedMotionMock.mockReturnValue(true);

    render(<Reveal className="reduced">Contenido reducido</Reveal>);

    expect(screen.queryByTestId("motion-reveal")).not.toBeInTheDocument();

    expect(screen.getByText("Contenido reducido")).toHaveClass("reduced");
  });

  it("no trata null como Reduced Motion activo", () => {
    useReducedMotionMock.mockReturnValue(null);

    render(<Reveal>Contenido inicial</Reveal>);

    expect(screen.getByTestId("motion-reveal")).toBeInTheDocument();
  });

  it("usa el snapshot de servidor para producir markup estable", () => {
    useReducedMotionMock.mockReturnValue(true);

    const html = renderToString(<Reveal className="ssr">Contenido SSR</Reveal>);

    expect(html).toContain('data-testid="motion-reveal"');
    expect(html).toContain("Contenido SSR");
    expect(html).toContain("ssr");
  });
});
