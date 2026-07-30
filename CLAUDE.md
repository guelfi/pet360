# Pet360 - Informacoes do Projeto

## Deploy / CI-CD

- Deploy roda via GitHub Actions (`.github/workflows/deploy-oci.yml`), disparado automaticamente
  apos o CI passar em `main`, ou manualmente via `workflow_dispatch` (exige confirmacao explicita).
- **Nunca fazer deploy manual direto por SSH fora do workflow, e nunca pular a confirmacao do
  usuario** — deploy em producao sempre passa por aprovacao explicita, mesmo que o CI esteja verde.
- **Host**: OCI compartilhada (129.153.86.168), mesma infraestrutura do Unisystem/HealthCore/etc.
- **Diretorio no servidor**: /var/www/pet360
- **Roteamento**: nginx-proxy compartilhado, subpaths /pet360/ (web) e /pet360-api/ (api)
- Compose de producao: `docker-compose.oci.yml` (sem nginx proprio, sem bind de porta no host —
  o nginx-proxy compartilhado acessa os containers pela rede Docker).

## Stack

- **Frontend**: Next.js 14 (apps/web)
- **Backend**: NestJS 10 (apps/api)
- **Banco de dados**: PostgreSQL 15
- **Cache**: Redis
- **WhatsApp**: Evolution API (self-hosted, imagem `evoapicloud/evolution-api`)
- **Containers**: Docker Compose
- **Gerenciador de pacotes**: pnpm (workspace monorepo)

## Ambiente local

- Infra (postgres/redis/evolution) via `docker compose -f docker-compose.dev.yml up -d`
  — portas ja ajustadas para nao colidir com outros projetos locais (postgres 5433, redis 6380,
  evolution 8090).
- `apps/api` e `apps/web` rodam via `pnpm dev` no host (nao containerizados em dev), lendo
  `apps/api/.env.local` e `apps/web/.env.local` (nao commitados).
