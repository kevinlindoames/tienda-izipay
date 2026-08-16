import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResponsiveMedia } from "./responsive-media";

describe("ResponsiveMedia", () => {
  it("muestra MediaPlaceholder cuando no existen fuentes", () => {
    render(<ResponsiveMedia alt="Imagen principal pendiente" sizes="100vw" />);

    expect(
      screen.getByRole("img", {
        name: "Imagen principal pendiente",
      }),
    ).toHaveTextContent("Imagen principal pendiente");

    expect(
      screen.getByRole("img", {
        name: "Imagen principal pendiente",
      }).tagName,
    ).toBe("DIV");
  });

  it("renderiza una imagen desktop optimizada", () => {
    render(
      <ResponsiveMedia
        desktopSrc="/media/product-desktop.jpg"
        alt="Producto destacado"
        sizes="100vw"
      />,
    );

    const image = screen.getByRole("img", {
      name: "Producto destacado",
    });

    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("sizes", "100vw");
    expect(image).toHaveClass("object-cover");
    expect(image.getAttribute("src")).toBeTruthy();
  });

  it("usa mobileSrc como fallback cuando desktopSrc es nulo", () => {
    const { container } = render(
      <ResponsiveMedia
        mobileSrc="/media/product-mobile.jpg"
        alt="Producto movil"
        sizes="100vw"
      />,
    );

    expect(
      screen.getByRole("img", { name: "Producto movil" }),
    ).toBeInTheDocument();

    expect(container.querySelector("picture")).not.toBeInTheDocument();
  });

  it("crea art direction cuando desktop y mobile son distintos", () => {
    const { container } = render(
      <ResponsiveMedia
        desktopSrc="/media/product-desktop.jpg"
        mobileSrc="/media/product-mobile.jpg"
        alt="Producto responsive"
        sizes="(max-width: 767px) 100vw, 80vw"
      />,
    );

    const picture = container.querySelector("picture");
    const source = container.querySelector(
      'source[media="(max-width: 767px)"]',
    );

    expect(picture).toBeInTheDocument();
    expect(picture).toHaveClass("relative", "block", "h-full", "w-full");
    expect(source).toBeInTheDocument();
    expect(source?.getAttribute("srcset")).toBeTruthy();
    expect(source).toHaveAttribute("sizes", "(max-width: 767px) 100vw, 80vw");

    expect(
      screen.getByRole("img", { name: "Producto responsive" }),
    ).toHaveAttribute("sizes", "(max-width: 767px) 100vw, 80vw");
  });

  it("no crea picture duplicado si mobile y desktop son iguales", () => {
    const { container } = render(
      <ResponsiveMedia
        desktopSrc="/media/product.jpg"
        mobileSrc="/media/product.jpg"
        alt="Producto unico"
        sizes="100vw"
      />,
    );

    expect(container.querySelector("picture")).not.toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: "Producto unico" }),
    ).toBeInTheDocument();
  });

  it("permite cambiar la proporcion mediante className", () => {
    const { container } = render(
      <ResponsiveMedia
        desktopSrc="/media/product.jpg"
        alt="Producto cuatro tercios"
        sizes="50vw"
        className="aspect-[4/3]"
      />,
    );

    expect(container.firstElementChild).toHaveClass("aspect-[4/3]");
    expect(container.firstElementChild).not.toHaveClass("aspect-video");
  });

  it("acepta priority para la imagen principal", () => {
    render(
      <ResponsiveMedia
        desktopSrc="/media/hero.jpg"
        alt="Hero principal"
        priority
        sizes="100vw"
      />,
    );

    expect(
      screen.getByRole("img", { name: "Hero principal" }),
    ).toBeInTheDocument();
  });

  it("permite cargar eager una imagen above the fold", () => {
    render(
      <ResponsiveMedia
        desktopSrc="/media/catalog-lcp.jpg"
        alt="Producto principal"
        sizes="100vw"
        loading="eager"
      />,
    );

    expect(
      screen.getByRole("img", { name: "Producto principal" }),
    ).toHaveAttribute("loading", "eager");
  });
});
