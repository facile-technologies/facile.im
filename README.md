# Facile

Monorepo for the Facile platform. The three frontends are one **pnpm workspace** orchestrated by
**Turborepo**; `apps/api` is intentionally separate (npm, built on the server).

| App | Stack | Package mgr | Served at | Build output |
|-----|-------|-------------|-----------|--------------|
| `apps/landing` | Next.js 16 + TS | pnpm (workspace) | `/` | `out/` (static export) |
| `apps/dashboard` | React 19 + Vite | pnpm (workspace) | `/app` | `dist/` |
| `apps/admin` | React + Vite | pnpm (workspace) | `/admin` | `dist/` |
| `apps/api` | Express 5 + MySQL (Sequelize) | **npm** (separate) | `/api` | — (no build) |

`packages/` is the home for shared design — `packages/tailwind-preset` then `packages/ui` (landing +
dashboard; admin joins after its Tailwind v3→v4 upgrade). Shared code stays plain JS/JSX for now.

## Prerequisites
- Node 20+ (developed on 24), pnpm 10, npm (for api), Docker (for the local DB).
- `corepack enable` will pin pnpm to the version in the root `package.json` (`packageManager`).

## Local development

### 1. Start the local database
```bash
docker compose -f docker-compose.dev.yml up -d
```
This runs MySQL on `localhost:3306` (db `dev_facile`, root password `facilelocal`).
Seed it with the schema (and optionally data) from a dump — see "Seeding" below.

### 2. Per-app env files (one-time)
```bash
cp apps/api/.env.example apps/api/.env.dev              # DB on 127.0.0.1:3306, dummy secrets
printf 'VITE_API_BASE_URL=http://localhost:4000\nVITE_APP_URL=http://localhost:5173\n' > apps/dashboard/.env.local
echo  'VITE_API_BASE_URL=http://localhost:4000' > apps/admin/.env.local
```
The backend loads `.env.dev` when `NODE_ENV=dev` (its `dev` script sets it), else `.env`.

### 3. Install + run everything (one command each)
```bash
pnpm install:all             # pnpm workspace (3 frontends) + npm install for api
pnpm dev                     # runs all four at once:
                             #   landing   -> http://localhost:3000
                             #   dashboard -> http://localhost:5173/app/
                             #   admin     -> http://localhost:5174/admin/
                             #   api       -> http://localhost:4000   (health: /health)
```
Run/build a single app:
```bash
pnpm --filter dashboard dev        # or admin / landing
npm --prefix apps/api run dev       # api is not in the workspace
pnpm build                          # turbo build of the 3 frontends (out/, dist/, dist/)
```

## Seeding the local DB
Schema only (no personal data):
```bash
ssh root@<vps> 'mysqldump --no-data --no-tablespaces dev_facile' \
  | docker exec -i facile-mysql-dev mysql -uroot -pfacilelocal dev_facile
```
A local test login can be added directly (see CLAUDE.md). Full data is production PII — only pull it
locally with explicit authorization, and keep it on your machine.

## Deployment
Push to `staging` → deploys to `staging.facile.im`; push to `main` → deploys to `facile.im`.
See `.github/workflows/deploy.yml` and `deploy/` (nginx + pm2 configs). The server `.env` files are
managed on the server and never committed.

## Important
- Never commit `.env*` (only `.env.example`). See `.gitignore`.
- DB has **no migrations** — schema changes are manual (staging → prod). See CLAUDE.md.
