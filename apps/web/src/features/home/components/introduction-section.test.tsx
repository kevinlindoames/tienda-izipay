import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { IntroductionSection } from "./introduction-section";

vi.mock("@/components/ui/reveal", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("IntroductionSection", () => {
  it("renderiza titulo y todos los parrafos", () => {
    render(
      <IntroductionSection
        content={{
          title: "Introduccion",
          paragraphs: ["Parrafo uno", "Parrafo dos"],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Introduccion" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Parrafo uno")).toBeInTheDocument();
    expect(screen.getByText("Parrafo dos")).toBeInTheDocument();
  });
});
