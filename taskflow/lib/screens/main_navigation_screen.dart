import 'package:flutter/material.dart';
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
