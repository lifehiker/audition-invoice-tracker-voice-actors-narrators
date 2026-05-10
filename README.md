# NarraTrack

NarraTrack is a Next.js 15 SaaS dashboard for freelance voice actors and ACX audiobook narrators. It covers auditions, bookings, royalty-share ROI, invoices, payments, rate benchmarking, CSV export, and guarded billing/email integrations.

## Local development

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The default `.env.example` uses a local SQLite database at `prisma/prisma/dev.db`. Google OAuth, Stripe, and Resend are optional. When those credentials are absent, the app falls back gracefully instead of failing.

For production PostgreSQL handoff, `prisma/schema.postgres.prisma` mirrors the same model set with the datasource provider switched to PostgreSQL.

## Production notes

- `next.config.ts` uses `output: "standalone"` for container deploys.
- Do not use `next/font/google` in this project. Keep fonts local or system-based.
- Third-party clients are lazy-initialized inside handlers and actions only.
- `NEXTAUTH_URL` should be set to the deployed app URL.

## Deploy

For a containerized deploy:

```bash
npm run build
docker build .
```

The included `Dockerfile` targets the standalone Next.js output. `docker-compose.yml` provides a simple local app container setup using the same workspace-mounted SQLite database path.
