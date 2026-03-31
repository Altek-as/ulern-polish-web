'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Renders children only on the client (after hydration).
 * Use this to wrap components that use browser-only APIs like Stripe.js.
 */
export function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
