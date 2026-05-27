drop policy if exists "Vendors view all sessions" on public.edtech_sessions;
create policy "Vendors view all sessions" on public.edtech_sessions 
  for select using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'vendor');

drop policy if exists "Vendors update all sessions" on public.edtech_sessions;
create policy "Vendors update all sessions" on public.edtech_sessions 
  for update using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'vendor');
