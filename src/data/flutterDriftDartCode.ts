// ==============================================================================
// TASKFLOW: lib/core/database/app_database.dart
// Drift (SQLite) Schema for Offline-First Flutter Architecture
// ==============================================================================

export const driftDatabaseDartCode = `import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'app_database.g.dart';

// --- Local Drift Tables ---

@DataClassName('TaskEntry')
class TasksTable extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  TextColumn get categoryId => text().nullable()();
  TextColumn get projectId => text().nullable()();
  TextColumn get title => text()();
  TextColumn get description => text().nullable()();
  TextColumn get priority => text().withDefault(const Constant('medium'))();
  TextColumn get status => text().withDefault(const Constant('pending'))();
  DateTimeColumn get dueDate => dateTime().nullable()();
  TextColumn get dueTime => text().nullable()();
  BoolColumn get isRecurring => boolean().withDefault(const Constant(false))();
  TextColumn get recurrenceRule => text().nullable()(); // JSON encoded
  DateTimeColumn get completedAt => dateTime().nullable()();
  BoolColumn get isArchived => boolean().withDefault(const Constant(false))();
  DateTimeColumn get deletedAt => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  
  // Offline Sync State
  BoolColumn get isSynced => boolean().withDefault(const Constant(true))();
  IntColumn get syncVersion => integer().withDefault(const Constant(1))();

  @override
  Set<Column> get primaryKey => {id};
}

@DataClassName('SyncMutationEntry')
class SyncMutationQueueTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get entityType => text()(); // 'task', 'habit', 'subtask'
  TextColumn get entityId => text()();
  TextColumn get mutationType => text()(); // 'INSERT', 'UPDATE', 'DELETE'
  TextColumn get payload => text()(); // JSON serialization of entity
  DateTimeColumn get createdAt => dateTime()();
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
}

@DriftDatabase(tables: [TasksTable, SyncMutationQueueTable])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'taskflow_local.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
`;

export const conflictResolutionDartCode = `import 'package:supabase_flutter/supabase_flutter.dart';
import '../database/app_database.dart';

enum ConflictStrategy {
  lastWriteWins,
  remoteWins,
  localWins,
}

class SyncConflictResolver {
  /// Resolves conflicts using Last-Write-Wins (LWW) with client-server monotonic timestamp comparison
  static TaskEntry resolveTaskConflict({
    required TaskEntry local,
    required Map<String, dynamic> remote,
    ConflictStrategy strategy = ConflictStrategy.lastWriteWins,
  }) {
    if (strategy == ConflictStrategy.remoteWins) {
      return _mapRemoteToLocal(remote);
    }
    if (strategy == ConflictStrategy.localWins) {
      return local;
    }

    final remoteUpdatedAt = DateTime.parse(remote['updated_at'] as String);
    final localUpdatedAt = local.updatedAt;

    // Last-Write-Wins: Newer timestamp wins
    if (remoteUpdatedAt.isAfter(localUpdatedAt)) {
      return _mapRemoteToLocal(remote);
    } else {
      // Local version is newer or equal: keep local and flag for push
      return local.copyWith(isSynced: false);
    }
  }

  static TaskEntry _mapRemoteToLocal(Map<String, dynamic> remote) {
    return TaskEntry(
      id: remote['id'] as String,
      userId: remote['user_id'] as String,
      categoryId: remote['category_id'] as String?,
      projectId: remote['project_id'] as String?,
      title: remote['title'] as String,
      description: remote['description'] as String?,
      priority: remote['priority'] as String,
      status: remote['status'] as String,
      dueDate: remote['due_date'] != null ? DateTime.parse(remote['due_date'] as String) : null,
      dueTime: remote['due_time'] as String?,
      isRecurring: remote['is_recurring'] as bool? ?? false,
      recurrenceRule: remote['recurrence_rule'] != null ? remote['recurrence_rule'].toString() : null,
      completedAt: remote['completed_at'] != null ? DateTime.parse(remote['completed_at'] as String) : null,
      isArchived: remote['is_archived'] as bool? ?? false,
      deletedAt: remote['deleted_at'] != null ? DateTime.parse(remote['deleted_at'] as String) : null,
      createdAt: DateTime.parse(remote['created_at'] as String),
      updatedAt: DateTime.parse(remote['updated_at'] as String),
      isSynced: true,
      syncVersion: (remote['sync_version'] as int?) ?? 1,
    );
  }
}
`;
