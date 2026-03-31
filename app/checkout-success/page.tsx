/**
 * uLern-Polish — Checkout Success Page
 * Shown after a successful Stripe Checkout session
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session_id from URL params (Stripe appends it to success_url)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    setSessionId(id);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-600 mb-2">
          Welcome to <strong>Pro</strong>! Your subscription is now active.
        </p>

        <p className="text-gray-500 text-sm mb-8">
          You now have unlimited access to all lessons, exercises, and premium
          features. Thank you for supporting uLern-Polish!
        </p>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-8 font-mono break-all">
            Session: {sessionId}
          </p>
        )}

        <div className="space-y-3">
          <Link
            href="/lessons"
            className="block w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Learning Now →
          </Link>
          <Link
            href="/profile"
            className="block w-full py-3 px-6 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            View My Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
