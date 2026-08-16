import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("es decorativo y respeta reduced motion", () => {
    const { container } = render(<Skeleton className="h-8 w-20" />);
    const skeleton = container.firstElementChild;

    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("motion-reduce:animate-none");
    expect(skeleton).toHaveClass("bg-[var(--color-surface-soft)]");
  });
});
