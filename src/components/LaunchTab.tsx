import React, { useState } from 'react';
import { 
  Rocket, Globe, Activity, CheckCircle2, ShieldCheck, AlertCircle, 
  Terminal, FileCode2, Languages, Bug, BarChart3, RefreshCw, Smartphone, Star
} from 'lucide-react';
import { sentryPosthogDartCode, arbLocalizationJson } from '../data/flutterLaunchDartCode';

interface LaunchChecklistItem {
  id: string;
  category: 'store' | 'legal' | 'tech' | 'growth';
  title: string;
  desc: string;
  completed: boolean;
}

export const LaunchTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'checklist' | 'telemetry_code' | 'localization' | 'analytics_demo'>('checklist');

  // Launch Checklist State
  const [checklist, setChecklist] = useState<LaunchChecklistItem[]>([
    {
      id: 'app_store_review',
      category: 'store',
      title: 'Sign in with Apple & Guideline 4.8 Compliance',
      desc: 'Hashed nonce authentication implemented; Apple Review account credentials configured in App Store Connect.',
      completed: true,
    },
    {
      id: 'google_data_safety',
      category: 'legal',
      title: 'Google Play Data Safety Form & Privacy Policy',
      desc: 'All Supabase, PostHog, and Sentry telemetries declared with encryption in transit and account deletion URLs.',
      completed: true,
    },
    {
      id: 'exact_alarm_justification',
      category: 'legal',
      title: 'USE_EXACT_ALARM Declaration for Android 14+',
      desc: 'Calendar/Reminder app category declaration submitted to avoid Play Store automated rejection.',
      completed: true,
    },
    {
      id: 'l10n_arb',
      category: 'growth',
      title: 'Multi-Language Localization (English, Japanese, German)',
      desc: 'Generated official app_*.arb files with pluralization and locale-aware number/currency formatting.',
      completed: true,
    },
    {
      id: 'sentry_dsn',
      category: 'tech',
      title: 'Sentry Crash Reporting with User Sanitization',
      desc: 'Captures unhandled Flutter exceptions while stripping personal task names from error payloads.',
      completed: true,
    },
    {
      id: 'posthog_funnels',
      category: 'tech',
      title: 'PostHog Paywall & Conversion Funnels',
      desc: 'Telemetry tracking onboarding completion -> first task added -> paywall view -> subscription purchased.',
      completed: true,
    },
  ]);

  // Telemetry event log simulation
  const [eventLogs, setEventLogs] = useState<Array<{ time: string; event: string; user: string; status: string }>>([
    { time: '11:14:02', event: 'paywall_viewed', user: 'usr_8492048-0284', status: 'source: habit_limit' },
    { time: '11:14:15', event: 'subscription_purchased', user: 'usr_8492048-0284', status: 'tier: annual ($39.99)' },
    { time: '11:14:32', event: 'ai_task_breakdown_triggered', user: 'usr_8492048-0284', status: 'latency: 612ms' },
    { time: '11:15:01', event: 'drift_background_sync_flushed', user: 'usr_8492048-0284', status: 'mutations: 3' },
  ]);

  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const simulateNewEvent = () => {
    const events = [
      { event: 'habit_completed', status: 'streak: 14 days' },
      { event: 'pomodoro_session_finished', status: 'duration: 25m' },
      { event: 'task_created_offline', status: 'drift_queue: pending' },
      { event: 'burnout_alert_shown', status: 'cognitive_load: 85%' },
    ];
    const picked = events[Math.floor(Math.random() * events.length)];
    const newLog = {
      time: new Date().toLocaleTimeString(),
      event: picked.event,
      user: 'usr_8492048-0284',
      status: picked.status,
    };
    setEventLogs([newLog, ...eventLogs]);
  };

  const completedCount = checklist.filter(c => c.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Rocket className="w-3.5 h-3.5" />
              Phase 12: App Store Launch, Localization & Post-Launch Telemetry
            </div>
            <h2 className="text-2xl font-bold tracking-tight">App Store Compliance, Multi-Language & Observability</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Production readiness with Sentry crash reporting, PostHog funnel analytics, 
              Flutter ARB multi-language localization, and Play Store / App Store review approvals.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="font-semibold text-slate-200">
              Readiness: {completedCount}/{checklist.length} Complete (100%)
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('checklist')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'checklist'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Store Submission Checklist
        </button>
        <button
          onClick={() => setActiveSubtab('analytics_demo')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'analytics_demo'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Live Telemetry & PostHog Funnels
        </button>
        <button
          onClick={() => setActiveSubtab('localization')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'localization'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Languages className="w-4 h-4" />
          ARB Localization (`l10n`)
        </button>
        <button
          onClick={() => setActiveSubtab('telemetry_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'telemetry_code'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Sentry & PostHog Service
        </button>
      </div>

      {/* SUBTAB 1: STORE SUBMISSION CHECKLIST */}
      {activeSubtab === 'checklist' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Pre-Flight Review Verification Matrix</h3>
              <p className="text-[11px] text-slate-500">Every requirement validated against Apple Review Guidelines & Google Play Policy.</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              Ready for Store Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  item.completed
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg mt-0.5 flex-shrink-0 ${
                    item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  <span className="inline-block mt-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ANALYTICS & TELEMETRY LIVE STREAM */}
      {activeSubtab === 'analytics_demo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">PostHog Event Ingestion & Sentry Stream</h3>
              <p className="text-xs text-slate-500">Real-time event capture with anonymized user properties and latency benchmarks.</p>
            </div>
            <button
              onClick={simulateNewEvent}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Activity className="w-4 h-4" />
              <span>Simulate App Event</span>
            </button>
          </div>

          {/* Event Stream Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-900 text-slate-300 text-xs font-mono flex items-center justify-between">
              <span className="text-purple-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                PostHog Live Ingestion Stream
              </span>
              <span className="text-slate-500">Auto-refreshing</span>
            </div>
            <div className="divide-y divide-slate-100 font-mono text-xs max-h-72 overflow-y-auto">
              {eventLogs.map((log, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{log.time}</span>
                    <span className="text-purple-700 font-bold">{log.event}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-[11px]">{log.user}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LOCALIZATION ARB */}
      {activeSubtab === 'localization' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-purple-400 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              lib/l10n/app_*.arb
            </span>
            <span className="text-slate-500">English, Japanese & German ARB Resources</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{arbLocalizationJson}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 4: SENTRY & POSTHOG DART CODE */}
      {activeSubtab === 'telemetry_code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-purple-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/core/telemetry/telemetry_service.dart
            </span>
            <span className="text-slate-500">Sentry 8.0+ & PostHog SDK Integration</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{sentryPosthogDartCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
