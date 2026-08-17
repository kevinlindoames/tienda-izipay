import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ReactElement } from "react";

import type { CheckoutFormInput } from "../schemas/checkout.schema";

interface CustomerFieldsProps {
  register: UseFormRegister<CheckoutFormInput>;
  errors: FieldErrors<CheckoutFormInput>;
}

const inputClassName =
  "mt-2 min-h-11 w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none transition-shadow placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20";

export function CustomerFields({
  register,
  errors,
}: CustomerFieldsProps): ReactElement {
  return (
    <fieldset className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <legend className="px-2 text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
        Datos de contacto
      </legend>

      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
        Usaremos estos datos para identificar y coordinar el pedido.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="checkout-first-name"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Nombres
          </label>

          <input
            id="checkout-first-name"
            type="text"
            autoComplete="given-name"
            aria-invalid={errors.firstName ? "true" : undefined}
            aria-describedby={
              errors.firstName ? "checkout-first-name-error" : undefined
            }
            className={inputClassName}
            {...register("firstName")}
          />

          {errors.firstName?.message ? (
            <p
              id="checkout-first-name-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.firstName.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="checkout-last-name"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Apellidos
          </label>

          <input
            id="checkout-last-name"
            type="text"
            autoComplete="family-name"
            aria-invalid={errors.lastName ? "true" : undefined}
            aria-describedby={
              errors.lastName ? "checkout-last-name-error" : undefined
            }
            className={inputClassName}
            {...register("lastName")}
          />

          {errors.lastName?.message ? (
            <p
              id="checkout-last-name-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.lastName.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="checkout-email"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Correo electronico
          </label>

          <input
            id="checkout-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "checkout-email-error" : undefined}
            className={inputClassName}
            {...register("email")}
          />

          {errors.email?.message ? (
            <p
              id="checkout-email-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="checkout-phone"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Telefono
          </label>

          <input
            id="checkout-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
            className={inputClassName}
            {...register("phone")}
          />

          {errors.phone?.message ? (
            <p
              id="checkout-phone-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.phone.message}
            </p>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}
