-- Trigger: bump touches and learned flag on correct attempts

create or replace function public.fn_bump_word_touches()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    -- ensure the attempt is for the same owner as the word
    if not exists (
        select 1 from public.words w where w.id = new.word_id and w.user_id = new.user_id
    ) then
        raise exception 'attempt user_id must match word owner';
    end if;
    if new.correct is true then
        update public.words w
        set touches = w.touches + 1,
            is_learned = (w.touches + 1) >= 20
        where w.id = new.word_id and w.user_id = new.user_id;
    end if;
    return new;
end;
$$;

drop trigger if exists trg_attempts_bump on public.attempts;
create trigger trg_attempts_bump
after insert on public.attempts
for each row execute function public.fn_bump_word_touches();