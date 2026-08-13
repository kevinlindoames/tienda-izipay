import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renderiza contenido opcional y alineacion centrada", () => {
    const { container } = render(
      <SectionHeading
        eyebrow="Eyebrow"
        title="Titulo"
        description="Descripcion"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Titulo" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(screen.getByText("Descripcion")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("items-center");
  });

  it("soporta alineacion izquierda e inverse", () => {
    const { container } = render(
      <SectionHeading title="Titulo oscuro" align="left" inverse />,
    );

    expect(container.firstElementChild).toHaveClass("items-start");
    expect(
      screen.getByRole("heading", { level: 2, name: "Titulo oscuro" }),
    ).toHaveClass("text-white");
    expect(screen.queryByText("Eyebrow")).not.toBeInTheDocument();
  });
});
