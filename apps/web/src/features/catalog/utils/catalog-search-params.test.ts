import { describe, expect, it } from "vitest";

import {
  buildCatalogHref,
  parseCatalogSearchParams,
} from "./catalog-search-params";

describe("catalog search params", () => {
  it("usa valores seguros por defecto", () => {
    expect(parseCatalogSearchParams({})).toEqual({
      q: "",
      category: "",
      sort: "featured",
      page: 1,
      pageSize: 6,
    });
  });

  it("normaliza page y sort invalidos", () => {
    expect(
      parseCatalogSearchParams({
        page: "-4",
        sort: "invalid",
      }),
    ).toMatchObject({
      page: 1,
      sort: "featured",
    });
  });

  it("construye URL preservando filtros", () => {
    expect(
      buildCatalogHref(
        {
          q: "camara",
          category: "video",
          sort: "price-desc",
        },
        2,
      ),
    ).toBe("/productos?q=camara&category=video&sort=price-desc&page=2");
  });
});
