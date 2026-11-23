# AquaVillae

Site AL (Astro + Cloudflare Worker). Ver `docs/ARCHITECTURE.md`.

- Monorepo: `apps/web`, `apps/gateway`, `packages/contract`, `config/`.
- Node 22 (via nvm). Idiomas: `/pt/` e `/en/`.
- Conteúdo em Markdown, editado só pelo utilizador via Claude Code.
- Preços só em `config/pricing.json`; unidades em `config/units.json`.
- Respeitar a interface `BookingProvider`; nada de lógica Google Calendar fora do adapter.
- Sem pagamentos na fase 1.

## Conteúdo (apps/web)
- Páginas em `apps/web/src/content/pages/{pt,en}/`, alojamentos em `.../units/{pt,en}/`.
- `key` liga a mesma página nos dois idiomas (hreflang e seletor PT/EN). `urlPath` é o caminho do URL. Não usar `slug` no frontmatter (o Astro usa-o como id).
- Novas páginas: criar o `.md` nos dois idiomas; as rotas e o menu usam as chaves `units`, `thermal`, `contact`, `book`, `privacy`.
- Texto por preencher está marcado com `TODO`.
