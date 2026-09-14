import React from 'react';
import { Smartphone, Server, Database, Shield, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ArchitectureTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Summary Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Commercial SaaS Blueprint
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            TaskFlow – Production Architecture Overview
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            A high-efficiency, offline-first personal task management ecosystem built to operate with near-zero monthly infrastructure overhead while sustaining 100,000+ active users. Zero client-exposed AI credentials, deterministic productivity scoring, and Google Play Billing subscription validation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Mobile Framework</span>
              <span className="text-sm font-semibold text-white">Flutter / Material 3</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Database Engine</span>
              <span className="text-sm font-semibold text-emerald-400">PostgreSQL (RLS)</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Local Offline Store</span>
              <span className="text-sm font-semibold text-amber-300">SQLite / Drift</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Est. Cloud Cost / User</span>
              <span className="text-sm font-semibold text-indigo-300">&lt; ₹0.05 / mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Diagram: Client -> Edge -> DB */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-600" />
          End-to-End System Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Layer 1: Client */}
          <div className="border border-indigo-100 bg-indigo-50/40 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold">CLIENT</span>
                <Smartphone className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Flutter Mobile App</h4>
              <p className="text-xs text-slate-600 mb-4">
                Single source of truth is the local SQLite database. Operates smoothly with zero internet connectivity.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Material 3 Light/Dark adaptive UI
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  BLoC / Cubit state management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Local alarms & notifications (₹0 cost)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  In-App Purchase Client (Google Play)
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100 text-[11px] text-indigo-900 font-medium">
              Encrypted SharedPreferences for JWT session cache
            </div>
          </div>

          {/* Layer 2: Edge & Auth */}
          <div className="border border-slate-200 bg-slate-50/60 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs font-bold">GATEWAY & LOGIC</span>
                <Cpu className="w-5 h-5 text-slate-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Supabase Edge Engine</h4>
              <p className="text-xs text-slate-600 mb-4">
                Serverless Deno edge functions executing sensitive transactions and proxying AI.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Google Play purchase token validator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  AI assistant proxy with Gemini 2.5 Flash
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  GDPR data exporter & account purger
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Monthly quota limiter (50 reqs/mo)
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-700 font-medium">
              Zero client exposure of AI secrets or service keys
            </div>
          </div>

          {/* Layer 3: Database */}
          <div className="border border-emerald-100 bg-emerald-50/30 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white text-xs font-bold">STORAGE</span>
                <Database className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">PostgreSQL Database</h4>
              <p className="text-xs text-slate-600 mb-4">
                Multi-tenant persistence isolated by cryptographic Row Level Security (RLS).
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  10 optimized relational tables
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Strict RLS: auth.uid() = user_id
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Covering indexes on status & due_date
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Virtual recurrence (zero record explosion)
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-900 font-medium">
              Free tier accommodates first 10,000 registered users
            </div>
          </div>
        </div>
      </div>

      {/* Clean Architecture Folder Tree */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          Flutter Clean Architecture Specification
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Strict separation of concerns across Data, Domain, and Presentation layers, enabling isolated unit testing without touching network or database dependencies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-4 bg-slate-900 text-slate-200 rounded-lg overflow-x-auto">
            <span className="text-indigo-400 font-bold block mb-2">// 1. CORE & SHARED</span>
            <pre>{`lib/
├── core/
│   ├── constants/
│   ├── database/ (Drift/SQLite)
│   ├── errors/ (Failures)
│   ├── network/ (Supabase)
│   ├── theme/ (Material 3)
│   └── utils/ (Calculators)
└── shared/
    ├── services/ (Alarms)
    └── widgets/ (Tokens)`}</pre>
          </div>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-lg overflow-x-auto">
            <span className="text-emerald-400 font-bold block mb-2">// 2. FEATURE PACKAGE</span>
            <pre>{`lib/features/tasks/
├── data/
│   ├── datasources/
│   │   ├── task_local_ds.dart
│   │   └── task_remote_ds.dart
│   ├── models/ (TaskModel)
│   └── repositories/ (Impl)
├── domain/
│   ├── entities/ (TaskEntity)
│   ├── repositories/ (Interface)
│   └── usecases/ (CreateTask)
└── presentation/
    ├── bloc/ (TaskBloc)
    └── pages/ (TaskScreen)`}</pre>
          </div>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-lg overflow-x-auto">
            <span className="text-amber-400 font-bold block mb-2">// 3. SYNC ENGINE</span>
            <pre>{`lib/core/sync/
├── sync_engine.dart
├── change_tracker.dart
├── conflict_resolver.dart
└── offline_queue.dart

Strategy:
- Mutation writes to local DB first
- Appends to dirty_records queue
- Flushes batch on network connect
- Uses last-write-wins timestamp`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
