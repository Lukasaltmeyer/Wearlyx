-- ─── Reviews ──────────────────────────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  reviewer_id uuid references profiles(id) on delete cascade not null,
  reviewed_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('buyer','seller')),
  rating int not null check (rating between 1 and 5),
  comment text,
  is_deleted boolean default false,
  deleted_by uuid references profiles(id),
  deleted_reason text,
  created_at timestamptz default now()
);
alter table reviews enable row level security;
create policy "anyone can read non-deleted reviews" on reviews for select using (not is_deleted);
create policy "reviewer insert" on reviews for insert with check (auth.uid() = reviewer_id);
create policy "reviewer update own" on reviews for update using (auth.uid() = reviewer_id);

-- ─── Support Tickets ──────────────────────────────────────────────────────────
create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  category text not null default 'other' check (category in ('payment','delivery','bug','account','other')),
  subject text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  admin_note text,
  related_order_id uuid references orders(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table support_tickets enable row level security;
create policy "user see own tickets" on support_tickets for select using (auth.uid() = user_id);
create policy "user insert ticket" on support_tickets for insert with check (auth.uid() = user_id);

-- ─── Bug Reports ──────────────────────────────────────────────────────────────
create table if not exists bug_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id),
  title text not null,
  description text not null,
  category text not null default 'other' check (category in ('ui','payment','auth','messaging','listing','other')),
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  status text not null default 'detected' check (status in ('detected','in_progress','fixed','wont_fix')),
  steps text,
  url text,
  device_info text,
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table bug_reports enable row level security;
create policy "anyone report bug" on bug_reports for insert with check (true);
create policy "reporter see own" on bug_reports for select using (auth.uid() = reporter_id);

-- ─── Admin Reports (signalements) ─────────────────────────────────────────────
create table if not exists admin_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('product','user','review','message')),
  target_id uuid not null,
  reason text not null check (reason in ('spam','inappropriate','counterfeit','scam','harassment','other')),
  description text,
  status text not null default 'pending' check (status in ('pending','reviewed','dismissed','actioned')),
  admin_note text,
  created_at timestamptz default now()
);
alter table admin_reports enable row level security;
create policy "reporter insert" on admin_reports for insert with check (auth.uid() = reporter_id);
create policy "reporter see own" on admin_reports for select using (auth.uid() = reporter_id);
