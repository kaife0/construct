# CasaStruct — client

Frontend for CasaStruct — a civil-engineering & architecture practice website:
services, smart material calculators, ready-made plans, a blog, and (soon) an
admin panel. Contact happens via tap-to-WhatsApp, phone, email, and a home-page
inquiry form.

See [`../server`](../server) for the API/admin backend and
[the root README](../README.md) for how the two fit together.

## Tech stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **Motion** (animations) + **lucide-react** (icons)

## Getting started
```bash
npm install
cp .env.example .env.local   # only needed once DB-backed data fetching lands
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
  app/            # routes (App Router) — home, services, calculators, blog, about
  components/     # UI, organized per page: home/, about/, services/, calculators/
  lib/
    content/      # placeholder content, one file per future DB collection
    calculators.ts  # pure material-estimation formulas (no React)
    rates.ts         # placeholder ₹ material rates
    site.ts          # nav links, contact details, WhatsApp helper
    db.ts            # Mongoose connection (unused until data fetching is wired up)
```

Routes: `/`, `/services` (includes ready-made plans), `/calculators`, `/blog`,
`/blog/[slug]`, `/about`. There is no standalone `/plans` or `/contact` route —
plans live inside Services, contact lives inside Home (`/#contact`).

## Build phases
1. Setup — scaffold, design system, navbar/footer shell ✅
2. Public site — home, services, about, contact ✅
3. Calculators — bricks, cement, steel, sand, stone ✅
4. Blog + ready-made plans ✅
5. Wire pages to `../server`'s API (replace `lib/content/` placeholders)
6. Admin panel (auth + CRUD, in `../server`)
7. Deploy to Hostinger

## Configuration
Placeholder contact/profile details live in `src/lib/site.ts` and
`src/lib/content/`. These become admin-editable once phase 5/6 land.
