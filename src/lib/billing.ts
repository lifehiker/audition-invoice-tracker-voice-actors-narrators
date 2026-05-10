import Stripe from "stripe";

import { env, featureFlags } from "@/lib/env";

export type PriceKey =
  | "starter-monthly"
  | "starter-yearly"
  | "pro-monthly"
  | "pro-yearly";

export const priceCatalog: Record<
  PriceKey,
  { name: string; monthlyEquivalent: number; priceId: string; pro: boolean }
> = {
  "starter-monthly": {
    name: "Starter Monthly",
    monthlyEquivalent: 19,
    priceId: env.stripeStarterMonthlyPriceId,
    pro: false,
  },
  "starter-yearly": {
    name: "Starter Yearly",
    monthlyEquivalent: 149 / 12,
    priceId: env.stripeStarterYearlyPriceId,
    pro: false,
  },
  "pro-monthly": {
    name: "Pro Monthly",
    monthlyEquivalent: 29,
    priceId: env.stripeProMonthlyPriceId,
    pro: true,
  },
  "pro-yearly": {
    name: "Pro Yearly",
    monthlyEquivalent: 229 / 12,
    priceId: env.stripeProYearlyPriceId,
    pro: true,
  },
};

export function getStripeClient() {
  if (!featureFlags.stripe) {
    return null;
  }

  return new Stripe(env.stripeSecretKey);
}
