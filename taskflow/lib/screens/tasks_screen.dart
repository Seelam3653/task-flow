import 'package:flutter/material.dart';
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
        SubTask(id: '${task.id}-1', title: 'Identify core scope & dependencies'),
        SubTask(id: '${task.id}-2', title: 'Execute primary milestone'),
        SubTask(id: '${task.id}-3', title: 'Final test & verification'),
      ]);
      onUpdate();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✨ Added AI subtasks to "${task.title}"!'),
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
