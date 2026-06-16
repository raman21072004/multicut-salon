# Multicut Salon

A premium multi-page salon management platform with 10 public pages, a complete admin dashboard, and Supabase as the sole backend.

## Run & Operate

- `pnpm --filter @workspace/salon run dev` — run the salon website (port 22979, preview at `/`)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- React + Vite + TypeScript + Tailwind CSS
- Supabase (auth, database, storage)
- shadcn/ui components
- wouter for routing
- recharts for analytics charts

## Where things live

```
artifacts/salon/src/
├── App.tsx                        — all 21 routes (10 public + 11 admin)
├── lib/
│   ├── supabase.ts                — Supabase client
│   ├── types.ts                   — shared TypeScript interfaces
│   ├── hooks.ts                   — useSalonSettings(), uploadImage()
│   ├── auth.ts                    — signIn(), signOut()
│   └── schema.sql                 — full SQL schema to run in Supabase
├── contexts/AuthContext.tsx       — auth session provider
├── components/
│   ├── Navbar.tsx                 — shared public navbar (settings-driven)
│   ├── Footer.tsx                 — shared public footer (settings-driven)
│   ├── ImageUpload.tsx            — drag-drop upload to Supabase Storage
│   └── admin/AdminLayout.tsx      — admin sidebar with all nav links
├── pages/
│   ├── Home.tsx                   — landing page with preview sections
│   ├── About.tsx                  — full about page
│   ├── Services.tsx               — services grid with category filter
│   ├── ServiceDetail.tsx          — individual service page (/services/:slug)
│   ├── Gallery.tsx                — masonry gallery with lightbox
│   ├── Stylists.tsx               — stylists grid
│   ├── StylistDetail.tsx          — individual stylist (/stylists/:id)
│   ├── Reviews.tsx                — reviews with rating filter & stats
│   ├── Contact.tsx                — contact form + info
│   ├── BookAppointment.tsx        — booking form with service/stylist select
│   └── admin/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Analytics.tsx          — charts: monthly, daily, status, services
│       ├── Appointments.tsx       — CRUD with status workflow
│       ├── Services.tsx           — CRUD + image upload + featured toggle
│       ├── Stylists.tsx           — CRUD + photo upload
│       ├── Gallery.tsx            — CRUD + Supabase Storage upload
│       ├── Reviews.tsx            — CRUD
│       ├── Contacts.tsx           — view + resolve + delete
│       ├── Settings.tsx           — tabbed: general/hero/about/hours/social + image upload
│       └── Admins.tsx             — role management (super_admin / admin)
└── index.css                      — dark luxury theme (black + gold)
```

## Environment Variables

| Variable | Where to find |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public key |

## Supabase Setup (REQUIRED)

Before the app works, you must run the SQL schema in your Supabase project:

1. Open your Supabase project → **SQL Editor**
2. Copy the entire contents of `artifacts/salon/src/lib/schema.sql`
3. Paste and **Run** it
4. This creates all tables, enables RLS, seeds starter data, and adds the auto-profile trigger

### Tables
- `settings` — all website content (hero, about, hours, social, images)
- `profiles` — admin users with roles (super_admin / admin)
- `appointments` — bookings with status workflow
- `services` — services with slug, price, duration, image, featured flag
- `stylists` — stylist profiles with photo
- `gallery` — images with captions and categories
- `reviews` — client reviews with star ratings
- `contacts` — contact form submissions

### Storage Buckets (create manually in Supabase → Storage)

Create these as **public** buckets:
- `gallery-images`
- `stylist-images`
- `service-images`
- `logos`
- `website-assets`

### Admin Login

1. Go to your Supabase project → **Authentication → Users**
2. Click **Invite user** or **Add user** → enter your email + password
3. Navigate to `/admin/login` in the app and sign in
4. Go to `/admin/admins` → click "Become Super Admin" to set your role

## Public Routes

| Path | Page |
|---|---|
| `/` | Home — hero, featured services, stylists, gallery preview, reviews |
| `/about` | About — story, philosophy, hours, contact info |
| `/services` | Services — filtered grid of all services |
| `/services/:slug` | Service Detail — full info + booking CTA |
| `/gallery` | Gallery — masonry grid with lightbox + category filter |
| `/stylists` | Stylists — team grid with social links |
| `/stylists/:id` | Stylist Detail — full profile + booking CTA |
| `/reviews` | Reviews — all reviews with rating stats + filter |
| `/contact` | Contact — form + address/hours/socials |
| `/book-appointment` | Booking — full appointment form |

## Admin Routes

| Path | Page |
|---|---|
| `/admin/login` | Secure login |
| `/admin/dashboard` | Stats overview + charts |
| `/admin/analytics` | Deep analytics: monthly, daily, revenue, popular services |
| `/admin/appointments` | Manage bookings (confirm/cancel/complete/delete/search) |
| `/admin/services` | Add/edit/delete services + image upload + featured toggle |
| `/admin/stylists` | Add/edit/delete stylists + photo upload |
| `/admin/gallery` | Add/edit/delete gallery images + Supabase Storage upload |
| `/admin/reviews` | Add/edit/delete reviews |
| `/admin/contacts` | View, resolve, delete contact messages |
| `/admin/settings` | Tabbed settings: General, Hero, About, Hours, Social — all with image upload |
| `/admin/admins` | Role management — Super Admin / Admin |

## Architecture

- Supabase is the entire backend (no Express needed for this app)
- RLS allows public reads; admin writes require auth
- Settings are live-fetched on every page load — admin changes are instant
- `useSalonSettings()` hook used across all public pages for consistent data
- `ImageUpload` component handles drag-drop + Supabase Storage upload
- `uploadImage()` helper uploads to a named bucket and returns the public URL
- Services use `slug` field for SEO-friendly URLs (`/services/balayage`)
- `profiles` table with `role` column auto-created on first user sign-in via trigger

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vite builds to `dist/public` automatically

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
