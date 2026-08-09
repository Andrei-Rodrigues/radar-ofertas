-- Rode este script no SQL Editor do Supabase (adicional aos anteriores)

alter table links add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public can read product images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

create policy "admins can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-images'
  and auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
)
with check (
  bucket_id = 'product-images'
  and auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);

create policy "admins can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-images'
  and auth.jwt() ->> 'email' in ('andreigeral86@gmail.com', 'gabriellearaujopereira3@gmail.com')
);
