-- Run this in Supabase SQL editor after startup_projects.sql
-- It grants admin role in profiles table for dashboard access.

with target_user as (
    select
        id,
        email,
        coalesce(raw_user_meta_data->>'full_name', '') as full_name,
        coalesce(raw_user_meta_data->>'phone', '') as phone
    from auth.users
    where lower(email) = lower('shabani_saeid@hotmail.com')
    limit 1
)
insert into public.profiles (id, full_name, phone, email, bio, is_admin, updated_at)
select
    target_user.id,
    target_user.full_name,
    target_user.phone,
    target_user.email,
    '',
    true,
    now()
from target_user
on conflict (id)
do update set
    is_admin = true,
    updated_at = now(),
    email = excluded.email;
