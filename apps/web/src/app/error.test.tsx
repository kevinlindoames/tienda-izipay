import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ErrorPage from "./error";

describe("ErrorPage", () => {
  it("muestra fallback y permite reintentar", () => {
    const reset = vi.fn();

    render(
      <ErrorPage
        error={Object.assign(new Error("boom"), {
          digest: "ref-123",
        })}
        reset={reset}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Ocurri\u00f3 un problema",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Referencia: ref-123")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Intentar nuevamente",
      }),
    );

    expect(reset).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("link", {
        name: "Volver al inicio",
      }),
    ).toHaveAttribute("href", "/");
  });

  it("no muestra referencia si no existe digest", () => {
    render(<ErrorPage error={new Error("boom")} reset={vi.fn()} />);

    expect(screen.queryByText(/Referencia:/)).not.toBeInTheDocument();
  });
});
