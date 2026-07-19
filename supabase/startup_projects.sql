-- Run this SQL in Supabase SQL editor.
-- It creates the admin-managed projects table and secure RLS policies.

create table if not exists public.startup_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  los_status text not null,
  description text not null,
  benefits text[] not null default '{}',
  sector text not null,
  required_roles text not null,
  show_designated_org boolean not null default false,
  designated_org_type text,
  current_phase text not null,
  available_countries text not null,
  logo_path text,
  website_url text,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint designated_org_required_when_visible
    check (
      show_designated_org = false
      or (show_designated_org = true and designated_org_type is not null and length(trim(designated_org_type)) > 0)
    )
);

create index if not exists idx_startup_projects_published_order
  on public.startup_projects (is_published, display_order, created_at desc);

create index if not exists idx_startup_projects_slug
  on public.startup_projects (slug);

alter table if exists public.startup_projects
  add column if not exists logo_path text;

alter table if exists public.startup_projects
  add column if not exists website_url text;

-- Optional admin flag on profiles table.
alter table if exists public.profiles
  add column if not exists is_admin boolean not null default false;

alter table public.startup_projects enable row level security;

-- Public read for published projects.
drop policy if exists "public can read published startup projects" on public.startup_projects;
create policy "public can read published startup projects"
  on public.startup_projects
  for select
  using (is_published = true);

-- Admin full access.
drop policy if exists "admins can manage startup projects" on public.startup_projects;
create policy "admins can manage startup projects"
  on public.startup_projects
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
