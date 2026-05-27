-- 1. Create the new base table specifically for the payments tracker
create table if not exists public.edtech_sessions (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  type text not null,
  hours numeric not null,
  amount numeric not null,
  status text not null default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id),
  start_time timestamp with time zone,
  paid_at timestamp with time zone
);

-- 2. Enable Row Level Security
alter table public.edtech_sessions enable row level security;

-- 3. Add Policies
drop policy if exists "Teachers view own sessions" on public.edtech_sessions;
create policy "Teachers view own sessions" on public.edtech_sessions 
  for select using (auth.uid() = user_id);

drop policy if exists "Teachers insert own sessions" on public.edtech_sessions;
create policy "Teachers insert own sessions" on public.edtech_sessions 
  for insert with check (auth.uid() = user_id);

drop policy if exists "Teachers update own sessions" on public.edtech_sessions;
create policy "Teachers update own sessions" on public.edtech_sessions 
  for update using (auth.uid() = user_id);

drop policy if exists "Vendors view all sessions" on public.edtech_sessions;
create policy "Vendors view all sessions" on public.edtech_sessions 
  for select using ((select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'vendor');

drop policy if exists "Vendors update all sessions" on public.edtech_sessions;
create policy "Vendors update all sessions" on public.edtech_sessions 
  for update using ((select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'vendor');
