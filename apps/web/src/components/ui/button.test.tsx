import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renderiza un button primary por defecto", () => {
    render(<Button>Guardar</Button>);

    const button = screen.getByRole("button", { name: "Guardar" });

    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("min-h-11");
    expect(button).toHaveClass("bg-[var(--color-dark)]");
  });

  it("respeta un type HTML explicito", () => {
    render(<Button type="submit">Enviar</Button>);

    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("renderiza secondary como enlace cuando recibe href", () => {
    render(
      <Button href="/catalogo" variant="secondary">
        Catalogo
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Catalogo" });

    expect(link).toHaveAttribute("href", "/catalogo");
    expect(link).toHaveClass("border");
    expect(link).toHaveClass("bg-[var(--color-surface)]");
  });

  it("soporta la variante ghost", () => {
    render(
      <Button href="#detalle" variant="ghost">
        Ver detalle
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveClass(
      "bg-transparent",
    );
  });

  it("respeta disabled en un button real", () => {
    render(<Button disabled>No disponible</Button>);

    expect(
      screen.getByRole("button", { name: "No disponible" }),
    ).toBeDisabled();
  });

  it("bloquea la activacion de un enlace disabled", () => {
    const onClick = vi.fn();

    render(
      <Button href="/checkout" disabled onClick={onClick}>
        Comprar
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Comprar" });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");

    const clickResult = fireEvent.click(link);

    expect(clickResult).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ejecuta onClick en un enlace habilitado", () => {
    const onClick = vi.fn();

    render(
      <Button href="#comprar" onClick={onClick}>
        Comprar
      </Button>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Comprar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("permite clases adicionales sin perder las clases base", () => {
    render(<Button className="custom-button">Accion</Button>);

    const button = screen.getByRole("button", { name: "Accion" });

    expect(button).toHaveClass("custom-button");
    expect(button).toHaveClass("min-h-11");
  });
});
