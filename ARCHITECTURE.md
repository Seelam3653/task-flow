# TaskFlow – Product Architecture & System Design Document (Phase 1)

## 1. Product Vision & Architecture Overview

TaskFlow is an offline-first, high-performance daily task manager, habit tracker, and productivity suite designed for commercial deployment on Google Play Store (and cross-platform ready for iOS and Web).

### Core Architectural Pillars
1. **Low Operating Cost**: Local computation first, PostgreSQL with efficient indices, virtualized recurrence (no record explosion), and local notifications (no push-notification service costs).
2. **Offline-First Resilience**: Local SQLite / Drift database acts as the single source of truth for the client UI; background synchronization engine handles Supabase PostgreSQL syncing with conflict resolution based on vector/timestamp semantics.
3. **Privacy & Security**: Zero client exposure of AI API keys; Supabase Row Level Security (RLS) on all tables; strict multi-tenant tenant isolation; zero admin snooping on private task content.
4. **Commercial Scalability**: Google Play Billing with server-side receipt validation, tiered freemium entitlements, and usage-gated AI services.

---

## 2. Feature Prioritization & Release Tiers

| Feature Area | MVP (Phase 1–5) | Growth (Phase 6–9) | Scale & Monetization (Phase 10–12) |
|---|---|---|---|
| **Auth** | Email/Password, Google Sign-In, Session cache | Password Reset, Account Deletion | Apple Sign-In, Biometric Lock |
| **Tasks** | CRUD, Priorities, Due Dates, Tags, Filters | Subtasks, Smart Virtual Recurrence | Natural language quick-add, AI Task Breakdown |
| **Categories & Projects** | Default & Custom Categories, Projects, Progress calculation | Project templates, Color & icon badges | Advanced category analytics, Exporting |
| **Habits & Goals** | Basic Habit tracking with streaks | Daily completion logs, 30-day goals | AI Habit insights, Habit-to-task linking |
| **Productivity** | Daily completion score (deterministic) | Focus Timer (Pomodoro 25/50m) | Weekly reports, Trend forecasting |
| **Sync & Offline** | Local SQLite cache, basic dirty-flag sync | Delta sync, offline queue | Multi-device collision resolution |
| **Billing** | Free plan restrictions | Google Play Billing integration | Real-time subscription state verification |

---

## 3. MVP vs. Premium Feature Matrix

| Capability | Free Tier (₹0) | Premium Tier (₹99/mo or ₹799/yr) |
|---|---|---|
| **Active Projects** | Up to 3 projects | **Unlimited** projects |
| **Custom Categories** | Up to 5 categories | **Unlimited** categories |
| **Recurring Tasks** | Daily, Weekly basic recurrence | **Advanced custom schedules** (e.g. every 15 days, Nth weekday) |
| **Habits Tracked** | Up to 3 active habits | **Unlimited** habits & streak protection |
| **Goals** | 1 active goal | **Unlimited** milestones & goals |
| **Focus Timer** | Standard 25 min Pomodoro | **Custom durations, ambient sounds, deep focus metrics** |
| **Analytics & Reports** | 7-day completion summary | **Lifetime trends, weekly PDF export, category breakdown** |
| **Cloud Sync & Backup** | Manual daily sync / 1 device | **Real-time instant cloud backup & multi-device sync** |
| **AI Productivity Assistant**| Not included (preview trial 3 credits)| **50 AI actions/month** (smart parser, auto-breakdown, plan assist) |
| **Theme & Customization** | Material 3 System/Light/Dark | **Custom accent palettes, app icons, typography options** |

---

## 4. Flutter Clean Architecture

The mobile application follows Uncle Bob's Clean Architecture layered with Feature-Driven packaging:

```
lib/
├── core/
│   ├── constants/        # App constants, API routes, storage keys
│   ├── errors/           # Failure & Exception classes with user-friendly mapping
│   ├── network/          # Network connectivity listener, Supabase client wrapper
│   ├── theme/            # Material 3 color schemes, typography, spacing tokens
│   ├── utils/            # Date formatters, recurrence calculators, score algorithms
│   └── database/         # Local database (Drift/SQLite) & migration helpers
├── features/
│   ├── auth/             # Data (remote/local), Domain (models/usecases), Presentation (Bloc/Cubit)
│   ├── dashboard/        # Aggregation usecases, daily score calculator, dashboard view
│   ├── tasks/            # Task CRUD, filters, priority sorts, recurrence engine
│   ├── projects/         # Project entities, progress percentage watchers
│   ├── categories/       # Category palette managers & order indices
│   ├── habits/           # Habit streaks, daily check-in logic
│   ├── goals/            # Milestone hierarchies, deadline trackers
│   ├── focus/            # Ticking focus timer service, background session recorders
│   ├── analytics/        # Deterministic productivity calculations, chart transformers
│   ├── ai/               # AI prompt client, usage quota checks, payload sanitizer
│   ├── subscription/     # In-app purchase repository, Google Play Billing bridge
│   └── profile/          # User preferences, data export, account deletion
└── shared/
    ├── widgets/          # Buttons, Cards, Inputs, Empty states, Loading skeletons
    ├── models/           # Common DTOs, PaginatedResult, SyncRecord
    └── services/         # Local notification manager, secure storage provider
```

### State Management Pattern: BLoC / Cubit
- Predictable, testable event-to-state stream.
- Zero UI business logic leaks.
- Independent presentation testing with Mocktail/Mockito.

---

## 5. Supabase Architecture

1. **Supabase Auth**: JWT with 1-hour expiration + refresh token securely stored in Android EncryptedSharedPreferences (via `flutter_secure_storage`).
2. **PostgreSQL Database**: Custom schema equipped with Strict Row Level Security (RLS) policies based on `auth.uid() = user_id`.
3. **Supabase Edge Functions**:
   - `/verify-purchase`: Securely parses Google Play Developer API purchase tokens, records verified state into `subscriptions` table.
   - `/ai-assistant`: Proxies user prompts to Gemini 2.5/Flash model using server-side `GEMINI_API_KEY`, enforces tier rate limits via `ai_usage` table.
   - `/export-user-data`: Generates a zip/JSON archive of user's personal data for GDPR compliance.
   - `/delete-account`: Purges all relational records associated with the calling user.
4. **Realtime**: Disabled by default across all tables to eliminate persistent WebSocket overhead and idle connection billing. Only enabled on explicit multi-device collaboration tables if needed in future releases.

---

## 6. Security Architecture

1. **Row Level Security (RLS)**: Every user table enforces `auth.uid() = user_id` for SELECT, INSERT, UPDATE, and DELETE. No user can ever read or modify another user's task or profile.
2. **Secret Separation**: AI API keys, Google Service Account keys, and Supabase service_role keys never touch mobile binaries. They reside exclusively in Supabase Edge Function environment variables.
3. **No Database Superuser in App**: Flutter uses Supabase anon public key only, strictly bounded by RLS.
4. **Admin Privacy Isolation**: Admin analytics queries use aggregated SQL views (`SELECT count(*), date_trunc('day', created_at) ...`) with zero access to raw task descriptions or titles.

---

## 7. Cost Optimization Architecture ("Zero-Waste Blueprint")

### Principles:
1. **Virtual Recurrence**: Recurring tasks do NOT spawn future task rows in the database. Instead, a single recurring task definition exists. When marked completed on date $D$, the system writes a completion record or updates `next_due_at`, preventing database bloat.
2. **Local Notifications**: Scheduled using Android `AlarmManager` and `flutter_local_notifications`. Eliminates monthly Firebase Cloud Messaging / OneSignal third-party tier costs.
3. **Client-Side Aggregation**: Dashboard daily score, completion percentages, and streaks are calculated locally using lightweight SQLite queries rather than consuming Edge Function execution credits.
4. **Batch Syncing**: Online synchronization queues changes and flushes in batches during network recovery, reducing HTTP round trips.

---

## 8. Development Roadmap (Phases 1 to 12)

- **Phase 1 (Current)**: Product architecture, DB ER design, schema, monetization, and design system.
- **Phase 2**: Supabase setup, PostgreSQL schema, RLS policies, indexes, and Auth endpoints.
- **Phase 3**: Flutter shell, Material 3 theme, navigation routing, authentication UI.
- **Phase 4**: Task management core (CRUD, priorities, labels, sorting, filter engine).
- **Phase 5**: Projects, categories, subtasks progress tracking.
- **Phase 6**: Calendar views (Day/Week/Month), local reminders & notification scheduler.
- **Phase 7**: Habit tracking with streaks, Goals tracker, and Focus Pomodoro timer.
- **Phase 8**: Deterministic Productivity Score, weekly visual reports, and data visualization.
- **Phase 9**: AI Assistant (Edge Function with Gemini server-side proxy, usage limits).
- **Phase 10**: Subscriptions (Google Play Billing, server verification, paywall UI).
- **Phase 11**: Unit & integration tests, offline sync stress testing, security audits.
- **Phase 12**: Google Play Store release bundle (AAB), signing, Privacy Policy, and store assets.
