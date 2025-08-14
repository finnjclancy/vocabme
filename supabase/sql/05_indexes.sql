-- Helpful indexes

create index if not exists idx_words_user_learned on public.words (user_id, is_learned, touches);
create index if not exists idx_words_user_created on public.words (user_id, created_at desc);
create unique index if not exists idx_words_unique_per_user on public.words (user_id, lower(word_text));

create index if not exists idx_attempts_user_time on public.attempts (user_id, created_at desc);
create index if not exists idx_attempts_user_word_time on public.attempts (user_id, word_id, created_at desc);

create index if not exists idx_messages_to_time on public.messages (to_user, created_at desc);
create index if not exists idx_messages_from_time on public.messages (from_user, created_at desc);

create index if not exists idx_friends_user on public.friends (user_id);
create index if not exists idx_friends_friend on public.friends (friend_id);

create index if not exists idx_themes_min_max on public.themes (min_words, max_words);

create index if not exists idx_tutor_messages_thread_time on public.tutor_messages (thread_id, created_at desc);

