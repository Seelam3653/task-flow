-- ==============================================================================
-- TASKFLOW SUPABASE MIGRATION: 20260914000002_row_level_security.sql
-- Description: Enable Row Level Security (RLS) and define multi-tenant policies
-- ==============================================================================

-- 1. Enable RLS on all 10 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. POLICIES: PROFILES
-- ==============================================================================
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ==============================================================================
-- 3. POLICIES: CATEGORIES
-- ==============================================================================
CREATE POLICY "Users can view their own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. POLICIES: PROJECTS
-- ==============================================================================
CREATE POLICY "Users can view their own projects"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. POLICIES: TASKS
-- ==============================================================================
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 6. POLICIES: SUBTASKS
-- ==============================================================================
CREATE POLICY "Users can view their own subtasks"
    ON public.subtasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subtasks"
    ON public.subtasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subtasks"
    ON public.subtasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subtasks"
    ON public.subtasks FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. POLICIES: HABITS & HABIT LOGS
-- ==============================================================================
CREATE POLICY "Users can view their own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habit logs"
    ON public.habit_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit logs"
    ON public.habit_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit logs"
    ON public.habit_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit logs"
    ON public.habit_logs FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. POLICIES: GOALS & FOCUS SESSIONS
-- ==============================================================================
CREATE POLICY "Users can view their own goals"
    ON public.goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
    ON public.goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON public.goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON public.goals FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own focus sessions"
    ON public.focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own focus sessions"
    ON public.focus_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 9. POLICIES: SUBSCRIPTIONS & AI USAGE (CLIENT READ-ONLY)
-- Clients cannot tamper with subscription status or reset their own AI limits!
-- ==============================================================================
CREATE POLICY "Users can view their own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI usage"
    ON public.ai_usage FOR SELECT
    USING (auth.uid() = user_id);

-- Mutation on subscriptions and ai_usage are strictly handled by Supabase Edge Functions
-- executing with the service_role key.

-- ==============================================================================
-- 10. NEW USER REGISTRATION TRIGGER (Bootstraps Profile & System Categories)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Create Profile Row
    INSERT INTO public.profiles (id, email, display_name, tier, streak_count, theme_mode)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'free',
        0,
        'system'
    );

    -- 2. Seed Default System Categories for the new user
    INSERT INTO public.categories (user_id, name, color_hex, icon_name, sort_order, is_system)
    VALUES
        (NEW.id, 'Work', '#3B82F6', 'briefcase', 0, true),
        (NEW.id, 'Personal', '#10B981', 'user', 1, true),
        (NEW.id, 'Health & Fitness', '#EF4444', 'heart', 2, true),
        (NEW.id, 'Study', '#8B5CF6', 'book-open', 3, true),
        (NEW.id, 'Finance', '#F59E0B', 'credit-card', 4, true),
        (NEW.id, 'Shopping', '#EC4899', 'shopping-cart', 5, true);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
