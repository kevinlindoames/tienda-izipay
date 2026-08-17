import { describe, expect, it } from "vitest";

import { adminLoginSchema } from "./admin-login.schema";

describe("adminLoginSchema", () => {
  it("accepts valid administrator credentials", () => {
    expect(
      adminLoginSchema.safeParse({
        email: "admin@example.com",
        password: "a-secure-password",
      }).success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      adminLoginSchema.safeParse({
        email: "invalid",
        password: "password",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(
      adminLoginSchema.safeParse({
        email: "admin@example.com",
        password: "",
      }).success,
    ).toBe(false);
  });
});
