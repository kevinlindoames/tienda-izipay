import { beforeEach, describe, expect, it } from "vitest";

import type { CheckoutDraft } from "../types/checkout.types";
import { useCheckoutDraftStore } from "./checkout-draft.store";

const draft: CheckoutDraft = {
  firstName: "Kevin",
  lastName: "Lindo",
  email: "kevin@example.com",
  phone: "987654321",
  deliveryMode: "pickup",
};

describe("useCheckoutDraftStore", () => {
  beforeEach(() => {
    localStorage.clear();

    useCheckoutDraftStore.setState({
      draft: null,
    });
  });

  it("stores and clears the draft in memory", () => {
    useCheckoutDraftStore.getState().setDraft(draft);

    expect(useCheckoutDraftStore.getState().draft).toEqual(draft);

    useCheckoutDraftStore.getState().clearDraft();

    expect(useCheckoutDraftStore.getState().draft).toBeNull();
  });

  it("does not persist checkout PII in localStorage", () => {
    useCheckoutDraftStore.getState().setDraft(draft);

    expect(localStorage.length).toBe(0);
  });
});
