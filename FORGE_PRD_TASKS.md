# NarraTrack PRD Checklist

## Foundation
- [x] Scaffold Next.js 15 App Router app with TypeScript, Tailwind, ESLint, and `output: "standalone"`.
- [x] Install and configure required dependencies for Prisma, NextAuth, forms, charts, billing, email, and content.
- [x] Establish global design system, theme tokens, responsive shell, and reusable UI primitives.
- [x] Add environment handling with safe fallbacks for missing external credentials.

## Data Model
- [x] Configure Prisma with PostgreSQL-compatible schema.
- [x] Define auth models: `User`, `Account`, `Session`, `VerificationToken`.
- [x] Define business models: `Audition`, `Booking`, `Invoice`, `Payment`, `RoyaltyShareProject`, `RateEntry`.
- [x] Add enums for audition status, booking status, invoice status, rights type, rate type, payment method, and subscription tier/state.
- [x] Support local/dev database fallback so the app still runs without external infrastructure.

## Auth
- [x] Implement NextAuth v5 with Prisma adapter wiring.
- [x] Support email/password signup and login.
- [x] Support Google OAuth with credential guard and graceful fallback when unset.
- [x] Protect dashboard routes and expose session subscription fields.
- [x] Add account/settings page for profile and auth state.

## User-Facing Pages
- [x] `/` homepage
- [x] `/pricing`
- [x] `/royalty-share-calculator` public calculator
- [x] `/features/audition-tracker`
- [x] `/features/royalty-share-roi`
- [x] `/vs/spreadsheets`
- [x] `/blog`
- [x] `/blog/[slug]`
- [x] `/login`
- [x] `/signup`
- [x] `/dashboard`
- [x] `/dashboard/auditions`
- [x] `/dashboard/bookings`
- [x] `/dashboard/bookings/[id]`
- [x] `/dashboard/invoices`
- [x] `/dashboard/invoices/[id]`
- [x] `/dashboard/royalty-share`
- [x] `/dashboard/rate-history`
- [x] `/dashboard/settings`

## API / Server Actions
- [x] Auth handlers
- [x] Audition create/update/delete/convert-to-booking
- [x] Booking create/update/delete
- [x] Invoice create/update/delete
- [x] Payment create/update/delete
- [x] Royalty-share project create/update/delete
- [x] Rate entry create/update/delete
- [x] CSV export endpoints for auditions, bookings, payments
- [x] Billing checkout and billing portal actions with safe fallback
- [x] Stripe webhook route with guarded no-op behavior when credentials are missing
- [x] Cron-compatible reminder routes for overdue invoices, exclusivity alerts, and trial reminders with guarded fallback

## Core Workflows
- [x] Log audition and filter by status/date/rights type
- [x] Update audition status and trigger notification path
- [x] Convert audition to booking
- [x] Manage booking/project details and exclusivity dates
- [x] Create invoice and track invoice status
- [x] Log payments against invoices
- [x] Show dashboard summary metrics
- [x] Export core data as CSV

## Secondary Workflows
- [x] Public royalty-share ROI calculator
- [x] Authenticated royalty-share project comparison and save flow
- [x] Rate history logging and charting
- [x] Subscription/pricing UX with plan gating and trial messaging
- [x] Email notifications with local/dev fallback logging
- [x] Analytics-ready public page structure without build-time network dependence

## Integrations / Safe Fallbacks
- [x] PostgreSQL production path with local SQLite/dev fallback
- [x] Google OAuth fallback when env vars are absent
- [x] Stripe billing fallback when env vars are absent
- [x] Resend email fallback when env vars are absent
- [x] Storage requirements assessed; document if no separate object storage is required

## Marketing / SEO
- [x] Metadata defaults, OpenGraph, sitemap, robots
- [x] Keyword-focused landing pages
- [x] Blog content pages for the specified topics
- [x] Comparison page targeting spreadsheet switchers
- [x] Strong CTAs into signup/pricing

## Docker / Deploy
- [x] Production-ready Dockerfile using Next standalone output
- [x] `docker-compose.yml` for local app + database
- [x] Environment example file
- [x] Coolify-compatible runtime assumptions documented

## Verification
- [x] Run Prisma generate/migrate or db push successfully
- [x] Run `npm run build` successfully
- [x] Start dev server successfully
- [x] Smoke test primary routes
- [x] Check interactive forms/navigation
- [x] Produce `FORGE_COMPLETION_AUDIT.md`
- [x] Produce `HUMAN_INPUT_NEEDED.md` for external credentials only if needed
