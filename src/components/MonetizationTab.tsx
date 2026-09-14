import React, { useState } from 'react';
import { FEATURE_MATRIX } from '../data/phase1Data';
import { DollarSign, Check, X, TrendingUp, Calculator, ShieldCheck } from 'lucide-react';

export const MonetizationTab: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<number>(10000);
  const [conversionRate, setConversionRate] = useState<number>(3.5); // 3.5%
  const [annualPriceInr, setAnnualPriceInr] = useState<number>(799);

  // Unit Economics calculation
  const paidUsers = Math.round(activeUsers * (conversionRate / 100));
  const annualGross = paidUsers * annualPriceInr;
  const playFee = annualGross * 0.15; // 15% Google Play tier
  const serverCosts = paidUsers * 30; // ₹30/yr per active paid user
  const aiCosts = paidUsers * 48; // ₹48/yr (approx 50 req/mo Gemini Flash)
  const netAnnualProfit = annualGross - playFee - serverCosts - aiCosts;
  const netMarginPercent = annualGross > 0 ? Math.round((netAnnualProfit / annualGross) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Monetization Strategy Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan A</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">Free</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950">Free Forever</h3>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-slate-900">₹0</span>
              <span className="text-xs text-slate-500"> / forever</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Full core task management, basic calendar, up to 3 habits & 3 projects. Establishes daily usage habit loop.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            Zero cloud sync overhead; fully offline capable.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-indigo-600 shadow-md relative flex flex-col justify-between">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Plan B</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">Premium Annual</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950">Premium Pro</h3>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-indigo-600">₹799</span>
              <span className="text-xs text-slate-500"> / year (₹66/mo)</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Unlimited projects & habits, AI Task Assistant (50 credits/mo), advanced recurring schedules, real-time cloud sync.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-indigo-900 font-medium">
            33% discount vs ₹99/month subscription.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-amber-300 bg-amber-50/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Launch Special</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Limited 1,000 Slots</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950">Founding Lifetime</h3>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-slate-900">₹1,499</span>
              <span className="text-xs text-slate-500"> / one-time</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Lifetime access for early adopters. Front-loads immediate seed revenue to offset development costs while building vocal advocates.
            </p>
          </div>
          <div className="pt-3 border-t border-amber-200 text-xs text-amber-900 font-medium">
            Subject to fair-use AI quota caps.
          </div>
        </div>
      </div>

      {/* Interactive Unit Economics Calculator */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          Interactive SaaS Profit & Unit Economics Simulator
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          Adjust the sliders below to calculate the net operating margins across different user milestones after factoring Google Play fees and cloud expenses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Total Active Users: <span className="text-indigo-600 font-mono text-sm">{activeUsers.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="100"
              max="100000"
              step="500"
              value={activeUsers}
              onChange={(e) => setActiveUsers(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>100</span>
              <span>10,000</span>
              <span>100,000</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Free-to-Paid Conversion: <span className="text-indigo-600 font-mono text-sm">{conversionRate}%</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>1.0%</span>
              <span>3.5% (Industry avg)</span>
              <span>8.0%</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Annual Price (INR): <span className="text-indigo-600 font-mono text-sm">₹{annualPriceInr}</span>
            </label>
            <input
              type="range"
              min="499"
              max="1299"
              step="50"
              value={annualPriceInr}
              onChange={(e) => setAnnualPriceInr(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>₹499</span>
              <span>₹799</span>
              <span>₹1,299</span>
            </div>
          </div>
        </div>

        {/* Calculated Results Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs text-slate-500 block">Paying Subscribers</span>
            <span className="text-xl font-bold font-mono text-slate-900">{paidUsers.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Gross Annual ARR</span>
            <span className="text-xl font-bold font-mono text-slate-900">₹{Math.round(annualGross).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Google Play Fees (15%)</span>
            <span className="text-xl font-bold font-mono text-rose-600">-₹{Math.round(playFee).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Net Annual Profit</span>
            <span className="text-xl font-bold font-mono text-emerald-600">
              ₹{Math.round(netAnnualProfit).toLocaleString()} ({netMarginPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Feature Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Free Plan vs. Premium Plan Entitlement Matrix
          </h3>
          <p className="text-xs text-slate-600">
            Carefully balanced so free users find daily value while high-productivity users readily convert to unlock unlimited automation.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Free Plan (₹0)</th>
                <th className="py-3 px-4">Premium Plan (₹799/yr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {FEATURE_MATRIX.map((item, idx) => (
                <tr key={idx} className={item.isKeyDifferentiator ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}>
                  <td className="py-2.5 px-4 font-medium text-slate-900 flex items-center gap-2">
                    {item.feature}
                    {item.isKeyDifferentiator && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                        Key Driver
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">{item.category}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-700">{item.freeTier}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{item.premiumTier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
