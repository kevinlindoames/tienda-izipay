import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ReactElement } from "react";

import type { CheckoutFormInput } from "../schemas/checkout.schema";
import type { DeliveryMode } from "../types/checkout.types";

interface DeliveryFieldsProps {
  register: UseFormRegister<CheckoutFormInput>;
  errors: FieldErrors<CheckoutFormInput>;
  deliveryMode: DeliveryMode;
}

const inputClassName =
  "mt-2 min-h-11 w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none transition-shadow placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20";

export function DeliveryFields({
  register,
  errors,
  deliveryMode,
}: DeliveryFieldsProps): ReactElement {
  return (
    <fieldset className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <legend className="px-2 text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
        Entrega
      </legend>

      <div className="mt-2">
        <label
          htmlFor="checkout-delivery-mode"
          className="text-sm font-medium text-[var(--color-text)]"
        >
          Modalidad de entrega
        </label>

        <select
          id="checkout-delivery-mode"
          className={inputClassName}
          {...register("deliveryMode")}
        >
          <option value="delivery">Envio a domicilio</option>
          <option value="pickup">Recojo coordinado</option>
        </select>
      </div>

      {deliveryMode === "delivery" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="checkout-department"
              className="text-sm font-medium text-[var(--color-text)]"
            >
              Departamento
            </label>

            <input
              id="checkout-department"
              type="text"
              autoComplete="address-level1"
              aria-invalid={errors.department ? "true" : undefined}
              aria-describedby={
                errors.department ? "checkout-department-error" : undefined
              }
              className={inputClassName}
              {...register("department")}
            />

            {errors.department?.message ? (
              <p
                id="checkout-department-error"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errors.department.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="checkout-province"
              className="text-sm font-medium text-[var(--color-text)]"
            >
              Provincia
            </label>

            <input
              id="checkout-province"
              type="text"
              autoComplete="address-level2"
              aria-invalid={errors.province ? "true" : undefined}
              aria-describedby={
                errors.province ? "checkout-province-error" : undefined
              }
              className={inputClassName}
              {...register("province")}
            />

            {errors.province?.message ? (
              <p
                id="checkout-province-error"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errors.province.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="checkout-district"
              className="text-sm font-medium text-[var(--color-text)]"
            >
              Distrito
            </label>

            <input
              id="checkout-district"
              type="text"
              autoComplete="address-level3"
              aria-invalid={errors.district ? "true" : undefined}
              aria-describedby={
                errors.district ? "checkout-district-error" : undefined
              }
              className={inputClassName}
              {...register("district")}
            />

            {errors.district?.message ? (
              <p
                id="checkout-district-error"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errors.district.message}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="checkout-address"
              className="text-sm font-medium text-[var(--color-text)]"
            >
              Direccion
            </label>

            <input
              id="checkout-address"
              type="text"
              autoComplete="address-line1"
              aria-invalid={errors.address ? "true" : undefined}
              aria-describedby={
                errors.address ? "checkout-address-error" : undefined
              }
              className={inputClassName}
              {...register("address")}
            />

            {errors.address?.message ? (
              <p
                id="checkout-address-error"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errors.address.message}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="checkout-reference"
              className="text-sm font-medium text-[var(--color-text)]"
            >
              Referencia{" "}
              <span className="font-normal text-[var(--color-text-muted)]">
                (opcional)
              </span>
            </label>

            <textarea
              id="checkout-reference"
              rows={3}
              className={inputClassName}
              {...register("reference")}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[var(--radius-card)] bg-[var(--color-surface-soft)] p-4">
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            El punto y horario de recojo se coordinara al confirmar el pedido.
          </p>
        </div>
      )}
    </fieldset>
  );
}
