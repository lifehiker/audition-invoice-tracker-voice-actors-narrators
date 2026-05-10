# FORGE Completion Audit

## Foundation and deployment

- Next.js 15 App Router with standalone output: `next.config.ts`, `src/app/layout.tsx`
- Global UI system, responsive shells, and reusable controls: `src/app/globals.css`, `src/components/ui/*`, `src/components/layout/*`
- Environment and integration guards: `src/lib/env.ts`, `src/lib/billing.ts`, `src/lib/email.ts`
- Container and local deploy artifacts: `Dockerfile`, `docker-compose.yml`, `.env.example`, `README.md`
- PostgreSQL handoff plus local SQLite fallback: `prisma/schema.prisma`, `prisma/schema.postgres.prisma`

## Data model and auth

- Auth models and business entities: `prisma/schema.prisma`
- Demo seeding and dashboard aggregation: `src/lib/data.ts`
- NextAuth v5 with credentials and optional Google OAuth: `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- Route protection and Pro gating helpers: `src/lib/auth-helpers.ts`, `src/types/next-auth.d.ts`
- Signup and login server actions: `src/app/actions/auth.ts`

## Public product and SEO pages

- Homepage: `src/app/page.tsx`
- Pricing: `src/app/pricing/page.tsx`
- Public royalty-share calculator: `src/app/royalty-share-calculator/page.tsx`, `src/components/dashboard/royalty-calculator.tsx`
- Feature landing pages: `src/app/features/audition-tracker/page.tsx`, `src/app/features/royalty-share-roi/page.tsx`
- Spreadsheets comparison page: `src/app/vs/spreadsheets/page.tsx`
- Blog hub and article pages: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/lib/blog.ts`, `src/content/blog/*.mdx`
- SEO metadata, sitemap, robots: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`

## Dashboard pages and workflows

- Overview metrics dashboard: `src/app/dashboard/page.tsx`, `src/components/dashboard/stat-card.tsx`
- Audition pipeline with filters, status changes, conversion, delete, and booking conversion: `src/app/dashboard/auditions/page.tsx`, `src/app/actions/auditions.ts`
- Booking list and detail editing workflow: `src/app/dashboard/bookings/page.tsx`, `src/app/dashboard/bookings/[id]/page.tsx`, `src/app/actions/bookings.ts`
- Invoice list, detail editing, payment logging, and deletes: `src/app/dashboard/invoices/page.tsx`, `src/app/dashboard/invoices/[id]/page.tsx`, `src/app/actions/invoices.ts`
- Royalty-share saved comparison workflow with Pro gating: `src/app/dashboard/royalty-share/page.tsx`, `src/app/actions/royalty-share.ts`, `src/lib/royalty-calculations.ts`
- Rate benchmarking and charting: `src/app/dashboard/rate-history/page.tsx`, `src/app/actions/rates.ts`, `src/components/charts/rate-history-chart.tsx`
- Settings and CSV exports: `src/app/dashboard/settings/page.tsx`, `src/app/api/export/[type]/route.ts`

## Integrations and safe fallbacks

- Stripe checkout, billing portal, and webhook handling with fallback redirects when credentials are absent: `src/app/actions/billing.ts`, `src/app/api/webhooks/stripe/route.ts`, `src/lib/billing.ts`
- Resend-backed transactional email with console fallback: `src/lib/email.ts`
- Cron-compatible reminder routes for overdue invoices, exclusivity windows, and trial endings: `src/app/api/cron/check-overdue/route.ts`, `src/app/api/cron/check-exclusivity/route.ts`, `src/app/api/cron/check-trials/route.ts`
- No separate object storage is required for this MVP because it stores structured workflow data only.

## Verification completed

- Prisma sync: `npx prisma db push`
- Production build: `npm run build`
- Dev server start: `npm run dev`
- Smoke-tested public routes: `/`, `/pricing`, `/royalty-share-calculator`, `/blog`, `/login`
- Smoke-tested auth and authenticated flow: signup server action, dashboard load, audition creation, CSV export

## External credential items intentionally deferred

- Google OAuth requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; guarded fallback already renders login/signup without breaking.
- Stripe billing requires live Stripe credentials, price IDs, and webhook secret; guarded fallback keeps pricing and settings functional locally.
- Resend requires API key and sender identity; guarded fallback logs email events locally.
- Full `docker build .` execution could not be completed in this session because Docker socket access was denied (`permission denied while trying to connect to the docker API`). The Dockerfile itself is present and matches Next standalone output.
