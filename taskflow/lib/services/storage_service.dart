import 'dart:convert';
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
