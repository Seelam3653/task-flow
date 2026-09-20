// ==============================================================================
// TASKFLOW FLUTTER ARCHITECTURE: MODULAR CLEAN STRUCTURE
// ==============================================================================

export interface ProjectFileStructure {
  path: string;
  name: string;
  category: 'core' | 'model' | 'service' | 'screen' | 'widget' | 'config';
  description: string;
  code: string;
}

export const cleanFlutterFiles: ProjectFileStructure[] = [
  {
    path: "pubspec.yaml",
    name: "pubspec.yaml",
    category: "config",
    description: "App configuration and minimal zero-conflict dependencies.",
    code: `name: taskflow
description: "TaskFlow: Intelligent offline-first tasks, habits, and focus engine."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ">=3.4.0 <4.0.0"
  flutter: ">=3.22.0"

dependencies:
  flutter:
    sdk: flutter

  # Local Disk Persistence (Latest stable)
  shared_preferences: ^2.5.5

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^6.0.0

flutter:
  uses-material-design: true
`
  },
  {
    path: "lib/main.dart",
    name: "main.dart",
    category: "core",
    description: "Application entry point and Theme configuration.",
    code: `import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/main_navigation_screen.dart';
import 'services/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final storageService = StorageService(prefs: prefs);
  
  runApp(TaskFlowApp(storageService: storageService));
}

class TaskFlowApp extends StatelessWidget {
  final StorageService storageService;
  const TaskFlowApp({super.key, required this.storageService});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TaskFlow',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Roboto',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5),
          primary: const Color(0xFF4F46E5),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        cardTheme: const CardThemeData(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(14)),
            side: BorderSide(color: Color(0xFFE2E8F0)),
          ),
        ),
      ),
      home: MainNavigationScreen(storageService: storageService),
    );
  }
}
`
  },
  {
    path: "lib/models/task_item.dart",
    name: "task_item.dart",
    category: "model",
    description: "Task and Subtask domain models with JSON serialization.",
    code: `class SubTask {
  final String id;
  String title;
  bool isCompleted;

  SubTask({
    required this.id,
    required this.title,
    this.isCompleted = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'isCompleted': isCompleted,
  };

  factory SubTask.fromJson(Map<String, dynamic> json) => SubTask(
    id: json['id'] as String,
    title: json['title'] as String,
    isCompleted: json['isCompleted'] as bool? ?? false,
  );
}

class TaskItem {
  final String id;
  String title;
  String priority; // 'Urgent', 'High', 'Medium', 'Low'
  String dueDate;
  bool isCompleted;
  List<SubTask> subtasks;

  TaskItem({
    required this.id,
    required this.title,
    required this.priority,
    required this.dueDate,
    this.isCompleted = false,
    List<SubTask>? subtasks,
  }) : subtasks = subtasks ?? [];

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'priority': priority,
    'dueDate': dueDate,
    'isCompleted': isCompleted,
    'subtasks': subtasks.map((s) => s.toJson()).toList(),
  };

  factory TaskItem.fromJson(Map<String, dynamic> json) => TaskItem(
    id: json['id'] as String,
    title: json['title'] as String,
    priority: json['priority'] as String? ?? 'High',
    dueDate: json['dueDate'] as String? ?? 'Today',
    isCompleted: json['isCompleted'] as bool? ?? false,
    subtasks: (json['subtasks'] as List<dynamic>?)
            ?.map((s) => SubTask.fromJson(s as Map<String, dynamic>))
            .toList() ??
        [],
  );
}
`
  },
  {
    path: "lib/models/habit_item.dart",
    name: "habit_item.dart",
    category: "model",
    description: "Habit domain model with daily streak calculations.",
    code: `class HabitItem {
  final String id;
  String title;
  String icon;
  int streak;
  bool isCompletedToday;
  String targetDays;

  HabitItem({
    required this.id,
    required this.title,
    required this.icon,
    this.streak = 0,
    this.isCompletedToday = false,
    this.targetDays = 'Daily',
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'icon': icon,
    'streak': streak,
    'isCompletedToday': isCompletedToday,
    'targetDays': targetDays,
  };

  factory HabitItem.fromJson(Map<String, dynamic> json) => HabitItem(
    id: json['id'] as String,
    title: json['title'] as String,
    icon: json['icon'] as String? ?? '⚡',
    streak: json['streak'] as int? ?? 0,
    isCompletedToday: json['isCompletedToday'] as bool? ?? false,
    targetDays: json['targetDays'] as String? ?? 'Daily',
  );
}
`
  },
  {
    path: "lib/services/storage_service.dart",
    name: "storage_service.dart",
    category: "service",
    description: "SharedPreferences disk persistence for tasks and habits.",
    code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/task_item.dart';
import '../models/habit_item.dart';

class StorageService {
  final SharedPreferences prefs;
  static const String _tasksKey = 'taskflow_tasks_v2';
  static const String _habitsKey = 'taskflow_habits_v2';

  StorageService({required this.prefs});

  List<TaskItem> loadTasks() {
    final raw = prefs.getString(_tasksKey);
    if (raw == null || raw.isEmpty) return _getDefaultTasks();
    try {
      final List<dynamic> decoded = jsonDecode(raw);
      return decoded.map((e) => TaskItem.fromJson(e)).toList();
    } catch (_) {
      return _getDefaultTasks();
    }
  }

  Future<void> saveTasks(List<TaskItem> tasks) async {
    final encoded = jsonEncode(tasks.map((t) => t.toJson()).toList());
    await prefs.setString(_tasksKey, encoded);
  }

  List<HabitItem> loadHabits() {
    final raw = prefs.getString(_habitsKey);
    if (raw == null || raw.isEmpty) return _getDefaultHabits();
    try {
      final List<dynamic> decoded = jsonDecode(raw);
      return decoded.map((e) => HabitItem.fromJson(e)).toList();
    } catch (_) {
      return _getDefaultHabits();
    }
  }

  Future<void> saveHabits(List<HabitItem> habits) async {
    final encoded = jsonEncode(habits.map((h) => h.toJson()).toList());
    await prefs.setString(_habitsKey, encoded);
  }

  List<TaskItem> _getDefaultTasks() {
    return [
      TaskItem(
        id: '1',
        title: 'Finalize Google Play Store Listing Copy',
        priority: 'Urgent',
        dueDate: 'Today, 5:00 PM',
        subtasks: [
          SubTask(id: '1-1', title: 'Write 80-char short description', isCompleted: true),
          SubTask(id: '1-2', title: 'Format feature bullets with emojis', isCompleted: true),
          SubTask(id: '1-3', title: 'Draft Data Safety policy answers', isCompleted: false),
        ],
      ),
      TaskItem(
        id: '2',
        title: 'Review Supabase Database Migrations',
        priority: 'High',
        dueDate: 'Tomorrow',
        subtasks: [
          SubTask(id: '2-1', title: 'Verify RLS multi-tenant policies', isCompleted: true),
          SubTask(id: '2-2', title: 'Run seed script for test user', isCompleted: false),
        ],
      ),
      TaskItem(
        id: '3',
        title: 'Configure RevenueCat Entitlements',
        priority: 'Medium',
        dueDate: 'Sep 16',
        isCompleted: true,
      ),
      TaskItem(
        id: '4',
        title: 'Prepare 1024x500 Feature Graphic',
        priority: 'Low',
        dueDate: 'Sep 18',
      ),
    ];
  }

  List<HabitItem> _getDefaultHabits() {
    return [
      HabitItem(id: 'h1', title: 'Deep Work (2 Pomodoros)', icon: '⚡', streak: 12, isCompletedToday: true, targetDays: 'Daily'),
      HabitItem(id: 'h2', title: 'Read 20 pages (Design Systems)', icon: '📚', streak: 5, isCompletedToday: false, targetDays: 'Daily'),
      HabitItem(id: 'h3', title: 'Zero Inbox Task Review', icon: '📥', streak: 8, isCompletedToday: false, targetDays: 'Weekdays'),
      HabitItem(id: 'h4', title: 'Post-work 30m Walk', icon: '🚶‍♂️', streak: 19, isCompletedToday: true, targetDays: 'Daily'),
    ];
  }
}
`
  },
  {
    path: "lib/screens/main_navigation_screen.dart",
    name: "main_navigation_screen.dart",
    category: "screen",
    description: "App header with PRO badge, live stats, and 3-tab bottom navigation bar.",
    code: `import 'package:flutter/material.dart';
import '../services/storage_service.dart';
import '../models/task_item.dart';
import '../models/habit_item.dart';
import '../widgets/pro_paywall_sheet.dart';
import 'tasks_screen.dart';
import 'habits_screen.dart';
import 'pomodoro_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  final StorageService storageService;
  const MainNavigationScreen({super.key, required this.storageService});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;
  late List<TaskItem> _tasks;
  late List<HabitItem> _habits;

  @override
  void initState() {
    super.initState();
    _tasks = widget.storageService.loadTasks();
    _habits = widget.storageService.loadHabits();
  }

  void _onTasksUpdated() {
    setState(() {});
    widget.storageService.saveTasks(_tasks);
  }

  void _onHabitsUpdated() {
    setState(() {});
    widget.storageService.saveHabits(_habits);
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      TasksScreen(tasks: _tasks, onUpdate: _onTasksUpdated),
      HabitsScreen(habits: _habits, onUpdate: _onHabitsUpdated),
      const PomodoroScreen(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(60),
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
          ),
          padding: const EdgeInsets.only(top: 10, left: 16, right: 16, bottom: 8),
          child: SafeArea(
            bottom: false,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Color(0xFF4F46E5),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          'TaskFlow',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.5,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      _selectedIndex == 0
                          ? '\${_tasks.length} tasks • \${_tasks.where((t) => t.isCompleted).length} completed'
                          : (_selectedIndex == 1
                              ? 'Active Streak: \${_habits.isNotEmpty ? _habits.map((h) => h.streak).reduce((a, b) => a > b ? a : b) : 0} Days 🔥'
                              : 'Pomodoro Focus Session'),
                      style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (ctx) => const ProPaywallSheet(),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFF59E0B), Color(0xFFEA580C)],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF59E0B).withAlpha(60),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.workspace_premium, color: Colors.white, size: 14),
                        SizedBox(width: 4),
                        Text(
                          'PRO',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      body: screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
        ),
        child: NavigationBar(
          selectedIndex: _selectedIndex,
          onDestinationSelected: (index) => setState(() => _selectedIndex = index),
          backgroundColor: Colors.white,
          elevation: 0,
          indicatorColor: const Color(0xFFEEF2FF),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.check_circle_outline, color: Color(0xFF64748B)),
              selectedIcon: Icon(Icons.check_circle, color: Color(0xFF4F46E5)),
              label: 'Tasks',
            ),
            NavigationDestination(
              icon: Icon(Icons.local_fire_department_outlined, color: Color(0xFF64748B)),
              selectedIcon: Icon(Icons.local_fire_department, color: Color(0xFFEA580C)),
              label: 'Habits',
            ),
            NavigationDestination(
              icon: Icon(Icons.timer_outlined, color: Color(0xFF64748B)),
              selectedIcon: Icon(Icons.timer, color: Color(0xFF4F46E5)),
              label: 'Focus',
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: "lib/screens/tasks_screen.dart",
    name: "tasks_screen.dart",
    category: "screen",
    description: "Tasks list, quick add field, subtask checklist, and AI breakdown button.",
    code: `import 'package:flutter/material.dart';
import '../models/task_item.dart';

class TasksScreen extends StatefulWidget {
  final List<TaskItem> tasks;
  final VoidCallback onUpdate;

  const TasksScreen({
    super.key,
    required this.tasks,
    required this.onUpdate,
  });

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  final TextEditingController _quickTaskController = TextEditingController();
  bool _isAiBreakingDown = false;

  Color _getPriorityBgColor(String priority) {
    switch (priority) {
      case 'Urgent':
        return const Color(0xFFFFE4E6);
      case 'High':
        return const Color(0xFFFEF3C7);
      case 'Medium':
        return const Color(0xFFDBEAFE);
      default:
        return const Color(0xFFF1F5F9);
    }
  }

  Color _getPriorityTextColor(String priority) {
    switch (priority) {
      case 'Urgent':
        return const Color(0xFFBE123C);
      case 'High':
        return const Color(0xFF92400E);
      case 'Medium':
        return const Color(0xFF1D4ED8);
      default:
        return const Color(0xFF334155);
    }
  }

  Color _getPriorityBorderColor(String priority) {
    switch (priority) {
      case 'Urgent':
        return const Color(0xFFFECDD3);
      case 'High':
        return const Color(0xFFFDE68A);
      case 'Medium':
        return const Color(0xFFBFDBFE);
      default:
        return const Color(0xFFE2E8F0);
    }
  }

  void _handleAddTask() {
    final text = _quickTaskController.text.trim();
    if (text.isEmpty) return;
    widget.tasks.insert(
      0,
      TaskItem(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: text,
        priority: 'High',
        dueDate: 'Today',
      ),
    );
    _quickTaskController.clear();
    widget.onUpdate();
  }

  void _triggerAiBreakdown(TaskItem task) {
    setState(() => _isAiBreakingDown = true);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: const Row(
          children: [
            CircularProgressIndicator(color: Color(0xFF4F46E5)),
            SizedBox(width: 16),
            Expanded(
              child: Text(
                'Gemini AI breaking task into actionable subtasks...',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );

    Future.delayed(const Duration(milliseconds: 1000), () {
      if (!mounted) return;
      Navigator.pop(context);
      setState(() => _isAiBreakingDown = false);
      task.subtasks.addAll([
        SubTask(id: '\${task.id}-ai1', title: 'Define high-level objectives & constraints'),
        SubTask(id: '\${task.id}-ai2', title: 'Draft execution checklist & assign resources'),
        SubTask(id: '\${task.id}-ai3', title: 'Validate against quality benchmarks'),
      ]);
      widget.onUpdate();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✨ AI generated subtasks for "\${task.title}"!'),
          backgroundColor: const Color(0xFF4F46E5),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Quick Add Form (Exact match to simulator)
        Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 14),
                child: TextField(
                  controller: _quickTaskController,
                  decoration: const InputDecoration(
                    hintText: 'Add a new task...',
                    hintStyle: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                    border: InputBorder.none,
                  ),
                  onSubmitted: (_) => _handleAddTask(),
                ),
              ),
            ),
            const SizedBox(width: 8),
            InkWell(
              onTap: _handleAddTask,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 20),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Task Items
        ...widget.tasks.map((task) {
          final completedSubtasks = task.subtasks.where((s) => s.isCompleted).length;

          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: task.isCompleted ? const Color(0xFFF1F5F9) : const Color(0xFFE2E8F0),
              ),
              boxShadow: [
                if (!task.isCompleted)
                  BoxShadow(
                    color: Colors.black.withAlpha(5),
                    blurRadius: 3,
                    offset: const Offset(0, 1),
                  ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Circle Checkbox
                    InkWell(
                      onTap: () {
                        task.isCompleted = !task.isCompleted;
                        widget.onUpdate();
                      },
                      child: Padding(
                        padding: const EdgeInsets.only(top: 2, right: 10),
                        child: Icon(
                          task.isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                          size: 20,
                          color: task.isCompleted ? const Color(0xFF10B981) : const Color(0xFF94A3B8),
                        ),
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            task.title,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                              color: task.isCompleted ? const Color(0xFF94A3B8) : const Color(0xFF1E293B),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 6,
                            runSpacing: 4,
                            crossAxisAlignment: WrapCrossAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                decoration: BoxDecoration(
                                  color: _getPriorityBgColor(task.priority),
                                  border: Border.all(color: _getPriorityBorderColor(task.priority)),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  task.priority,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: _getPriorityTextColor(task.priority),
                                  ),
                                ),
                              ),
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.calendar_today, size: 10, color: Color(0xFF94A3B8)),
                                  const SizedBox(width: 3),
                                  Text(
                                    task.dueDate,
                                    style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                                  ),
                                ],
                              ),
                              if (task.subtasks.isNotEmpty)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEEF2FF),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    '\$completedSubtasks/\${task.subtasks.length} subtasks',
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF4F46E5),
                                    ),
                                  ),
                                ),
                            ],
                          ),

                          // Subtasks list inside the card
                          if (task.subtasks.isNotEmpty) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.only(top: 8),
                              decoration: const BoxDecoration(
                                border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
                              ),
                              child: Column(
                                children: task.subtasks.map((st) {
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 3),
                                    child: Row(
                                      children: [
                                        InkWell(
                                          onTap: () {
                                            st.isCompleted = !st.isCompleted;
                                            widget.onUpdate();
                                          },
                                          child: Icon(
                                            st.isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                                            size: 15,
                                            color: st.isCompleted ? const Color(0xFF10B981) : const Color(0xFFCBD5E1),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(
                                            st.title,
                                            style: TextStyle(
                                              fontSize: 11,
                                              decoration: st.isCompleted ? TextDecoration.lineThrough : null,
                                              color: st.isCompleted ? const Color(0xFF94A3B8) : const Color(0xFF475569),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                          ],

                          // AI Subtask Breakdown Button (Exact match)
                          if (!task.isCompleted && task.subtasks.isEmpty) ...[
                            const SizedBox(height: 8),
                            InkWell(
                              onTap: () => _triggerAiBreakdown(task),
                              borderRadius: BorderRadius.circular(6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEEF2FF),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.auto_awesome, size: 12, color: Color(0xFF4F46E5)),
                                    const SizedBox(width: 4),
                                    Text(
                                      _isAiBreakingDown ? 'AI Breaking down...' : 'AI Subtask Breakdown',
                                      style: const TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF4F46E5),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFCBD5E1)),
                      onPressed: () {
                        widget.tasks.removeWhere((t) => t.id == task.id);
                        widget.onUpdate();
                      },
                    ),
                  ],
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}
`
  },
  {
    path: "lib/screens/habits_screen.dart",
    name: "habits_screen.dart",
    category: "screen",
    description: "Daily habits tracker with Consistency Score banner, emoji picker, streaks, and check-in buttons.",
    code: `import 'package:flutter/material.dart';
import '../models/habit_item.dart';

class HabitsScreen extends StatelessWidget {
  final List<HabitItem> habits;
  final VoidCallback onUpdate;

  const HabitsScreen({
    super.key,
    required this.habits,
    required this.onUpdate,
  });

  void _showAddHabitDialog(BuildContext context) {
    final controller = TextEditingController();
    String selectedIcon = '⚡';
    final emojis = ['⚡', '📚', '📥', '🚶‍♂️', '💧', '🧘', '🥗', '💻'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add New Habit', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'e.g. Read 20 pages, Deep Work...',
                  filled: true,
                  fillColor: const Color(0xFFF1F5F9),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 14),
              const Text('Pick an Icon:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                children: emojis.map((emoji) {
                  final isSelected = selectedIcon == emoji;
                  return InkWell(
                    onTap: () => setSheetState(() => selectedIcon = emoji),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFEEF2FF) : Colors.transparent,
                        border: Border.all(
                          color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFFE2E8F0),
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(emoji, style: const TextStyle(fontSize: 20)),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEA580C),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    if (controller.text.trim().isEmpty) return;
                    habits.insert(
                      0,
                      HabitItem(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        title: controller.text.trim(),
                        icon: selectedIcon,
                        streak: 0,
                      ),
                    );
                    onUpdate();
                    Navigator.pop(ctx);
                  },
                  child: const Text('Create Habit', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final completedCount = habits.where((h) => h.isCompletedToday).length;
    final consistencyPercent = habits.isNotEmpty ? ((completedCount / habits.length) * 100).toInt() : 0;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFFEA580C),
        elevation: 3,
        onPressed: () => _showAddHabitDialog(context),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Consistency Score Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEA580C), Color(0xFFF59E0B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFEA580C).withAlpha(50),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'CONSISTENCY SCORE',
                          style: TextStyle(
                            color: Color(0xFFFFEDD5),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '\$consistencyPercent% Completed',
                          style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                    const Icon(Icons.local_fire_department, size: 36, color: Color(0xFFFDE68A)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  '\$completedCount of \${habits.length} habits logged for today',
                  style: const TextStyle(color: Color(0xFFFFEDD5), fontSize: 11),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Habit Items
          ...habits.map((habit) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Text(habit.icon, style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            habit.title,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              const Icon(Icons.local_fire_department, size: 12, color: Color(0xFFEA580C)),
                              const SizedBox(width: 2),
                              Text(
                                '\${habit.streak} day streak',
                                style: const TextStyle(
                                  color: Color(0xFFEA580C),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                '• \${habit.targetDays}',
                                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    InkWell(
                      onTap: () {
                        habit.isCompletedToday = !habit.isCompletedToday;
                        habit.streak = habit.isCompletedToday ? habit.streak + 1 : (habit.streak > 0 ? habit.streak - 1 : 0);
                        onUpdate();
                      },
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: habit.isCompletedToday ? const Color(0xFF059669) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: habit.isCompletedToday
                            ? const Icon(Icons.check, color: Colors.white, size: 18)
                            : const Text('Log', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
`
  },
  {
    path: "lib/screens/pomodoro_screen.dart",
    name: "pomodoro_screen.dart",
    category: "screen",
    description: "Focus & break timer with circular countdown and ambient soundscape selector.",
    code: `import 'dart:async';
import 'package:flutter/material.dart';

class PomodoroScreen extends StatefulWidget {
  const PomodoroScreen({super.key});

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  static const int focusDuration = 25 * 60;
  static const int breakDuration = 5 * 60;

  int _remainingSeconds = focusDuration;
  bool _isRunning = false;
  String _mode = 'focus'; // 'focus' | 'break'
  String _selectedSound = 'Rainfall';
  Timer? _timer;

  void _startTimer() {
    _timer?.cancel();
    setState(() => _isRunning = true);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_remainingSeconds > 0) {
        setState(() => _remainingSeconds--);
      } else {
        _timer?.cancel();
        setState(() {
          _isRunning = false;
          _mode = _mode == 'focus' ? 'break' : 'focus';
          _remainingSeconds = _mode == 'focus' ? focusDuration : breakDuration;
        });
      }
    });
  }

  void _pauseTimer() {
    _timer?.cancel();
    setState(() => _isRunning = false);
  }

  void _resetTimer() {
    _timer?.cancel();
    setState(() {
      _isRunning = false;
      _remainingSeconds = _mode == 'focus' ? focusDuration : breakDuration;
    });
  }

  void _switchMode(String newMode) {
    _timer?.cancel();
    setState(() {
      _mode = newMode;
      _isRunning = false;
      _remainingSeconds = newMode == 'focus' ? focusDuration : breakDuration;
    });
  }

  String _formatTimer(int totalSeconds) {
    final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '\$minutes:\$seconds';
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 10),

          // Mode Selector Switch (Focus 25m vs Break 5m)
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFFE2E8F0),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                GestureDetector(
                  onTap: () => _switchMode('focus'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: _mode == 'focus' ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: _mode == 'focus'
                          ? [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 4)]
                          : null,
                    ),
                    child: Text(
                      'Focus (25m)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _mode == 'focus' ? const Color(0xFF4338CA) : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () => _switchMode('break'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: _mode == 'break' ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: _mode == 'break'
                          ? [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 4)]
                          : null,
                    ),
                    child: Text(
                      'Break (5m)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _mode == 'break' ? const Color(0xFF4338CA) : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 36),

          // Circular Timer Display matching Simulator
          Container(
            width: 180,
            height: 180,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF4F46E5), width: 4),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(10),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _formatTimer(_remainingSeconds),
                  style: const TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  _isRunning ? 'Deep Focus Active' : 'Paused',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                    color: Color(0xFF4F46E5),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Controls (Start / Pause / Reset)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4F46E5),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                ),
                onPressed: () {
                  if (_isRunning) {
                    _pauseTimer();
                  } else {
                    _startTimer();
                  }
                },
                icon: Icon(_isRunning ? Icons.pause : Icons.play_arrow, color: Colors.white, size: 18),
                label: Text(
                  _isRunning ? 'Pause' : 'Start Focus',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
              const SizedBox(width: 12),
              InkWell(
                onTap: _resetTimer,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.rotate_left, color: Color(0xFF334155), size: 20),
                ),
              ),
            ],
          ),
          const SizedBox(height: 36),

          // Ambient Soundscape Selector matching Live Simulator
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.volume_up, size: 16, color: Color(0xFF4F46E5)),
                        SizedBox(width: 6),
                        Text(
                          'Ambient Soundscape',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                        ),
                      ],
                    ),
                    Text(
                      _selectedSound,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: ['Rainfall', 'White Noise', 'Forest', 'Mute'].map((sound) {
                    final isSelected = _selectedSound == sound;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedSound = sound),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          padding: const EdgeInsets.symmetric(vertical: 7),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFFEEF2FF) : const Color(0xFFF8FAFC),
                            border: Border.all(
                              color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFFE2E8F0),
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            sound,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              color: isSelected ? const Color(0xFF4338CA) : const Color(0xFF475569),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: "lib/widgets/pro_paywall_sheet.dart",
    name: "pro_paywall_sheet.dart",
    category: "widget",
    description: "Pro upgrade modal bottom sheet for Google Play monetization.",
    code: `import 'package:flutter/material.dart';

class ProPaywallSheet extends StatelessWidget {
  const ProPaywallSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Color(0xFF0F172A),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Container(
            width: 36,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 18),

          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFFF59E0B).withAlpha(40),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.workspace_premium, color: Color(0xFFFCD34D), size: 24),
          ),
          const SizedBox(height: 10),
          const Text(
            'TaskFlow Pro',
            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 4),
          const Text(
            'Supercharge productivity with unlimited AI decomposition and offline multi-device sync.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 11),
          ),
          const SizedBox(height: 20),

          // Feature checkmarks
          Column(
            children: [
              _buildFeatureRow('Unlimited Gemini AI Subtask Breakdowns'),
              const SizedBox(height: 8),
              _buildFeatureRow('Instant 2-way Cloud SQLite Synchronization'),
              const SizedBox(height: 8),
              _buildFeatureRow('Cognitive Workload & Burnout Guard'),
            ],
          ),
          const SizedBox(height: 20),

          // Annual Plan Button
          Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF59E0B), Color(0xFFEA580C)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🎉 Subscribed to TaskFlow Pro Annual!')),
                );
              },
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Annual Plan (Save 33%)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                  Text(r'\\$39.99 / year', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Monthly Plan Button
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🎉 Subscribed to TaskFlow Pro Monthly!')),
                );
              },
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Monthly Plan', style: TextStyle(color: Color(0xFFE2E8F0), fontWeight: FontWeight.w600, fontSize: 12)),
                  Text(r'\\$4.99 / mo', style: TextStyle(color: Color(0xFFE2E8F0), fontWeight: FontWeight.w600, fontSize: 12)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Back to Free Version',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, decoration: TextDecoration.underline),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(String label) {
    return Row(
      children: [
        const Icon(Icons.check, size: 14, color: Color(0xFF34D399)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 11),
          ),
        ),
      ],
    );
  }
}
`
  }
];
