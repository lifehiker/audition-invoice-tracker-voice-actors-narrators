import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getStripeClient } from "@/lib/billing";
import { env, featureFlags } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!featureFlags.stripe || !env.stripeWebhookSecret) {
    return NextResponse.json({ ok: true, fallback: true });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ ok: true, fallback: true });
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  const payload = await request.text();
  const event = await stripe.webhooks.constructEventAsync(
    payload,
    signature,
    env.stripeWebhookSecret,
  );

  const prisma = getPrisma();
  const subscription = event.data.object as {
    customer?: string;
    id?: string;
    status?: string;
    items?: { data: Array<{ price?: { id?: string } }> };
  };

  if (subscription.customer) {
    await prisma.user.updateMany({
      where: { stripeCustomerId: subscription.customer },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items?.data?.[0]?.price?.id || null,
        subscriptionStatus:
          subscription.status === "active" ? SubscriptionStatus.ACTIVE : SubscriptionStatus.PAST_DUE,
        subscriptionTier:
          subscription.items?.data?.[0]?.price?.id === env.stripeProMonthlyPriceId ||
          subscription.items?.data?.[0]?.price?.id === env.stripeProYearlyPriceId
            ? SubscriptionTier.PRO
            : SubscriptionTier.STARTER,
      },
    });
  }

  return NextResponse.json({ received: true });
}
