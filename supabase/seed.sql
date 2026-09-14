-- ==============================================================================
-- TASKFLOW SUPABASE SEED DATA (Demo Account & Initial Datasets)
-- Note: Replace USER_ID with an actual auth.users UUID when executing manually
-- ==============================================================================

DO $$
DECLARE
    demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
    work_cat_id UUID := gen_random_uuid();
    personal_cat_id UUID := gen_random_uuid();
    health_cat_id UUID := gen_random_uuid();
    taskflow_proj_id UUID := gen_random_uuid();
    task_1_id UUID := gen_random_uuid();
    task_2_id UUID := gen_random_uuid();
    habit_1_id UUID := gen_random_uuid();
BEGIN
    -- Only seed if the demo user profile doesn't exist
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = demo_user_id) THEN
        -- Insert profile
        INSERT INTO public.profiles (id, email, display_name, tier, streak_count, longest_streak, theme_mode)
        VALUES (demo_user_id, 'demo@taskflow.dev', 'Alex Developer', 'free', 14, 21, 'system');

        -- Seed categories
        INSERT INTO public.categories (id, user_id, name, color_hex, icon_name, sort_order, is_system)
        VALUES
            (work_cat_id, demo_user_id, 'Work', '#3B82F6', 'briefcase', 0, true),
            (personal_cat_id, demo_user_id, 'Personal', '#10B981', 'user', 1, true),
            (health_cat_id, demo_user_id, 'Health & Fitness', '#EF4444', 'heart', 2, true);

        -- Seed project
        INSERT INTO public.projects (id, user_id, name, description, color_hex, target_date, status)
        VALUES
            (taskflow_proj_id, demo_user_id, 'Launch TaskFlow on Google Play', 'Prepare store listing, sign release bundle, and verify in-app billing', '#6366F1', CURRENT_DATE + INTERVAL '30 days', 'active');

        -- Seed tasks
        INSERT INTO public.tasks (id, user_id, category_id, project_id, title, description, priority, status, due_date, due_time, is_recurring, recurrence_rule)
        VALUES
            (task_1_id, demo_user_id, work_cat_id, taskflow_proj_id, 'Verify Google Play Billing signature verification', 'Test sandbox IAP flow with test cards and verify digital signature via Edge Function', 'urgent', 'pending', CURRENT_DATE, '15:00:00', false, NULL),
            (task_2_id, demo_user_id, health_cat_id, NULL, 'Morning 5km run', 'Keep target heart rate zone 2', 'medium', 'completed', CURRENT_DATE, '07:00:00', true, '{"freq": "daily", "interval": 1}'::jsonb);

        -- Seed subtasks
        INSERT INTO public.subtasks (task_id, user_id, title, is_completed, sort_order)
        VALUES
            (task_1_id, demo_user_id, 'Configure service account key in Supabase secrets', true, 0),
            (task_1_id, demo_user_id, 'Verify purchase token against Google Play Androidpublisher API', false, 1),
            (task_1_id, demo_user_id, 'Update user tier to premium upon receipt ack', false, 2);

        -- Seed habit
        INSERT INTO public.habits (id, user_id, title, frequency, target_count, current_streak, best_streak, color_hex)
        VALUES
            (habit_1_id, demo_user_id, 'Drink 2.5L Water', 'daily', 1, 8, 14, '#06B6D4');

        -- Seed habit log for today
        INSERT INTO public.habit_logs (habit_id, user_id, log_date, completed_count)
        VALUES
            (habit_1_id, demo_user_id, CURRENT_DATE, 1);

        -- Seed goal
        INSERT INTO public.goals (user_id, title, description, deadline, target_value, current_value, status)
        VALUES
            (demo_user_id, 'Complete 50 Deep Focus Sessions', 'Track pomodoro focus hours for Q3 release', CURRENT_DATE + INTERVAL '45 days', 50, 28, 'in_progress');

        -- Seed AI usage record
        INSERT INTO public.ai_usage (user_id, month_year, request_count, last_used_at)
        VALUES
            (demo_user_id, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), 3, now());
    END IF;
END $$;
