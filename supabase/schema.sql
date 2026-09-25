-- Run this in your Supabase project's SQL editor (Database > SQL Editor > New query).

-- Profiles: extends Supabase auth.users with a display name
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Question sets
create table if not exists quiz_sets (
  id uuid primary key default gen_random_uuid(),
  owner uuid references profiles(id) on delete cascade,
  title text not null,
  is_public boolean default false,
  created_at timestamptz default now()
);
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  set_id uuid references quiz_sets(id) on delete cascade,
  question text not null,
  choices text[] not null,
  correct_index int not null,
  position int default 0
);
alter table quiz_sets enable row level security;
alter table quiz_questions enable row level security;
create policy "Public or own sets are viewable" on quiz_sets for select using (is_public or owner = auth.uid());
create policy "Users manage their own sets" on quiz_sets for all using (owner = auth.uid());
create policy "Questions follow their set's visibility" on quiz_questions for select
  using (exists (select 1 from quiz_sets s where s.id = set_id and (s.is_public or s.owner = auth.uid())));
create policy "Users manage questions of their own sets" on quiz_questions for all
  using (exists (select 1 from quiz_sets s where s.id = set_id and s.owner = auth.uid()));

-- Game rooms (lobby state; live gameplay sync uses Supabase Realtime channels, not this table)
create table if not exists game_rooms (
  code text primary key,
  host uuid references profiles(id) on delete cascade,
  mode text not null default 'gold',
  status text not null default 'lobby', -- lobby | playing | finished
  set_id uuid references quiz_sets(id),
  created_at timestamptz default now()
);
alter table game_rooms enable row level security;
create policy "Rooms are viewable by everyone" on game_rooms for select using (true);
create policy "Hosts manage their own rooms" on game_rooms for all using (host = auth.uid());

-- Play history
create table if not exists game_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mode text,
  score int,
  played_at timestamptz default now()
);
alter table game_history enable row level security;
create policy "Users see their own history" on game_history for select using (user_id = auth.uid());
create policy "Users insert their own history" on game_history for insert with check (user_id = auth.uid());
