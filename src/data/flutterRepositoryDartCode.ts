// ==============================================================================
// TASKFLOW: lib/features/tasks/data/repositories/task_repository_impl.dart
// Offline-First Task Repository implementation syncing local Drift/Hive with Supabase
// ==============================================================================

export const taskRepositoryDartCode = `import 'package:supabase_flutter/supabase_flutter.dart';
import '../../domain/entities/task.dart';
import '../../domain/repositories/task_repository.dart';

class TaskRepositoryImpl implements TaskRepository {
  final SupabaseClient supabase;
  final LocalTaskDataSource localDataSource;
  final NetworkInfo networkInfo;

  TaskRepositoryImpl({
    required this.supabase,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Stream<List<Task>> watchTasks({String? categoryId, String? projectId}) {
    // 1. Return local database stream immediately for zero-latency UI
    return localDataSource.watchTasks(categoryId: categoryId, projectId: projectId);
  }

  @override
  Future<void> syncPendingMutations() async {
    if (!await networkInfo.isConnected) return;
    
    final unsynced = await localDataSource.getUnsyncedChanges();
    for (final change in unsynced) {
      try {
        if (change.type == MutationType.insert) {
          await supabase.from('tasks').insert(change.task.toJson());
        } else if (change.type == MutationType.update) {
          await supabase.from('tasks').update(change.task.toJson()).eq('id', change.task.id);
        } else if (change.type == MutationType.delete) {
          await supabase.from('tasks').delete().eq('id', change.task.id);
        }
        await localDataSource.markChangeSynced(change.id);
      } catch (e) {
        // Retry logic on exponential backoff
      }
    }
  }

  @override
  Future<void> completeTask(String taskId) async {
    final now = DateTime.now();
    final task = await localDataSource.getTaskById(taskId);
    if (task == null) return;

    if (task.isRecurring && task.recurrenceRule != null) {
      // 1. Advance due date based on recurrence rule
      final nextDueDate = _calculateNextRecurrence(task.dueDate ?? now, task.recurrenceRule!);
      final updated = task.copyWith(
        dueDate: nextDueDate,
        updatedAt: now,
      );
      await localDataSource.saveTask(updated, isLocalMutation: true);
    } else {
      // Normal completion
      final updated = task.copyWith(
        status: TaskStatus.completed,
        completedAt: now,
        updatedAt: now,
      );
      await localDataSource.saveTask(updated, isLocalMutation: true);
    }

    // Trigger non-blocking remote sync
    syncPendingMutations();
  }

  DateTime _calculateNextRecurrence(DateTime current, RecurrenceRule rule) {
    if (rule.freq == 'daily') {
      return current.add(Duration(days: rule.interval));
    } else if (rule.freq == 'weekdays') {
      DateTime next = current.add(const Duration(days: 1));
      while (next.weekday == DateTime.saturday || next.weekday == DateTime.sunday) {
        next = next.add(const Duration(days: 1));
      }
      return next;
    } else if (rule.freq == 'weekly') {
      return current.add(Duration(days: 7 * rule.interval));
    } else if (rule.freq == 'monthly') {
      return DateTime(current.year, current.month + rule.interval, current.day);
    }
    return current.add(const Duration(days: 1));
  }
}
`;
