"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  checkoutSchema,
  type CheckoutFormInput,
  type CheckoutFormOutput,
} from "../schemas/checkout.schema";
import { useCheckoutDraftStore } from "../stores/checkout-draft.store";
import { CustomerFields } from "./customer-fields";
import { DeliveryFields } from "./delivery-fields";

const emptyCheckoutValues: CheckoutFormInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  deliveryMode: "delivery",
  department: "",
  province: "",
  district: "",
  address: "",
  reference: "",
};

export function CheckoutForm(): ReactElement {
  const draft = useCheckoutDraftStore((state) => state.draft);

  const setDraft = useCheckoutDraftStore((state) => state.setDraft);

  const [reviewReady, setReviewReady] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormOutput>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    shouldUnregister: true,
    defaultValues: draft ?? emptyCheckoutValues,
  });

  const deliveryMode = watch("deliveryMode") ?? "delivery";

  function submitValidDraft(values: CheckoutFormOutput): void {
    setDraft(values);
    setReviewReady(true);
  }

  return (
    <form
      noValidate
      className="space-y-6"
      onChange={() => {
        setReviewReady(false);
      }}
      onSubmit={handleSubmit(submitValidDraft)}
    >
      <CustomerFields register={register} errors={errors} />

      <DeliveryFields
        register={register}
        errors={errors}
        deliveryMode={deliveryMode}
      />

      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Revisar pedido
        </Button>

        <p className="mt-4 max-w-2xl text-xs leading-5 text-[var(--color-text-muted)]">
          Este paso solo valida tus datos. Todavia no crea un pedido ni realiza
          ningun cobro.
        </p>

        {reviewReady ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-5 rounded-[var(--radius-card)] bg-[var(--color-surface-soft)] p-4"
          >
            <p className="font-semibold text-[var(--color-text)]">
              Datos listos para revisar
            </p>

            <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
              El borrador queda disponible solo durante esta sesion. La creacion
              y revalidacion real del pedido se implementara en el siguiente
              bloque.
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
