import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CartSummary } from "./cart-summary";

describe("CartSummary", () => {
  it("links a non-empty cart to checkout", () => {
    render(<CartSummary unitCount={2} subtotalMinor={259800} />);

    expect(
      screen.getByRole("link", {
        name: "Continuar al checkout",
      }),
    ).toHaveAttribute("href", "/checkout");
  });
});
