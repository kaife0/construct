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

Frontend and backend are deployed independently, sharing one MongoDB Atlas
database (e.g. Vercel for the frontend, Render for the backend — or two
Node processes on a single VPS via PM2). Both need production environment
variables set explicitly:

- **Backend**: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` (the deployed
  frontend's URL), `NODE_ENV=production` (required — this is what makes the
  session cookie `Secure`/HTTPS-only), and the `STORAGE_DRIVER`/Cloudinary
  vars below.
- **Frontend**: `API_URL` (the deployed backend's URL, used server-side for
  the rewrite proxy), the same `JWT_SECRET`, and `NEXT_PUBLIC_SITE_URL`.

### Image storage on an ephemeral host

`STORAGE_DRIVER=local` (the default) writes uploads to `server/uploads/` on
disk — fine for a VPS with persistent disk, **not safe** on a host with an
ephemeral filesystem (Render, Vercel, Cloud Run, ...), where every deploy or
restart wipes anything not in git.

For those hosts, set `STORAGE_DRIVER=cloudinary` and provide
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (from
your Cloudinary dashboard). If you already have images stored locally, move
them over first:

```bash
cd server
# with CLOUDINARY_* vars set in .env (STORAGE_DRIVER can still say "local" for this run)
npm run migrate:images-to-cloudinary
```

This uploads every file under `server/uploads/` to Cloudinary and rewrites
the matching URLs in MongoDB. It's idempotent — safe to re-run — and doesn't
touch the local files, so verify the site looks right before deleting them.
Then set `STORAGE_DRIVER=cloudinary` for the deployed backend going forward.
