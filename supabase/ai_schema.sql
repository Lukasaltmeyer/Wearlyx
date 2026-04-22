-- AI generations table
create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  style text,
  generated_title text,
  generated_description text,
  generated_price numeric(10,2),
  created_at timestamptz default now()
);

-- User limits table
create table if not exists public.user_limits (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  plan text not null default 'free',
  ai_used int not null default 0,
  reset_date date not null default (current_date + interval '1 month')
);

-- RLS ai_generations
alter table public.ai_generations enable row level security;

create policy "Users see own generations"
  on public.ai_generations for select
  using (auth.uid() = user_id);

create policy "Users insert own generations"
  on public.ai_generations for insert
  with check (auth.uid() = user_id);

-- RLS user_limits
alter table public.user_limits enable row level security;

create policy "Users see own limits"
  on public.user_limits for select
  using (auth.uid() = user_id);

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Anyone can view product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'products' and auth.role() = 'authenticated');
