# CasaStruct

Website for a civil-engineering & architecture practice — services, smart
material calculators, ready-made plans, digital products, a blog, and a full
admin panel for managing all of it.

This is a two-app monorepo:

| Folder | What | Docs |
| --- | --- | --- |
| [`client/`](client) | Public website + admin UI — Next.js 16 (App Router) + React 19 + TypeScript | [client/README.md](client/README.md) |
| [`server/`](server) | Admin/API backend — Express + TypeScript + Mongoose | [server/README.md](server/README.md) |

The two are deployed independently (separate Node processes) and share one
MongoDB Atlas database. See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**
for how they fit together and what's used where, and
**[docs/ADMIN.md](docs/ADMIN.md)** for how to use the admin panel day to day.

## Prerequisites

- **Node 20.19+ or 22 LTS** (required by Next.js 16)
- A **MongoDB Atlas** connection string (both apps share one database)

## Install & run

Both apps run side by side in local development — the frontend proxies
`/api/*` and `/uploads/*` to the backend (see `client/next.config.ts`), so the
browser only ever talks to `localhost:3000`.

```bash
# 1. Backend
cd server
npm install
cp .env.example .env       # fill in MONGODB_URI and JWT_SECRET (see below)
npm run dev                 # http://localhost:4000

# 2. Frontend (separate terminal)
cd client
npm install
cp .env.example .env.local  # JWT_SECRET must match the server's exactly
npm run dev                 # http://localhost:3000
```

Generate a `JWT_SECRET` with `openssl rand -base64 32` and put the **same
value** in both `server/.env` and `client/.env.local` — the server signs the
admin session cookie, the frontend's edge proxy verifies it, and both must
agree on the secret and algorithm (HS256).

### Create your first admin account

There's no public sign-up route by design. Create the first (and any
subsequent) admin user from the command line, against the backend's database:

```bash
cd server
npm run seed:admin -- --email you@example.com --password "..." --name "Your Name"
```

Then sign in at `http://localhost:3000/admin/login`. See
[docs/ADMIN.md](docs/ADMIN.md) for everything the admin panel can do.

### Optional: seed demo content

```bash
cd server
npm run seed:services
npm run seed:plans
npm run seed:digital-products
npm run seed:blog
```

These are idempotent (safe to re-run) and only needed if you want sample data
in a fresh database — real content is normally added through the admin panel.

## Deployment

Frontend and backend run as two separate Node processes (e.g. via PM2),
sharing one MongoDB Atlas database. Both need production environment
variables set explicitly:

- **Backend** (`server/.env`): `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` (the
  deployed frontend's URL), `NODE_ENV=production` (required — this is what
  makes the session cookie `Secure`/HTTPS-only).
- **Frontend** (`client/.env.local`): `API_URL` (the deployed backend's URL,
  used server-side for the rewrite proxy), the same `JWT_SECRET`, and
  `NEXT_PUBLIC_SITE_URL`.

Uploaded images are currently stored on the backend's local disk
(`server/uploads/`, gitignored) — back this up independently of your deploy
process. A Cloudinary-backed storage driver is planned; see
`server/src/lib/storage/index.ts` for where that plugs in.
