import 'package:flutter/material.dart';
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
                          '$consistencyPercent% Completed',
                          style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                    const Icon(Icons.local_fire_department, size: 36, color: Color(0xFFFDE68A)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  '$completedCount of ${habits.length} habits logged for today',
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
                                '${habit.streak} day streak',
                                style: const TextStyle(
                                  color: Color(0xFFEA580C),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                '• ${habit.targetDays}',
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
