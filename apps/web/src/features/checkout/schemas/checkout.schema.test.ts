import { describe, expect, it } from "vitest";

import { checkoutSchema } from "./checkout.schema";

const validCustomer = {
  firstName: "Kevin",
  lastName: "Lindo",
  email: "kevin@example.com",
  phone: "987 654 321",
};

describe("checkoutSchema", () => {
  it("accepts delivery when all address fields are present", () => {
    const result = checkoutSchema.safeParse({
      ...validCustomer,
      deliveryMode: "delivery",
      department: "Lima",
      province: "Lima",
      district: "Miraflores",
      address: "Av. Demo 123",
      reference: "Frente al parque",
    });

    expect(result.success).toBe(true);
  });

  it("requires delivery address fields for delivery mode", () => {
    const result = checkoutSchema.safeParse({
      ...validCustomer,
      deliveryMode: "delivery",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    const paths = result.error.issues.map((issue) => issue.path[0]);

    expect(paths).toEqual(
      expect.arrayContaining(["department", "province", "district", "address"]),
    );
  });

  it("allows pickup without delivery address", () => {
    const result = checkoutSchema.safeParse({
      ...validCustomer,
      deliveryMode: "pickup",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and phone", () => {
    const result = checkoutSchema.safeParse({
      ...validCustomer,
      email: "correo-invalido",
      phone: "123",
      deliveryMode: "pickup",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    const paths = result.error.issues.map((issue) => issue.path[0]);

    expect(paths).toContain("email");
    expect(paths).toContain("phone");
  });
});
