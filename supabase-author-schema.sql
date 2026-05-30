-- supabase-author-schema.sql
-- Tabelle dedicate per author.abissoinfinito.it
-- Da eseguire nel progetto Supabase dove già vive la musical app.

create extension if not exists pgcrypto;

create table if not exists public.author_allowed_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  role text not null default 'Autore',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.author_chapter_texts (
  chapter_key text primary key,
  content text not null default '',
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.author_text_versions (
  id uuid primary key default gen_random_uuid(),
  chapter_key text not null,
  content text not null default '',
  edited_by text,
  edit_note text,
  created_at timestamptz not null default now()
);

create index if not exists author_text_versions_chapter_key_created_at_idx
  on public.author_text_versions (chapter_key, created_at desc);

create table if not exists public.author_comments (
  id uuid primary key default gen_random_uuid(),
  chapter_key text not null,
  parent_id uuid references public.author_comments(id) on delete cascade,
  author text not null,
  role text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists author_comments_chapter_key_created_at_idx
  on public.author_comments (chapter_key, created_at asc);

create or replace function public.is_author_allowed()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.author_allowed_users au
    where lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and au.is_active = true
  );
$$;

create or replace function public.is_author_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.author_allowed_users au
    where lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and au.is_active = true
      and lower(au.role) in ('admin', 'owner', 'revisore')
  );
$$;

alter table public.author_allowed_users enable row level security;
alter table public.author_chapter_texts enable row level security;
alter table public.author_text_versions enable row level security;
alter table public.author_comments enable row level security;

drop policy if exists "author_allowed_users_select_self" on public.author_allowed_users;
create policy "author_allowed_users_select_self"
on public.author_allowed_users
for select
to authenticated
using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_author_admin()
);

drop policy if exists "author_allowed_users_admin_all" on public.author_allowed_users;
create policy "author_allowed_users_admin_all"
on public.author_allowed_users
for all
to authenticated
using (public.is_author_admin())
with check (public.is_author_admin());

drop policy if exists "author_texts_select_allowed" on public.author_chapter_texts;
create policy "author_texts_select_allowed"
on public.author_chapter_texts
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_texts_insert_allowed" on public.author_chapter_texts;
create policy "author_texts_insert_allowed"
on public.author_chapter_texts
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_texts_update_allowed" on public.author_chapter_texts;
create policy "author_texts_update_allowed"
on public.author_chapter_texts
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_versions_select_allowed" on public.author_text_versions;
create policy "author_versions_select_allowed"
on public.author_text_versions
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_versions_insert_allowed" on public.author_text_versions;
create policy "author_versions_insert_allowed"
on public.author_text_versions
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_comments_select_allowed" on public.author_comments;
create policy "author_comments_select_allowed"
on public.author_comments
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_comments_insert_allowed" on public.author_comments;
create policy "author_comments_insert_allowed"
on public.author_comments
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_comments_update_allowed" on public.author_comments;
create policy "author_comments_update_allowed"
on public.author_comments
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_comments_delete_allowed" on public.author_comments;
create policy "author_comments_delete_allowed"
on public.author_comments
for delete
to authenticated
using (public.is_author_allowed());

-- Esempio: autorizza il tuo account e quello dell'autore.
-- insert into public.author_allowed_users (email, display_name, role)
-- values
--   ('tua-email@example.com', 'Angelo', 'Admin'),
--   ('email-autore@example.com', 'Autore', 'Autore')
-- on conflict (email) do update
-- set display_name = excluded.display_name,
--     role = excluded.role,
--     is_active = true;
