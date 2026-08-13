"use client";

import { motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore, type ReactElement, type ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  offset?: number;
}

function subscribeToHydration(): () => void {
  return () => {};
}

function getClientSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

function useHasHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  offset = 24,
}: RevealProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hasHydrated = useHasHydrated();

  const shouldReduceMotion = hasHydrated && prefersReducedMotion === true;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: offset,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
