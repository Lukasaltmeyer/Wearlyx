-- FOLLOWS
create table if not exists follows (
  id          uuid primary key default gen_random_uuid(),
  follower_id uuid references profiles(id) on delete cascade not null,
  following_id uuid references profiles(id) on delete cascade not null,
  created_at  timestamptz default now(),
  unique(follower_id, following_id)
);

alter table follows enable row level security;

create policy "follows viewable by all" on follows for select using (true);
create policy "users can follow" on follows for insert with check (auth.uid() = follower_id);
create policy "users can unfollow" on follows for delete using (auth.uid() = follower_id);

-- Columns on profiles for cached counts
alter table profiles add column if not exists followers_count int default 0;
alter table profiles add column if not exists following_count int default 0;

-- Trigger to keep counts in sync
create or replace function update_follow_counts()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update profiles set followers_count = followers_count + 1 where id = new.following_id;
    update profiles set following_count = following_count + 1 where id = new.follower_id;
  elsif tg_op = 'DELETE' then
    update profiles set followers_count = greatest(followers_count - 1, 0) where id = old.following_id;
    update profiles set following_count = greatest(following_count - 1, 0) where id = old.follower_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_follow_change on follows;
create trigger on_follow_change
  after insert or delete on follows
  for each row execute procedure update_follow_counts();
