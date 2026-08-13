import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TestButton } from "@/test/fixtures/TestButton";

describe("infraestructura de pruebas web", () => {
  it("renderiza React y dispone de los matchers de jest-dom", () => {
    render(<TestButton />);

    expect(
      screen.getByRole("button", { name: "Prueba lista" }),
    ).toBeInTheDocument();
  });
});
