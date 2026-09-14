import React from 'react';
import { ROADMAP_PHASES } from '../data/phase1Data';
import { CheckCircle2, CircleDot, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const RoadmapTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sign-off Banner */}
      <div className="bg-emerald-900 text-white p-6 rounded-xl border border-emerald-800 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-emerald-700 text-white shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
              Phase 1 Milestone Complete
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Phase 1 Architecture, Database & Monetization Blueprint Ready
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-3xl">
              All architectural specifications, database schemas (10 tables with RLS and virtual recurrence), unit economics, cost control models, and Material 3 design tokens are completed and documented. We await user review and confirmation before initiating Phase 2 (Supabase Setup & Authentication).
            </p>
          </div>
        </div>
      </div>

      {/* 12 Phases Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-indigo-600" />
          Complete 12-Phase Development & Play Store Release Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROADMAP_PHASES.map((phase) => {
            const isCurrent = phase.status === 'current';
            return (
              <div
                key={phase.phaseNumber}
                className={`p-5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    PHASE {String(phase.phaseNumber).padStart(2, '0')}
                  </span>
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Ready for Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      <Clock className="w-3 h-3" /> Upcoming
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-2">{phase.title}</h4>

                <div className="mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Functional Scope:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {phase.scope.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {phase.deliverables.map((del, dIdx) => (
                    <span
                      key={dIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {del}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
