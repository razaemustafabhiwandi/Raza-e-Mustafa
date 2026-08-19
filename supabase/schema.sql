-- Raza-e-Mustafa: Rabi-ul-Awwal Ibadat Counter
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query > paste > Run).

create extension if not exists "pgcrypto";

-- Community members. Login is phone + a 4-6 digit Security PIN (bcrypt hashed
-- in pin_hash, never stored in plain text). A browser also holds its own
-- profile id after a successful login (see lib/profile-session.ts).
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  address text,
  pin_hash text,
  created_at timestamptz not null default now()
);

-- One row per "I read X, add N to my count" submission.
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('durood', 'kalimah', 'para', 'surah')),
  count integer not null check (count > 0),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists entries_profile_id_idx on public.entries(profile_id);
create index if not exists entries_type_idx on public.entries(type);

-- Admin-posted announcements shown to everyone.
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- Marks which Supabase Auth users are allowed into /admin.
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Lock every table down by default. All reads/writes go through the Next.js
-- API routes using the server-side secret key, so no public policies are needed.
alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.announcements enable row level security;
alter table public.admins enable row level security;

-- ---------------------------------------------------------------------------
-- One-time setup after running this file: create your first admin.
-- 1. Dashboard > Authentication > Users > Add user (email + password).
-- 2. Copy that user's UID, then run:
--    insert into public.admins (id) values ('<paste-the-uid-here>');
-- ---------------------------------------------------------------------------
