# Leo.Blog — Crypto & Macro News

Blog bilíngue (PT/EN) de notícias sobre criptomoedas, macroeconomia, bancos
centrais e commodities: [blog.leoschlanger.com](https://blog.leoschlanger.com).

## Arquitetura

- **App**: React 19 + Vite 7 + Tailwind + React Query (SPA).
- **Conteúdo**: tabela `blog_posts` no Supabase, alimentada pelos pipelines
  `cron_macroeconomic` / `cron_politics` (só leitura aqui, via anon key).
- **Dados de mercado**: `thermometer.json` do repositório
  [`market-thermo-cron`](https://github.com/leo-schlanger/market-thermo-cron),
  consumido pelo hook `useMarketData` (um request compartilhado por página).
- **Hospedagem**: GitHub Pages, via `.github/workflows/deploy.yml`.

### Pré-renderização (`scripts/prerender.ts`)

O GitHub Pages responde 404 para rotas sem arquivo e crawlers de prévia
(WhatsApp, LinkedIn, Telegram) não executam JavaScript. Após o `vite build`,
o script gera:

- `dist/post/<slug>.html` para cada slug PT e EN, com título, descrição,
  Open Graph, `hreflang`, JSON-LD e o artigo em HTML;
- `dist/category/<categoria>.html` e uma página por rota fixa (`/about`...);
- `sitemap.xml` (vira índice automaticamente acima de 45 mil URLs) e `rss.xml`.

O React substitui o HTML estático ao montar. O deploy roda a cada push em
`master` e **a cada 6 horas**, para que posts novos entrem no sitemap/RSS.

## Desenvolvimento

Requer Node 22+.

```bash
cp .env.example .env   # preencha VITE_SUPABASE_ANON_KEY (sem ela, usa posts mock)
npm install
npm run dev            # http://localhost:3000
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck + bundle + pré-renderização |
| `npm run lint` | ESLint |
| `npm test` | Testes (`node:test` via tsx) em `tests/` |
| `npm run check` | Typecheck + lint + testes |

> **Windows + WSL**: o `node_modules` guarda binários nativos por plataforma
> (rollup, esbuild). Rode `npm install` no ambiente em que vai buildar.

## Comentários (Giscus)

Desativados até serem configurados. Para ativar:

1. Habilite **Discussions** no repositório e crie a categoria `Comments`.
2. Instale o app [giscus](https://github.com/apps/giscus) no repositório.
3. Copie `repoId` e `categoryId` de [giscus.app](https://giscus.app) para
   `GISCUS_CONFIG` em `src/lib/constants.ts`.

As discussões são indexadas pelo ID do post, então as versões PT e EN
compartilham os mesmos comentários.
