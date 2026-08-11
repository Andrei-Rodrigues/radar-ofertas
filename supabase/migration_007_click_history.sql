-- Rode este script no SQL Editor do Supabase (adicional aos anteriores)

create table if not exists link_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references links(id) on delete cascade,
  source text,
  clicked_at timestamptz not null default now()
);

create index if not exists idx_link_clicks_link_id on link_clicks(link_id);

alter table link_clicks enable row level security;

create policy "admins can read link_clicks"
on link_clicks for select
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can delete link_clicks"
on link_clicks for delete
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

-- substitui a função de clique: continua incrementando o contador e
-- também grava o evento (com origem) pro histórico
drop function if exists increment_link_click(uuid);

create or replace function increment_link_click(link_id uuid, source text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update links set clicks = clicks + 1 where links.id = increment_link_click.link_id;
  insert into link_clicks (link_id, source)
  values (increment_link_click.link_id, increment_link_click.source);
end;
$$;

grant execute on function increment_link_click(uuid, text) to anon, authenticated;
