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
