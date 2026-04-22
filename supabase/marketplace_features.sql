-- ============================================================
-- MARKETPLACE FEATURES — offers, orders, shipments, disputes, notifications
-- Run this in Supabase SQL editor
-- ============================================================

-- OFFERS
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  buyer_id uuid references profiles(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,
  amount numeric(10,2) not null,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','refused','countered','expired')),
  counter_amount numeric(10,2),
  counter_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table offers enable row level security;
create policy "users see own offers" on offers for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "buyer insert offer" on offers for insert with check (auth.uid() = buyer_id);
create policy "seller update offer" on offers for update using (auth.uid() = seller_id or auth.uid() = buyer_id);

-- ORDERS
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) not null,
  buyer_id uuid references profiles(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,
  offer_id uuid references offers(id),
  amount numeric(10,2) not null,
  protection_fee numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','in_transit','delivered','dispute','cancelled','refunded')),
  shipping_mode text not null default 'home' check (shipping_mode in ('home','relay','locker')),
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table orders enable row level security;
create policy "users see own orders" on orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "buyer insert order" on orders for insert with check (auth.uid() = buyer_id);
create policy "parties update order" on orders for update using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- SHIPMENTS
create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  tracking_number text,
  carrier text,
  mode text not null default 'home' check (mode in ('home','relay','locker')),
  relay_name text,
  relay_address text,
  locker_id text,
  status text not null default 'pending' check (status in ('pending','prepared','dropped','in_transit','out_for_delivery','delivered','failed')),
  estimated_delivery date,
  delivered_at timestamptz,
  events jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table shipments enable row level security;
create policy "parties see shipment" on shipments for select using (
  exists (select 1 from orders where orders.id = shipments.order_id and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid()))
);
create policy "seller manage shipment" on shipments for all using (
  exists (select 1 from orders where orders.id = shipments.order_id and orders.seller_id = auth.uid())
);

-- DISPUTES
create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  opened_by uuid references profiles(id) on delete cascade not null,
  reason text not null check (reason in ('not_received','not_as_described','wrong_item','damaged','seller_inactive','delivery_issue','other')),
  description text not null,
  photos text[] default '{}',
  status text not null default 'open' check (status in ('open','under_review','resolved','refunded','rejected')),
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table disputes enable row level security;
create policy "parties see dispute" on disputes for select using (
  auth.uid() = opened_by or exists (select 1 from orders where orders.id = disputes.order_id and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid()))
);
create policy "user open dispute" on disputes for insert with check (auth.uid() = opened_by);

-- NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('offer_received','offer_accepted','offer_refused','offer_countered','order_confirmed','order_shipped','order_delivered','dispute_opened','dispute_resolved','new_message')),
  title text not null,
  body text not null,
  data jsonb default '{}'::jsonb,
  read boolean default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;
create policy "user see own notifs" on notifications for select using (auth.uid() = user_id);
create policy "system insert notif" on notifications for insert with check (true);
create policy "user update notif" on notifications for update using (auth.uid() = user_id);
