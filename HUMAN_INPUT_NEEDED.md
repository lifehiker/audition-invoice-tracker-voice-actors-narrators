# Human Input Needed

The app runs locally without external credentials. The items below are only required to enable real third-party integrations in production.

## Google OAuth

- Create a Google OAuth client.
- Add the deployed callback URL for NextAuth.
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

## Stripe billing

- Create four recurring prices for Starter monthly/yearly and Pro monthly/yearly.
- Set `STRIPE_SECRET_KEY`.
- Set `STRIPE_STARTER_MONTHLY_PRICE_ID`, `STRIPE_STARTER_YEARLY_PRICE_ID`, `STRIPE_PRO_MONTHLY_PRICE_ID`, and `STRIPE_PRO_YEARLY_PRICE_ID`.
- Configure the webhook endpoint at `/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET`.

## Resend email

- Create a Resend API key.
- Verify a sending domain or sender address.
- Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

## Production app URL

- Set `NEXTAUTH_URL` to the deployed HTTPS origin so metadata, auth redirects, and Stripe return URLs resolve correctly.
