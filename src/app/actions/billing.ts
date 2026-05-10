"use server";

import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth-helpers";
import { getStripeClient, priceCatalog, type PriceKey } from "@/lib/billing";
import { featureFlags } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

export async function createCheckoutSession(priceKey: PriceKey) {
  const user = await requireUser();
  const prisma = getPrisma();
  const stripe = getStripeClient();

  if (!featureFlags.stripe || !stripe || !priceCatalog[priceKey].priceId) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: priceCatalog[priceKey].pro ? SubscriptionTier.PRO : SubscriptionTier.STARTER,
        subscriptionStatus: SubscriptionStatus.TRIAL,
      },
    });
    revalidatePath("/pricing");
    revalidatePath("/dashboard");
    redirect("/dashboard/settings?billing=fallback");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings`,
    cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing`,
    customer_email: user.email || undefined,
    line_items: [{ price: priceCatalog[priceKey].priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 14 },
  });

  if (!session.url) {
    redirect("/pricing?error=missing-checkout-url");
  }

  redirect(session.url);
}

export async function createBillingPortalSession() {
  const user = await requireUser();
  const prisma = getPrisma();
  const dbUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
  const stripe = getStripeClient();

  if (!featureFlags.stripe || !stripe || !dbUser.stripeCustomerId) {
    redirect("/dashboard/settings?billing=fallback");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings`,
  });

  redirect(session.url);
}
