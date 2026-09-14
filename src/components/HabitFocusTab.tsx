import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Play, Pause, RotateCcw, Check, Plus, Calendar, Clock, 
  Sparkles, Award, TrendingUp, ShieldAlert, BarChart3, Coffee, 
  Volume2, VolumeX, CheckCircle2, ChevronRight, FileText, Code2, AlertCircle
} from 'lucide-react';
import { habitDartEntity, focusSessionDartEntity } from '../data/flutterHabitDartCode';

interface HabitItem {
  id: string;
  title: string;
  frequency: 'daily' | 'weekdays' | 'weekly';
  targetCount: number;
  currentStreak: number;
  bestStreak: number;
  colorHex: string;
  history: boolean[]; // last 14 days (index 13 = today)
}

interface FocusSessionRecord {
  id: string;
  taskTitle: string;
  durationMinutes: number;
  completedAt: string;
}

export const HabitFocusTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'tracker' | 'pomodoro' | 'dart_code' | 'streak_algo'>('tracker');

  // Habits State
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h-1',
      title: 'Drink 2.5L Water',
      frequency: 'daily',
      targetCount: 1,
      currentStreak: 12,
      bestStreak: 18,
      colorHex: '#06B6D4',
      history: [true, true, true, false, true, true, true, true, true, true, true, true, true, true],
    },
    {
      id: 'h-2',
      title: 'Morning 20m Aerobic Workout',
      frequency: 'daily',
      targetCount: 1,
      currentStreak: 6,
      bestStreak: 14,
      colorHex: '#10B981',
      history: [false, true, true, true, false, true, false, true, true, true, true, true, true, false],
    },
    {
      id: 'h-3',
      title: 'Read 15 Pages Architecture Book',
      frequency: 'weekdays',
      targetCount: 1,
      currentStreak: 4,
      bestStreak: 21,
      colorHex: '#8B5CF6',
      history: [true, true, true, true, true, false, false, true, true, true, true, true, true, true],
    },
    {
      id: 'h-4',
      title: 'Evening Brain Dump & Plan Tomorrow',
      frequency: 'daily',
      targetCount: 1,
      currentStreak: 9,
      bestStreak: 9,
      colorHex: '#F59E0B',
      history: [true, false, true, true, true, true, true, true, true, true, true, true, true, false],
    },
  ]);

  // New Habit Modal State
  const [isAddingHabit, setIsAddingHabit] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newFreq, setNewFreq] = useState<'daily' | 'weekdays' | 'weekly'>('daily');
  const [newColor, setNewColor] = useState<string>('#3B82F6');

  // Pomodoro State
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 mins in seconds
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [linkedTask, setLinkedTask] = useState<string>('Verify Google Play Billing signature verification');
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(3);
  const [sessionHistory, setSessionHistory] = useState<FocusSessionRecord[]>([
    { id: 'fs-1', taskTitle: 'Configure Supabase RLS policies', durationMinutes: 25, completedAt: '09:15 AM' },
    { id: 'fs-2', taskTitle: 'Implement Clean Architecture entities', durationMinutes: 25, completedAt: '10:30 AM' },
    { id: 'fs-3', taskTitle: 'Draft offline sync repository logic', durationMinutes: 25, completedAt: '11:45 AM' },
  ]);

  // Audio effect simulation using Web Audio API (gentle chime)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      // AudioContext unavailable or restricted
    }
  };

  // Timer Tick
  useEffect(() => {
    let timer: any = null;
    if (timerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimerRunning(false);
            playChime();
            if (pomodoroMode === 'work') {
              setSessionsCompletedToday((c) => c + 1);
              setSessionHistory((prevList) => [
                {
                  id: `fs-${Date.now()}`,
                  taskTitle: linkedTask,
                  durationMinutes: 25,
                  completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
                ...prevList,
              ]);
              setPomodoroMode('shortBreak');
              return 5 * 60;
            } else {
              setPomodoroMode('work');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerRunning, pomodoroMode, linkedTask, soundEnabled]);

  const switchPomodoroMode = (mode: 'work' | 'shortBreak' | 'longBreak') => {
    setTimerRunning(false);
    setPomodoroMode(mode);
    if (mode === 'work') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle habit completion today (index 13 in 14-day history)
  const toggleHabitToday = (habitId: string) => {
    setHabits(habits.map((h) => {
      if (h.id !== habitId) return h;
      const newHistory = [...h.history];
      const todayDone = !newHistory[13];
      newHistory[13] = todayDone;
      const newStreak = todayDone ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
      const newBest = Math.max(h.bestStreak, newStreak);
      return {
        ...h,
        history: newHistory,
        currentStreak: newStreak,
        bestStreak: newBest,
      };
    }));
  };

  const handleAddHabit = () => {
    if (!newTitle.trim()) return;
    const newHabit: HabitItem = {
      id: `h-${Date.now()}`,
      title: newTitle.trim(),
      frequency: newFreq,
      targetCount: 1,
      currentStreak: 0,
      bestStreak: 0,
      colorHex: newColor,
      history: Array(14).fill(false),
    };
    setHabits([...habits, newHabit]);
    setNewTitle('');
    setIsAddingHabit(false);
  };

  // Generate last 14 days labels
  const daysLabels = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      dayNum: d.getDate(),
      dayName: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()],
      isToday: i === 13,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5" />
              Phase 4: Habit Tracking & Deep Focus Pomodoro Timer
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Gamified Habits, Consistency Streaks & Pomodoro</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              14-day completion matrix, unbreakable streak calculation algorithms, and task-linked 
              Pomodoro focus sessions with audio feedback and break intervals.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>12 Day Streak</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Clock className="w-4 h-4" />
              <span>{sessionsCompletedToday} Focus Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('tracker')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'tracker'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          14-Day Habit Matrix & Streaks
        </button>
        <button
          onClick={() => setActiveSubtab('pomodoro')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'pomodoro'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Task-Linked Pomodoro Timer
        </button>
        <button
          onClick={() => setActiveSubtab('streak_algo')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'streak_algo'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          Streak Algorithm & Grace Period
        </button>
        <button
          onClick={() => setActiveSubtab('dart_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'dart_code'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Dart Entities (`habit.dart`)
        </button>
      </div>

      {/* SUBTAB 1: HABIT TRACKER MATRIX */}
      {activeSubtab === 'tracker' && (
        <div className="space-y-6">
          {/* Quick Actions & Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daily Habit Consistency Heatmap</h3>
              <p className="text-xs text-slate-500">Tap the checkmark for today or any past day to log completion.</p>
            </div>
            <button
              onClick={() => setIsAddingHabit(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Habit
            </button>
          </div>

          {/* Habit Heatmap Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-4 font-bold min-w-[220px]">Habit Name</th>
                    <th className="p-4 font-bold text-center w-24">Streak</th>
                    <th className="p-4 font-bold text-center w-24">Best</th>
                    {daysLabels.map((d, i) => (
                      <th
                        key={i}
                        className={`p-2 text-center w-10 font-mono text-[11px] ${
                          d.isToday ? 'bg-teal-50 text-teal-700 font-bold' : ''
                        }`}
                      >
                        <div className="text-[10px] text-slate-400 font-sans">{d.dayName}</div>
                        <div>{d.dayNum}</div>
                      </th>
                    ))}
                    <th className="p-4 text-center font-bold min-w-[100px]">Today's Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {habits.map((habit) => {
                    const isDoneToday = habit.history[13];
                    return (
                      <tr key={habit.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Title & Frequency */}
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: habit.colorHex }}
                            ></span>
                            <div>
                              <span className="font-semibold text-slate-900 block">{habit.title}</span>
                              <span className="text-[10px] text-slate-400 capitalize">{habit.frequency} target</span>
                            </div>
                          </div>
                        </td>

                        {/* Current Streak */}
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs">
                            <Flame className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {habit.currentStreak}
                          </span>
                        </td>

                        {/* Best Streak */}
                        <td className="p-4 text-center font-mono text-slate-500 font-medium">
                          {habit.bestStreak}d
                        </td>

                        {/* 14-Day Blocks */}
                        {habit.history.map((done, idx) => {
                          const isTodayCol = idx === 13;
                          return (
                            <td
                              key={idx}
                              className={`p-1 text-center ${isTodayCol ? 'bg-teal-50/50' : ''}`}
                            >
                              <div
                                className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-all ${
                                  done
                                    ? 'shadow-xs text-white'
                                    : 'bg-slate-100 text-slate-300'
                                }`}
                                style={{
                                  backgroundColor: done ? habit.colorHex : undefined,
                                }}
                              >
                                {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </td>
                          );
                        })}

                        {/* Today Completion Button */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleHabitToday(habit.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 mx-auto ${
                              isDoneToday
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {isDoneToday ? 'Completed' : 'Mark Done'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: POMODORO TIMER */}
      {activeSubtab === 'pomodoro' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer Display */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-6">
            {/* Mode Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => switchPomodoroMode('work')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  pomodoroMode === 'work' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Focus Session (25m)
              </button>
              <button
                onClick={() => switchPomodoroMode('shortBreak')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  pomodoroMode === 'shortBreak' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => switchPomodoroMode('longBreak')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  pomodoroMode === 'longBreak' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Linked Task Selector */}
            <div className="max-w-md w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left">
              <span className="text-slate-400 font-bold block mb-1">Target Task to Focus On:</span>
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span className="truncate">{linkedTask}</span>
              </div>
            </div>

            {/* Huge Timer Digits */}
            <div className="relative my-4">
              <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-slate-900">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-2">
                {timerRunning ? 'Timer active — stay in deep flow state' : 'Paused — ready to begin'}
              </div>
            </div>

            {/* Primary Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 shadow-sm transition-all ${
                  timerRunning
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                {timerRunning ? 'Pause Session' : 'Start Focus Flow'}
              </button>

              <button
                onClick={() => switchPomodoroMode(pomodoroMode)}
                className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-4 rounded-xl transition-colors ${
                  soundEnabled ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-400'
                }`}
                title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Session History & Daily Progress */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Today's Focus Goal
              </h3>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-600">{sessionsCompletedToday} / 6 Sessions</span>
                <span className="font-bold text-teal-600">{Math.round((sessionsCompletedToday / 6) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (sessionsCompletedToday / 6) * 100)}%` }}
                ></div>
              </div>
              <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg text-xs text-teal-800 font-medium">
                {sessionsCompletedToday * 25} minutes of undistracted deep work logged today.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Completed Sessions</span>
                <span className="text-xs text-slate-400">{sessionHistory.length}</span>
              </h3>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {sessionHistory.map((s) => (
                  <div key={s.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                      <span className="truncate max-w-[180px]">{s.taskTitle}</span>
                      <span className="text-[10px] text-teal-600 font-mono">+{s.durationMinutes}m</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{s.completedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: STREAK ALGORITHM & GRACE PERIOD */}
      {activeSubtab === 'streak_algo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              The TaskFlow "Fair Streak" Engine
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Standard habit apps cause user fatigue by ruthlessly resetting streaks to 0 if a habit is logged at 12:01 AM instead of 11:59 PM.
            </p>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1.5 font-medium">
              <span className="font-bold block">1. 36-Hour Grace Window</span>
              <p className="text-[11px] text-amber-800">
                A streak is not penalized immediately at midnight. The user has until 12:00 PM the following afternoon to record their evening habit.
              </p>
            </div>
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 space-y-1.5 font-medium">
              <span className="font-bold block">2. Frequency Masking</span>
              <p className="text-[11px] text-teal-800">
                For weekday-only habits (e.g. "Review Pull Requests"), Saturdays and Sundays are excluded from streak reset logic.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Gamification & Dopamine Loops
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Habit adherence spikes when paired with progressive milestone recognition:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🥉</span>
                  <div>
                    <span className="font-bold text-slate-900 block">7-Day Consistency</span>
                    <span className="text-slate-500 text-[11px]">Unlocks customized habit color themes</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Unlocked</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🥈</span>
                  <div>
                    <span className="font-bold text-slate-900 block">21-Day Habit Formation</span>
                    <span className="text-slate-500 text-[11px]">Neuroscience threshold for subconscious routine</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">12 / 21 Days</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🥇</span>
                  <div>
                    <span className="font-bold text-slate-900 block">66-Day Mastery</span>
                    <span className="text-slate-500 text-[11px]">Permanent lifetime achievement badge</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">12 / 66 Days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: DART CODE ENTITIES */}
      {activeSubtab === 'dart_code' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
              <span className="text-teal-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                lib/features/habits/domain/entities/habit.dart
              </span>
              <span className="text-slate-500">Pure Dart Habit & HabitLog Domain Entities</span>
            </div>
            <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[380px]">
              <code>{habitDartEntity}</code>
            </pre>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
              <span className="text-teal-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                lib/features/focus/domain/entities/focus_session.dart
              </span>
              <span className="text-slate-500">Pure Dart Pomodoro Focus Session Entity</span>
            </div>
            <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[320px]">
              <code>{focusSessionDartEntity}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Create Habit Modal */}
      {isAddingHabit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Create New Habit</h3>
              <button onClick={() => setIsAddingHabit(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Habit Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Meditate for 10 minutes"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Frequency</label>
              <select
                value={newFreq}
                onChange={(e: any) => setNewFreq(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
              >
                <option value="daily">Daily (Every Day)</option>
                <option value="weekdays">Weekdays Only (Monday to Friday)</option>
                <option value="weekly">Weekly (Once per week)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Accent Theme Color</label>
              <div className="flex items-center gap-2">
                {['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-slate-800' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddingHabit(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHabit}
                className="px-4 py-2 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs"
              >
                Save Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
