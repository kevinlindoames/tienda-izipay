"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/stores/cart.store";

import { createOrder } from "../api/orders.client";
import {
  checkoutSchema,
  type CheckoutFormInput,
  type CheckoutFormOutput,
} from "../schemas/checkout.schema";
import { useCheckoutDraftStore } from "../stores/checkout-draft.store";
import type {
  BackendDeliveryMode,
  CreateOrderRequest,
  CreatedOrderSummary,
} from "../types/order.types";
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

interface CheckoutFormProps {
  onOrderCreated: (order: CreatedOrderSummary) => void;
}

function toBackendDeliveryMode(
  deliveryMode: CheckoutFormOutput["deliveryMode"],
): BackendDeliveryMode {
  return deliveryMode === "delivery" ? "DELIVERY" : "PICKUP";
}

export function CheckoutForm({
  onOrderCreated,
}: CheckoutFormProps): ReactElement {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const draft = useCheckoutDraftStore((state) => state.draft);
  const setDraft = useCheckoutDraftStore((state) => state.setDraft);
  const clearDraft = useCheckoutDraftStore((state) => state.clearDraft);

  const [submitError, setSubmitError] = useState<string | null>(null);

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

  async function submitOrder(values: CheckoutFormOutput): Promise<void> {
    setSubmitError(null);
    setDraft(values);

    const payload: CreateOrderRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      deliveryMode: toBackendDeliveryMode(values.deliveryMode),

      ...(values.deliveryMode === "delivery"
        ? {
            department: values.department,
            province: values.province,
            district: values.district,
            address: values.address,
          }
        : {}),

      ...(values.reference
        ? {
            reference: values.reference,
          }
        : {}),

      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const order = await createOrder(payload);

      onOrderCreated(order);
      clearCart();
      clearDraft();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos crear el pedido. Intenta nuevamente.",
      );
    }
  }

  return (
    <form noValidate className="space-y-6" onSubmit={handleSubmit(submitOrder)}>
      <CustomerFields register={register} errors={errors} />

      <DeliveryFields
        register={register}
        errors={errors}
        deliveryMode={deliveryMode}
      />

      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <Button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Creando pedido..." : "Crear pedido"}
        </Button>

        <p className="mt-4 max-w-2xl text-xs leading-5 text-[var(--color-text-muted)]">
          El servidor volvera a validar precios y stock antes de registrar el
          pedido. Este paso todavia no realiza ningun cobro.
        </p>

        {submitError ? (
          <div
            role="alert"
            className="mt-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-text)]"
          >
            {submitError}
          </div>
        ) : null}
      </div>
    </form>
  );
}
