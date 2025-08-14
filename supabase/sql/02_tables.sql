-- Core tables for vocabme

-- profiles: one row per auth user
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    x_id text,
    name text,
    timezone text,
    streak integer not null default 0,
    xp integer not null default 0,
    last_active date,
    allow_new_words_from_dictionary boolean not null default false
);

-- words the user wants to learn
create table if not exists public.words (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    word_text text not null,
    definition text not null,
    touches integer not null default 0 check (touches >= 0),
    is_learned boolean not null default false,
    created_at timestamptz not null default now()
);

-- attempts during lessons/tutor
create table if not exists public.attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    word_id uuid not null references public.words (id) on delete cascade,
    type text not null,
    correct boolean not null,
    prompt jsonb,
    reply jsonb,
    meta jsonb,
    created_at timestamptz not null default now(),
    constraint attempts_type_check check (type in ('blank','define','match_def','match_syn','speak'))
);

-- study sessions for xp/streak aggregation
create table if not exists public.sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    started_at timestamptz not null default now(),
    ended_at timestamptz,
    xp_earned integer not null default 0,
    meta jsonb
);

-- daily streak tracking
create table if not exists public.streak_log (
    user_id uuid not null references auth.users (id) on delete cascade,
    date date not null,
    did_study boolean not null default true,
    primary key (user_id, date)
);

-- friendships
create table if not exists public.friends (
    user_id uuid not null references auth.users (id) on delete cascade,
    friend_id uuid not null references auth.users (id) on delete cascade,
    status text not null default 'pending',
    created_at timestamptz not null default now(),
    constraint friends_self check (user_id <> friend_id),
    constraint friends_status_check check (status in ('pending','accepted','blocked')),
    primary key (user_id, friend_id)
);

-- direct messages between friends
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    from_user uuid not null references auth.users (id) on delete cascade,
    to_user uuid not null references auth.users (id) on delete cascade,
    body text not null,
    created_at timestamptz not null default now()
);

-- theme bands for the learn path
create table if not exists public.themes (
    id serial primary key,
    name text not null,
    min_words integer not null default 0,
    max_words integer,
    assets jsonb
);

-- tutor threads/messages (for v1 tutor)
create table if not exists public.tutor_threads (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    created_at timestamptz not null default now(),
    last_at timestamptz
);

create table if not exists public.tutor_messages (
    id uuid primary key default gen_random_uuid(),
    thread_id uuid not null references public.tutor_threads (id) on delete cascade,
    user_id uuid references auth.users (id) on delete set null,
    role text not null,
    text text not null,
    created_at timestamptz not null default now(),
    constraint tutor_role_check check (role in ('user','assistant','system'))
);
