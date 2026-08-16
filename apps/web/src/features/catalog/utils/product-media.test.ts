import { describe, expect, it } from "vitest";

import type { ProductImage } from "../types/catalog.types";
import { getPrimaryProductImage } from "./product-media";

const image = (
  id: string,
  position: number,
  isPrimary: boolean,
): ProductImage => ({
  id,
  desktopSrc: `/media/${id}.jpg`,
  alt: id,
  position,
  isPrimary,
});

describe("getPrimaryProductImage", () => {
  it("prioriza la imagen marcada como principal", () => {
    expect(
      getPrimaryProductImage([
        image("secondary", 1, false),
        image("primary", 2, true),
      ])?.id,
    ).toBe("primary");
  });

  it("usa posicion cuando no hay una imagen principal", () => {
    expect(
      getPrimaryProductImage([
        image("second", 2, false),
        image("first", 1, false),
      ])?.id,
    ).toBe("first");
  });

  it("devuelve null cuando no hay imagenes", () => {
    expect(getPrimaryProductImage([])).toBeNull();
  });
});
