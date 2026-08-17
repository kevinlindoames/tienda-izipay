"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { adminLoginSchema, type AdminLoginValues } from "./admin-login.schema";

export function AdminLoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AdminLoginValues): Promise<void> {
    setServerError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        let message = "No se pudo iniciar sesión.";

        try {
          const body = (await response.json()) as {
            message?: unknown;
          };

          if (typeof body.message === "string") {
            message = body.message;
          }
        } catch {
          // Keep the generic error.
        }

        setServerError(message);

        return;
      }

      window.location.assign("/admin");
    } catch {
      setServerError("No se pudo conectar con el servidor.");
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="admin-email">
          Correo
        </label>

        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          className="min-h-11 rounded-md border border-black/20 bg-white px-3"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "admin-email-error" : undefined}
          {...register("email")}
        />

        {errors.email ? (
          <p
            id="admin-email-error"
            className="text-sm text-red-700"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="admin-password">
          Contraseña
        </label>

        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className="min-h-11 rounded-md border border-black/20 bg-white px-3"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "admin-password-error" : undefined
          }
          {...register("password")}
        />

        {errors.password ? (
          <p
            id="admin-password-error"
            className="text-sm text-red-700"
            role="alert"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p
          className="rounded-md bg-red-50 p-3 text-sm text-red-800"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
