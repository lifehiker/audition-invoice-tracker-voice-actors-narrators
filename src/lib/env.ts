export const env = {
  appUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  authSecret: process.env.AUTH_SECRET || "local-dev-secret-for-narratrack",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripeStarterMonthlyPriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || "",
  stripeStarterYearlyPriceId: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || "",
  stripeProMonthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
  stripeProYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFromEmail: process.env.RESEND_FROM_EMAIL || "hello@narratrack.local",
  cronSecret: process.env.CRON_SECRET || "local-cron-secret",
};

export const featureFlags = {
  googleAuth: Boolean(env.googleClientId && env.googleClientSecret),
  stripe: Boolean(env.stripeSecretKey),
  resend: Boolean(env.resendApiKey),
};
