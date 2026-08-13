import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MobileMenu } from "./mobile-menu";

const navigation = [
  { label: "Productos", href: "#features" },
  { label: "Soporte", href: "#contact" },
];

describe("MobileMenu", () => {
  it("abre y cierra el menu con atributos aria correctos", () => {
    render(<MobileMenu navigation={navigation} />);

    const openButton = screen.getByRole("button", {
      name: "Abrir menu",
    });

    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", {
        name: "Navegacion movil",
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(openButton);

    const closeButton = screen.getByRole("button", {
      name: "Cerrar menu",
    });

    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    expect(closeButton).toHaveAttribute(
      "aria-controls",
      "mobile-site-navigation",
    );

    fireEvent.click(closeButton);

    expect(
      screen.queryByRole("navigation", {
        name: "Navegacion movil",
      }),
    ).not.toBeInTheDocument();
  });

  it("cierra el menu al seleccionar un enlace", () => {
    render(<MobileMenu navigation={navigation} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu",
      }),
    );

    fireEvent.click(
      screen.getByRole("link", {
        name: "Productos",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Abrir menu",
      }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("cierra con Escape y devuelve focus al trigger", () => {
    render(<MobileMenu navigation={navigation} />);

    const trigger = screen.getByRole("button", {
      name: "Abrir menu",
    });

    fireEvent.click(trigger);

    const navigationElement = screen.getByRole("navigation", {
      name: "Navegacion movil",
    });

    fireEvent.keyDown(navigationElement, {
      key: "Escape",
    });

    const reopenedTrigger = screen.getByRole("button", {
      name: "Abrir menu",
    });

    expect(reopenedTrigger).toHaveFocus();
    expect(
      screen.queryByRole("navigation", {
        name: "Navegacion movil",
      }),
    ).not.toBeInTheDocument();
  });

  it("ignora otras teclas y mantiene el menu abierto", () => {
    render(<MobileMenu navigation={navigation} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu",
      }),
    );

    const navigationElement = screen.getByRole("navigation", {
      name: "Navegacion movil",
    });

    fireEvent.keyDown(navigationElement, {
      key: "ArrowDown",
    });

    expect(navigationElement).toBeVisible();
  });
});
