import React, { useState } from 'react';
import { 
  Sparkles, Check, Crown, ShieldCheck, RefreshCw, Zap, ArrowRight,
  Smartphone, FileCode2, Layers, AlertCircle, CheckCircle2, Lock, Gift
} from 'lucide-react';
import { subscriptionRepositoryDartCode, revenueCatWebhookDenoDartCode } from '../data/flutterSubscriptionDartCode';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  savings?: string;
  features: string[];
}

export const SubscriptionTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'paywall' | 'webhook_code' | 'repo_code' | 'entitlement_matrix'>('paywall');

  // Simulated Pro Entitlement State
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [selectedPlan, setSelectedPlan] = useState<string>('annual');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  const plans: PricingTier[] = [
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: '$4.99',
      period: 'per month',
      features: [
        'Unlimited tasks & subtasks',
        'Unlimited habit streaks',
        'AI Subtask Breakdown (Gemini 2.5 Flash)',
        'Full 2-way cloud synchronization',
        'Soundscapes & Pomodoro timer',
      ],
    },
    {
      id: 'annual',
      name: 'Annual Pro',
      price: '$39.99',
      period: 'per year ($3.33/mo)',
      popular: true,
      savings: 'Save 33%',
      features: [
        'All Monthly Pro features',
        'Cognitive Load & Burnout Guard',
        'Historical Productivity Matrix',
        'Priority Supabase cloud backup',
        'Early access to new features',
      ],
    },
    {
      id: 'lifetime',
      name: 'Lifetime Founder',
      price: '$79.99',
      period: 'one-time payment',
      savings: 'Best Value',
      features: [
        'All Annual Pro features forever',
        'Founder badge in community',
        'Lifetime AI query quota',
        'Direct developer Slack channel access',
        'Never pay another subscription fee',
      ],
    },
  ];

  const handleSimulatePurchase = (planId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUserTier('pro');
      const selectedObj = plans.find(p => p.id === planId);
      setPurchaseSuccessMessage(`Entitlement 'pro_access' unlocked via RevenueCat for ${selectedObj?.name}! Synced with Supabase.`);
    }, 1100);
  };

  const handleSimulateRestore = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUserTier('pro');
      setPurchaseSuccessMessage("Previous App Store purchases successfully restored. Entitlements re-synced!");
    }, 900);
  };

  const handleResetToFree = () => {
    setUserTier('free');
    setPurchaseSuccessMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
              <Crown className="w-3.5 h-3.5" />
              Phase 9: In-App Purchases, Subscriptions & Monetization
            </div>
            <h2 className="text-2xl font-bold tracking-tight">RevenueCat SDK, Paywall UI & Supabase Webhooks</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Cross-platform Apple In-App Purchase and Google Play Billing integration with Server-Side Receipt Validation,
              Deno Edge Webhooks, and granular feature gating.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${userTier === 'pro' ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="font-semibold text-slate-200">
              Current Tier: {userTier === 'pro' ? 'PRO ACTIVE' : 'FREE TIER'}
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('paywall')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'paywall'
              ? 'border-amber-600 text-amber-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Crown className="w-4 h-4" />
          Interactive Paywall Simulator
        </button>
        <button
          onClick={() => setActiveSubtab('entitlement_matrix')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'entitlement_matrix'
              ? 'border-amber-600 text-amber-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Feature Gating Matrix
        </button>
        <button
          onClick={() => setActiveSubtab('repo_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'repo_code'
              ? 'border-amber-600 text-amber-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Flutter Service (`subscription_repository_impl.dart`)
        </button>
        <button
          onClick={() => setActiveSubtab('webhook_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'webhook_code'
              ? 'border-amber-600 text-amber-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          Deno Edge Function Webhook
        </button>
      </div>

      {/* SUBTAB 1: INTERACTIVE PAYWALL */}
      {activeSubtab === 'paywall' && (
        <div className="space-y-6">
          {purchaseSuccessMessage && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>{purchaseSuccessMessage}</span>
              </div>
              <button
                onClick={handleResetToFree}
                className="text-xs font-bold text-amber-800 underline hover:text-amber-950"
              >
                Reset to Free Tier
              </button>
            </div>
          )}

          {/* Paywall Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Unlock TaskFlow Pro
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Focus deeply, achieve more every single day</h3>
              <p className="text-xs text-slate-500">
                Join thousands of productive founders and knowledge workers organizing tasks with AI insights and zero latency.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/30 shadow-md ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-900 font-bold text-[10px] uppercase tracking-wider shadow-xs">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                          <p className="text-[11px] text-slate-500">{plan.period}</p>
                        </div>
                        {plan.savings && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {plan.savings}
                          </span>
                        )}
                      </div>

                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        {plan.price}
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulatePurchase(plan.id);
                      }}
                      disabled={isProcessing}
                      className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isProcessing && selectedPlan === plan.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Crown className="w-4 h-4" />
                      )}
                      <span>Subscribe with 1-Tap</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>Auto-renews. Cancel anytime in App Store or Google Play.</span>
              </div>
              <button
                onClick={handleSimulateRestore}
                disabled={isProcessing}
                className="text-slate-600 hover:text-slate-900 font-bold underline"
              >
                Restore Purchases
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FEATURE GATING MATRIX */}
      {activeSubtab === 'entitlement_matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">TaskFlow Free vs. Pro Entitlement Enforcement</h3>
              <p className="text-xs text-slate-500">Client-side & Server-side RLS feature gating rules.</p>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">
              Entitlement Key: 'pro_access'
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-600">
                  <th className="p-3.5 font-bold">Feature Capability</th>
                  <th className="p-3.5 font-bold">Free Tier</th>
                  <th className="p-3.5 font-bold">Pro Tier ($39.99/yr)</th>
                  <th className="p-3.5 font-bold">Enforcement Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-800">Active Task Limit</td>
                  <td className="p-3.5 text-slate-600">Up to 50 active tasks</td>
                  <td className="p-3.5 font-bold text-emerald-700">Unlimited</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">Supabase RLS trigger count check</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-800">Habit Streaks</td>
                  <td className="p-3.5 text-slate-600">3 active habits</td>
                  <td className="p-3.5 font-bold text-emerald-700">Unlimited</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">Flutter UI Gate & RLS policy</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-800">AI Subtask Decomposer</td>
                  <td className="p-3.5 text-slate-600">3 breakdowns / day</td>
                  <td className="p-3.5 font-bold text-emerald-700">Unlimited (Gemini 2.5 Flash)</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">Express /api/ai/subtasks rate limiter</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-800">Cognitive Load & Burnout Guard</td>
                  <td className="p-3.5 text-slate-400">Locked</td>
                  <td className="p-3.5 font-bold text-emerald-700">Full Real-Time Analytics</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">Flutter Paywall Gate</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-800">Doze Mode Exact Alarms</td>
                  <td className="p-3.5 text-slate-600">Included</td>
                  <td className="p-3.5 font-bold text-emerald-700">Included</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">Core mobile capability</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: REPO CODE */}
      {activeSubtab === 'repo_code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/features/subscription/data/subscription_repository_impl.dart
            </span>
            <span className="text-slate-500">purchases_flutter 5.0+</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{subscriptionRepositoryDartCode}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 4: WEBHOOK CODE */}
      {activeSubtab === 'webhook_code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              supabase/functions/revenuecat-webhook/index.ts
            </span>
            <span className="text-slate-500">Deno Serverless Webhook Handler</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{revenueCatWebhookDenoDartCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
