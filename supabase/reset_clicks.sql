-- Rode no SQL Editor do Supabase pra zerar todo o histórico e contador de cliques.
-- Não afeta os links em si (título, foto, preço, etc.) — só o rastreamento de clique.

delete from link_clicks;
update links set clicks = 0;
