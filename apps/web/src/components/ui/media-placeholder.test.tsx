import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MediaPlaceholder } from "./media-placeholder";

describe("MediaPlaceholder", () => {
  it("usa proporcion 16/9 y tono light por defecto", () => {
    render(<MediaPlaceholder label="Imagen pendiente" />);

    const placeholder = screen.getByRole("img", {
      name: "Imagen pendiente",
    });

    expect(placeholder).toHaveClass("aspect-video");
    expect(placeholder).toHaveClass("bg-[var(--color-surface-soft)]");
    expect(placeholder).toHaveTextContent("Imagen pendiente");
  });

  it("soporta proporcion portrait y tono dark", () => {
    render(
      <MediaPlaceholder
        label="Retrato pendiente"
        aspectRatio="portrait"
        tone="dark"
      />,
    );

    const placeholder = screen.getByRole("img", {
      name: "Retrato pendiente",
    });

    expect(placeholder).toHaveClass("aspect-[3/4]");
    expect(placeholder).toHaveClass("bg-[var(--color-dark)]");
  });

  it("soporta proporcion 4/3 y tono brand", () => {
    render(
      <MediaPlaceholder
        label="Media de marca"
        aspectRatio="4/3"
        tone="brand"
      />,
    );

    const placeholder = screen.getByRole("img", {
      name: "Media de marca",
    });

    expect(placeholder).toHaveClass("aspect-[4/3]");
    expect(placeholder).toHaveClass("bg-[var(--color-brand)]");
  });

  it("soporta proporciones 3/2 y 1/1", () => {
    const { rerender } = render(
      <MediaPlaceholder label="Media 3/2" aspectRatio="3/2" />,
    );

    expect(screen.getByRole("img", { name: "Media 3/2" })).toHaveClass(
      "aspect-[3/2]",
    );

    rerender(<MediaPlaceholder label="Media cuadrada" aspectRatio="1/1" />);

    expect(screen.getByRole("img", { name: "Media cuadrada" })).toHaveClass(
      "aspect-square",
    );
  });

  it("permite clases adicionales", () => {
    render(
      <MediaPlaceholder label="Media personalizada" className="custom-media" />,
    );

    expect(
      screen.getByRole("img", { name: "Media personalizada" }),
    ).toHaveClass("custom-media");
  });
});
