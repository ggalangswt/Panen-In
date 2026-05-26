create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  kabupaten text,
  preferred_plants text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  notifications_enabled boolean not null default true,
  weather_morning boolean not null default true,
  weather_alert boolean not null default false,
  planting_reminder boolean not null default true,
  fertilizer_reminder boolean not null default true,
  harvest_reminder boolean not null default false,
  weekly_ai_tips boolean not null default true,
  morning_hour smallint not null default 6 check (morning_hour between 4 and 9),
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_notification_settings_updated_at on public.notification_settings;
create trigger set_notification_settings_updated_at
before update on public.notification_settings
for each row
execute function public.set_updated_at();

alter table public.cuaca_cache
add column if not exists kabupaten_normalized text;

update public.cuaca_cache
set kabupaten_normalized = lower(regexp_replace(trim(kabupaten), '\s+', ' ', 'g'))
where kabupaten is not null and (kabupaten_normalized is null or kabupaten_normalized = '');

create unique index if not exists cuaca_cache_user_kabupaten_normalized_idx
on public.cuaca_cache (user_id, kabupaten_normalized);

alter table public.profiles enable row level security;
alter table public.notification_settings enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "notification_settings_select_own" on public.notification_settings;
create policy "notification_settings_select_own"
on public.notification_settings
for select
using (auth.uid() = user_id);

drop policy if exists "notification_settings_insert_own" on public.notification_settings;
create policy "notification_settings_insert_own"
on public.notification_settings
for insert
with check (auth.uid() = user_id);

drop policy if exists "notification_settings_update_own" on public.notification_settings;
create policy "notification_settings_update_own"
on public.notification_settings
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
