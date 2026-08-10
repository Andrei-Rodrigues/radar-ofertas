-- Rode este script no SQL Editor do Supabase (adicional aos anteriores)

alter table links add column if not exists category text;

-- categoriza os produtos existentes como "Tecnologia" (ajuste depois pelo admin se quiser)
update links set category = 'Tecnologia' where section = 'produto' and category is null;
