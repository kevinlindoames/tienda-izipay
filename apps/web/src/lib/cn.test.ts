import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("combina clases condicionales", () => {
    expect(cn("block", false && "hidden", ["text-sm"])).toBe("block text-sm");
  });

  it("resuelve conflictos de Tailwind usando la ultima clase", () => {
    expect(cn("px-2", "px-6")).toBe("px-6");
  });
});
