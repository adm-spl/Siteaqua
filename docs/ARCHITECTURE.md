# AquaVillae — Arquitetura

Site de Alojamento Local (T2 Jardim, Suite, T2 Terraço) junto às Termas de São Pedro do Sul.
Estética "Quiet Luxury": `#0B231E`, `#C5A059`, `#F9F6F0`.

## Visão geral

- **apps/web** — Astro estático, rotas `/pt/` e `/en/`. Conteúdo em Markdown no repo.
- **apps/gateway** — Cloudflare Worker "Gateway": `availability`, `quote`, `request`.
- **packages/contract** — tipos e schemas partilhados entre web e gateway.
- **config/units.json**, **config/pricing.json** — unidades e preços fixos.

## Gateway e BookingProvider

O Gateway fala com uma interface `BookingProvider` com adapters:

- `google-calendar` (ativo, fase 1)
- `hostify` (stub, migração futura para PMS)

O contrato de resposta inclui `redirect` para permitir migrar o checkout para o PMS sem mexer no frontend.

## Fase 1 (MVP)

- Só pedidos manuais, sem pagamentos.
- 1 Google Calendar por unidade; eventos `[PEDIDO]` / `[CONFIRMADO]`.
- Disponibilidade via service account + Freebusy; cache KV ~2 min; sem D1.
- Checkout numa página dedicada `/reservar`.
- Preços em `config/pricing.json` (só mudam com o PMS).

## Fora de âmbito

- Hostkit: ignorado. OTAs: só após migrar para PMS. CMS: nenhum, conteúdo editado via Claude Code.

## Deploy

GitHub (`adm-spl/Siteaqua`) → Cloudflare, deploy automático. Domínio na Cloudflare.

## Por decidir

- Resend para emails (proposto).
- Páginas do lançamento.
- URLs WordPress a redirecionar (301).
- Taxa turística e estadia mínima na cotação.
