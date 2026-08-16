import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeSkeleton } from "./home-skeleton";

describe("HomeSkeleton", () => {
  it("representa la estructura principal del Home durante la carga", () => {
    render(<HomeSkeleton />);

    expect(
      screen.getByRole("main", {
        name: "Cargando p\u00e1gina de inicio",
      }),
    ).toHaveAttribute("aria-busy", "true");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Cargando p\u00e1gina de inicio",
    );

    expect(screen.getByTestId("home-skeleton-hero")).toBeInTheDocument();

    expect(screen.getAllByTestId("home-skeleton-feature-card")).toHaveLength(8);

    expect(screen.getAllByTestId("home-skeleton-editorial-card")).toHaveLength(
      2,
    );

    expect(screen.getAllByTestId("home-skeleton-media-text")).toHaveLength(3);

    expect(
      screen.getAllByTestId("home-skeleton-compatibility-card"),
    ).toHaveLength(4);
  });
});
