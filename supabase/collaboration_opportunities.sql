-- Run this SQL in Supabase SQL editor.
-- It creates per-project collaboration opportunities with admin-only write access.

create table if not exists public.project_collaboration_opportunities (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references public.startup_projects(slug) on delete cascade,
  opportunity_key text not null,
  title_fa text not null,
  title_en text not null,
  subtitle_fa text not null,
  subtitle_en text not null,
  is_enabled boolean not null default true,
  display_order integer not null default 0,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_project_opportunity unique (project_slug, opportunity_key)
);

create index if not exists idx_project_collab_project_slug
  on public.project_collaboration_opportunities(project_slug);

create index if not exists idx_project_collab_enabled_order
  on public.project_collaboration_opportunities(project_slug, is_enabled, display_order);

alter table public.project_collaboration_opportunities enable row level security;

drop policy if exists "public can read enabled collaboration opportunities" on public.project_collaboration_opportunities;
create policy "public can read enabled collaboration opportunities"
  on public.project_collaboration_opportunities
  for select
  using (is_enabled = true);

drop policy if exists "admins can manage collaboration opportunities" on public.project_collaboration_opportunities;
create policy "admins can manage collaboration opportunities"
  on public.project_collaboration_opportunities
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
