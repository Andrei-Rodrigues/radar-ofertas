-- Rode este script no SQL Editor do Supabase (adicional aos anteriores)

alter table links add column if not exists original_price numeric;
alter table links add column if not exists sale_price numeric;
alter table links add column if not exists coupon_code text;
alter table links add column if not exists store_name text;

create table if not exists message_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  body text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table message_templates enable row level security;

create policy "admins can read templates"
on message_templates for select
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can insert templates"
on message_templates for insert
to authenticated
with check (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can update templates"
on message_templates for update
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
)
with check (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can delete templates"
on message_templates for delete
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

-- templates iniciais, baseados nos exemplos que você já usa
insert into message_templates (name, body, position) values
(
  '🔥 Oferta com preço',
  '🔥 *{titulo}*

De {preco_de}
Por {preco_por} 🔥

👉 {link}',
  1
),
(
  '🎟️ Oferta com cupom',
  '✅ *{titulo}*

De {preco_de}
Por {preco_por} 🔥

🎟️ Cupom: {cupom}

👉 {link}',
  2
),
(
  '🏬 Loja oficial',
  '🔥 *{titulo}*

De {preco_de}
Por {preco_por}

👉 {link}

Loja oficial {loja} no MELI!',
  3
),
(
  '⚡ Simples (sem preço)',
  '⚡ *{titulo}*
{subtitulo}

👉 {link}',
  4
);
