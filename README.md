# CasaStruct

Website for a civil-engineering & architecture practice — services showcase, smart
material calculators, ready-made plans, blog, and an admin panel. Contact happens
via tap-to-WhatsApp, phone, and email.

## Tech stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **Motion** (animations) + **lucide-react** (icons)
- **MongoDB** via **Mongoose** (hosted on MongoDB Atlas)
- **Auth.js** for the admin login (added in a later phase)

## Getting started
```bash
npm install
cp .env.example .env.local   # then fill in MONGODB_URI etc.
npm run dev                  # http://localhost:3000
```

> Requires Node **20.19+** or **22 LTS** for full Next 16 support (it builds on
> 20.14 but with engine warnings).

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint

## Project structure
```
src/
  app/            # routes (App Router) + layout + global styles
  components/     # shared UI (navbar, footer, whatsapp button, reveal, icons)
  lib/            # site config, db connection, utils
```

## Build phases
1. Setup — scaffold, design system, DB connection, navbar/footer shell ✅
2. Public site — home, services, about, contact
3. Calculators — bricks, cement, steel, sand, stone
4. Blog + ready-made plans
5. Database + APIs (MongoDB Atlas)
6. Admin panel (auth + CRUD)
7. Deploy to Hostinger

## Configuration
Placeholder contact details live in `src/lib/site.ts` — replace with the client's
real phone, WhatsApp number (intl format, digits only), and email. These become
admin-editable in phase 6.
