-- Run this SQL in Supabase SQL editor.
-- It provisions storage for project logos and secure admin write policies.

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do update
set public = true;

drop policy if exists "public can read project assets" on storage.objects;
create policy "public can read project assets"
  on storage.objects
  for select
  to public
  using (bucket_id = 'project-assets');

drop policy if exists "admins can upload project assets" on storage.objects;
create policy "admins can upload project assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'project-assets'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

drop policy if exists "admins can update project assets" on storage.objects;
create policy "admins can update project assets"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'project-assets'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  )
  with check (
    bucket_id = 'project-assets'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

drop policy if exists "admins can delete project assets" on storage.objects;
create policy "admins can delete project assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'project-assets'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
