-- ==============================================================================
-- Campus2Career: Supabase Database Schema & Row Level Security (RLS)
-- Complete PostgreSQL schema for Engineering Placement Preparation Dashboard
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Scoped to Supabase Auth User)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    college TEXT DEFAULT 'National Institute of Technology',
    branch TEXT DEFAULT 'Computer Science & Engineering',
    graduation_year INTEGER DEFAULT 2027,
    github_username TEXT DEFAULT '',
    leetcode_username TEXT DEFAULT '',
    target_companies TEXT[] DEFAULT ARRAY['Google', 'Microsoft', 'Amazon', 'Adobe', 'Atlassian'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CGPA & Academic Records Table
CREATE TABLE IF NOT EXISTS public.cgpa_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 10),
    sgpa NUMERIC(4,2) NOT NULL CHECK (sgpa >= 0.0 AND sgpa <= 10.0),
    credits INTEGER NOT NULL DEFAULT 20,
    academic_year TEXT DEFAULT '2024-2025',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_semester UNIQUE (user_id, semester)
);

-- 4. Semester Exam Planner & Revision Schedule
CREATE TABLE IF NOT EXISTS public.exam_planners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TEXT DEFAULT '09:30 AM',
    credits INTEGER DEFAULT 3,
    difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Revising', 'Completed')),
    revision_plan JSONB DEFAULT '[]'::jsonb, -- Array of { day: string, topic: string, done: boolean }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Core CS Subjects Knowledge Matrix
CREATE TABLE IF NOT EXISTS public.core_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL, -- e.g. 'Operating Systems', 'DBMS', 'Computer Networks', 'OOP'
    category TEXT DEFAULT 'Core CS',
    confidence_level INTEGER DEFAULT 3 CHECK (confidence_level >= 1 AND confidence_level <= 5),
    status TEXT DEFAULT 'Learning' CHECK (status IN ('Not Started', 'Learning', 'Confident', 'Mastered')),
    key_topics JSONB DEFAULT '[]'::jsonb, -- [{ name: string, completed: boolean }]
    notes TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_subject UNIQUE (user_id, subject_name)
);

-- 6. Internships & Placement Applications Tracker
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    location TEXT DEFAULT 'Remote / On-site',
    stipend_or_ctc TEXT DEFAULT 'Competitive',
    application_date DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    duration TEXT DEFAULT '2 Months / Summer',
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Online Assessment', 'Interviewing', 'Offered', 'Rejected', 'Completed')),
    rounds_info JSONB DEFAULT '[]'::jsonb, -- [{ roundName: string, date: string, status: string, notes: string }]
    notes TEXT DEFAULT '',
    job_link TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Major Projects Tracker
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_repo_url TEXT NOT NULL,
    live_demo_url TEXT DEFAULT '',
    highlights TEXT[] DEFAULT '{}', -- Key resume bullets
    stars_count INTEGER DEFAULT 0,
    last_pushed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'Completed' CHECK (status IN ('In Progress', 'Completed', 'Deployed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Mistakes-to-Avoid Log (Pre-Interview Wisdom Bank)
CREATE TABLE IF NOT EXISTS public.mistakes_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    context_or_company TEXT NOT NULL, -- e.g. 'Google Mock OA', 'Graph BFS DP Interview'
    mistake_description TEXT NOT NULL,
    lesson_learned TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. External Courses & Certifications
CREATE TABLE IF NOT EXISTS public.external_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('Coursera', 'Infosys Springboard', 'HackerRank', 'Udemy', 'NPTEL', 'AWS/GCP', 'Other')),
    course_title TEXT NOT NULL,
    credential_id TEXT DEFAULT '',
    completion_date DATE DEFAULT CURRENT_DATE,
    certificate_url TEXT DEFAULT '',
    skills_acquired TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Daily Productivity & Study Sessions Log
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('DSA', 'Aptitude', 'Academics', 'Projects', 'Core CS', 'Interview Prep')),
    topic_name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    session_date DATE DEFAULT CURRENT_DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI Generated Study Plans
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_name TEXT NOT NULL,
    total_days INTEGER NOT NULL DEFAULT 7,
    difficulty TEXT DEFAULT 'Medium',
    plan_data JSONB NOT NULL, -- Array of { day: number, title: string, durationHours: number, subtopics: string[], practiceProblems: string[], completed: boolean }
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Aptitude Daily Tracking & Streaks
CREATE TABLE IF NOT EXISTS public.aptitude_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Quantitative', 'Reasoning', 'Verbal')),
    topic_name TEXT NOT NULL,
    completed_date DATE DEFAULT CURRENT_DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_aptitude_day UNIQUE (user_id, category, topic_name, completed_date)
);

-- 13. DSA Problem Solving Progress
CREATE TABLE IF NOT EXISTS public.dsa_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_title TEXT NOT NULL,
    topic_category TEXT NOT NULL, -- 'Arrays', 'Trees', 'DP', etc.
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    platform TEXT DEFAULT 'LeetCode',
    problem_url TEXT DEFAULT '',
    solved_date DATE DEFAULT CURRENT_DATE,
    time_complexity TEXT DEFAULT 'O(n)',
    space_complexity TEXT DEFAULT 'O(1)',
    notes TEXT DEFAULT '',
    code_snippet TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. LinkedIn & Placement Readiness Checklist
CREATE TABLE IF NOT EXISTS public.linkedin_checklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_key TEXT NOT NULL,
    task_title TEXT NOT NULL,
    category TEXT DEFAULT 'Weekly Networking',
    is_completed BOOLEAN DEFAULT FALSE,
    last_completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_task UNIQUE (user_id, task_key)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Each user can only read, insert, update, delete their own data
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cgpa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_checklist ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Helper macro for standard user_id RLS policies
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY[
        'cgpa_records', 'exam_planners', 'core_subjects', 'internships', 
        'projects', 'mistakes_log', 'external_courses', 'study_sessions', 
        'study_plans', 'aptitude_progress', 'dsa_progress', 'linkedin_checklist'
    ])
    LOOP
        EXECUTE format('
            CREATE POLICY "%1$s_select_policy" ON public.%1$s FOR SELECT USING (auth.uid() = user_id);
            CREATE POLICY "%1$s_insert_policy" ON public.%1$s FOR INSERT WITH CHECK (auth.uid() = user_id);
            CREATE POLICY "%1$s_update_policy" ON public.%1$s FOR UPDATE USING (auth.uid() = user_id);
            CREATE POLICY "%1$s_delete_policy" ON public.%1$s FOR DELETE USING (auth.uid() = user_id);
        ', tbl);
    END LOOP;
END $$;

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, avatar_url, github_username, leetcode_username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Engineering Student'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        COALESCE(NEW.raw_user_meta_data->>'user_name', ''),
        ''
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
