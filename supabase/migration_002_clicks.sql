-- Rode este script no SQL Editor do Supabase (adicional ao schema.sql já rodado)

alter table links add column if not exists clicks integer not null default 0;

-- Função que incrementa o contador sem precisar abrir UPDATE geral pra
-- visitantes anônimos (security definer roda com o dono da tabela).
create or replace function increment_link_click(link_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update links set clicks = clicks + 1 where id = link_id;
end;
$$;

grant execute on function increment_link_click(uuid) to anon, authenticated;
