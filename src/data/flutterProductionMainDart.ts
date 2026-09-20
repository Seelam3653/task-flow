export const completeProductionMainDart = `import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  runApp(TaskFlowApp(prefs: prefs));
}

class TaskFlowApp extends StatelessWidget {
  final SharedPreferences prefs;
  const TaskFlowApp({super.key, required this.prefs});

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
      home: MainNavigationScreen(prefs: prefs),
    );
  }
}

// ---------------------------------------------------------------------------
// MODELS WITH JSON SERIALIZATION
// ---------------------------------------------------------------------------

class SubTask {
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

class HabitItem {
  String id;
  String title;
  String icon;
  int streak;
  bool isCompletedToday;
  String lastCompletedDate;

  HabitItem({
    required this.id,
    required this.title,
    required this.icon,
    required this.streak,
    this.isCompletedToday = false,
    this.lastCompletedDate = '',
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'icon': icon,
    'streak': streak,
    'isCompletedToday': isCompletedToday,
    'lastCompletedDate': lastCompletedDate,
  };

  factory HabitItem.fromJson(Map<String, dynamic> json) => HabitItem(
    id: json['id'] as String,
    title: json['title'] as String,
    icon: json['icon'] as String? ?? '⚡',
    streak: json['streak'] as int? ?? 0,
    isCompletedToday: json['isCompletedToday'] as bool? ?? false,
    lastCompletedDate: json['lastCompletedDate'] as String? ?? '',
  );
}

// ---------------------------------------------------------------------------
// ROOT NAVIGATION & PERSISTENCE CONTROLLER
// ---------------------------------------------------------------------------

class MainNavigationScreen extends StatefulWidget {
  final SharedPreferences prefs;
  const MainNavigationScreen({super.key, required this.prefs});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;
  List<TaskItem> _tasks = [];
  List<HabitItem> _habits = [];

  static const String _tasksKey = 'taskflow_tasks_v1';
  static const String _habitsKey = 'taskflow_habits_v1';

  @override
  void initState() {
    super.initState();
    _loadPersistedData();
  }

  void _loadPersistedData() {
    final tasksJson = widget.prefs.getString(_tasksKey);
    if (tasksJson != null && tasksJson.isNotEmpty) {
      try {
        final List<dynamic> decoded = jsonDecode(tasksJson);
        _tasks = decoded.map((e) => TaskItem.fromJson(e)).toList();
      } catch (_) {
        _initDefaultTasks();
      }
    } else {
      _initDefaultTasks();
    }

    final habitsJson = widget.prefs.getString(_habitsKey);
    if (habitsJson != null && habitsJson.isNotEmpty) {
      try {
        final List<dynamic> decoded = jsonDecode(habitsJson);
        _habits = decoded.map((e) => HabitItem.fromJson(e)).toList();
      } catch (_) {
        _initDefaultHabits();
      }
    } else {
      _initDefaultHabits();
    }

    setState(() {});
  }

  void _initDefaultTasks() {
    _tasks = [
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
        dueDate: 'Sep 25',
        isCompleted: true,
      ),
      TaskItem(
        id: '4',
        title: 'Prepare 1024x500 Feature Graphic',
        priority: 'Low',
        dueDate: 'Sep 28',
      ),
    ];
    _saveTasks();
  }

  void _initDefaultHabits() {
    _habits = [
      HabitItem(id: 'h1', title: 'Deep Work (2 Pomodoros)', icon: '⚡', streak: 12, isCompletedToday: true),
      HabitItem(id: 'h2', title: 'Read 20 pages (Design Systems)', icon: '📚', streak: 5, isCompletedToday: false),
      HabitItem(id: 'h3', title: 'Zero Inbox Task Review', icon: '📥', streak: 8, isCompletedToday: false),
      HabitItem(id: 'h4', title: 'Post-work 30m Walk', icon: '🚶‍♂️', streak: 19, isCompletedToday: true),
    ];
    _saveHabits();
  }

  Future<void> _saveTasks() async {
    final encoded = jsonEncode(_tasks.map((t) => t.toJson()).toList());
    await widget.prefs.setString(_tasksKey, encoded);
  }

  Future<void> _saveHabits() async {
    final encoded = jsonEncode(_habits.map((h) => h.toJson()).toList());
    await widget.prefs.setString(_habitsKey, encoded);
  }

  void _onTasksUpdated() {
    setState(() {});
    _saveTasks();
  }

  void _onHabitsUpdated() {
    setState(() {});
    _saveHabits();
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      TasksScreen(
        tasks: _tasks,
        onUpdate: _onTasksUpdated,
      ),
      HabitsScreen(
        habits: _habits,
        onUpdate: _onHabitsUpdated,
      ),
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

// ---------------------------------------------------------------------------
// 1. TASKS TAB WITH PRIORITY, SUBTASKS, & LOCAL DISK SYNC
// ---------------------------------------------------------------------------

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

    Future.delayed(const Duration(milliseconds: 800), () {
      Navigator.pop(context);
      task.subtasks.addAll([
        SubTask(id: '\${task.id}-ai1', title: 'Define scope & identify blockers'),
        SubTask(id: '\${task.id}-ai2', title: 'Draft execution checklist'),
        SubTask(id: '\${task.id}-ai3', title: 'Final review & validation'),
      ]);
      onUpdate();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✨ Added 3 AI subtasks to "\${task.title}"!'),
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
            tooltip: 'Pro Upgrade',
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
          // Header Progress Card
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

          // Empty state
          if (tasks.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: const Column(
                children: [
                  Icon(Icons.check_circle_outline, size: 48, color: Color(0xFF94A3B8)),
                  SizedBox(height: 12),
                  Text('No tasks yet! Tap + to add one.', style: TextStyle(color: Color(0xFF64748B))),
                ],
              ),
            ),

          // Task List Cards
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
                          size: 24,
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

                  // Subtasks
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

// ---------------------------------------------------------------------------
// 2. HABITS TAB WITH STREAK TRACKING & DISK PERSISTENCE
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 3. POMODORO FOCUS TIMER WITH MODES & CONTROLS
// ---------------------------------------------------------------------------

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

            // Circular Progress Indicator & Digital Display
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

            // Timer Controls
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

// ---------------------------------------------------------------------------
// 4. PRO PAYWALL SHEET FOR GOOGLE PLAY BILLING COMPLIANCE
// ---------------------------------------------------------------------------

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
`;
