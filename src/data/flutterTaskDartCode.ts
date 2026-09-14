// ==============================================================================
// TASKFLOW: lib/features/tasks/domain/entities/task.dart
// Clean Architecture Domain Entity in pure Dart with copyWith & serialization
// ==============================================================================

export const taskDartEntity = `import 'package:equatable/equatable.dart';

enum TaskPriority {
  low,
  medium,
  high,
  urgent,
}

enum TaskStatus {
  pending,
  completed,
  archived,
  deleted,
}

class RecurrenceRule extends Equatable {
  final String freq; // 'daily', 'weekdays', 'weekly', 'monthly'
  final int interval;
  final List<int>? daysOfWeek;
  final int? dayOfMonth;

  const RecurrenceRule({
    required this.freq,
    this.interval = 1,
    this.daysOfWeek,
    this.dayOfMonth,
  });

  factory RecurrenceRule.fromJson(Map<String, dynamic> json) {
    return RecurrenceRule(
      freq: json['freq'] as String? ?? 'daily',
      interval: json['interval'] as int? ?? 1,
      daysOfWeek: (json['daysOfWeek'] as List<dynamic>?)?.map((e) => e as int).toList(),
      dayOfMonth: json['dayOfMonth'] as int?,
    );
  }

  Map<String, dynamic> toJson() => {
    'freq': freq,
    'interval': interval,
    if (daysOfWeek != null) 'daysOfWeek': daysOfWeek,
    if (dayOfMonth != null) 'dayOfMonth': dayOfMonth,
  };

  @override
  List<Object?> get props => [freq, interval, daysOfWeek, dayOfMonth];
}

class Subtask extends Equatable {
  final String id;
  final String taskId;
  final String title;
  final bool isCompleted;
  final int sortOrder;

  const Subtask({
    required this.id,
    required this.taskId,
    required this.title,
    this.isCompleted = false,
    this.sortOrder = 0,
  });

  Subtask copyWith({
    String? id,
    String? taskId,
    String? title,
    bool? isCompleted,
    int? sortOrder,
  }) {
    return Subtask(
      id: id ?? this.id,
      taskId: taskId ?? this.taskId,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
      sortOrder: sortOrder ?? this.sortOrder,
    );
  }

  factory Subtask.fromJson(Map<String, dynamic> json) => Subtask(
    id: json['id'] as String,
    taskId: json['task_id'] as String,
    title: json['title'] as String,
    isCompleted: json['is_completed'] as bool? ?? false,
    sortOrder: json['sort_order'] as int? ?? 0,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'task_id': taskId,
    'title': title,
    'is_completed': isCompleted,
    'sort_order': sortOrder,
  };

  @override
  List<Object?> get props => [id, taskId, title, isCompleted, sortOrder];
}

class Task extends Equatable {
  final String id;
  final String userId;
  final String? categoryId;
  final String? projectId;
  final String title;
  final String? description;
  final TaskPriority priority;
  final TaskStatus status;
  final DateTime? dueDate;
  final String? dueTime; // 'HH:mm'
  final DateTime? reminderAt;
  final bool isRecurring;
  final RecurrenceRule? recurrenceRule;
  final DateTime? completedAt;
  final bool isArchived;
  final DateTime? deletedAt;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<Subtask> subtasks;

  const Task({
    required this.id,
    required this.userId,
    this.categoryId,
    this.projectId,
    required this.title,
    this.description,
    this.priority = TaskPriority.medium,
    this.status = TaskStatus.pending,
    this.dueDate,
    this.dueTime,
    this.reminderAt,
    this.isRecurring = false,
    this.recurrenceRule,
    this.completedAt,
    this.isArchived = false,
    this.deletedAt,
    required this.createdAt,
    required this.updatedAt,
    this.subtasks = const [],
  });

  bool get isCompleted => status == TaskStatus.completed;
  bool get isOverdue {
    if (isCompleted || dueDate == null) return false;
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return dueDate!.isBefore(today);
  }

  Task copyWith({
    String? id,
    String? userId,
    String? categoryId,
    String? projectId,
    String? title,
    String? description,
    TaskPriority? priority,
    TaskStatus? status,
    DateTime? dueDate,
    String? dueTime,
    DateTime? reminderAt,
    bool? isRecurring,
    RecurrenceRule? recurrenceRule,
    DateTime? completedAt,
    bool? isArchived,
    DateTime? deletedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<Subtask>? subtasks,
  }) {
    return Task(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      categoryId: categoryId ?? this.categoryId,
      projectId: projectId ?? this.projectId,
      title: title ?? this.title,
      description: description ?? this.description,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      dueDate: dueDate ?? this.dueDate,
      dueTime: dueTime ?? this.dueTime,
      reminderAt: reminderAt ?? this.reminderAt,
      isRecurring: isRecurring ?? this.isRecurring,
      recurrenceRule: recurrenceRule ?? this.recurrenceRule,
      completedAt: completedAt ?? this.completedAt,
      isArchived: isArchived ?? this.isArchived,
      deletedAt: deletedAt ?? this.deletedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      subtasks: subtasks ?? this.subtasks,
    );
  }

  @override
  List<Object?> get props => [
    id, userId, categoryId, projectId, title, description,
    priority, status, dueDate, dueTime, reminderAt, isRecurring,
    recurrenceRule, completedAt, isArchived, deletedAt, subtasks
  ];
}
`;
