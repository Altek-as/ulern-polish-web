/**
 * uLern-Polish — Checkout Cancel Page
 * Shown when user cancels Stripe Checkout
 */

'use client';

import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Checkout Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          No worries — your payment was not processed and you have not been
          charged. You can still use the free version of uLern-Polish.
        </p>

        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            View Pricing Again
          </Link>
          <Link
            href="/lessons"
            className="block w-full py-3 px-6 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Continue Learning (Free)
          </Link>
        </div>
      </div>
    </main>
  );
}
