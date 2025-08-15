-- profiles table (users)
create table if not exists public.profiles (
  id text primary key, -- x user id
  username text not null,
  display_name text,
  avatar_url text,
  timezone text default 'UTC',
  xp integer default 0,
  streak_count integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_streak_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- sessions table for custom auth
create table if not exists public.sessions (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  access_token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- words table
create table if not exists public.words (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  word_text text not null,
  definition text not null,
  is_learned boolean default false,
  touches integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- attempts table
create table if not exists public.attempts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  word_id uuid not null references public.words(id) on delete cascade,
  session_id text not null references public.sessions(id) on delete cascade,
  lesson_type text not null check (lesson_type in ('blank_in_sentence', 'free_define', 'matching', 'speak_in_sentence')),
  is_correct boolean not null,
  response_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- streak_log table
create table if not exists public.streak_log (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  date date not null,
  xp_earned integer not null,
  lessons_completed integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- friends table
create table if not exists public.friends (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  friend_id text not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'blocked')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id)
);

-- messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id text not null references public.profiles(id) on delete cascade,
  receiver_id text not null references public.profiles(id) on delete cascade,
  word_id uuid references public.words(id) on delete set null,
  message_text text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- themes table
create table if not exists public.themes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  min_words_required integer not null,
  max_words_required integer,
  background_color text,
  accent_color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- tutor_threads table
create table if not exists public.tutor_threads (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- tutor_messages table
create table if not exists public.tutor_messages (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid not null references public.tutor_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
