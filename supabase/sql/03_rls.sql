-- enable rls on all tables
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.words enable row level security;
alter table public.attempts enable row level security;
alter table public.streak_log enable row level security;
alter table public.friends enable row level security;
alter table public.messages enable row level security;
alter table public.themes enable row level security;
alter table public.tutor_threads enable row level security;
alter table public.tutor_messages enable row level security;

-- for now, disable rls on sessions since we need to access them for auth
alter table public.sessions disable row level security;

-- profiles policies - allow all operations for now since we handle auth in the app
create policy "allow all profiles operations" on public.profiles
  for all using (true);

-- words policies - allow all operations for now since we handle auth in the app
create policy "allow all words operations" on public.words
  for all using (true);

-- attempts policies - allow all operations for now since we handle auth in the app
create policy "allow all attempts operations" on public.attempts
  for all using (true);

-- streak_log policies - allow all operations for now since we handle auth in the app
create policy "allow all streak_log operations" on public.streak_log
  for all using (true);

-- friends policies - allow all operations for now since we handle auth in the app
create policy "allow all friends operations" on public.friends
  for all using (true);

-- messages policies - allow all operations for now since we handle auth in the app
create policy "allow all messages operations" on public.messages
  for all using (true);

-- themes policies - allow read access for all authenticated users
create policy "allow themes read" on public.themes
  for select using (true);

-- tutor_threads policies - allow all operations for now since we handle auth in the app
create policy "allow all tutor_threads operations" on public.tutor_threads
  for all using (true);

-- tutor_messages policies - allow all operations for now since we handle auth in the app
create policy "allow all tutor_messages operations" on public.tutor_messages
  for all using (true);
