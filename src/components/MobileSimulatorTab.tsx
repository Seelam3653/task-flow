import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Circle, Flame, Timer, Sparkles, Plus, Play, Pause, RotateCcw, 
  ChevronRight, Volume2, ShieldCheck, Crown, Bell, Battery, Wifi, Signal, 
  ArrowLeft, Trash2, Calendar, AlertTriangle, Check, Laptop, Terminal
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string;
  subtasks: { id: string; title: string; completed: boolean }[];
}

interface Habit {
  id: string;
  title: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  targetDays: string;
}

interface MobileSimulatorTabProps {
  onNavigateToLocalSetup?: () => void;
}

export const MobileSimulatorTab: React.FC<MobileSimulatorTabProps> = ({ onNavigateToLocalSetup }) => {
  // Navigation inside the simulated phone
  const [mobileTab, setMobileTab] = useState<'tasks' | 'habits' | 'pomodoro' | 'paywall'>('tasks');
  const [phoneFrame, setPhoneFrame] = useState<'iphone' | 'pixel'>('pixel');

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Finalize Google Play Store Listing Copy',
      priority: 'Urgent',
      completed: false,
      dueDate: 'Today, 5:00 PM',
      subtasks: [
        { id: '1-1', title: 'Write 80-char short description', completed: true },
        { id: '1-2', title: 'Format feature bullets with emojis', completed: true },
        { id: '1-3', title: 'Draft Data Safety policy answers', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Review Supabase Database Migrations',
      priority: 'High',
      completed: false,
      dueDate: 'Tomorrow',
      subtasks: [
        { id: '2-1', title: 'Verify RLS multi-tenant policies', completed: true },
        { id: '2-2', title: 'Run seed script for test user', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Configure RevenueCat Entitlements',
      priority: 'Medium',
      completed: true,
      dueDate: 'Sep 16',
      subtasks: [],
    },
    {
      id: '4',
      title: 'Prepare 1024x500 Feature Graphic',
      priority: 'Low',
      completed: false,
      dueDate: 'Sep 18',
      subtasks: [],
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAiDecomposing, setIsAiDecomposing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Habits State
  const [habits, setHabits] = useState<Habit[]>([
    { id: 'h1', title: 'Deep Work (2 Pomodoros)', icon: '⚡', streak: 12, completedToday: true, targetDays: 'Daily' },
    { id: 'h2', title: 'Read 20 pages (Design Systems)', icon: '📚', streak: 5, completedToday: false, targetDays: 'Daily' },
    { id: 'h3', title: 'Zero Inbox Task Review', icon: '📥', streak: 8, completedToday: false, targetDays: 'Weekdays' },
    { id: 'h4', title: 'Post-work 30m Walk', icon: '🚶‍♂️', streak: 19, completedToday: true, targetDays: 'Daily' },
  ]);

  // Pomodoro State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [selectedSound, setSelectedSound] = useState('Rainfall');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
      }
      return t;
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      priority: 'High',
      completed: false,
      dueDate: 'Today',
      subtasks: [],
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const handleAiDecompose = (task: Task) => {
    setIsAiDecomposing(true);
    setTimeout(() => {
      const generatedSubtasks = [
        { id: `${task.id}-ai1`, title: 'Define high-level objectives & constraints', completed: false },
        { id: `${task.id}-ai2`, title: 'Draft execution checklist & assign resources', completed: false },
        { id: `${task.id}-ai3`, title: 'Validate against quality benchmarks', completed: false },
      ];
      setTasks(tasks.map(t => t.id === task.id ? { ...t, subtasks: [...t.subtasks, ...generatedSubtasks] } : t));
      setIsAiDecomposing(false);
      setSelectedTask(null);
    }, 1200);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const nextCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: nextCompleted,
          streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-slate-900">Live TaskFlow Mobile App Simulator</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interact with the live TaskFlow mobile user interface directly. Test task completion, AI breakdowns, habits, and the focus timer.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {onNavigateToLocalSetup && (
            <button
              onClick={onNavigateToLocalSetup}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>💻 Run on Local Machine</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 px-1">Frame:</span>
            <button
              onClick={() => setPhoneFrame('pixel')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                phoneFrame === 'pixel' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pixel 8
            </button>
            <button
              onClick={() => setPhoneFrame('iphone')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                phoneFrame === 'iphone' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              iPhone 15
            </button>
          </div>
        </div>
      </div>

      {/* Main Center Area: Simulated Smartphone */}
      <div className="flex justify-center items-center py-4 bg-slate-100 rounded-2xl border border-slate-200/80">
        <div 
          className={`relative bg-slate-950 rounded-[44px] p-3 shadow-2xl transition-all duration-300 ${
            phoneFrame === 'pixel' ? 'border-[4px] border-slate-800 w-[380px]' : 'border-[6px] border-slate-700 w-[390px]'
          }`}
          style={{ height: '760px' }}
        >
          {/* Outer Frame Bezel Screen Container */}
          <div className="relative w-full h-full bg-slate-50 rounded-[36px] overflow-hidden flex flex-col select-none">
            
            {/* Status Bar */}
            <div className="h-10 bg-white border-b border-slate-100 px-6 flex items-center justify-between text-xs font-medium text-slate-800 z-30">
              <span className="font-semibold text-[11px]">9:41</span>
              
              {/* Dynamic Island / Camera Punch Hole */}
              {phoneFrame === 'iphone' ? (
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ml-12"></div>
                </div>
              ) : (
                <div className="w-3.5 h-3.5 bg-black rounded-full"></div>
              )}

              <div className="flex items-center gap-1.5 text-slate-600">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Mobile Header Bar */}
            <div className="bg-white px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <h1 className="text-base font-extrabold text-slate-900 tracking-tight">TaskFlow</h1>
                </div>
                <p className="text-[10px] font-medium text-slate-400">
                  {mobileTab === 'tasks' && '4 tasks • 1 completed'}
                  {mobileTab === 'habits' && 'Active Streak: 12 Days 🔥'}
                  {mobileTab === 'pomodoro' && 'Pomodoro Focus Session'}
                  {mobileTab === 'paywall' && 'TaskFlow Pro Access'}
                </p>
              </div>

              <button
                onClick={() => setMobileTab('paywall')}
                className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
              >
                <Crown className="w-3 h-3" />
                <span>PRO</span>
              </button>
            </div>

            {/* Simulated Mobile Screen Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: TASKS */}
              {mobileTab === 'tasks' && (
                <div className="space-y-4">
                  {/* Quick Add Form */}
                  <form onSubmit={handleAddTask} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a new task..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Task List */}
                  <div className="space-y-2.5">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`bg-white rounded-xl p-3 border transition-all ${
                          task.completed ? 'border-slate-200/60 opacity-60' : 'border-slate-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {task.title}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                {task.dueDate}
                              </span>
                              
                              {task.subtasks.length > 0 && (
                                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold">
                                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                                </span>
                              )}
                            </div>

                            {/* Subtask items if available */}
                            {task.subtasks.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                                {task.subtasks.map((sub) => (
                                  <div key={sub.id} className="flex items-center gap-2 text-[11px] text-slate-600">
                                    <button 
                                      onClick={() => handleToggleSubtask(task.id, sub.id)}
                                      className="text-slate-400 hover:text-indigo-600"
                                    >
                                      {sub.completed ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Circle className="w-3 h-3" />
                                      )}
                                    </button>
                                    <span className={sub.completed ? 'line-through text-slate-400' : ''}>
                                      {sub.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Action Row: AI Decomposer button */}
                            {!task.completed && task.subtasks.length === 0 && (
                              <button
                                onClick={() => handleAiDecompose(task)}
                                disabled={isAiDecomposing}
                                className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                <span>{isAiDecomposing ? 'AI Breaking down...' : 'AI Subtask Breakdown'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: HABITS */}
              {mobileTab === 'habits' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 text-white shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-100">Consistency Score</span>
                        <h3 className="text-xl font-black mt-0.5">86% Completed</h3>
                      </div>
                      <Flame className="w-8 h-8 text-amber-200 fill-amber-200" />
                    </div>
                    <p className="text-[11px] text-orange-100 mt-1">2 of 4 habits logged for today</p>
                  </div>

                  <div className="space-y-2.5">
                    {habits.map((habit) => (
                      <div 
                        key={habit.id}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{habit.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{habit.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {habit.streak} day streak
                              </span>
                              <span className="text-[10px] text-slate-400">• {habit.targetDays}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleHabit(habit.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all active:scale-95 ${
                            habit.completedToday 
                              ? 'bg-emerald-600 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {habit.completedToday ? <Check className="w-4 h-4" /> : 'Log'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: POMODORO TIMER */}
              {mobileTab === 'pomodoro' && (
                <div className="space-y-5 text-center pt-3">
                  {/* Mode switcher */}
                  <div className="inline-flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => { setTimerMode('focus'); setPomodoroSeconds(25 * 60); setIsTimerRunning(false); }}
                      className={`px-4 py-1.5 rounded-lg transition-colors ${
                        timerMode === 'focus' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Focus (25m)
                    </button>
                    <button
                      onClick={() => { setTimerMode('break'); setPomodoroSeconds(5 * 60); setIsTimerRunning(false); }}
                      className={`px-4 py-1.5 rounded-lg transition-colors ${
                        timerMode === 'break' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Break (5m)
                    </button>
                  </div>

                  {/* Circular Timer Display */}
                  <div className="w-44 h-44 mx-auto rounded-full border-4 border-indigo-600 flex flex-col items-center justify-center bg-white shadow-md relative">
                    <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                      {formatTimer(pomodoroSeconds)}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">
                      {isTimerRunning ? 'Deep Focus Active' : 'Paused'}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs active:scale-95 transition-transform"
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                    </button>
                    <button
                      onClick={() => { setIsTimerRunning(false); setPomodoroSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60); }}
                      className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Soundscape Selector */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                        Ambient Soundscape
                      </span>
                      <span className="text-[10px] text-indigo-600 font-semibold">{selectedSound}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 text-[10px] font-semibold">
                      {['Rainfall', 'White Noise', 'Forest', 'Mute'].map((sound) => (
                        <button
                          key={sound}
                          onClick={() => setSelectedSound(sound)}
                          className={`py-1.5 rounded-lg border text-center transition-colors ${
                            selectedSound === sound
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {sound}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PAYWALL SCREEN */}
              {mobileTab === 'paywall' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-5 text-white text-center shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                      <Crown className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-extrabold">TaskFlow Pro</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Supercharge productivity with unlimited AI decomposition and offline multi-device sync.
                    </p>

                    <div className="mt-4 space-y-2 text-left text-xs">
                      <div className="flex items-center gap-2 text-[11px] text-slate-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Unlimited Gemini AI Subtask Breakdowns</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Instant 2-way Cloud SQLite Synchronization</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cognitive Workload & Burnout Guard</span>
                      </div>
                    </div>

                    {/* Subscription Buttons */}
                    <div className="mt-4 space-y-2">
                      <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-98 transition-transform flex items-center justify-between px-3">
                        <span>Annual Plan (Save 33%)</span>
                        <span>$39.99 / year</span>
                      </button>
                      <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold active:scale-98 transition-transform flex items-center justify-between px-3">
                        <span>Monthly Plan</span>
                        <span>$4.99 / mo</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setMobileTab('tasks')}
                      className="mt-3 text-[10px] text-slate-400 hover:text-slate-200 underline"
                    >
                      Back to Free Version
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Navigation Bar */}
            <div className="h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-around z-30">
              <button
                onClick={() => setMobileTab('tasks')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                  mobileTab === 'tasks' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span>Tasks</span>
              </button>

              <button
                onClick={() => setMobileTab('habits')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                  mobileTab === 'habits' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Flame className="w-5 h-5" />
                <span>Habits</span>
              </button>

              <button
                onClick={() => setMobileTab('pomodoro')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                  mobileTab === 'pomodoro' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Timer className="w-5 h-5" />
                <span>Focus</span>
              </button>
            </div>

            {/* Home Indicator Bar */}
            <div className="h-4 bg-white flex items-center justify-center pb-1">
              <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
