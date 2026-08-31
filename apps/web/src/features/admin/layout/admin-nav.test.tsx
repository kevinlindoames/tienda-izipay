import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminNav } from "./admin-nav";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

describe("AdminNav", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/admin");
  });

  it("marks dashboard as current on the admin root", () => {
    render(<AdminNav variant="desktop" />);

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      }),
    ).toHaveAttribute("aria-current", "page");

    expect(
      screen.getByRole("link", {
        name: "Productos",
      }),
    ).not.toHaveAttribute("aria-current");
  });

  it("marks a nested admin section as current", () => {
    mockedUsePathname.mockReturnValue("/admin/productos");

    render(<AdminNav variant="desktop" />);

    expect(
      screen.getByRole("link", {
        name: "Productos",
      }),
    ).toHaveAttribute("aria-current", "page");

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      }),
    ).not.toHaveAttribute("aria-current");
  });

  it("renders the mobile navigation with accessible links", () => {
    mockedUsePathname.mockReturnValue("/admin/pedidos");

    render(<AdminNav variant="mobile" />);

    expect(
      screen.getByRole("navigation", {
        name: "Navegación administrativa móvil",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Pedidos",
      }),
    ).toHaveAttribute("aria-current", "page");
  });
});
