# AquaVillae

Site AL (Astro + Cloudflare Worker). Ver `docs/ARCHITECTURE.md`.

- Monorepo: `apps/web`, `apps/gateway`, `packages/contract`, `config/`.
- Node 22 (via nvm). Idiomas: `/pt/` e `/en/`.
- Conteúdo em Markdown, editado só pelo utilizador via Claude Code.
- Preços só em `config/pricing.json`; unidades em `config/units.json`.
- Respeitar a interface `BookingProvider`; nada de lógica Google Calendar fora do adapter.
- Sem pagamentos na fase 1.
