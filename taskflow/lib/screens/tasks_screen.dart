import 'package:flutter/material.dart';
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
        SubTask(id: '${task.id}-ai1', title: 'Define high-level objectives & constraints'),
        SubTask(id: '${task.id}-ai2', title: 'Draft execution checklist & assign resources'),
        SubTask(id: '${task.id}-ai3', title: 'Validate against quality benchmarks'),
      ]);
      widget.onUpdate();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✨ AI generated subtasks for "${task.title}"!'),
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
                                    '$completedSubtasks/${task.subtasks.length} subtasks',
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
