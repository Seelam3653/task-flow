import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, Plus, Trash2, Calendar, Clock, Tag, Folder, 
  Repeat, AlertCircle, Sparkles, Filter, Search, ArrowUpDown, 
  ChevronRight, CheckSquare, Layers, Code2, RefreshCw, FileText
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Category, Project } from '../types/taskModels';
import { taskDartEntity } from '../data/flutterTaskDartCode';
import { taskRepositoryDartCode } from '../data/flutterRepositoryDartCode';

export const CoreTaskTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'app_preview' | 'dart_entities' | 'repository_sync' | 'recurrence_engine'>('app_preview');

  // Categories
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', userId: 'u1', name: 'Work', colorHex: '#3B82F6', iconName: 'briefcase', sortOrder: 0, isSystem: true },
    { id: 'cat-2', userId: 'u1', name: 'Personal', colorHex: '#10B981', iconName: 'user', sortOrder: 1, isSystem: true },
    { id: 'cat-3', userId: 'u1', name: 'Health & Fitness', colorHex: '#EF4444', iconName: 'heart', sortOrder: 2, isSystem: true },
    { id: 'cat-4', userId: 'u1', name: 'Study', colorHex: '#8B5CF6', iconName: 'book-open', sortOrder: 3, isSystem: true },
  ]);

  // Projects
  const [projects] = useState<Project[]>([
    { id: 'proj-1', userId: 'u1', name: 'TaskFlow Android Launch', colorHex: '#6366F1', targetDate: '2026-10-15', status: 'active', totalTasks: 4, completedTasks: 2 },
    { id: 'proj-2', userId: 'u1', name: 'Q4 Health & Running Goal', colorHex: '#10B981', targetDate: '2026-12-31', status: 'active', totalTasks: 2, completedTasks: 1 },
  ]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      userId: 'u1',
      categoryId: 'cat-1',
      projectId: 'proj-1',
      title: 'Configure Google Play Billing key & service account',
      description: 'Generate JSON credentials for verify-purchase edge function.',
      priority: TaskPriority.urgent,
      status: TaskStatus.pending,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '15:00',
      reminderAt: '2026-09-14T14:45:00Z',
      isRecurring: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [
        { id: 'sub-1', taskId: 'task-1', title: 'Download Google Play JSON API key', isCompleted: true, sortOrder: 0 },
        { id: 'sub-2', taskId: 'task-1', title: 'Add SUPABASE_SERVICE_ROLE_KEY to secrets', isCompleted: false, sortOrder: 1 },
      ],
    },
    {
      id: 'task-2',
      userId: 'u1',
      categoryId: 'cat-3',
      title: 'Morning 5km aerobic run',
      description: 'Keep heart rate in zone 2 under 145 bpm.',
      priority: TaskPriority.medium,
      status: TaskStatus.pending,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '07:30',
      isRecurring: true,
      recurrenceRule: { freq: 'daily', interval: 1 },
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
    },
    {
      id: 'task-3',
      userId: 'u1',
      categoryId: 'cat-4',
      title: 'Study Flutter Clean Architecture with Bloc / Riverpod',
      description: 'Review domain entities vs data models vs presentation state.',
      priority: TaskPriority.high,
      status: TaskStatus.completed,
      dueDate: '2026-09-13',
      completedAt: '2026-09-13T18:30:00Z',
      isRecurring: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
    },
  ]);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showArchived, setShowArchived] = useState<boolean>(false);

  // New task form modal/drawer
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('cat-1');
  const [newPriority, setNewPriority] = useState<TaskPriority>(TaskPriority.medium);
  const [newDueDate, setNewDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newDueTime, setNewDueTime] = useState<string>('12:00');
  const [newIsRecurring, setNewIsRecurring] = useState<boolean>(false);
  const [newRecurrenceFreq, setNewRecurrenceFreq] = useState<'daily' | 'weekdays' | 'weekly'>('daily');

  // Quick NLP Parser Simulation
  const handleQuickAdd = (text: string) => {
    if (!text.trim()) return;
    let priority = TaskPriority.medium;
    let categoryId = 'cat-1';
    let isRecurring = false;

    if (text.toLowerCase().includes('urgent') || text.includes('!')) {
      priority = TaskPriority.urgent;
    } else if (text.toLowerCase().includes('low priority')) {
      priority = TaskPriority.low;
    }

    if (text.toLowerCase().includes('health') || text.toLowerCase().includes('gym') || text.toLowerCase().includes('run')) {
      categoryId = 'cat-3';
    } else if (text.toLowerCase().includes('study') || text.toLowerCase().includes('read')) {
      categoryId = 'cat-4';
    }

    if (text.toLowerCase().includes('every day') || text.toLowerCase().includes('daily')) {
      isRecurring = true;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      userId: 'u1',
      categoryId,
      title: text.replace(/!(urgent|low|high)/gi, '').trim(),
      priority,
      status: TaskStatus.pending,
      dueDate: new Date().toISOString().split('T')[0],
      isRecurring,
      recurrenceRule: isRecurring ? { freq: 'daily', interval: 1 } : null,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setIsCreating(false);
  };

  // Toggle completion with virtual recurrence logic
  const toggleTaskStatus = (task: Task) => {
    if (task.status === TaskStatus.completed) {
      // Revert to pending
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: TaskStatus.pending, completedAt: null } : t));
    } else {
      // If recurring, advance date
      if (task.isRecurring && task.recurrenceRule) {
        const currentDue = task.dueDate ? new Date(task.dueDate) : new Date();
        const nextDue = new Date(currentDue);
        if (task.recurrenceRule.freq === 'daily') {
          nextDue.setDate(nextDue.getDate() + 1);
        } else if (task.recurrenceRule.freq === 'weekdays') {
          nextDue.setDate(nextDue.getDate() + (nextDue.getDay() === 5 ? 3 : nextDue.getDay() === 6 ? 2 : 1));
        } else if (task.recurrenceRule.freq === 'weekly') {
          nextDue.setDate(nextDue.getDate() + 7);
        }

        setTasks(tasks.map(t => t.id === task.id ? {
          ...t,
          dueDate: nextDue.toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
        } : t));
      } else {
        setTasks(tasks.map(t => t.id === task.id ? {
          ...t,
          status: TaskStatus.completed,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } : t));
      }
    }
  };

  // Toggle subtask
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks?.map(s => s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s)
      };
    }));
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(t => {
    if (!showArchived && t.isArchived) return false;
    if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.urgent:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">Urgent</span>;
      case TaskPriority.high:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700">High</span>;
      case TaskPriority.medium:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">Medium</span>;
      case TaskPriority.low:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              Phase 3: Core Task Management & Flutter Models
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Flutter Clean Architecture Task Engine</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Clean Architecture Domain Entities, Offline-First SQLite/Drift sync repository, 
              virtual recurrence scheduler, hierarchical subtasks, and quick NLP parser.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Offline-First Sync Engine Active</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveView('app_preview')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeView === 'app_preview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Interactive Task Manager & Recurrence
        </button>
        <button
          onClick={() => setActiveView('dart_entities')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeView === 'dart_entities'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Dart Domain Entity (`task.dart`)
        </button>
        <button
          onClick={() => setActiveView('repository_sync')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeView === 'repository_sync'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Flutter Offline Sync Repository
        </button>
        <button
          onClick={() => setActiveView('recurrence_engine')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeView === 'recurrence_engine'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Repeat className="w-4 h-4" />
          Recurrence & Scheduling Logic
        </button>
      </div>

      {/* VIEW 1: INTERACTIVE TASK MANAGER */}
      {activeView === 'app_preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Task List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Add Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Quick add task... (e.g., 'Finish slide deck tomorrow !urgent #Work')"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickAdd(newTitle);
                  }}
                  className="flex-1 text-sm bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-indigo-500 focus:bg-white"
                />
                <button
                  onClick={() => handleQuickAdd(newTitle)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg shadow-xs transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span>Tip: Type <code>!urgent</code> or <code>daily</code> for auto-parsing</span>
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  + Open Detailed Creator
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
                >
                  <option value="all">All Priorities</option>
                  <option value={TaskPriority.urgent}>Urgent</option>
                  <option value={TaskPriority.high}>High</option>
                  <option value={TaskPriority.medium}>Medium</option>
                  <option value={TaskPriority.low}>Low</option>
                </select>
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No tasks matching criteria</p>
                  <p className="text-xs text-slate-400 mt-1">Add a new task using the quick add bar above</p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const category = categories.find(c => c.id === task.categoryId);
                  const isCompleted = task.status === TaskStatus.completed;

                  return (
                    <div
                      key={task.id}
                      className={`group bg-white rounded-xl border transition-all p-4 ${
                        isCompleted
                          ? 'border-slate-200 bg-slate-50/60 opacity-75'
                          : 'border-slate-200 hover:border-indigo-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-sm font-semibold text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                              {task.title}
                            </span>
                            {getPriorityBadge(task.priority)}
                            {task.isRecurring && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                <Repeat className="w-3 h-3" />
                                {task.recurrenceRule?.freq}
                              </span>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-xs text-slate-500 mb-2">{task.description}</p>
                          )}

                          {/* Subtasks */}
                          {task.subtasks && task.subtasks.length > 0 && (
                            <div className="mb-2 pl-2 border-l-2 border-slate-100 space-y-1">
                              {task.subtasks.map((sub) => (
                                <div key={sub.id} className="flex items-center gap-2 text-xs text-slate-600">
                                  <input
                                    type="checkbox"
                                    checked={sub.isCompleted}
                                    onChange={() => toggleSubtask(task.id, sub.id)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                                  />
                                  <span className={sub.isCompleted ? 'line-through text-slate-400' : ''}>
                                    {sub.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Metadata row */}
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            {category && (
                              <span className="flex items-center gap-1 font-medium" style={{ color: category.colorHex }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.colorHex }}></span>
                                {category.name}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Calendar className="w-3 h-3" />
                                {task.dueDate} {task.dueTime && `@ ${task.dueTime}`}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 p-1 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Sidebar: Categories & Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Task Categories</span>
                <span className="text-xs text-slate-400">{categories.length}</span>
              </h3>
              <div className="space-y-2">
                {categories.map((c) => {
                  const count = tasks.filter(t => t.categoryId === c.id && t.status !== TaskStatus.completed).length;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCategory(selectedCategory === c.id ? 'all' : c.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        selectedCategory === c.id ? 'bg-indigo-50 border border-indigo-200 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.colorHex }}></span>
                        <span className="text-slate-800">{c.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Active Projects</h3>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{p.name}</span>
                      <span className="text-[10px] text-indigo-600">
                        {p.completedTasks}/{p.totalTasks} Done
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${((p.completedTasks || 0) / (p.totalTasks || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DART ENTITY CODE */}
      {activeView === 'dart_entities' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                lib/features/tasks/domain/entities/task.dart
              </span>
              <span className="text-slate-500">Pure Dart Clean Architecture Domain Entity</span>
            </div>
            <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[500px]">
              <code>{taskDartEntity}</code>
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 3: REPOSITORY SYNC CODE */}
      {activeView === 'repository_sync' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                lib/features/tasks/data/repositories/task_repository_impl.dart
              </span>
              <span className="text-slate-500">Offline-First Drift & Supabase Synchronization</span>
            </div>
            <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[500px]">
              <code>{taskRepositoryDartCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 4: RECURRENCE & SCHEDULING */}
      {activeView === 'recurrence_engine' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-indigo-600" />
              Virtual Recurrence (No Database Bloat)
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Traditional todo apps create 365 rows in the database when a user sets a daily recurring task, causing table bloat, slow sync times, and storage strain.
            </p>
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 font-medium">
              TaskFlow uses <strong>Virtual Recurrence</strong>: only <strong>one</strong> database record exists. When completed, the repository automatically calculates the next date and advances the due date in a single row update.
            </div>
            <ul className="space-y-2 text-slate-700">
              <li>• <strong>Daily</strong>: <code>next = current + 1 day</code></li>
              <li>• <strong>Weekdays</strong>: Skips Saturday & Sunday automatically</li>
              <li>• <strong>Weekly</strong>: Advances by 7 days or matching days-of-week mask</li>
              <li>• <strong>Monthly</strong>: Preserves target day-of-month</li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Quick Natural Language Parser (NLP)
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Users can type natural sentences and the parser automatically categorizes priority, due date, and category:
            </p>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-mono text-indigo-600 font-bold block mb-1">"Gym leg workout tomorrow 7am !urgent #Health"</span>
                <span className="text-slate-500">→ Due tomorrow @ 07:00, Priority: Urgent, Category: Health & Fitness</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-mono text-emerald-600 font-bold block mb-1">"Review marketing deck every weekday #Work"</span>
                <span className="text-slate-500">→ Recurrence: Weekdays, Category: Work</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Task Creator Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Create New Task</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Build release bundle for production"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add notes, links, or instructions..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value={TaskPriority.low}>Low</option>
                    <option value={TaskPriority.medium}>Medium</option>
                    <option value={TaskPriority.high}>High</option>
                    <option value={TaskPriority.urgent}>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newIsRecurring}
                    onChange={(e) => setNewIsRecurring(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Make this a recurring task</span>
                </label>
              </div>

              {newIsRecurring && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <label className="block font-bold text-purple-900 mb-1">Recurrence Frequency</label>
                  <select
                    value={newRecurrenceFreq}
                    onChange={(e: any) => setNewRecurrenceFreq(e.target.value)}
                    className="w-full p-2 bg-white border border-purple-300 rounded-lg text-purple-900 font-medium"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newTask: Task = {
                    id: `task-${Date.now()}`,
                    userId: 'u1',
                    categoryId: newCategory,
                    title: newTitle || 'Untitled Task',
                    description: newDescription,
                    priority: newPriority,
                    status: TaskStatus.pending,
                    dueDate: newDueDate,
                    dueTime: newDueTime,
                    isRecurring: newIsRecurring,
                    recurrenceRule: newIsRecurring ? { freq: newRecurrenceFreq, interval: 1 } : null,
                    isArchived: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    subtasks: [],
                  };
                  setTasks([newTask, ...tasks]);
                  setIsCreating(false);
                  setNewTitle('');
                  setNewDescription('');
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
