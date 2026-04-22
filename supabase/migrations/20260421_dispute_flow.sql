-- Dispute flow v2: types, photos, solution tracking
alter table disputes
  add column if not exists dispute_type text,
  add column if not exists photos       text[] default '{}',
  add column if not exists user_solution text,
  add column if not exists solution_note text;

-- Bug reports: accessible to users from their profile
-- (table already created in admin_extensions, just ensure RLS allows user insert)
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bug_reports' and policyname = 'Users can insert bug reports'
  ) then
    create policy "Users can insert bug reports"
      on bug_reports for insert
      to authenticated
      with check (reporter_id = auth.uid());
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bug_reports' and policyname = 'Users can view own bug reports'
  ) then
    create policy "Users can view own bug reports"
      on bug_reports for select
      to authenticated
      using (reporter_id = auth.uid());
  end if;
end $$;
