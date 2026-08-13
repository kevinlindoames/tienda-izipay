"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonBaseProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href"
  > & {
    href: string;
    disabled?: boolean;
  };

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never;
  };

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-dark)] text-white hover:bg-[var(--color-dark-deep)]",
  secondary:
    "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]",
};

export function Button({
  children,
  className,
  variant = "primary",
  ...elementProps
}: ButtonProps): ReactElement {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
    variantClasses[variant],
    className,
  );

  if (typeof elementProps.href === "string") {
    const {
      disabled = false,
      href,
      onClick,
      tabIndex,
      ...anchorProps
    } = elementProps;

    return (
      <a
        {...anchorProps}
        href={href}
        aria-disabled={disabled || undefined}
        className={classes}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...elementProps}
      type={elementProps.type ?? "button"}
      className={classes}
    >
      {children}
    </button>
  );
}
