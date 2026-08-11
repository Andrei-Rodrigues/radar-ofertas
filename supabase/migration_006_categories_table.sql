-- Rode este script no SQL Editor do Supabase (adicional aos anteriores)

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "admins can read categories"
on categories for select
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can insert categories"
on categories for insert
to authenticated
with check (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can delete categories"
on categories for delete
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

-- categorias que já existiam fixas no código
insert into categories (name) values
  ('Tecnologia'), ('Casa'), ('Esporte'), ('Roupas')
on conflict (name) do nothing;
