import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "./not-found";

describe("NotFound", () => {
  it("muestra 404 y permite volver al inicio", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "P\u00e1gina no encontrada",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Volver al inicio",
      }),
    ).toHaveAttribute("href", "/");
  });
});
