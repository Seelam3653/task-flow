import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Sparkles, Folder, Calendar, Flame, Target, Play } from 'lucide-react';

export const DesignSystemTab: React.FC = () => {
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [habitDays, setHabitDays] = useState([true, true, true, false, true, false, false]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Material 3 Palette & Typography Specs */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Material 3 Design Tokens & Archetype Specification
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          Adheres strictly to Google Material Design 3 guidelines: purposeful tonal elevation, high WCAG AA contrast (≥ 4.5:1), and mathematically scaled 1.25 typography.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="h-10 rounded-md bg-indigo-600 mb-2"></div>
            <span className="text-xs font-bold block text-slate-800">Primary</span>
            <span className="text-[10px] font-mono text-slate-400">#4F46E5 (Indigo 600)</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="h-10 rounded-md bg-indigo-100 mb-2"></div>
            <span className="text-xs font-bold block text-slate-800">Primary Container</span>
            <span className="text-[10px] font-mono text-slate-400">#E0E7FF (Indigo 100)</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="h-10 rounded-md bg-rose-600 mb-2"></div>
            <span className="text-xs font-bold block text-slate-800">Urgent Priority</span>
            <span className="text-[10px] font-mono text-slate-400">#E11D48 (Rose 600)</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="h-10 rounded-md bg-amber-500 mb-2"></div>
            <span className="text-xs font-bold block text-slate-800">High Priority</span>
            <span className="text-[10px] font-mono text-slate-400">#F59E0B (Amber 500)</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="h-10 rounded-md bg-emerald-600 mb-2"></div>
            <span className="text-xs font-bold block text-slate-800">Success / Done</span>
            <span className="text-[10px] font-mono text-slate-400">#059669 (Emerald 600)</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="h-10 rounded-md bg-slate-900 mb-2"></div>
            <span className="text-xs font-bold block text-slate-800">Surface Dark</span>
            <span className="text-[10px] font-mono text-slate-400">#0F172A (Slate 900)</span>
          </div>
        </div>

        {/* Priority Badges Matrix */}
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Standardized Priority Badges (Flutter Components)
          </h4>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" /> Urgent
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <Clock className="w-3.5 h-3.5" /> High
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Medium
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              Low
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Mobile UI Prototype / Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Interactive Material 3 Mobile Component Preview
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          Experience the interactive feedback loops, completion animations, and gesture affordances of the production Flutter client.
        </p>

        <div className="max-w-md mx-auto border-4 border-slate-800 rounded-3xl p-5 bg-slate-50 shadow-2xl space-y-5">
          {/* Mobile Screen Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Monday, Sep 14</span>
              <h4 className="text-base font-bold text-slate-900">Good morning, Alex 👋</h4>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              12 Days
            </div>
          </div>

          {/* Daily Progress Gauge */}
          <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-md">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-indigo-100">Today's Progress</span>
              <span className="font-mono font-bold">{demoCompleted ? '5 / 5' : '4 / 5'} Done</span>
            </div>
            <div className="h-2 w-full bg-indigo-950/40 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: demoCompleted ? '100%' : '80%' }}
              ></div>
            </div>
            <div className="text-[11px] text-indigo-100 flex justify-between">
              <span>Daily Productivity Score: {demoCompleted ? '96/100' : '88/100'}</span>
              <span>{demoCompleted ? '100%' : '80%'}</span>
            </div>
          </div>

          {/* Interactive Task Card */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Due Today (Tap circle to test)
            </span>
            <div
              onClick={() => setDemoCompleted(!demoCompleted)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                demoCompleted
                  ? 'bg-slate-100/70 border-slate-200 opacity-70'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <button
                id="btn-demo-toggle-task"
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  demoCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 hover:border-indigo-500'
                }`}
              >
                {demoCompleted && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${demoCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    Submit Google Play Release AAB
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800">
                    Urgent
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Verify ProGuard rules, sign with release keystore & push to internal testing.
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-indigo-600">
                    <Folder className="w-3 h-3" /> Play Store
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3 h-3" /> Today, 5:00 PM
                  </span>
                  <span>4/5 Subtasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Habit Tracker Preview */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Drink 2L Water</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                5 Day Streak
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <button
                  key={i}
                  id={`btn-habit-day-${i}`}
                  onClick={() => {
                    const updated = [...habitDays];
                    updated[i] = !updated[i];
                    setHabitDays(updated);
                  }}
                  className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                    habitDays[i]
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Timer Strip */}
          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Play className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold block leading-tight">Focus: Build Database</span>
                <span className="text-[10px] text-slate-400 font-mono">25:00 Remaining</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-slate-800 text-indigo-400">
              Pomodoro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
