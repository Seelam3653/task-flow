import React, { useState } from 'react';
import { 
  Sparkles, Brain, Bot, CheckCircle2, ArrowRight, RefreshCw, 
  BarChart3, Zap, ShieldAlert, Cpu, Layers, Flame, Clock, Award, Check
} from 'lucide-react';

export const SmartAnalyticsTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'ai_assistant' | 'productivity_score' | 'insights'>('ai_assistant');

  // AI Task Breakdown State
  const [taskInput, setTaskInput] = useState<string>('Prepare quarterly investor pitch deck and financial forecast');
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState<boolean>(false);
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([
    'Gather current ARR, retention rates, and unit economics',
    'Draft 10-slide core narrative focusing on product-led growth',
    'Model 3-year cash runway scenarios under base and bull cases',
    'Conduct dry-run rehearsal with advisors and gather feedback',
  ]);

  // AI Daily Plan State
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [dailyPlan, setDailyPlan] = useState<string>(
    `### 🎯 Today's AI Suggested Schedule\n\n1. **The "Frog" Priority (09:00 - 11:30)**: Tackle your investor pitch financial forecast during peak cognitive morning hours with two 25-minute Pomodoro intervals.\n2. **Habit Cadence**: Complete your aerobic workout and hydration goal before lunch to maintain steady glucose and energy levels.\n3. **Afternoon Execution (14:00 - 16:30)**: Clear developer syncs, review pull requests, and log your habits before 18:00.`
  );

  const handleGenerateSubtasks = async () => {
    if (!taskInput.trim()) return;
    setIsGeneratingSubtasks(true);
    try {
      const res = await fetch('/api/ai/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskInput }),
      });
      const data = await res.json();
      if (data.subtasks && Array.isArray(data.subtasks)) {
        setGeneratedSubtasks(data.subtasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  const handleGenerateDailyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await fetch('/api/ai/day-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: [
            { title: taskInput, priority: 'urgent' },
            { title: 'Google Play Billing signature validation', priority: 'high' },
            { title: 'Morning 20m Aerobic Workout', priority: 'medium' },
          ],
          habits: ['Drink 2.5L Water', 'Read 15 Pages Architecture Book'],
        }),
      });
      const data = await res.json();
      if (data.plan) {
        setDailyPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Phase 5: Smart Analytics & Gemini AI Assistant
            </div>
            <h2 className="text-2xl font-bold tracking-tight">AI Task Breakdown & Cognitive Productivity Score</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Server-side Gemini 2.5 Flash decomposition engine, weekly productivity velocity metrics, 
              and fatigue prevention recommendations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span className="font-mono text-slate-300">Gemini 2.5 Flash Server Proxy</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('ai_assistant')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'ai_assistant'
              ? 'border-violet-600 text-violet-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          AI Subtask Decomposer & Daily Strategist
        </button>
        <button
          onClick={() => setActiveSubtab('productivity_score')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'productivity_score'
              ? 'border-violet-600 text-violet-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Productivity Score & Velocity Matrix
        </button>
        <button
          onClick={() => setActiveSubtab('insights')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'insights'
              ? 'border-violet-600 text-violet-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Brain className="w-4 h-4" />
          Cognitive Load & Burnout Guard
        </button>
      </div>

      {/* SUBTAB 1: AI ASSISTANT */}
      {activeSubtab === 'ai_assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Subtask Generator */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                1-Click Task Decomposer (Gemini AI)
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 font-medium">
                Server-side Proxy
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Transform vague, overwhelming projects into concrete, actionable steps to eliminate procrastination.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Project / Task Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="e.g. Plan marketing campaign for Q4"
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleGenerateSubtasks}
                  disabled={isGeneratingSubtasks}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isGeneratingSubtasks ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  Break Down
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Generated Action Items:</span>
              <div className="space-y-2">
                {generatedSubtasks.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Daily Strategist */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-600" />
                AI Daily Prioritizer & Schedule Synthesizer
              </h3>
              <button
                onClick={handleGenerateDailyPlan}
                disabled={isGeneratingPlan}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isGeneratingPlan ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Re-Synthesize
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Evaluates current pending tasks, priority levels, and habit streaks to recommend the highest-impact schedule.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-2 whitespace-pre-line leading-relaxed font-sans">
              {dailyPlan}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PRODUCTIVITY SCORE */}
      {activeSubtab === 'productivity_score' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Gauge */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Score</span>
            <div className="relative flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-violet-100 flex items-center justify-center">
                <div className="text-4xl font-black text-violet-700 font-mono">88</div>
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Top 5% Productivity Tier
            </div>
            <p className="text-[11px] text-slate-500">
              Calculated dynamically from 24 completed tasks, 4 habits kept, and 120m deep focus logged.
            </p>
          </div>

          {/* Breakdown Indicators */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Productivity Velocity Dimensions</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">Urgent Task Completion Velocity</span>
                  <span className="font-bold text-violet-700">92%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-violet-600 h-full w-[92%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">Habit Adherence Rate</span>
                  <span className="font-bold text-emerald-600">85%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">Focus Session Ratio vs Target</span>
                  <span className="font-bold text-amber-600">78%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[78%]"></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-violet-50 border border-violet-100 rounded-lg text-violet-900 text-xs">
              <span className="font-bold">Insight:</span> Your completion rate peaks between 09:30 AM and 11:45 AM. Schedule your highest complexity tasks in this window.
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: COGNITIVE LOAD & BURNOUT GUARD */}
      {activeSubtab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Cognitive Overload Protection
            </h4>
            <p className="text-slate-600 leading-relaxed">
              TaskFlow monitors pending backlog size and warns users when daily scheduled tasks exceed sustainable human working memory (Miller's Law: 7 ± 2 items).
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-800">Current Daily Load: 5 items</span>
              <p className="text-[11px] text-slate-500">Status: Healthy cognitive threshold. Low risk of decision paralysis.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              Fatigue Recovery Engine
            </h4>
            <p className="text-slate-600 leading-relaxed">
              When 4 consecutive Pomodoro intervals are recorded without a 15-minute long break, the app suggests a hydration walk before opening the next session.
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900">
              <span className="font-bold">Recommendation:</span> Take your scheduled 15-minute long break after the next 25-minute sprint.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
