-- ============================================================
-- WEARLYX — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  username    text unique not null,
  full_name   text,
  avatar_url  text,
  bio         text,
  location    text,
  website     text,
  rating      numeric(3,2) default 5.0,
  sales_count int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================================
-- PRODUCTS
-- ============================================================
create type product_condition as enum ('new', 'like_new', 'good', 'fair');
create type product_status as enum ('active', 'sold', 'reserved', 'deleted');

create table public.products (
  id          uuid default uuid_generate_v4() primary key,
  seller_id   uuid references public.profiles(id) on delete cascade not null,
  title       text not null,
  description text,
  price       numeric(10,2) not null check (price >= 0),
  images      text[] default '{}',
  category    text not null,
  size        text,
  brand       text,
  condition   product_condition not null default 'good',
  status      product_status not null default 'active',
  views       int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select using (status != 'deleted');

create policy "Sellers can insert their own products"
  on public.products for insert with check (auth.uid() = seller_id);

create policy "Sellers can update their own products"
  on public.products for update using (auth.uid() = seller_id);

create policy "Sellers can delete their own products"
  on public.products for delete using (auth.uid() = seller_id);

-- ============================================================
-- LIKES
-- ============================================================
create table public.likes (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.likes enable row level security;

create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Users can manage their own likes"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- ============================================================
-- SAVED ITEMS
-- ============================================================
create table public.saved_items (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.saved_items enable row level security;

create policy "Users can view their own saved items"
  on public.saved_items for select using (auth.uid() = user_id);

create policy "Users can insert their own saved items"
  on public.saved_items for insert with check (auth.uid() = user_id);

create policy "Users can delete their own saved items"
  on public.saved_items for delete using (auth.uid() = user_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
create table public.conversations (
  id         uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete set null,
  buyer_id   uuid references public.profiles(id) on delete cascade not null,
  seller_id  uuid references public.profiles(id) on delete cascade not null,
  last_message text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(product_id, buyer_id, seller_id)
);

alter table public.conversations enable row level security;

create policy "Participants can view their conversations"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can create conversations"
  on public.conversations for insert
  with check (auth.uid() = buyer_id);

create policy "Participants can update conversations"
  on public.conversations for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id              uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id       uuid references public.profiles(id) on delete cascade not null,
  content         text not null,
  read            boolean default false,
  created_at      timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Participants can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('products', 'products', true)
  on conflict do nothing;

insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict do nothing;

create policy "Anyone can view product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update updated_at on products
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Update conversation last_message
create or replace function public.handle_new_message()
returns trigger as $$
begin
  update public.conversations
  set last_message = new.content,
      last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_new_message
  after insert on public.messages
  for each row execute procedure public.handle_new_message();
