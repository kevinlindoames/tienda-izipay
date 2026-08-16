"use client";

import { Menu, X } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import type { NavigationItem } from "@/content/site.types";
import { cn } from "@/lib/cn";

export interface MobileMenuProps {
  navigation: NavigationItem[];
}

export function MobileMenu({ navigation }: MobileMenuProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = "mobile-site-navigation";

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== "Escape" || !isOpen) {
      return;
    }

    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div
      className="relative justify-self-end md:hidden"
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-full",
          "text-[var(--color-text)] transition-colors",
          "hover:bg-[var(--color-surface-soft)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
        )}
        onClick={() => {
          setIsOpen((value) => !value);
        }}
      >
        {isOpen ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
        <span className="sr-only">{isOpen ? "Cerrar menu" : "Abrir menu"}</span>
      </button>

      <div
        id={menuId}
        hidden={!isOpen}
        className={cn(
          "absolute right-0 top-[calc(100%+0.75rem)]",
          "w-[min(20rem,calc(100vw-2rem))]",
          "rounded-[var(--radius-card)] border",
          "border-[var(--color-border)] bg-[var(--color-surface)]",
          "p-3 shadow-[var(--shadow-soft)]",
        )}
      >
        <nav aria-label="Navegacion movil">
          <ul className="flex flex-col gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "flex min-h-11 items-center rounded-xl px-4 py-2",
                    "text-sm font-medium text-[var(--color-text)]",
                    "hover:bg-[var(--color-surface-soft)]",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[var(--color-brand)]",
                  )}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
