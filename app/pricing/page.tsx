/**
 * uLern-Polish — Pricing Page
 * Three tiers: Free, Pro Monthly, Pro Annual
 */

'use client';

import { useState } from 'react';

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with Polish',
    features: [
      '5 AI chat lessons per month',
      'Basic vocabulary exercises',
      'Community support',
      'Limited lesson access',
    ],
    priceId: null,
    highlight: false,
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Full access for dedicated learners',
    features: [
      'Unlimited AI chat lessons',
      'All vocabulary & grammar exercises',
      'Speech recognition practice',
      'Progress tracking & analytics',
      'Priority support',
      'New lessons every week',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
    highlight: true,
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    price: '$79.99',
    period: '/year',
    description: 'Best value — save ~33% vs monthly',
    features: [
      'Everything in Pro Monthly',
      '2 months free (save ~$20)',
      'Early access to new features',
      'Offline lesson downloads',
      'Personalized learning path',
      'Certificate of completion',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || 'price_annual_placeholder',
    highlight: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(priceId: string | null, tierId: string) {
    if (!priceId) {
      setError('This plan is not available yet. Please check back soon.');
      return;
    }

    setLoading(tierId);
    setError(null);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: localStorage.getItem('userId') || undefined,
          userEmail: localStorage.getItem('userEmail') || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start learning Polish for free. Upgrade to Pro for unlimited access
            and accelerated progress.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.highlight
                  ? 'bg-indigo-600 text-white shadow-xl scale-105 ring-2 ring-indigo-300'
                  : 'bg-white text-gray-900 shadow-md border border-gray-200'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h2>
                <p className={`text-sm ${tier.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`text-4xl font-extrabold ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </span>
                <span className={`text-sm ${tier.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {tier.period}
                </span>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? 'text-indigo-300' : 'text-green-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={tier.highlight ? 'text-indigo-100' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.priceId, tier.id)}
                disabled={loading === tier.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
                  tier.highlight
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-md'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === tier.id
                  ? 'Redirecting...'
                  : tier.id === 'free'
                  ? 'Get Started Free'
                  : `Subscribe — ${tier.price}${tier.period}`}
              </button>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <p className="text-center text-gray-400 text-sm mt-10">
          🔒 Secure payments via Stripe · Cancel anytime · 30-day money-back guarantee
        </p>
      </div>
    </main>
  );
}
