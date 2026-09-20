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
  sdk: ^3.5.0
  flutter: ">=3.24.0"

dependencies:
  flutter:
    sdk: flutter

  # Local Disk Persistence
  shared_preferences: ^2.3.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

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
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        cardTheme: const CardThemeData(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
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
  String id;
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
  String id;
  String title;
  String priority; // 'Urgent', 'High', 'Medium', 'Low'
  bool isCompleted;
  String dueDate;
  List<SubTask> subtasks;

  TaskItem({
    required this.id,
    required this.title,
    required this.priority,
    this.isCompleted = false,
    required this.dueDate,
    List<SubTask>? subtasks,
  }) : subtasks = subtasks ?? [];

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'priority': priority,
    'isCompleted': isCompleted,
    'dueDate': dueDate,
    'subtasks': subtasks.map((s) => s.toJson()).toList(),
  };

  factory TaskItem.fromJson(Map<String, dynamic> json) => TaskItem(
    id: json['id'] as String,
    title: json['title'] as String,
    priority: json['priority'] as String? ?? 'High',
    isCompleted: json['isCompleted'] as bool? ?? false,
    dueDate: json['dueDate'] as String? ?? 'Today',
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
  String id;
  String title;
  String icon;
  int streak;
  bool isCompletedToday;

  HabitItem({
    required this.id,
    required this.title,
    required this.icon,
    this.streak = 0,
    this.isCompletedToday = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'icon': icon,
    'streak': streak,
    'isCompletedToday': isCompletedToday,
  };

  factory HabitItem.fromJson(Map<String, dynamic> json) => HabitItem(
    id: json['id'] as String,
    title: json['title'] as String,
    icon: json['icon'] as String? ?? '⚡',
    streak: json['streak'] as int? ?? 0,
    isCompletedToday: json['isCompletedToday'] as bool? ?? false,
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
  static const String _tasksKey = 'taskflow_tasks_v1';
  static const String _habitsKey = 'taskflow_habits_v1';

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
        title: 'Review Google Play Store Copy',
        priority: 'Urgent',
        dueDate: 'Today, 5:00 PM',
        subtasks: [
          SubTask(id: '1-1', title: 'Check short description limit (80 chars)', isCompleted: true),
          SubTask(id: '1-2', title: 'Verify Data Safety questionnaire answers', isCompleted: false),
        ],
      ),
      TaskItem(
        id: '2',
        title: 'Build Release App Bundle (AAB)',
        priority: 'High',
        dueDate: 'Tomorrow',
      ),
    ];
  }

  List<HabitItem> _getDefaultHabits() {
    return [
      HabitItem(id: 'h1', title: 'Deep Work (2 Pomodoros)', icon: '⚡', streak: 12, isCompletedToday: true),
      HabitItem(id: 'h2', title: 'Read 20 pages', icon: '📚', streak: 5, isCompletedToday: false),
      HabitItem(id: 'h3', title: 'Post-work 30m Walk', icon: '🚶‍♂️', streak: 19, isCompletedToday: true),
    ];
  }
}
`
  },
  {
    path: "lib/screens/main_navigation_screen.dart",
    name: "main_navigation_screen.dart",
    category: "screen",
    description: "Bottom navigation host connecting Tasks, Habits, and Focus screens.",
    code: `import 'package:flutter/material.dart';
import '../services/storage_service.dart';
import '../models/task_item.dart';
import '../models/habit_item.dart';
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
      body: screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        backgroundColor: Colors.white,
        elevation: 4,
        indicatorColor: const Color(0xFFEEF2FF),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.check_circle_outline),
            selectedIcon: Icon(Icons.check_circle, color: Color(0xFF4F46E5)),
            label: 'Tasks',
          ),
          NavigationDestination(
            icon: Icon(Icons.local_fire_department_outlined),
            selectedIcon: Icon(Icons.local_fire_department, color: Color(0xFFEA580C)),
            label: 'Habits',
          ),
          NavigationDestination(
            icon: Icon(Icons.timer_outlined),
            selectedIcon: Icon(Icons.timer, color: Color(0xFF4F46E5)),
            label: 'Focus',
          ),
        ],
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
    description: "Tasks list, progress bar, subtasks list, and AI breakdown action.",
    code: `import 'package:flutter/material.dart';
import '../models/task_item.dart';
import '../widgets/pro_paywall_sheet.dart';

class TasksScreen extends StatelessWidget {
  final List<TaskItem> tasks;
  final VoidCallback onUpdate;

  const TasksScreen({super.key, required this.tasks, required this.onUpdate});

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'Urgent': return const Color(0xFFE11D48);
      case 'High': return const Color(0xFFEA580C);
      case 'Medium': return const Color(0xFF2563EB);
      default: return const Color(0xFF64748B);
    }
  }

  void _showAddTaskDialog(BuildContext context) {
    final controller = TextEditingController();
    String selectedPriority = 'High';

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
            left: 20, right: 20, top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text('New Task', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'What needs to be done?',
                  filled: true,
                  fillColor: const Color(0xFFF1F5F9),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text('Priority Level:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: ['Urgent', 'High', 'Medium', 'Low'].map((p) {
                  final isSelected = selectedPriority == p;
                  return ChoiceChip(
                    label: Text(p),
                    selected: isSelected,
                    onSelected: (val) {
                      if (val) setSheetState(() => selectedPriority = p);
                    },
                    selectedColor: _getPriorityColor(p).withOpacity(0.18),
                    labelStyle: TextStyle(
                      color: isSelected ? _getPriorityColor(p) : Colors.black87,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    if (controller.text.trim().isEmpty) return;
                    tasks.insert(0, TaskItem(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      title: controller.text.trim(),
                      priority: selectedPriority,
                      dueDate: 'Today',
                    ));
                    onUpdate();
                    Navigator.pop(ctx);
                  },
                  child: const Text('Add Task', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _triggerAiBreakdown(BuildContext context, TaskItem task) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => const AlertDialog(
        content: Row(
          children: [
            CircularProgressIndicator(color: Color(0xFF4F46E5)),
            SizedBox(width: 20),
            Text('AI Breaking task into steps...'),
          ],
        ),
      ),
    );

    Future.delayed(const Duration(milliseconds: 700), () {
      Navigator.pop(context);
      task.subtasks.addAll([
        SubTask(id: '\${task.id}-1', title: 'Identify core scope & dependencies'),
        SubTask(id: '\${task.id}-2', title: 'Execute primary milestone'),
        SubTask(id: '\${task.id}-3', title: 'Final test & verification'),
      ]);
      onUpdate();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✨ Added AI subtasks to "\${task.title}"!'),
          backgroundColor: const Color(0xFF4F46E5),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final completedCount = tasks.where((t) => t.isCompleted).length;
    final totalCount = tasks.length;
    final double progress = totalCount > 0 ? completedCount / totalCount : 0.0;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('TaskFlow', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.workspace_premium, color: Color(0xFFF59E0B)),
            onPressed: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                isScrollControlled: true,
                builder: (ctx) => const ProPaywallSheet(),
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF4F46E5),
        elevation: 3,
        onPressed: () => _showAddTaskDialog(context),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Progress Overview Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text("Today's Tasks", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text(
                      '$completedCount of $totalCount Done',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 8,
                    backgroundColor: const Color(0xFFEEF2F6),
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Task Items
          ...tasks.map((task) => Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(
                          task.isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                          color: task.isCompleted ? const Color(0xFF10B981) : const Color(0xFF94A3B8),
                        ),
                        onPressed: () {
                          task.isCompleted = !task.isCompleted;
                          onUpdate();
                        },
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task.title,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                                color: task.isCompleted ? const Color(0xFF94A3B8) : const Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: _getPriorityColor(task.priority).withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    task.priority,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: _getPriorityColor(task.priority),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(task.dueDate, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                              ],
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.auto_awesome, color: Color(0xFF6366F1), size: 20),
                        tooltip: 'AI Breakdown',
                        onPressed: () => _triggerAiBreakdown(context, task),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, color: Color(0xFF94A3B8), size: 20),
                        onPressed: () {
                          tasks.removeWhere((t) => t.id == task.id);
                          onUpdate();
                        },
                      ),
                    ],
                  ),
                  if (task.subtasks.isNotEmpty) ...[
                    const Divider(height: 16),
                    Padding(
                      padding: const EdgeInsets.only(left: 36, right: 8, bottom: 6),
                      child: Column(
                        children: task.subtasks.map((st) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 3),
                          child: Row(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  st.isCompleted = !st.isCompleted;
                                  onUpdate();
                                },
                                child: Icon(
                                  st.isCompleted ? Icons.check_box : Icons.check_box_outline_blank,
                                  size: 18,
                                  color: st.isCompleted ? const Color(0xFF10B981) : const Color(0xFF94A3B8),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  st.title,
                                  style: TextStyle(
                                    fontSize: 13,
                                    decoration: st.isCompleted ? TextDecoration.lineThrough : null,
                                    color: st.isCompleted ? const Color(0xFF94A3B8) : const Color(0xFF334155),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )).toList(),
                      ),
                    ),
                  ],
                ],
              ),
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
    path: "lib/screens/habits_screen.dart",
    name: "habits_screen.dart",
    category: "screen",
    description: "Daily habits tracker with emoji picker, streaks, and check-in buttons.",
    code: `import 'package:flutter/material.dart';
import '../models/habit_item.dart';

class HabitsScreen extends StatelessWidget {
  final List<HabitItem> habits;
  final VoidCallback onUpdate;

  const HabitsScreen({super.key, required this.habits, required this.onUpdate});

  void _showAddHabitDialog(BuildContext context) {
    final controller = TextEditingController();
    String selectedIcon = '⚡';

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
            left: 20, right: 20, top: 20,
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
                  hintText: 'e.g. Read 15 mins, Drink water...',
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
                children: ['⚡', '📚', '🏃‍♂️', '💧', '🧘', '💻', '🍎', '💤'].map((emoji) {
                  final isSelected = selectedIcon == emoji;
                  return ChoiceChip(
                    label: Text(emoji, style: const TextStyle(fontSize: 18)),
                    selected: isSelected,
                    onSelected: (val) {
                      if (val) setSheetState(() => selectedIcon = emoji);
                    },
                    selectedColor: const Color(0xFFEEF2FF),
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
                    habits.insert(0, HabitItem(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      title: controller.text.trim(),
                      icon: selectedIcon,
                      streak: 0,
                    ));
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
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Daily Habits & Routines', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFFEA580C),
        elevation: 3,
        onPressed: () => _showAddHabitDialog(context),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFFEA580C), Color(0xFFF59E0B)]),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Row(
              children: [
                Text('🔥', style: TextStyle(fontSize: 34)),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Consistency Wins', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Check in daily to protect your streaks.', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          ...habits.map((h) => Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: Text(h.icon, style: const TextStyle(fontSize: 22)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(h.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text('🔥 \${h.streak} day streak', style: const TextStyle(color: Color(0xFFEA580C), fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  IconButton(
                    iconSize: 32,
                    icon: Icon(
                      h.isCompletedToday ? Icons.check_circle : Icons.radio_button_unchecked,
                      color: h.isCompletedToday ? const Color(0xFF10B981) : const Color(0xFFCBD5E1),
                    ),
                    onPressed: () {
                      h.isCompletedToday = !h.isCompletedToday;
                      h.streak = h.isCompletedToday ? h.streak + 1 : (h.streak > 0 ? h.streak - 1 : 0);
                      onUpdate();
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Color(0xFF94A3B8), size: 18),
                    onPressed: () {
                      habits.removeWhere((item) => item.id == h.id);
                      onUpdate();
                    },
                  ),
                ],
              ),
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
    description: "Full-screen Pomodoro focus timer with deep work and break modes.",
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
  bool _isBreak = false;
  Timer? _timer;

  void _startTimer() {
    setState(() => _isRunning = true);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() => _remainingSeconds--);
      } else {
        _timer?.cancel();
        setState(() {
          _isRunning = false;
          _isBreak = !_isBreak;
          _remainingSeconds = _isBreak ? breakDuration : focusDuration;
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
      _remainingSeconds = _isBreak ? breakDuration : focusDuration;
    });
  }

  String _formatTime(int totalSeconds) {
    final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final totalDuration = _isBreak ? breakDuration : focusDuration;
    final progress = 1.0 - (_remainingSeconds / totalDuration);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('Pomodoro Focus', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: _isBreak ? const Color(0xFF10B981).withOpacity(0.2) : const Color(0xFF6366F1).withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                _isBreak ? '☕ SHORT BREAK' : '🎯 DEEP WORK SESSION',
                style: TextStyle(
                  color: _isBreak ? const Color(0xFF34D399) : const Color(0xFFA5B4FC),
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 36),

            // Circular Progress Indicator & Countdown
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 240,
                  height: 240,
                  child: CircularProgressIndicator(
                    value: progress,
                    strokeWidth: 10,
                    backgroundColor: Colors.white12,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _isBreak ? const Color(0xFF10B981) : const Color(0xFF6366F1),
                    ),
                  ),
                ),
                Text(
                  _formatTime(_remainingSeconds),
                  style: const TextStyle(
                    fontSize: 56,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 48),

            // Controls
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  iconSize: 32,
                  icon: const Icon(Icons.refresh, color: Colors.white60),
                  onPressed: _resetTimer,
                ),
                const SizedBox(width: 24),
                FloatingActionButton.large(
                  backgroundColor: const Color(0xFF6366F1),
                  onPressed: _isRunning ? _pauseTimer : _startTimer,
                  child: Icon(_isRunning ? Icons.pause : Icons.play_arrow, size: 40, color: Colors.white),
                ),
                const SizedBox(width: 24),
                IconButton(
                  iconSize: 32,
                  icon: const Icon(Icons.skip_next, color: Colors.white60),
                  onPressed: () {
                    _timer?.cancel();
                    setState(() {
                      _isRunning = false;
                      _isBreak = !_isBreak;
                      _remainingSeconds = _isBreak ? breakDuration : focusDuration;
                    });
                  },
                ),
              ],
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
          const Icon(Icons.workspace_premium, color: Color(0xFFF59E0B), size: 48),
          const SizedBox(height: 8),
          const Text('Upgrade to TaskFlow Pro', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text(
            'Unlock AI subtask decomposition, unlimited habits, and priority focus sounds.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFF6366F1), width: 2),
              borderRadius: BorderRadius.circular(14),
              color: const Color(0xFF6366F1).withOpacity(0.15),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Text('Annual Plan (Save 33%)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                Text('\\$39.99 / year', style: TextStyle(color: Color(0xFFA5B4FC), fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366F1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Pro features unlocked!')),
                );
              },
              child: const Text('Start 7-Day Free Trial', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}
`
  }
];
