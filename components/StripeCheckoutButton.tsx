'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { ClientOnly } from '@/components/ClientOnly';

// Initialize Stripe outside the component to avoid re-initializing on re-renders
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
);

interface StripeCheckoutButtonProps {
  priceId: string;
  priceLabel: string;
  userId?: string;
  userEmail?: string;
  disabled?: boolean;
}

function CheckoutButtonInner({ priceId, priceLabel, userId, userEmail, disabled }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId, userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('[Checkout] Error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCheckout}
        disabled={loading || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
          loading || disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? 'Przekierowywanie...' : `Wybierz ${priceLabel}`}
      </button>
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}

/**
 * Stripe Checkout button wrapped in ClientOnly to prevent SSR hydration issues.
 * Uses @stripe/stripe-js for client-side Stripe initialization.
 */
export function StripeCheckoutButton(props: StripeCheckoutButtonProps) {
  return (
    <ClientOnly fallback={
      <button
        disabled
        className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-400 text-white cursor-not-allowed"
      >
        Ładowanie...
      </button>
    }>
      <CheckoutButtonInner {...props} />
    </ClientOnly>
  );
}
