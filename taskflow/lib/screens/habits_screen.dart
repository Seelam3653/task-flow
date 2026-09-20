import 'package:flutter/material.dart';
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
                        Text('🔥 ${h.streak} day streak', style: const TextStyle(color: Color(0xFFEA580C), fontSize: 12, fontWeight: FontWeight.bold)),
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
