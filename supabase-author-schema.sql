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

create table if not exists public.author_quest_texts (
  text_key text primary key,
  source_file text not null,
  source_id text not null,
  group_key text not null,
  entity_key text not null,
  field_path text not null,
  field_name text not null,
  provisional_text text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists author_quest_texts_source_entity_idx
  on public.author_quest_texts (source_id, group_key, entity_key);

create table if not exists public.author_quest_text_versions (
  id uuid primary key default gen_random_uuid(),
  text_key text not null,
  content text not null default '',
  edited_by text,
  created_at timestamptz not null default now()
);

create index if not exists author_quest_text_versions_key_created_idx
  on public.author_quest_text_versions (text_key, created_at desc);

-- Questa tabella contiene solo testi approvati e può essere letta dal gioco
-- senza condividere sessioni o credenziali tra i due progetti Supabase.
create table if not exists public.author_published_quest_texts (
  text_key text primary key,
  source_file text not null,
  source_id text not null,
  group_key text not null,
  entity_key text not null,
  field_path text not null,
  field_name text not null,
  content text not null,
  published_by text,
  published_at timestamptz not null default now()
);

create index if not exists author_published_quest_texts_source_entity_idx
  on public.author_published_quest_texts (source_id, group_key, entity_key);

create table if not exists public.author_weapon_texts (
  text_key text primary key,
  source_file text not null,
  character_key text not null,
  character_label text not null,
  weapon_id text not null,
  weapon_name text not null,
  provisional_text text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists author_weapon_texts_character_weapon_idx
  on public.author_weapon_texts (character_key, weapon_id);

create table if not exists public.author_weapon_text_versions (
  id uuid primary key default gen_random_uuid(),
  text_key text not null,
  content text not null default '',
  edited_by text,
  created_at timestamptz not null default now()
);

create index if not exists author_weapon_text_versions_key_created_idx
  on public.author_weapon_text_versions (text_key, created_at desc);

create table if not exists public.author_published_weapon_texts (
  text_key text primary key,
  source_file text not null,
  character_key text not null,
  character_label text not null,
  weapon_id text not null,
  weapon_name text not null,
  content text not null,
  published_by text,
  published_at timestamptz not null default now()
);

create index if not exists author_published_weapon_texts_character_weapon_idx
  on public.author_published_weapon_texts (character_key, weapon_id);

create table if not exists public.author_creature_texts (
  text_key text primary key,
  source_file text not null,
  creature_id text not null,
  creature_name text not null,
  element text,
  nature text,
  category text,
  vehicles text[] not null default '{}'::text[],
  provisional_text text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists author_creature_texts_creature_idx
  on public.author_creature_texts (creature_id);

create table if not exists public.author_creature_text_versions (
  id uuid primary key default gen_random_uuid(),
  text_key text not null,
  content text not null default '',
  edited_by text,
  created_at timestamptz not null default now()
);

create index if not exists author_creature_text_versions_key_created_idx
  on public.author_creature_text_versions (text_key, created_at desc);

create table if not exists public.author_published_creature_texts (
  text_key text primary key,
  source_file text not null,
  creature_id text not null,
  creature_name text not null,
  element text,
  nature text,
  category text,
  vehicles text[] not null default '{}'::text[],
  content text not null,
  published_by text,
  published_at timestamptz not null default now()
);

create index if not exists author_published_creature_texts_creature_idx
  on public.author_published_creature_texts (creature_id);

create table if not exists public.author_zone_guardian_texts (
  text_key text primary key,
  source_file text not null,
  map_key text not null,
  zone_key text not null,
  zone_label text not null,
  guardian_key text not null,
  guardian_name text not null,
  guardian_title text,
  guardian_full_name text,
  image text,
  provisional_text text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists author_zone_guardian_texts_zone_idx
  on public.author_zone_guardian_texts (map_key, zone_key);

create table if not exists public.author_zone_guardian_text_versions (
  id uuid primary key default gen_random_uuid(),
  text_key text not null,
  content text not null default '',
  edited_by text,
  created_at timestamptz not null default now()
);

create index if not exists author_zone_guardian_text_versions_key_created_idx
  on public.author_zone_guardian_text_versions (text_key, created_at desc);

create table if not exists public.author_published_zone_guardian_texts (
  text_key text primary key,
  source_file text not null,
  map_key text not null,
  zone_key text not null,
  zone_label text not null,
  guardian_key text not null,
  guardian_name text not null,
  guardian_title text,
  guardian_full_name text,
  image text,
  content text not null,
  published_by text,
  published_at timestamptz not null default now()
);

create index if not exists author_published_zone_guardian_texts_zone_idx
  on public.author_published_zone_guardian_texts (map_key, zone_key);

create table if not exists public.author_fragment_texts (
  text_key text primary key,
  source_file text not null,
  fragment_id text not null,
  fragment_name text not null,
  origin_monster_id text,
  origin_type text,
  fragment_class text,
  difficulty_tier text,
  spiritual_tier text,
  image text,
  rewards jsonb not null default '{}'::jsonb,
  provisional_text text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists author_fragment_texts_fragment_idx
  on public.author_fragment_texts (fragment_id);

create index if not exists author_fragment_texts_class_idx
  on public.author_fragment_texts (fragment_class);

create table if not exists public.author_fragment_text_versions (
  id uuid primary key default gen_random_uuid(),
  text_key text not null,
  content text not null default '',
  edited_by text,
  created_at timestamptz not null default now()
);

create index if not exists author_fragment_text_versions_key_created_idx
  on public.author_fragment_text_versions (text_key, created_at desc);

create table if not exists public.author_published_fragment_texts (
  text_key text primary key,
  source_file text not null,
  fragment_id text not null,
  fragment_name text not null,
  origin_monster_id text,
  origin_type text,
  fragment_class text,
  difficulty_tier text,
  spiritual_tier text,
  image text,
  rewards jsonb not null default '{}'::jsonb,
  content text not null,
  published_by text,
  published_at timestamptz not null default now()
);

create index if not exists author_published_fragment_texts_fragment_idx
  on public.author_published_fragment_texts (fragment_id);

create index if not exists author_published_fragment_texts_class_idx
  on public.author_published_fragment_texts (fragment_class);

create table if not exists public.author_modal_texts (
  text_key text primary key,
  source_file text not null,
  modal_id text not null,
  modal_label text not null,
  category text,
  field_key text not null,
  field_label text not null,
  text_type text,
  item_key text,
  item_label text,
  image text,
  metadata jsonb not null default '{}'::jsonb,
  provisional_text text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists author_modal_texts_modal_idx
  on public.author_modal_texts (modal_id);

create index if not exists author_modal_texts_field_idx
  on public.author_modal_texts (modal_id, field_key);

create index if not exists author_modal_texts_item_idx
  on public.author_modal_texts (modal_id, item_key);

create table if not exists public.author_modal_text_versions (
  id uuid primary key default gen_random_uuid(),
  text_key text not null,
  content text not null default '',
  edited_by text,
  created_at timestamptz not null default now()
);

create index if not exists author_modal_text_versions_key_created_idx
  on public.author_modal_text_versions (text_key, created_at desc);

create table if not exists public.author_published_modal_texts (
  text_key text primary key,
  source_file text not null,
  modal_id text not null,
  modal_label text not null,
  category text,
  field_key text not null,
  field_label text not null,
  text_type text,
  item_key text,
  item_label text,
  image text,
  metadata jsonb not null default '{}'::jsonb,
  content text not null,
  published_by text,
  published_at timestamptz not null default now()
);

create index if not exists author_published_modal_texts_modal_idx
  on public.author_published_modal_texts (modal_id);

create index if not exists author_published_modal_texts_field_idx
  on public.author_published_modal_texts (modal_id, field_key);

create index if not exists author_published_modal_texts_item_idx
  on public.author_published_modal_texts (modal_id, item_key);

-- Planner mappe / collegamenti minimappe: un unico documento JSON per mappa
-- (data = { rooms: {...}, edges: [...] }). Nessun versioning ne pubblicazione.
create table if not exists public.author_map_documents (
  map_key    text primary key,
  data       jsonb not null default '{"rooms":{},"edges":[]}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now()
);

-- Player "Nona Ora": catalogo personaggi giocanti, un text_key per blocco
-- editoriale (personaggio, caratteristica, dotazione, background, aspetto,
-- parentele, libero). Stesso schema di author_quest_texts.
create table if not exists public.author_player_texts (
  text_key text primary key,
  player_id text not null,
  player_name text not null,
  field_key text not null,
  field_label text not null,
  provisional_text text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists author_player_texts_player_idx
  on public.author_player_texts (player_id, field_key);

create table if not exists public.author_player_text_versions (
  id uuid primary key default gen_random_uuid(),
  text_key text not null,
  content text not null default '',
  edited_by text,
  created_at timestamptz not null default now()
);

create index if not exists author_player_text_versions_key_created_idx
  on public.author_player_text_versions (text_key, created_at desc);

create table if not exists public.author_published_player_texts (
  text_key text primary key,
  player_id text not null,
  player_name text not null,
  field_key text not null,
  field_label text not null,
  content text not null,
  published_by text,
  published_at timestamptz not null default now()
);

create index if not exists author_published_player_texts_player_idx
  on public.author_published_player_texts (player_id, field_key);

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
alter table public.author_quest_texts enable row level security;
alter table public.author_quest_text_versions enable row level security;
alter table public.author_published_quest_texts enable row level security;
alter table public.author_weapon_texts enable row level security;
alter table public.author_weapon_text_versions enable row level security;
alter table public.author_published_weapon_texts enable row level security;
alter table public.author_creature_texts enable row level security;
alter table public.author_creature_text_versions enable row level security;
alter table public.author_published_creature_texts enable row level security;
alter table public.author_zone_guardian_texts enable row level security;
alter table public.author_zone_guardian_text_versions enable row level security;
alter table public.author_published_zone_guardian_texts enable row level security;
alter table public.author_fragment_texts enable row level security;
alter table public.author_fragment_text_versions enable row level security;
alter table public.author_published_fragment_texts enable row level security;
alter table public.author_modal_texts enable row level security;
alter table public.author_modal_text_versions enable row level security;
alter table public.author_published_modal_texts enable row level security;
alter table public.author_map_documents enable row level security;
alter table public.author_player_texts enable row level security;
alter table public.author_player_text_versions enable row level security;
alter table public.author_published_player_texts enable row level security;

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

drop policy if exists "author_quest_texts_select_allowed" on public.author_quest_texts;
create policy "author_quest_texts_select_allowed"
on public.author_quest_texts
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_quest_texts_insert_allowed" on public.author_quest_texts;
create policy "author_quest_texts_insert_allowed"
on public.author_quest_texts
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_quest_texts_update_allowed" on public.author_quest_texts;
create policy "author_quest_texts_update_allowed"
on public.author_quest_texts
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_quest_versions_select_allowed" on public.author_quest_text_versions;
create policy "author_quest_versions_select_allowed"
on public.author_quest_text_versions
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_quest_versions_insert_allowed" on public.author_quest_text_versions;
create policy "author_quest_versions_insert_allowed"
on public.author_quest_text_versions
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "published_quest_texts_public_read" on public.author_published_quest_texts;
create policy "published_quest_texts_public_read"
on public.author_published_quest_texts
for select
to anon, authenticated
using (true);

drop policy if exists "published_quest_texts_admin_insert" on public.author_published_quest_texts;
create policy "published_quest_texts_admin_insert"
on public.author_published_quest_texts
for insert
to authenticated
with check (public.is_author_admin());

drop policy if exists "published_quest_texts_admin_update" on public.author_published_quest_texts;
create policy "published_quest_texts_admin_update"
on public.author_published_quest_texts
for update
to authenticated
using (public.is_author_admin())
with check (public.is_author_admin());

drop policy if exists "published_quest_texts_admin_delete" on public.author_published_quest_texts;
create policy "published_quest_texts_admin_delete"
on public.author_published_quest_texts
for delete
to authenticated
using (public.is_author_admin());

drop policy if exists "author_weapon_texts_select_allowed" on public.author_weapon_texts;
create policy "author_weapon_texts_select_allowed"
on public.author_weapon_texts
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_weapon_texts_insert_allowed" on public.author_weapon_texts;
create policy "author_weapon_texts_insert_allowed"
on public.author_weapon_texts
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_weapon_texts_update_allowed" on public.author_weapon_texts;
create policy "author_weapon_texts_update_allowed"
on public.author_weapon_texts
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_weapon_versions_select_allowed" on public.author_weapon_text_versions;
create policy "author_weapon_versions_select_allowed"
on public.author_weapon_text_versions
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_weapon_versions_insert_allowed" on public.author_weapon_text_versions;
create policy "author_weapon_versions_insert_allowed"
on public.author_weapon_text_versions
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "published_weapon_texts_public_read" on public.author_published_weapon_texts;
create policy "published_weapon_texts_public_read"
on public.author_published_weapon_texts
for select
to anon, authenticated
using (true);

drop policy if exists "published_weapon_texts_admin_insert" on public.author_published_weapon_texts;
create policy "published_weapon_texts_admin_insert"
on public.author_published_weapon_texts
for insert
to authenticated
with check (public.is_author_admin());

drop policy if exists "published_weapon_texts_admin_update" on public.author_published_weapon_texts;
create policy "published_weapon_texts_admin_update"
on public.author_published_weapon_texts
for update
to authenticated
using (public.is_author_admin())
with check (public.is_author_admin());

drop policy if exists "published_weapon_texts_admin_delete" on public.author_published_weapon_texts;
create policy "published_weapon_texts_admin_delete"
on public.author_published_weapon_texts
for delete
to authenticated
using (public.is_author_admin());

drop policy if exists "author_creature_texts_select_allowed" on public.author_creature_texts;
create policy "author_creature_texts_select_allowed"
on public.author_creature_texts
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_creature_texts_insert_allowed" on public.author_creature_texts;
create policy "author_creature_texts_insert_allowed"
on public.author_creature_texts
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_creature_texts_update_allowed" on public.author_creature_texts;
create policy "author_creature_texts_update_allowed"
on public.author_creature_texts
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_creature_versions_select_allowed" on public.author_creature_text_versions;
create policy "author_creature_versions_select_allowed"
on public.author_creature_text_versions
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_creature_versions_insert_allowed" on public.author_creature_text_versions;
create policy "author_creature_versions_insert_allowed"
on public.author_creature_text_versions
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "published_creature_texts_public_read" on public.author_published_creature_texts;
create policy "published_creature_texts_public_read"
on public.author_published_creature_texts
for select
to anon, authenticated
using (true);

drop policy if exists "published_creature_texts_admin_insert" on public.author_published_creature_texts;
create policy "published_creature_texts_admin_insert"
on public.author_published_creature_texts
for insert
to authenticated
with check (public.is_author_admin());

drop policy if exists "published_creature_texts_admin_update" on public.author_published_creature_texts;
create policy "published_creature_texts_admin_update"
on public.author_published_creature_texts
for update
to authenticated
using (public.is_author_admin())
with check (public.is_author_admin());

drop policy if exists "published_creature_texts_admin_delete" on public.author_published_creature_texts;
create policy "published_creature_texts_admin_delete"
on public.author_published_creature_texts
for delete
to authenticated
using (public.is_author_admin());

drop policy if exists "author_zone_guardian_texts_select_allowed" on public.author_zone_guardian_texts;
create policy "author_zone_guardian_texts_select_allowed"
on public.author_zone_guardian_texts
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_zone_guardian_texts_insert_allowed" on public.author_zone_guardian_texts;
create policy "author_zone_guardian_texts_insert_allowed"
on public.author_zone_guardian_texts
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_zone_guardian_texts_update_allowed" on public.author_zone_guardian_texts;
create policy "author_zone_guardian_texts_update_allowed"
on public.author_zone_guardian_texts
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_zone_guardian_versions_select_allowed" on public.author_zone_guardian_text_versions;
create policy "author_zone_guardian_versions_select_allowed"
on public.author_zone_guardian_text_versions
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_zone_guardian_versions_insert_allowed" on public.author_zone_guardian_text_versions;
create policy "author_zone_guardian_versions_insert_allowed"
on public.author_zone_guardian_text_versions
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "published_zone_guardian_texts_public_read" on public.author_published_zone_guardian_texts;
create policy "published_zone_guardian_texts_public_read"
on public.author_published_zone_guardian_texts
for select
to anon, authenticated
using (true);

drop policy if exists "published_zone_guardian_texts_admin_insert" on public.author_published_zone_guardian_texts;
create policy "published_zone_guardian_texts_admin_insert"
on public.author_published_zone_guardian_texts
for insert
to authenticated
with check (public.is_author_admin());

drop policy if exists "published_zone_guardian_texts_admin_update" on public.author_published_zone_guardian_texts;
create policy "published_zone_guardian_texts_admin_update"
on public.author_published_zone_guardian_texts
for update
to authenticated
using (public.is_author_admin())
with check (public.is_author_admin());

drop policy if exists "published_zone_guardian_texts_admin_delete" on public.author_published_zone_guardian_texts;
create policy "published_zone_guardian_texts_admin_delete"
on public.author_published_zone_guardian_texts
for delete
to authenticated
using (public.is_author_admin());

drop policy if exists "author_fragment_texts_select_allowed" on public.author_fragment_texts;
create policy "author_fragment_texts_select_allowed"
on public.author_fragment_texts
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_fragment_texts_insert_allowed" on public.author_fragment_texts;
create policy "author_fragment_texts_insert_allowed"
on public.author_fragment_texts
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_fragment_texts_update_allowed" on public.author_fragment_texts;
create policy "author_fragment_texts_update_allowed"
on public.author_fragment_texts
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_fragment_versions_select_allowed" on public.author_fragment_text_versions;
create policy "author_fragment_versions_select_allowed"
on public.author_fragment_text_versions
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_fragment_versions_insert_allowed" on public.author_fragment_text_versions;
create policy "author_fragment_versions_insert_allowed"
on public.author_fragment_text_versions
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "published_fragment_texts_public_read" on public.author_published_fragment_texts;
create policy "published_fragment_texts_public_read"
on public.author_published_fragment_texts
for select
to anon, authenticated
using (true);

drop policy if exists "published_fragment_texts_admin_insert" on public.author_published_fragment_texts;
create policy "published_fragment_texts_admin_insert"
on public.author_published_fragment_texts
for insert
to authenticated
with check (public.is_author_admin());

drop policy if exists "published_fragment_texts_admin_update" on public.author_published_fragment_texts;
create policy "published_fragment_texts_admin_update"
on public.author_published_fragment_texts
for update
to authenticated
using (public.is_author_admin())
with check (public.is_author_admin());

drop policy if exists "published_fragment_texts_admin_delete" on public.author_published_fragment_texts;
create policy "published_fragment_texts_admin_delete"
on public.author_published_fragment_texts
for delete
to authenticated
using (public.is_author_admin());

drop policy if exists "author_modal_texts_select_allowed" on public.author_modal_texts;
create policy "author_modal_texts_select_allowed"
on public.author_modal_texts
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_modal_texts_insert_allowed" on public.author_modal_texts;
create policy "author_modal_texts_insert_allowed"
on public.author_modal_texts
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_modal_texts_update_allowed" on public.author_modal_texts;
create policy "author_modal_texts_update_allowed"
on public.author_modal_texts
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_modal_versions_select_allowed" on public.author_modal_text_versions;
create policy "author_modal_versions_select_allowed"
on public.author_modal_text_versions
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_modal_versions_insert_allowed" on public.author_modal_text_versions;
create policy "author_modal_versions_insert_allowed"
on public.author_modal_text_versions
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "published_modal_texts_public_read" on public.author_published_modal_texts;
create policy "published_modal_texts_public_read"
on public.author_published_modal_texts
for select
to anon, authenticated
using (true);

drop policy if exists "published_modal_texts_admin_insert" on public.author_published_modal_texts;
create policy "published_modal_texts_admin_insert"
on public.author_published_modal_texts
for insert
to authenticated
with check (public.is_author_admin());

drop policy if exists "published_modal_texts_admin_update" on public.author_published_modal_texts;
create policy "published_modal_texts_admin_update"
on public.author_published_modal_texts
for update
to authenticated
using (public.is_author_admin())
with check (public.is_author_admin());

drop policy if exists "published_modal_texts_admin_delete" on public.author_published_modal_texts;
create policy "published_modal_texts_admin_delete"
on public.author_published_modal_texts
for delete
to authenticated
using (public.is_author_admin());

drop policy if exists "author_map_documents_select_allowed" on public.author_map_documents;
create policy "author_map_documents_select_allowed"
on public.author_map_documents
for select
to authenticated
using (public.is_author_allowed());

drop policy if exists "author_map_documents_insert_allowed" on public.author_map_documents;
create policy "author_map_documents_insert_allowed"
on public.author_map_documents
for insert
to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_map_documents_update_allowed" on public.author_map_documents;
create policy "author_map_documents_update_allowed"
on public.author_map_documents
for update
to authenticated
using (public.is_author_allowed())
with check (public.is_author_allowed());

drop policy if exists "author_player_texts_select_allowed" on public.author_player_texts;
create policy "author_player_texts_select_allowed"
on public.author_player_texts for select to authenticated
using (public.is_author_allowed());

drop policy if exists "author_player_texts_insert_allowed" on public.author_player_texts;
create policy "author_player_texts_insert_allowed"
on public.author_player_texts for insert to authenticated
with check (public.is_author_allowed());

drop policy if exists "author_player_texts_update_allowed" on public.author_player_texts;
create policy "author_player_texts_update_allowed"
on public.author_player_texts for update to authenticated
using (public.is_author_allowed()) with check (public.is_author_allowed());

drop policy if exists "author_player_versions_select_allowed" on public.author_player_text_versions;
create policy "author_player_versions_select_allowed"
on public.author_player_text_versions for select to authenticated
using (public.is_author_allowed());

drop policy if exists "author_player_versions_insert_allowed" on public.author_player_text_versions;
create policy "author_player_versions_insert_allowed"
on public.author_player_text_versions for insert to authenticated
with check (public.is_author_allowed());

drop policy if exists "published_player_texts_public_read" on public.author_published_player_texts;
create policy "published_player_texts_public_read"
on public.author_published_player_texts for select to anon, authenticated
using (true);

drop policy if exists "published_player_texts_admin_insert" on public.author_published_player_texts;
create policy "published_player_texts_admin_insert"
on public.author_published_player_texts for insert to authenticated
with check (public.is_author_admin());

drop policy if exists "published_player_texts_admin_update" on public.author_published_player_texts;
create policy "published_player_texts_admin_update"
on public.author_published_player_texts for update to authenticated
using (public.is_author_admin()) with check (public.is_author_admin());

drop policy if exists "published_player_texts_admin_delete" on public.author_published_player_texts;
create policy "published_player_texts_admin_delete"
on public.author_published_player_texts for delete to authenticated
using (public.is_author_admin());

revoke all privileges on table public.author_quest_texts from anon, authenticated;
revoke all privileges on table public.author_quest_text_versions from anon, authenticated;
revoke all privileges on table public.author_published_quest_texts from anon, authenticated;
revoke all privileges on table public.author_weapon_texts from anon, authenticated;
revoke all privileges on table public.author_weapon_text_versions from anon, authenticated;
revoke all privileges on table public.author_published_weapon_texts from anon, authenticated;
revoke all privileges on table public.author_creature_texts from anon, authenticated;
revoke all privileges on table public.author_creature_text_versions from anon, authenticated;
revoke all privileges on table public.author_published_creature_texts from anon, authenticated;
revoke all privileges on table public.author_zone_guardian_texts from anon, authenticated;
revoke all privileges on table public.author_zone_guardian_text_versions from anon, authenticated;
revoke all privileges on table public.author_published_zone_guardian_texts from anon, authenticated;
revoke all privileges on table public.author_fragment_texts from anon, authenticated;
revoke all privileges on table public.author_fragment_text_versions from anon, authenticated;
revoke all privileges on table public.author_published_fragment_texts from anon, authenticated;
revoke all privileges on table public.author_modal_texts from anon, authenticated;
revoke all privileges on table public.author_modal_text_versions from anon, authenticated;
revoke all privileges on table public.author_published_modal_texts from anon, authenticated;

grant select, insert, update on table public.author_quest_texts to authenticated;
grant select, insert on table public.author_quest_text_versions to authenticated;
grant select on table public.author_published_quest_texts to anon, authenticated;
grant insert, update, delete on table public.author_published_quest_texts to authenticated;
grant select, insert, update on table public.author_weapon_texts to authenticated;
grant select, insert on table public.author_weapon_text_versions to authenticated;
grant select on table public.author_published_weapon_texts to anon, authenticated;
grant insert, update, delete on table public.author_published_weapon_texts to authenticated;
grant select, insert, update on table public.author_creature_texts to authenticated;
grant select, insert on table public.author_creature_text_versions to authenticated;
grant select on table public.author_published_creature_texts to anon, authenticated;
grant insert, update, delete on table public.author_published_creature_texts to authenticated;
grant select, insert, update on table public.author_zone_guardian_texts to authenticated;
grant select, insert on table public.author_zone_guardian_text_versions to authenticated;
grant select on table public.author_published_zone_guardian_texts to anon, authenticated;
grant insert, update, delete on table public.author_published_zone_guardian_texts to authenticated;
grant select, insert, update on table public.author_fragment_texts to authenticated;
grant select, insert on table public.author_fragment_text_versions to authenticated;
grant select on table public.author_published_fragment_texts to anon, authenticated;
grant insert, update, delete on table public.author_published_fragment_texts to authenticated;
grant select, insert, update on table public.author_modal_texts to authenticated;
grant select, insert on table public.author_modal_text_versions to authenticated;
grant select on table public.author_published_modal_texts to anon, authenticated;
grant insert, update, delete on table public.author_published_modal_texts to authenticated;

revoke all privileges on table public.author_map_documents from anon;
grant select, insert, update on table public.author_map_documents to authenticated;

revoke all privileges on table public.author_player_texts from anon, authenticated;
revoke all privileges on table public.author_player_text_versions from anon, authenticated;
revoke all privileges on table public.author_published_player_texts from anon, authenticated;
grant select, insert, update on table public.author_player_texts to authenticated;
grant select, insert on table public.author_player_text_versions to authenticated;
grant select on table public.author_published_player_texts to anon, authenticated;
grant insert, update, delete on table public.author_published_player_texts to authenticated;

revoke execute on function public.is_author_allowed() from public, anon;
revoke execute on function public.is_author_admin() from public, anon;
grant execute on function public.is_author_allowed() to authenticated;
grant execute on function public.is_author_admin() to authenticated;

-- Esempio: autorizza il tuo account e quello dell'autore.
-- insert into public.author_allowed_users (email, display_name, role)
-- values
--   ('tua-email@example.com', 'Angelo', 'Admin'),
--   ('email-autore@example.com', 'Autore', 'Autore')
-- on conflict (email) do update
-- set display_name = excluded.display_name,
--     role = excluded.role,
--     is_active = true;
