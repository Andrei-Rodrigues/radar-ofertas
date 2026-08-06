-- Rode este script no SQL Editor do Supabase (Project > SQL Editor > New query)

create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('produto', 'social')),
  icon text not null,
  title text not null,
  sub text,
  href text not null,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table links enable row level security;

-- qualquer visitante pode ler os links ativos
create policy "public can read active links"
on links for select
to anon, authenticated
using (active = true);

-- admins (lista de e-mails abaixo) podem ler tudo, inclusive inativos
create policy "admins can read all links"
on links for select
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can insert links"
on links for insert
to authenticated
with check (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can update links"
on links for update
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
)
with check (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can delete links"
on links for delete
to authenticated
using (
  auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

-- seed com os links atuais do site
insert into links (section, icon, title, sub, href, position) values
  ('produto', 'Usb', 'Hub USB-C 5 em 1 — Ugreen', '100W · saída 4K · comprei e uso', 'https://meli.la/1uw1NCR', 1),
  ('produto', 'Zap', 'Carregador USB-C', 'carga rápida · testado no dia a dia', 'https://meli.la/2zwMwck', 2),
  ('social', 'Music2', 'TikTok', null, 'https://www.tiktok.com/@radar.de.ofertas052', 1),
  ('social', 'MessageCircle', 'Grupo do WhatsApp', null, 'https://chat.whatsapp.com/F4tAH45HBKFJwFVGbtF6ul', 2);
