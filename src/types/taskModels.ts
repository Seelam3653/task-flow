// ==============================================================================
// TASKFLOW: Flutter Domain Entity - Task
// Path: lib/features/tasks/domain/entities/task.dart
// Clean Architecture: Domain Layer (Pure Dart, zero framework dependency)
// ==============================================================================

export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent',
}

export enum TaskStatus {
  pending = 'pending',
  completed = 'completed',
  archived = 'archived',
  deleted = 'deleted',
}

export interface RecurrenceRule {
  freq: 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'custom';
  interval?: number; // every N days/weeks
  daysOfWeek?: number[]; // [1, 3, 5] for Mon, Wed, Fri
  dayOfMonth?: number;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  sortOrder: number;
}

export interface Task {
  id: string;
  userId: string;
  categoryId?: string | null;
  projectId?: string | null;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null; // YYYY-MM-DD
  dueTime?: string | null; // HH:mm
  reminderAt?: string | null; // ISO timestamp
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule | null;
  completedAt?: string | null;
  isArchived: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[];
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  colorHex: string;
  iconName: string;
  sortOrder: number;
  isSystem: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  colorHex: string;
  targetDate?: string | null;
  status: 'active' | 'completed' | 'archived';
  totalTasks?: number;
  completedTasks?: number;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  frequency: 'daily' | 'weekdays' | 'weekly';
  targetCount: number;
  currentStreak: number;
  bestStreak: number;
  colorHex: string;
  completedToday?: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  deadline: string;
  targetValue: number;
  currentValue: number;
  status: 'in_progress' | 'achieved' | 'abandoned';
}
