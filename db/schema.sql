-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text not null,
  category text not null, -- event-committee, live-streaming, motion-graphics, photography, videography, web-app, landing-page, design, other
  tags text[] default array[]::text[], -- ["Next.js", "Tailwind", "Framer Motion"]
  thumbnail_url text,
  demo_url text,
  repo_url text,
  featured boolean default false,
  order_index integer,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- EDUCATION TABLE
-- ============================================================================
create table if not exists public.education (
  id uuid primary key default uuid_generate_v4(),
  school text not null,
  degree text not null, -- "RPL", "S1", etc.
  field text not null, -- "Software Engineering", etc.
  start_date date,
  end_date date,
  description text,
  is_current boolean default false,
  order_index integer,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================
create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  date date not null,
  category text not null, -- "competition", "award", "publication", "milestone"
  url text, -- link to achievement
  order_index integer,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- SKILLS TABLE
-- ============================================================================
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  category text not null, -- "frontend", "backend", "tools", "design", "multimedia"
  proficiency text, -- "beginner", "intermediate", "advanced", "expert"
  order_index integer,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  price_range text, -- "5jt-10jt", "10jt-20jt", "custom"
  icon_name text, -- lucide icon name
  order_index integer,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- ANALYTICS_EVENTS TABLE
-- ============================================================================
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null, -- "page_view", "cta_click", "contact_form", "download"
  page_path text,
  user_id text, -- optional, for tracking if identified
  metadata jsonb, -- flexible data {button: "cta_whatsapp", project_id: "xxx", etc}
  created_at timestamp default now()
);

-- ============================================================================
-- INDEXES for query performance
-- ============================================================================
create index idx_projects_slug on public.projects(slug);
create index idx_projects_featured on public.projects(featured) where featured = true;
create index idx_projects_order on public.projects(order_index);
create index idx_education_current on public.education(is_current) where is_current = true;
create index idx_skills_category on public.skills(category);
create index idx_analytics_event_type on public.analytics_events(event_type);
create index idx_analytics_created_at on public.analytics_events(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Projects: public read, auth-only write
alter table public.projects enable row level security;
create policy "projects_public_read" on public.projects for select using (true);
create policy "projects_auth_write" on public.projects for insert to authenticated with check (auth.role() = 'authenticated');
create policy "projects_auth_update" on public.projects for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "projects_auth_delete" on public.projects for delete to authenticated using (auth.role() = 'authenticated');

-- Education: public read, auth-only write
alter table public.education enable row level security;
create policy "education_public_read" on public.education for select using (true);
create policy "education_auth_write" on public.education for insert to authenticated with check (auth.role() = 'authenticated');
create policy "education_auth_update" on public.education for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "education_auth_delete" on public.education for delete to authenticated using (auth.role() = 'authenticated');

-- Achievements: public read, auth-only write
alter table public.achievements enable row level security;
create policy "achievements_public_read" on public.achievements for select using (true);
create policy "achievements_auth_write" on public.achievements for insert to authenticated with check (auth.role() = 'authenticated');
create policy "achievements_auth_update" on public.achievements for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "achievements_auth_delete" on public.achievements for delete to authenticated using (auth.role() = 'authenticated');

-- Skills: public read, auth-only write
alter table public.skills enable row level security;
create policy "skills_public_read" on public.skills for select using (true);
create policy "skills_auth_write" on public.skills for insert to authenticated with check (auth.role() = 'authenticated');
create policy "skills_auth_update" on public.skills for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "skills_auth_delete" on public.skills for delete to authenticated using (auth.role() = 'authenticated');

-- Services: public read, auth-only write
alter table public.services enable row level security;
create policy "services_public_read" on public.services for select using (true);
create policy "services_auth_write" on public.services for insert to authenticated with check (auth.role() = 'authenticated');
create policy "services_auth_update" on public.services for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "services_auth_delete" on public.services for delete to authenticated using (auth.role() = 'authenticated');

-- Analytics: public write (no auth needed for tracking), auth-only read
alter table public.analytics_events enable row level security;
create policy "analytics_public_write" on public.analytics_events for insert to anon, authenticated with check (true);
create policy "analytics_auth_read" on public.analytics_events for select to authenticated using (auth.role() = 'authenticated');

-- ============================================================================
-- GRANT DATA API ACCESS
-- ============================================================================
-- Make tables accessible via Supabase REST API for anon and authenticated roles
grant select on public.projects to anon, authenticated;
grant select on public.education to anon, authenticated;
grant select on public.achievements to anon, authenticated;
grant select on public.skills to anon, authenticated;
grant select on public.services to anon, authenticated;

grant insert, select on public.analytics_events to anon, authenticated;
grant select on public.analytics_events to authenticated;

-- Auth users can manage their content
grant insert, update, delete on public.projects to authenticated;
grant insert, update, delete on public.education to authenticated;
grant insert, update, delete on public.achievements to authenticated;
grant insert, update, delete on public.skills to authenticated;
grant insert, update, delete on public.services to authenticated;
