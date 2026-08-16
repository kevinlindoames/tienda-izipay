import { describe, expect, it } from "vitest";

import { createMockMedia } from "./mock-media";

describe("createMockMedia", () => {
  it("genera URLs deterministas sin depender del componente visual", () => {
    const media = createMockMedia({
      id: "hero-home",
      seed: "hero-home",
      alt: "Hero provisional",
    });

    expect(media).toMatchObject({
      id: "hero-home",
      alt: "Hero provisional",
      width: 1600,
      height: 900,
    });

    expect(media.desktopSrc).toBe(
      "https://picsum.photos/seed/hero-home/1600/900",
    );
    expect(media.mobileSrc).toBe(
      "https://picsum.photos/seed/hero-home-mobile/900/1200",
    );
  });
});
