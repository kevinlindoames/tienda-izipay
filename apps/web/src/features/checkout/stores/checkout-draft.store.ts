"use client";

import { create } from "zustand";

import type { CheckoutDraft } from "../types/checkout.types";

interface CheckoutDraftStore {
  draft: CheckoutDraft | null;
  setDraft: (draft: CheckoutDraft) => void;
  clearDraft: () => void;
}

export const useCheckoutDraftStore = create<CheckoutDraftStore>()((set) => ({
  draft: null,

  setDraft: (draft) => {
    set({
      draft,
    });
  },

  clearDraft: () => {
    set({
      draft: null,
    });
  },
}));
