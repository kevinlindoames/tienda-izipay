import { z } from "zod";

import { deliveryModeValues } from "../types/checkout.types";

function hasRequiredText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export const checkoutSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Ingresa tus nombres.")
      .max(80, "Los nombres son demasiado largos."),

    lastName: z
      .string()
      .trim()
      .min(2, "Ingresa tus apellidos.")
      .max(80, "Los apellidos son demasiado largos."),

    email: z
      .string()
      .trim()
      .min(1, "Ingresa tu correo electronico.")
      .max(254, "El correo electronico es demasiado largo.")
      .email("Ingresa un correo electronico valido."),

    phone: z
      .string()
      .trim()
      .min(1, "Ingresa tu telefono.")
      .max(30, "El telefono es demasiado largo.")
      .refine((value) => {
        const digits = value.replace(/\D/g, "");

        return digits.length >= 7 && digits.length <= 11;
      }, "Ingresa un telefono valido."),

    deliveryMode: z.enum(deliveryModeValues),

    department: z
      .string()
      .trim()
      .max(120, "El departamento es demasiado largo.")
      .optional(),

    province: z
      .string()
      .trim()
      .max(120, "La provincia es demasiado larga.")
      .optional(),

    district: z
      .string()
      .trim()
      .max(120, "El distrito es demasiado largo.")
      .optional(),

    address: z
      .string()
      .trim()
      .max(200, "La direccion es demasiado larga.")
      .optional(),

    reference: z
      .string()
      .trim()
      .max(200, "La referencia es demasiado larga.")
      .optional(),
  })
  .superRefine((value, context) => {
    if (value.deliveryMode !== "delivery") {
      return;
    }

    if (!hasRequiredText(value.department)) {
      context.addIssue({
        code: "custom",
        path: ["department"],
        message: "Ingresa el departamento.",
      });
    }

    if (!hasRequiredText(value.province)) {
      context.addIssue({
        code: "custom",
        path: ["province"],
        message: "Ingresa la provincia.",
      });
    }

    if (!hasRequiredText(value.district)) {
      context.addIssue({
        code: "custom",
        path: ["district"],
        message: "Ingresa el distrito.",
      });
    }

    if (!hasRequiredText(value.address)) {
      context.addIssue({
        code: "custom",
        path: ["address"],
        message: "Ingresa la direccion de entrega.",
      });
    }
  });

export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutFormOutput = z.output<typeof checkoutSchema>;
