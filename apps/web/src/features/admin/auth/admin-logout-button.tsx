"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logout(): Promise<void> {
    setIsSubmitting(true);

    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.assign("/admin/login");
    }
  }

  return (
    <Button type="button" disabled={isSubmitting} onClick={() => void logout()}>
      {isSubmitting ? "Saliendo..." : "Cerrar sesión"}
    </Button>
  );
}
