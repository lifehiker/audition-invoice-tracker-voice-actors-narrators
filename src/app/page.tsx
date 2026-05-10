import Link from "next/link";

import { RoyaltyCalculator } from "@/components/dashboard/royalty-calculator";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Audition pipeline built for ACX",
    copy: "Track every submission, status change, and conversion trend without maintaining a stitched-together spreadsheet.",
  },
  {
    title: "Royalty-share ROI before you commit",
    copy: "Model breakeven timing, 12 and 24 month earnings, and buyout equivalents in narrator language.",
  },
  {
    title: "From booking to invoice to payment",
    copy: "Link projects, invoices, partial payments, due dates, and exclusivity windows from a single dashboard.",
  },
];

export default async function HomePage() {
  return (
    <div className="pb-16">
      <SiteHeader />
      <section className="shell grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[2.5rem] p-8 md:p-12">
          <p className="eyebrow">Narrator-first business stack</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-balance md:text-6xl">
            Replace your ACX spreadsheet with an audition-to-invoice system that actually speaks narrator.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            NarraTrack tracks auditions, bookings, PFH rates, royalty-share projections, invoices, and payments in one place. No client-portal bloat. No generic CRM vocabulary.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/signup" variant="accent">
              Start free 14-day trial
            </Button>
            <Button href="/royalty-share-calculator" variant="secondary">
              Use free ROI calculator
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["30-day conversion", "See booking rate without custom formulas"],
              ["Exclusivity alerts", "Know what is aging out before you miss it"],
              ["Outstanding balance", "Stay on top of what you still need to collect"],
            ].map(([label, copy]) => (
              <div key={label} className="rounded-[1.75rem] bg-white/75 p-5">
                <p className="font-semibold">{label}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Card className="overflow-hidden p-0">
            <div className="bg-[var(--foreground)] px-6 py-5 text-white">
              <p className="eyebrow text-white/70">What makes this different</p>
              <p className="mt-3 text-2xl font-semibold">
                ACX rights types, PFH pricing, royalty-share math, and invoice follow-through in one record.
              </p>
            </div>
            <div className="grid gap-px bg-[var(--line)]">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white px-6 py-5">
                  <p className="font-semibold">{feature.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{feature.copy}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="eyebrow">Free lead magnet</p>
            <h2 className="mt-3 text-2xl font-semibold">Public royalty-share ROI calculator</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Shareable, no-signup, and designed for the ACX narrator communities the product is built for.
            </p>
            <div className="mt-5">
              <Button href="/royalty-share-calculator" variant="secondary">
                Open calculator
              </Button>
            </div>
          </Card>
        </div>
      </section>
      <section className="shell py-12">
        <div className="mb-6">
          <p className="eyebrow">Free tool</p>
          <h2 className="mt-3 text-4xl font-semibold">Model a royalty-share title in under a minute.</h2>
        </div>
        <RoyaltyCalculator
          cta={
            <div className="rounded-3xl bg-[var(--foreground)] p-5 text-white">
              <p className="font-semibold">Want to save the projection?</p>
              <p className="mt-2 text-sm text-white/75">
                The full app stores project comparisons, rate history, and invoice follow-through inside one workspace.
              </p>
              <div className="mt-4">
                <Link href="/signup" className="text-sm font-semibold underline underline-offset-4">
                  Start the trial
                </Link>
              </div>
            </div>
          }
        />
      </section>
    </div>
  );
}
