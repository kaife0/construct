# CasaStruct

Website for a civil-engineering & architecture practice — services, smart
material calculators, ready-made plans, a blog, and an admin panel.

This is a two-app monorepo:

| Folder | What | Docs |
|---|---|---|
| [`client/`](client) | Public website — Next.js + React + TypeScript | [client/README.md](client/README.md) |
| [`server/`](server) | Admin/API backend — Express + TypeScript + Mongoose | [server/README.md](server/README.md) |

The two are deployed independently (frontend and backend as separate Node
processes on Hostinger) and share one MongoDB Atlas database.

## Quick start
```bash
# frontend
cd client && npm install && npm run dev     # http://localhost:3000

# backend (separate terminal)
cd server && npm install && npm run dev     # http://localhost:4000
```

## Status
The public site (home, services, calculators, blog, about) is built against
placeholder content in `client/src/lib/content/`. The backend is scaffolded
(models + one example route) but not yet wired to the frontend — that's the
next phase, followed by the admin panel (auth + CRUD).
