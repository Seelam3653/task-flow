import 'dart:convert';
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
