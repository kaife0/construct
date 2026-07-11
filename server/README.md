# casastruct-server

Admin/API backend for CasaStruct — a separate Express + TypeScript + Mongoose
project, deployed independently from the Next.js frontend (`../`). Shares the
same MongoDB Atlas database.

## Getting started
```bash
npm install
cp .env.example .env   # fill in MONGODB_URI etc.
npm run dev            # http://localhost:4000
```

## Scripts
- `npm run dev` — watch mode (tsx)
- `npm run build` — compile to `dist/`
- `npm run start` — run the compiled server
- `npm run typecheck` — type-check without emitting

## Structure
```
src/
  index.ts       # app entrypoint — express setup, route mounting
  db.ts          # mongoose connection
  models/        # one file per collection (Service, Plan, Project, BlogPost,
                  # Inquiry, AdminUser, CalculatorRates, SiteSettings)
  routes/        # one file per resource
```

## Status
Scaffold stage: models + DB connection + a health check + one example
read route (`GET /api/services`). Full CRUD for every resource, admin
authentication (JWT), and image upload endpoints are added together as the
admin panel is built — the frontend still reads placeholder data from
`../src/lib/content/` until that phase wires it up.

## Deployment
Runs as its own Node process (e.g. via PM2) on Hostinger, alongside the
Next.js app. Point `CORS_ORIGIN` at the deployed frontend URL and the
frontend's `NEXT_PUBLIC_API_URL` (added later) at this server's URL.
