# Link Bio React

Página "link in bio" para o TikTok, em React + Vite + Tailwind.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Onde editar

Todo o conteúdo (links, textos, produtos) está em `src/LinkBioPage.jsx`:

- **`PRODUCTS`** (topo do arquivo): array com os produtos. Troque `href: "#"` pelo
  link de afiliado real de cada um.
- **`SOCIAL`**: mesma lógica, pros links de TikTok, Instagram, WhatsApp.
- **`@seuusuario`** e a tagline: dentro do JSX, na seção `{/* HEADER */}`.
- **Avatar**: hoje é um círculo com texto "FOTO AQUI". Pra usar uma foto real,
  troque o `<div>` do avatar por uma tag `<img src="/sua-foto.jpg" ... />`
  com as mesmas classes de tamanho/borda, e coloque o arquivo de imagem em `public/`.

## Build para produção

```bash
npm run build
```

Isso gera a pasta `dist/` com os arquivos estáticos finais.

## Publicar (opções gratuitas)

- **Vercel**: conecta o repositório do GitHub, ele detecta Vite automaticamente e publica.
- **Netlify**: mesma ideia — conecta o repo, build command `npm run build`, publish directory `dist`.

Depois de publicado, você recebe uma URL `https://...` — essa é a que vai na bio do TikTok.
