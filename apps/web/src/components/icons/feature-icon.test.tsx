import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeatureIcon } from "./feature-icon";

describe("FeatureIcon", () => {
  it("renderiza un icono conocido", () => {
    const { container } = render(<FeatureIcon iconKey="view" />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("usa un icono fallback para una clave desconocida", () => {
    const { container } = render(
      <FeatureIcon iconKey="unknown" className="fallback-icon" />,
    );

    expect(container.querySelector("svg")).toHaveClass("fallback-icon");
  });
});
