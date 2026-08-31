"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

import { ADMIN_NAVIGATION } from "./admin-navigation";

interface AdminNavProps {
  variant: "desktop" | "mobile";
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ variant }: AdminNavProps): ReactElement {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <nav aria-label="Navegación administrativa móvil">
        <ul className="flex min-w-max gap-2">
          {ADMIN_NAVIGATION.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
                    isActive
                      ? "border-[var(--color-dark)] bg-[var(--color-dark)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]",
                  )}
                >
                  {item.shortLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Navegación administrativa">
      <ul className="space-y-1.5">
        {ADMIN_NAVIGATION.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
                  isActive
                    ? "bg-[var(--color-dark)] text-white"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "size-2 rounded-full",
                    isActive ? "bg-white" : "bg-[var(--color-border-strong)]",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
