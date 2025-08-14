-- Seed themes (learn path bands)
insert into public.themes (name, min_words, max_words, assets) values
    ('deep_ocean', 0, 50, '{"palette":"blue_deep"}'),
    ('shore', 51, 100, '{"palette":"blue_sand"}'),
    ('forest', 101, 200, '{"palette":"green_forest"}'),
    ('savanna', 201, 300, '{"palette":"gold_savanna"}'),
    ('town', 301, 500, '{"palette":"town"}'),
    ('city', 501, 800, '{"palette":"city"}'),
    ('moon', 801, 1200, '{"palette":"moon"}'),
    ('sci_fi', 1201, null, '{"palette":"neon"}');



