import Link from "next/link";

import { RoyaltyCalculator } from "@/components/dashboard/royalty-calculator";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata = {
  title: "ACX Royalty Share Calculator",
  description:
    "Free ACX royalty share calculator for audiobook narrators. Project breakeven timing and compare against buyout PFH equivalents.",
};

export default function PublicRoyaltyCalculatorPage() {
  return (
    <div className="pb-16">
      <SiteHeader />
      <section className="shell py-10">
        <div className="max-w-3xl">
          <p className="eyebrow">Free calculator</p>
          <h1 className="mt-3 text-5xl font-semibold">ACX royalty-share ROI calculator</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Estimate breakeven timing, 12-month earnings, and 24-month upside before you say yes to a royalty-share offer.
          </p>
        </div>
        <div className="mt-10">
          <RoyaltyCalculator
            cta={
              <div className="rounded-3xl bg-[var(--foreground)] p-5 text-white">
                <p className="font-semibold">Save this along with every ACX project.</p>
                <p className="mt-2 text-sm text-white/75">
                  NarraTrack stores the calculation beside your booking, invoices, and payout history.
                </p>
                <Link href="/signup" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
                  Start the 14-day trial
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}
