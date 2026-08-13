import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/styles/tokens.css"),
  "utf8",
);

function getToken(name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(
    new RegExp(`${escaped}\\s*:\\s*(#[0-9a-fA-F]{6})\\s*;`),
  );

  if (!match) {
    throw new Error(`Token no encontrado: ${name}`);
  }

  return match[1].toLowerCase();
}

function linearChannel(value: number): number {
  const normalized = value / 255;

  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = hex.replace("#", "");

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return (
    0.2126 * linearChannel(red) +
    0.7152 * linearChannel(green) +
    0.0722 * linearChannel(blue)
  );
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);

  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("tokens de contraste WCAG AA", () => {
  const text = getToken("--color-text");
  const muted = getToken("--color-text-muted");
  const page = getToken("--color-page");
  const surface = getToken("--color-surface");
  const soft = getToken("--color-surface-soft");
  const dark = getToken("--color-dark");
  const darkDeep = getToken("--color-dark-deep");
  const brand = getToken("--color-brand");

  const normalTextPairs = [
    ["text/page", text, page],
    ["text/surface", text, surface],
    ["text/soft", text, soft],
    ["muted/page", muted, page],
    ["muted/surface", muted, surface],
    ["muted/soft", muted, soft],
    ["white/dark", "#ffffff", dark],
    ["white/dark-deep", "#ffffff", darkDeep],
    ["brand/dark-deep", brand, darkDeep],
  ] as const;

  it.each(normalTextPairs)(
    "%s cumple al menos 4.5:1",
    (_name, foreground, background) => {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    },
  );
});
