import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "./container";

describe("Container", () => {
  it("renderiza un div por defecto con ancho y padding base", () => {
    const { container } = render(<Container>Contenido</Container>);

    const element = container.firstElementChild;

    expect(element?.tagName).toBe("DIV");
    expect(element).toHaveClass("mx-auto");
    expect(element).toHaveClass("w-full");
    expect(element).toHaveClass("max-w-[var(--container-max)]");
    expect(element).toHaveClass("px-4");
  });

  it("permite cambiar el elemento semantico y agregar clases", () => {
    render(
      <Container as="nav" className="test-navigation">
        Navegacion
      </Container>,
    );

    const navigation = screen.getByRole("navigation");

    expect(navigation).toHaveClass("test-navigation");
    expect(navigation).toHaveTextContent("Navegacion");
  });
});
