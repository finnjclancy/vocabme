-- Enable RLS and define policies

alter table public.profiles enable row level security;
alter table public.words enable row level security;
alter table public.attempts enable row level security;
alter table public.sessions enable row level security;
alter table public.streak_log enable row level security;
alter table public.friends enable row level security;
alter table public.messages enable row level security;
alter table public.themes enable row level security;
alter table public.tutor_threads enable row level security;
alter table public.tutor_messages enable row level security;

-- profiles: owner-only
create policy "profiles_select_own" on public.profiles
    for select using (id = auth.uid());
create policy "profiles_insert_self" on public.profiles
    for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles
    for update using (id = auth.uid()) with check (id = auth.uid());

-- words: owner-only
create policy "words_select_own" on public.words
    for select using (user_id = auth.uid());
create policy "words_insert_own" on public.words
    for insert with check (user_id = auth.uid());
create policy "words_update_own" on public.words
    for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "words_delete_own" on public.words
    for delete using (user_id = auth.uid());

-- attempts: owner-only
create policy "attempts_select_own" on public.attempts
    for select using (user_id = auth.uid());
create policy "attempts_insert_own" on public.attempts
    for insert with check (user_id = auth.uid());
create policy "attempts_update_own" on public.attempts
    for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "attempts_delete_own" on public.attempts
    for delete using (user_id = auth.uid());

-- sessions: owner-only
create policy "sessions_select_own" on public.sessions
    for select using (user_id = auth.uid());
create policy "sessions_insert_own" on public.sessions
    for insert with check (user_id = auth.uid());
create policy "sessions_update_own" on public.sessions
    for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "sessions_delete_own" on public.sessions
    for delete using (user_id = auth.uid());

-- streak_log: owner-only
create policy "streak_log_select_own" on public.streak_log
    for select using (user_id = auth.uid());
create policy "streak_log_insert_own" on public.streak_log
    for insert with check (user_id = auth.uid());
create policy "streak_log_update_own" on public.streak_log
    for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "streak_log_delete_own" on public.streak_log
    for delete using (user_id = auth.uid());

-- friends: visible to either side
create policy "friends_select_visible" on public.friends
    for select using (user_id = auth.uid() or friend_id = auth.uid());
create policy "friends_insert_self" on public.friends
    for insert with check (user_id = auth.uid());
create policy "friends_update_visible" on public.friends
    for update using (user_id = auth.uid() or friend_id = auth.uid())
    with check (user_id = auth.uid() or friend_id = auth.uid());
create policy "friends_delete_visible" on public.friends
    for delete using (user_id = auth.uid() or friend_id = auth.uid());

-- messages: sender or receiver
create policy "messages_select_visible" on public.messages
    for select using (from_user = auth.uid() or to_user = auth.uid());
create policy "messages_insert_sender" on public.messages
    for insert with check (from_user = auth.uid());
create policy "messages_update_sender" on public.messages
    for update using (from_user = auth.uid()) with check (from_user = auth.uid());
create policy "messages_delete_sender" on public.messages
    for delete using (from_user = auth.uid());

-- themes: readable by any authenticated user
create policy "themes_read_all" on public.themes
    for select using (auth.uid() is not null);

-- tutor threads/messages: owned
create policy "tutor_threads_select_own" on public.tutor_threads
    for select using (user_id = auth.uid());
create policy "tutor_threads_insert_own" on public.tutor_threads
    for insert with check (user_id = auth.uid());
create policy "tutor_threads_update_own" on public.tutor_threads
    for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tutor_threads_delete_own" on public.tutor_threads
    for delete using (user_id = auth.uid());

create policy "tutor_messages_select_in_thread" on public.tutor_messages
    for select using (
        exists (
            select 1 from public.tutor_threads t
            where t.id = thread_id and t.user_id = auth.uid()
        )
    );
create policy "tutor_messages_insert_in_thread" on public.tutor_messages
    for insert with check (
        (user_id = auth.uid()) and
        exists (
            select 1 from public.tutor_threads t
            where t.id = thread_id and t.user_id = auth.uid()
        )
    );
create policy "tutor_messages_delete_in_thread" on public.tutor_messages
    for delete using (
        exists (
            select 1 from public.tutor_threads t
            where t.id = thread_id and t.user_id = auth.uid()
        )
    );
