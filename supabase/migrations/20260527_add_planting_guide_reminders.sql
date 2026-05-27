create table if not exists public.planting_guide_reminders (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plant_id text not null,
  plant_label text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_planting_guide_reminders_updated_at on public.planting_guide_reminders;
create trigger set_planting_guide_reminders_updated_at
before update on public.planting_guide_reminders
for each row
execute function public.set_updated_at();

alter table public.planting_guide_reminders enable row level security;

drop policy if exists "planting_guide_reminders_select_own" on public.planting_guide_reminders;
create policy "planting_guide_reminders_select_own"
on public.planting_guide_reminders
for select
using (auth.uid() = user_id);

drop policy if exists "planting_guide_reminders_insert_own" on public.planting_guide_reminders;
create policy "planting_guide_reminders_insert_own"
on public.planting_guide_reminders
for insert
with check (auth.uid() = user_id);

drop policy if exists "planting_guide_reminders_update_own" on public.planting_guide_reminders;
create policy "planting_guide_reminders_update_own"
on public.planting_guide_reminders
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
