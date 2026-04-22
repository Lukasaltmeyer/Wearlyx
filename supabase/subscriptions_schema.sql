-- user_usage table
create table if not exists public.user_usage (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  plan           text not null default 'free',
  ai_photos_used int not null default 0,
  boost_used     int not null default 0,
  reset_date     date not null default (current_date + interval '1 month')
);

alter table public.user_usage enable row level security;

create policy "Users see own usage"
  on public.user_usage for select
  using (auth.uid() = user_id);

create policy "Users update own usage"
  on public.user_usage for update
  using (auth.uid() = user_id);

create policy "Users insert own usage"
  on public.user_usage for insert
  with check (auth.uid() = user_id);

-- subscriptions table
create table if not exists public.subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  plan        text not null default 'free',
  ai_limit    int,
  boost_limit int,
  start_date  timestamptz default now(),
  end_date    timestamptz,
  status      text not null default 'active',
  created_at  timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users see own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users insert own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- RPC to safely increment AI photos used
create or replace function public.increment_ai_photos_used(uid uuid, amount int default 1)
returns void as $$
begin
  insert into public.user_usage (user_id, ai_photos_used)
  values (uid, amount)
  on conflict (user_id) do update
  set ai_photos_used = public.user_usage.ai_photos_used + amount;
end;
$$ language plpgsql security definer;

-- RPC to increment boost used
create or replace function public.increment_boost_used(uid uuid, amount int default 1)
returns void as $$
begin
  insert into public.user_usage (user_id, boost_used)
  values (uid, amount)
  on conflict (user_id) do update
  set boost_used = public.user_usage.boost_used + amount;
end;
$$ language plpgsql security definer;
