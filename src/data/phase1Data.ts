import { TableSchema, FeatureComparison, RoadmapPhase } from '../types/architecture';

export const TABLE_SCHEMAS: TableSchema[] = [
  {
    name: 'profiles',
    description: 'User identity, active tier entitlements, daily streak metrics, and display preferences.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, references: 'auth.users(id)', description: 'Primary key linking to Supabase auth user' },
      { name: 'email', type: 'TEXT', nullable: false, description: 'User login email' },
      { name: 'display_name', type: 'TEXT', nullable: true, description: 'Full user name or pseudonym' },
      { name: 'tier', type: 'VARCHAR(16)', nullable: false, description: "'free' | 'premium' | 'lifetime'" },
      { name: 'streak_count', type: 'INT', nullable: false, description: 'Current consecutive active days' },
      { name: 'longest_streak', type: 'INT', nullable: false, description: 'All-time best streak' },
      { name: 'last_active_date', type: 'DATE', nullable: true, description: 'Used to calculate daily streaks' },
      { name: 'theme_mode', type: 'VARCHAR(10)', nullable: false, description: "'system' | 'light' | 'dark'" },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Account creation timestamp' },
    ],
    indexes: ['PRIMARY KEY (id)', 'INDEX idx_profiles_tier (tier)'],
    rlsPolicies: [
      'SELECT: auth.uid() = id',
      'UPDATE: auth.uid() = id',
    ]
  },
  {
    name: 'tasks',
    description: 'Core daily task entity with priority, deadlines, recurrence rules, and soft-deletion.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Unique task identifier' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Owner identifier' },
      { name: 'category_id', type: 'UUID', nullable: true, isForeign: true, references: 'categories(id)', description: 'Optional category tag' },
      { name: 'project_id', type: 'UUID', nullable: true, isForeign: true, references: 'projects(id)', description: 'Optional project association' },
      { name: 'title', type: 'TEXT', nullable: false, description: 'Task title / name' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Detailed notes or instructions' },
      { name: 'priority', type: 'VARCHAR(10)', nullable: false, description: "'low' | 'medium' | 'high' | 'urgent'" },
      { name: 'status', type: 'VARCHAR(12)', nullable: false, description: "'pending' | 'completed' | 'archived' | 'deleted'" },
      { name: 'due_date', type: 'DATE', nullable: true, description: 'Scheduled task date' },
      { name: 'due_time', type: 'TIME', nullable: true, description: 'Scheduled task time' },
      { name: 'reminder_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Local notification trigger time' },
      { name: 'is_recurring', type: 'BOOLEAN', nullable: false, description: 'Flag for recurring recurrence rules' },
      { name: 'recurrence_rule', type: 'JSONB', nullable: true, description: 'Rule definition: freq, interval, days' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Timestamp when marked done' },
      { name: 'deleted_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Soft delete timestamp for trash/restore' }
    ],
    indexes: [
      'INDEX idx_tasks_user_status (user_id, status)',
      'INDEX idx_tasks_user_due_date (user_id, due_date) WHERE status = "pending"',
      'INDEX idx_tasks_user_project (user_id, project_id)',
      'INDEX idx_tasks_user_priority (user_id, priority)'
    ],
    rlsPolicies: [
      'SELECT: auth.uid() = user_id',
      'INSERT: auth.uid() = user_id',
      'UPDATE: auth.uid() = user_id',
      'DELETE: auth.uid() = user_id'
    ]
  },
  {
    name: 'categories',
    description: 'Task organization buckets with custom hex color codes, icons, and sort orders.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Unique category identifier' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Category owner' },
      { name: 'name', type: 'TEXT', nullable: false, description: 'Category label (e.g. Work, Health)' },
      { name: 'color_hex', type: 'VARCHAR(7)', nullable: false, description: 'Hex color code (#6366F1)' },
      { name: 'icon_name', type: 'VARCHAR(32)', nullable: false, description: 'Icon identifier' },
      { name: 'sort_order', type: 'INT', nullable: false, description: 'Position in category list' },
      { name: 'is_system', type: 'BOOLEAN', nullable: false, description: 'Preset vs user-created' }
    ],
    indexes: ['INDEX idx_categories_user_order (user_id, sort_order)'],
    rlsPolicies: ['ALL: auth.uid() = user_id']
  },
  {
    name: 'projects',
    description: 'High-level initiatives that group tasks and compute completion percentage.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Unique project ID' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Owner' },
      { name: 'name', type: 'TEXT', nullable: false, description: 'Project title' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Project overview' },
      { name: 'color_hex', type: 'VARCHAR(7)', nullable: false, description: 'Theme badge color' },
      { name: 'target_date', type: 'DATE', nullable: true, description: 'Target delivery milestone' },
      { name: 'status', type: 'VARCHAR(12)', nullable: false, description: "'active' | 'completed' | 'archived'" }
    ],
    indexes: ['INDEX idx_projects_user_status (user_id, status)'],
    rlsPolicies: ['ALL: auth.uid() = user_id']
  },
  {
    name: 'subtasks',
    description: 'Itemized checklist elements belonging to a specific parent task.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Subtask ID' },
      { name: 'task_id', type: 'UUID', nullable: false, isForeign: true, references: 'tasks(id)', description: 'Parent task' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Task owner' },
      { name: 'title', type: 'TEXT', nullable: false, description: 'Checklist item title' },
      { name: 'is_completed', type: 'BOOLEAN', nullable: false, description: 'Done state' },
      { name: 'sort_order', type: 'INT', nullable: false, description: 'Checklist ordering' }
    ],
    indexes: ['INDEX idx_subtasks_task (task_id, sort_order)'],
    rlsPolicies: ['ALL: auth.uid() = user_id']
  },
  {
    name: 'habits',
    description: 'Lightweight habit definitions for daily routines with built-in streaks.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Habit ID' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Habit owner' },
      { name: 'title', type: 'TEXT', nullable: false, description: 'Habit title (Drink water, Read)' },
      { name: 'frequency', type: 'VARCHAR(12)', nullable: false, description: "'daily' | 'weekdays' | 'weekly'" },
      { name: 'target_count', type: 'INT', nullable: false, description: 'Daily target completions' },
      { name: 'current_streak', type: 'INT', nullable: false, description: 'Consecutive completed periods' },
      { name: 'best_streak', type: 'INT', nullable: false, description: 'Highest streak recorded' },
      { name: 'color_hex', type: 'VARCHAR(7)', nullable: false, description: 'Visual badge color' }
    ],
    indexes: ['INDEX idx_habits_user (user_id)'],
    rlsPolicies: ['ALL: auth.uid() = user_id']
  },
  {
    name: 'habit_logs',
    description: 'Historical records of daily habit check-ins (1 record per habit per day).',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Log entry ID' },
      { name: 'habit_id', type: 'UUID', nullable: false, isForeign: true, references: 'habits(id)', description: 'Associated habit' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Owner' },
      { name: 'log_date', type: 'DATE', nullable: false, description: 'Calendar date of completion' },
      { name: 'completed_count', type: 'INT', nullable: false, description: 'Count done on this date' }
    ],
    indexes: ['UNIQUE (habit_id, log_date)', 'INDEX idx_habit_logs_date (user_id, log_date)'],
    rlsPolicies: ['ALL: auth.uid() = user_id']
  },
  {
    name: 'goals',
    description: 'Targeted medium to long-term goals with progress metrics.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Goal ID' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Owner' },
      { name: 'title', type: 'TEXT', nullable: false, description: 'Goal title (e.g. Learn Python)' },
      { name: 'deadline', type: 'DATE', nullable: false, description: 'Target date' },
      { name: 'target_value', type: 'INT', nullable: false, description: 'Target numeric value (e.g. 100)' },
      { name: 'current_value', type: 'INT', nullable: false, description: 'Current progress value' },
      { name: 'status', type: 'VARCHAR(16)', nullable: false, description: "'in_progress' | 'achieved' | 'abandoned'" }
    ],
    indexes: ['INDEX idx_goals_user (user_id, status)'],
    rlsPolicies: ['ALL: auth.uid() = user_id']
  },
  {
    name: 'focus_sessions',
    description: 'Pomodoro and focus timer records for productivity reports.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Session ID' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'User' },
      { name: 'task_id', type: 'UUID', nullable: true, isForeign: true, references: 'tasks(id)', description: 'Optional focused task' },
      { name: 'duration_minutes', type: 'INT', nullable: false, description: '25, 50, or custom minutes' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Completion timestamp' }
    ],
    indexes: ['INDEX idx_focus_user (user_id, completed_at)'],
    rlsPolicies: ['ALL: auth.uid() = user_id']
  },
  {
    name: 'subscriptions',
    description: 'Server-side validated Google Play in-app purchase receipts and plan state.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, isPrimary: true, description: 'Subscription ID' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, references: 'auth.users(id)', description: 'Subscribed user' },
      { name: 'google_play_purchase_token', type: 'TEXT', nullable: false, description: 'Encrypted purchase token from Play Store' },
      { name: 'product_id', type: 'VARCHAR(64)', nullable: false, description: "'taskflow_premium_monthly' or 'yearly'" },
      { name: 'status', type: 'VARCHAR(16)', nullable: false, description: "'active' | 'canceled' | 'grace_period' | 'expired'" },
      { name: 'expires_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Current period expiration' }
    ],
    indexes: ['UNIQUE (google_play_purchase_token)', 'INDEX idx_subscriptions_user (user_id, status)'],
    rlsPolicies: [
      'SELECT: auth.uid() = user_id',
      'INSERT/UPDATE/DELETE: Denied to clients (Edge Function service role only)'
    ]
  }
];

export const FEATURE_MATRIX: FeatureComparison[] = [
  { feature: 'Core Task Creation & Editing', category: 'Tasks', freeTier: 'Unlimited', premiumTier: 'Unlimited' },
  { feature: 'Priority Flags (Low, Med, High, Urgent)', category: 'Tasks', freeTier: 'Supported', premiumTier: 'Supported' },
  { feature: 'Subtasks & Checklists', category: 'Tasks', freeTier: 'Up to 5 per task', premiumTier: 'Unlimited' },
  { feature: 'Smart Recurring Tasks', category: 'Tasks', freeTier: 'Daily & Weekly basic', premiumTier: 'Custom intervals & weekdays', isKeyDifferentiator: true },
  { feature: 'Category Management', category: 'Organization', freeTier: 'Up to 5 categories', premiumTier: 'Unlimited custom categories' },
  { feature: 'Active Projects', category: 'Organization', freeTier: 'Up to 3 projects', premiumTier: 'Unlimited projects', isKeyDifferentiator: true },
  { feature: 'Habit Tracker', category: 'Productivity', freeTier: 'Up to 3 habits', premiumTier: 'Unlimited habits & streak rescue', isKeyDifferentiator: true },
  { feature: 'Long-term Goals', category: 'Productivity', freeTier: '1 active goal', premiumTier: 'Unlimited goals & milestones' },
  { feature: 'Focus Timer (Pomodoro)', category: 'Productivity', freeTier: 'Standard 25m', premiumTier: 'Custom durations & deep stats' },
  { feature: 'Productivity Score & Analytics', category: 'Analytics', freeTier: '7-day overview', premiumTier: 'Lifetime trends & category breakdown', isKeyDifferentiator: true },
  { feature: 'Calendar Integration', category: 'Views', freeTier: 'Day & Week view', premiumTier: 'Day, Week, Month & Export' },
  { feature: 'Local Notifications & Reminders', category: 'Reminders', freeTier: 'Supported (Local)', premiumTier: 'Supported (Local + Smart Recurrence)' },
  { feature: 'Cloud Sync & Multi-Device', category: 'Sync', freeTier: 'Single device manual', premiumTier: 'Real-time multi-device cloud backup', isKeyDifferentiator: true },
  { feature: 'AI Natural Language Task Parser', category: 'Smart AI', freeTier: 'Trial 3 actions', premiumTier: '50 actions / month', isKeyDifferentiator: true },
  { feature: 'AI Smart Task Breakdown', category: 'Smart AI', freeTier: 'Trial 3 actions', premiumTier: '50 actions / month', isKeyDifferentiator: true },
  { feature: 'AI Daily Planning Assistant', category: 'Smart AI', freeTier: 'Not included', premiumTier: 'Unlimited recommendations', isKeyDifferentiator: true },
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phaseNumber: 1,
    title: 'Product Architecture & Foundations',
    status: 'current',
    scope: [
      'High-level product topology & Clean Architecture specification',
      'PostgreSQL Relational ER Schema with 10 tables',
      'Virtual Recurrence Engine specification (zero-bloat)',
      'Security model: Row-Level-Security (RLS) & Server-side AI proxies',
      'Monetization & Cost Control model (100 to 100k users)',
      'Material 3 design system tokens and color harmonies'
    ],
    deliverables: [
      'ARCHITECTURE.md',
      'DATABASE.md',
      'MONETIZATION.md',
      'SECURITY.md',
      'Interactive Phase 1 Architectural Workspace'
    ]
  },
  {
    phaseNumber: 2,
    title: 'Supabase Setup & Authentication Engine',
    status: 'upcoming',
    scope: [
      'Complete PostgreSQL migration scripts',
      'RLS policies & security triggers for profiles',
      'Supabase Auth client integration (Email/Password, Google OAuth)',
      'Local Secure Token storage'
    ],
    deliverables: ['supabase/migrations/*.sql', 'supabase/seed.sql', 'Auth repository']
  },
  {
    phaseNumber: 3,
    title: 'Flutter Shell, Material 3 Theme & Navigation',
    status: 'upcoming',
    scope: [
      'Material 3 theme configuration (Light/Dark/Amoled)',
      'Bottom navigation bar with responsive drawer',
      'Splash & Onboarding carousels',
      'Authentication presentation screens (Login, Register, Forgot Password)'
    ],
    deliverables: ['lib/core/theme/*', 'lib/features/auth/presentation/*']
  },
  {
    phaseNumber: 4,
    title: 'Task Management Engine (CRUD & Filters)',
    status: 'upcoming',
    scope: [
      'Task creation, editing, deletion, archiving, restoring',
      'Priority visual badges and deadline sorters',
      'Filter pipeline by priority, due date, category, status',
      'Virtual recurrence transition algorithms'
    ],
    deliverables: ['lib/features/tasks/*']
  },
  {
    phaseNumber: 5,
    title: 'Projects, Categories & Subtask Hierarchy',
    status: 'upcoming',
    scope: [
      'Category palette picker with icons',
      'Project view with dynamic completion percentage calculation',
      'Interactive subtask checklist with progress ring'
    ],
    deliverables: ['lib/features/projects/*', 'lib/features/categories/*']
  },
  {
    phaseNumber: 6,
    title: 'Calendar & Local Notification Reminders',
    status: 'upcoming',
    scope: [
      'Interactive Day, Week, and Month calendar views',
      'Direct task scheduling from calendar',
      'flutter_local_notifications scheduling without server cost',
      'Exact alarms and permission handling for Android 13+'
    ],
    deliverables: ['lib/features/calendar/*', 'lib/shared/services/notification_service.dart']
  },
  {
    phaseNumber: 7,
    title: 'Habits, Long-Term Goals & Focus Mode',
    status: 'upcoming',
    scope: [
      'Habit tracker with daily check-in circles and streaks',
      'Goal milestone progress bars',
      'Focus Mode (Pomodoro 25m/50m timer) with background lock prevention'
    ],
    deliverables: ['lib/features/habits/*', 'lib/features/goals/*', 'lib/features/focus/*']
  },
  {
    phaseNumber: 8,
    title: 'Deterministic Productivity Analytics',
    status: 'upcoming',
    scope: [
      'Daily productivity score algorithm (transparent, non-black-box)',
      'Weekly productivity reports with charts',
      'Most productive day calculations and category time distribution'
    ],
    deliverables: ['lib/features/analytics/*']
  },
  {
    phaseNumber: 9,
    title: 'Server-Gated Smart AI Features',
    status: 'upcoming',
    scope: [
      'Supabase Edge Function /ai-assistant with Gemini 2.5 Flash',
      'Natural language task parser ("Tomorrow 10am call client")',
      'Smart task breakdown for large projects',
      'Tier-based monthly quota enforcement (50 requests/mo)'
    ],
    deliverables: ['supabase/functions/ai-assistant/*', 'lib/features/ai/*']
  },
  {
    phaseNumber: 10,
    title: 'Google Play Billing & Subscriptions',
    status: 'upcoming',
    scope: [
      'Google Play Billing integration via in_app_purchase',
      'Edge Function /verify-purchase with Google Play Developer API',
      'Paywall UI and entitlement unlocking',
      'Subscription restore and grace period handler'
    ],
    deliverables: ['lib/features/subscription/*', 'supabase/functions/verify-purchase/*']
  },
  {
    phaseNumber: 11,
    title: 'Testing, Security Audits & Offline Sync Engine',
    status: 'upcoming',
    scope: [
      'Drift/SQLite offline sync engine with dirty-flag queue',
      'Unit tests for recurrence and score calculators',
      'Widget tests for task interactions',
      'RLS automated security verification suite'
    ],
    deliverables: ['test/*', 'lib/core/database/*']
  },
  {
    phaseNumber: 12,
    title: 'Google Play Store Release & Production Deployment',
    status: 'upcoming',
    scope: [
      'Release Android App Bundle (.aab) build scripts',
      'Keystore signing configuration',
      'Privacy Policy & Terms of Service documents',
      'Data Safety declaration forms & store listing assets'
    ],
    deliverables: ['android/app/build.gradle', 'PRIVACY_POLICY.md', 'STORE_LISTING.md']
  }
];
