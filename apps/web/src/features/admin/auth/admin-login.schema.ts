import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo.")
    .email("Ingresa un correo válido.")
    .max(254, "El correo es demasiado largo."),
  password: z
    .string()
    .min(1, "Ingresa tu contraseña.")
    .max(128, "La contraseña es demasiado larga."),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
