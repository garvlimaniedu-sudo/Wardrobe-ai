-- StyleMind AI Database Schema
-- Run this in Supabase SQL Editor

create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  full_name text,
  gender text,
  age integer,
  height integer,
  body_type text,
  skin_tone text,
  wears_spectacles boolean default false,
  preferred_styles text[],
  favourite_colours text[],
  occasions text[],
  face_photo_url text,
  body_photo_url text,
  onboarding_complete boolean default false,
  created_at timestamp default now()
);

create table if not exists wardrobe_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text,
  subcategory text,
  colour text,
  photo_url text,
  season text,
  occasion text,
  notes text,
  created_at timestamp default now()
);

create table if not exists outfits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  item_ids uuid[],
  ai_tip text,
  occasion text,
  created_at timestamp default now()
);

create table if not exists ai_assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text,
  photo_url text,
  prompt_sent text,
  ai_response text,
  created_at timestamp default now()
);

alter table profiles enable row level security;
alter table wardrobe_items enable row level security;
alter table outfits enable row level security;
alter table ai_assessments enable row level security;

create policy if not exists "Users own profile" on profiles for all using (auth.uid() = user_id);
create policy if not exists "Users own wardrobe" on wardrobe_items for all using (auth.uid() = user_id);
create policy if not exists "Users own outfits" on outfits for all using (auth.uid() = user_id);
create policy if not exists "Users own assessments" on ai_assessments for all using (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('user-photos', 'user-photos', false) on conflict do nothing;
create policy if not exists "Users own photos" on storage.objects for all using (auth.uid()::text = (storage.foldername(name))[1]);
