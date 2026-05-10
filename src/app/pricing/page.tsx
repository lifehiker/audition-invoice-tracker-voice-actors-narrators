import { createCheckoutSession } from "@/app/actions/billing";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { featureFlags } from "@/lib/env";

const tiers = [
  {
    title: "Starter",
    price: "$19/mo",
    annual: "$149/yr",
    features: [
      "Unlimited auditions",
      "Bookings, invoices, and payments",
      "Dashboard reporting",
      "CSV exports",
    ],
  },
  {
    title: "Pro",
    price: "$29/mo",
    annual: "$229/yr",
    features: [
      "Everything in Starter",
      "Royalty-share ROI workspace",
      "PFH benchmark charting",
      "Exclusivity and trial reminder workflows",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="pb-16">
      <SiteHeader />
      <section className="shell py-10">
        <div className="max-w-3xl">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-3 text-5xl font-semibold">Purpose-built pricing for serious working narrators.</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Two plans. Both start with a 14-day trial. When Stripe credentials are absent, the UI still works and records a local trial fallback instead of breaking.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {tiers.map((tier) => (
            <Card key={tier.title} className="flex flex-col">
              <p className="eyebrow">{tier.title}</p>
              <h2 className="mt-3 text-3xl font-semibold">{tier.price}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">or {tier.annual}</p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                {tier.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3">
                <form
                  action={async () => {
                    "use server";
                    await createCheckoutSession(
                      tier.title === "Starter" ? "starter-monthly" : "pro-monthly",
                    );
                  }}
                >
                  <button type="submit" className="w-full rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
                    Start monthly trial
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await createCheckoutSession(
                      tier.title === "Starter" ? "starter-yearly" : "pro-yearly",
                    );
                  }}
                >
                  <button type="submit" className="w-full rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)]">
                    Start yearly trial
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
        {!featureFlags.stripe ? (
          <p className="mt-6 text-sm text-[var(--muted)]">
            Stripe is not configured in this environment, so checkout safely falls back to a local trial state for testing.
          </p>
        ) : null}
      </section>
    </div>
  );
}
