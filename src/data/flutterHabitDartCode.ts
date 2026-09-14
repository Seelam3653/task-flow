// ==============================================================================
// TASKFLOW: Flutter Domain Entities - Habit & FocusSession
// Path: lib/features/habits/domain/entities/habit.dart
// Clean Architecture: Domain Layer (Pure Dart)
// ==============================================================================

export const habitDartEntity = `import 'package:equatable/equatable.dart';

enum HabitFrequency {
  daily,
  weekdays,
  weekly,
}

class HabitLog extends Equatable {
  final String id;
  final String habitId;
  final String userId;
  final DateTime logDate; // YYYY-MM-DD
  final int completedCount;
  final DateTime createdAt;

  const HabitLog({
    required this.id,
    required this.habitId,
    required this.userId,
    required this.logDate,
    this.completedCount = 1,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, habitId, userId, logDate, completedCount, createdAt];
}

class Habit extends Equatable {
  final String id;
  final String userId;
  final String title;
  final HabitFrequency frequency;
  final int targetCount;
  final int currentStreak;
  final int bestStreak;
  final String colorHex;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<DateTime> recentCompletionDates;

  const Habit({
    required this.id,
    required this.userId,
    required this.title,
    this.frequency = HabitFrequency.daily,
    this.targetCount = 1,
    this.currentStreak = 0,
    this.bestStreak = 0,
    this.colorHex = '#10B981',
    required this.createdAt,
    required this.updatedAt,
    this.recentCompletionDates = const [],
  });

  bool get isCompletedToday {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return recentCompletionDates.any((d) =>
      d.year == today.year && d.month == today.month && d.day == today.day
    );
  }

  Habit copyWith({
    String? id,
    String? userId,
    String? title,
    HabitFrequency? frequency,
    int? targetCount,
    int? currentStreak,
    int? bestStreak,
    String? colorHex,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<DateTime>? recentCompletionDates,
  }) {
    return Habit(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      frequency: frequency ?? this.frequency,
      targetCount: targetCount ?? this.targetCount,
      currentStreak: currentStreak ?? this.currentStreak,
      bestStreak: bestStreak ?? this.bestStreak,
      colorHex: colorHex ?? this.colorHex,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      recentCompletionDates: recentCompletionDates ?? this.recentCompletionDates,
    );
  }

  @override
  List<Object?> get props => [
    id, userId, title, frequency, targetCount, currentStreak, bestStreak,
    colorHex, createdAt, updatedAt, recentCompletionDates
  ];
}
`;

export const focusSessionDartEntity = `import 'package:equatable/equatable.dart';

enum FocusState {
  initial,
  running,
  paused,
  shortBreak,
  longBreak,
  completed,
}

class FocusSession extends Equatable {
  final String id;
  final String userId;
  final String? taskId;
  final int durationMinutes;
  final DateTime startedAt;
  final DateTime completedAt;
  final DateTime createdAt;

  const FocusSession({
    required this.id,
    required this.userId,
    this.taskId,
    required this.durationMinutes,
    required this.startedAt,
    required this.completedAt,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, userId, taskId, durationMinutes, startedAt, completedAt, createdAt];
}
`;
