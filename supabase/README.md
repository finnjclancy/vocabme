run these files in order in the supabase sql editor:

1) `sql/01_extensions.sql`
2) `sql/02_tables.sql`
3) `sql/03_rls.sql`
4) `sql/04_triggers.sql`
5) `sql/05_indexes.sql`
6) `sql/06_seeds.sql` (optional)
7) `sql/07_auth.sql`

notes

- the attempts trigger increments `words.touches` only on correct tries and flips `is_learned` at 20.
- `profiles.allow_new_words_from_dictionary` controls whether to mix in random dictionary words when the user lacks enough unlearned words.
- themes are public to authenticated users and used to switch the learn path visuals by learned count bands.
- dictionary table removed per project choice; new words will be generated on demand by ai.



