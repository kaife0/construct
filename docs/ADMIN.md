# Admin panel guide

Everything the `/admin` panel manages, and how each part works. For how it's
built under the hood, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Signing in

- URL: `/admin/login`.
- There is no public sign-up — admin accounts only exist if created via the
  backend's CLI script (re-running it with the same email updates that
  account's name/password):

  ```bash
  cd server
  npm run seed:admin -- --email you@example.com --password "..." --name "Your Name"
  ```

- A successful login sets an `httpOnly` session cookie valid for **7 days**.
  Visiting any `/admin/*` page without a valid session redirects to
  `/admin/login?from=<page>` and returns you there after signing in.
- **Logout** is the button in the admin header (top right) — clears the
  session cookie and redirects to the login page.
- **View site** (also in the header) opens the public site in a new tab, so
  you can check how a change looks without leaving the admin panel.

## Dashboard

`/admin` is a tile grid linking to the eight manageable sections:

| Section | Manages |
| --- | --- |
| **Services** | The service cards shown on Home and `/services` |
| **Digital Products** | Product *categories* (e.g. "Ready-made House Plans", "CAD Blocks") |
| **Ready-made Plans** | The individual house plans shown under the Digital Products catalog |
| **Our Work** | Completed / in-progress projects shown on the About page |
| **Blog** | Journal posts and their categories |
| **Inquiries** | Leads submitted through the site's contact form and service pages |
| **Calculator Rates** | The ₹ material rates the public material calculators use |
| **Site Settings** | Profile, achievements, contact details, and social links |

## How a typical resource works (Services, Plans, Projects, Blog Posts, Digital Products)

These all behave the same way:

- **List screen** shows a thumbnail, title, and a short subtitle per item,
  with **Edit** and **Delete** buttons and a **New X** button.
- **Delete** asks for confirmation first, then removes the item **and** its
  uploaded image(s) from storage — this can't be undone.
- **Create/Edit** is one form. Required fields are marked; saving with a
  required field empty or an image not yet uploaded shows an inline error
  and does not submit.
- **Slugs** (the `/…` part of a public URL) are generated automatically from
  the title and kept unique — if you create two services both titled
  "Interior Design," the second gets `interior-design-2`. There's no field to
  set the slug manually.
- **Ordering** is set automatically at creation time (new items go to the
  end); there's currently no drag-to-reorder or manual order field in the
  forms. To change display order today, that requires editing the `order`
  value directly in the database.
- **Images** upload immediately when picked (via the image icon/box in the
  form) — you'll see a spinner, then a preview. Uploads are re-encoded
  server-side to WebP automatically; there's nothing to do beyond picking a
  reasonably-sized photo. Some resources (Plans, Projects, Digital Products)
  also have a **gallery** — a multi-image uploader for extra photos shown on
  that item's detail page, in addition to its one main image.
- **Publishing changes**: saves apply immediately — the public site reflects
  the change on the very next page load, not after a delay.

### Digital Products specifically

This is two nested levels:

1. **`/admin/digital-products`** — the *categories* (e.g. "Ready-made House
   Plans"). A category has its own title/summary/description/image, plus a
   **"Show plans catalog"** toggle — when on, that category's public page
   renders the existing Ready-made Plans catalog inline instead of its own
   product list (used for exactly one category today).
2. **`/admin/digital-products/[id]/products`** — the individual products
   *inside* one category (e.g. specific CAD blocks or templates), reached via
   the "Products →" link on a category row. Each product has its own
   title/description/image/gallery/price/feature list.

### Blog specifically

- **Blog Categories** (`/admin/blog-categories`) — a simple flat taxonomy
  (title only). Deleting a category does **not** check whether any posts
  still use it — do this only after reassigning or deleting those posts
  first, otherwise they're left pointing at a category that no longer
  exists.
- **Blog Posts** (`/admin/blog`) — title, excerpt, a category, a cover image,
  estimated read time, and the post body written in **Markdown**, which
  renders to HTML on the public post page.
- **Published toggle**: a post isn't visible on the public site until you
  mark it *Published*. Unpublished posts are drafts — visible in the admin
  list, invisible everywhere else.

## Inquiries

`/admin/inquiries` is read/act-only — there's no create/edit form here since
these come from the public contact form and per-service inquiry forms.

- Each row shows the sender's name, phone (tap-to-call), email (tap-to-email,
  if given), which service they asked about (if any), their message, and
  when they submitted.
- **Status** is a dropdown: `new` → `contacted` → `closed`. Purely for your
  own tracking — changing it doesn't notify the sender.
- **Delete** removes the inquiry permanently.

## Calculator Rates

`/admin/calculator-rates` is a single form (no list) — one document holding
the ₹ rates the public material calculators (brick, cement, sand, steel,
concrete) use for their estimates: price per brick, per cement bag, per kg of
steel, per cubic foot of sand, per cubic foot of aggregate. Save updates the
one shared rate sheet site-wide immediately.

## Site Settings

`/admin/site-settings` is also a single form, covering everything about *you*
that appears across the public site outside of the dedicated content types
above:

- **Profile** — name, role/title, intro paragraph (used on the About-teaser
  section on Home), a multi-paragraph bio (About page), a list of
  credentials, and the **stats** shown on both the About page and the Home
  page's stats band: projects completed, years of experience, cities served.
- **Achievements** — a timeline of year + title + description entries shown
  on the About page.
- **Contact** — phone, email, WhatsApp number (international format, digits
  only — used to build tap-to-WhatsApp links), and location. These feed the
  footer, the contact section, and every "Chat on WhatsApp" button site-wide.
- **Socials** — Instagram/LinkedIn/YouTube URLs, used by the footer's social
  icons.

Because these fields drive multiple pages at once (Home, About, Footer), a
save here has the widest visible effect of anything in the admin panel — the
next page load anywhere on the site reflects it.
