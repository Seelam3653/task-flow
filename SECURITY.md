# TaskFlow – Security Architecture & Data Protection (SECURITY.md)

## 1. Supabase Row Level Security (RLS) Policy Blueprint

Every table has RLS explicitly enabled:
`ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;`

### Universal Policy Pattern:
```sql
-- Profiles: Users can only read and update their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tasks: Strict multi-tenant isolation
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

The same strict policy structure applies to `categories`, `projects`, `subtasks`, `habits`, `habit_logs`, `goals`, and `focus_sessions`.

---

## 2. Server-Side AI Key Protection

- **Threat**: Exposing the Gemini API key in mobile APK/AAB assets allows malicious actors to reverse-engineer and exhaust quota.
- **Countermeasure**: The Flutter client **NEVER** holds `GEMINI_API_KEY`. Requests to AI features are dispatched to the Supabase Edge Function `/api/ai-assistant` with the user's Supabase JWT token.
- The Edge Function verifies the JWT, checks if the user has remaining AI credits in `ai_usage`, performs server-side call to Google GenAI, and returns structured JSON to the client.

---

## 3. Account Deletion & GDPR Compliance Flow

Google Play Store enforces a strict Account Deletion requirement:
1. User navigates to **Settings > Account > Delete Account**.
2. Client presents an explicit double-confirmation dialog explaining irreversible data loss.
3. Client invokes Edge Function `/api/delete-account`.
4. The database triggers cascade deletion across all related child records via `ON DELETE CASCADE`.
5. Auth user is deleted from `auth.users` via Supabase Admin API.
6. Local cache and secure storage are purged, redirecting user to onboarding screen.
