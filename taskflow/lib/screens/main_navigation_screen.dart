import 'package:flutter/material.dart';
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
                          ? '${_tasks.length} tasks • ${_tasks.where((t) => t.isCompleted).length} completed'
                          : (_selectedIndex == 1
                              ? 'Active Streak: ${_habits.isNotEmpty ? _habits.map((h) => h.streak).reduce((a, b) => a > b ? a : b) : 0} Days 🔥'
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
