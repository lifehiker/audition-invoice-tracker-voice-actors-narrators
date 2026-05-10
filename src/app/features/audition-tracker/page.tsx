import { SiteHeader } from "@/components/layout/site-header";

export const metadata = {
  title: "ACX Audition Tracker",
  description:
    "Track audiobook narration auditions, statuses, booking conversions, and rights types with a pipeline designed for ACX narrators.",
};

export default function AuditionTrackerFeaturePage() {
  return (
    <div className="pb-16">
      <SiteHeader />
      <section className="shell py-10">
        <div className="panel rounded-[2.5rem] p-10">
          <p className="eyebrow">Feature</p>
          <h1 className="mt-3 text-5xl font-semibold">ACX audition tracker</h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">
            Log every title, author, client, status, and rights type in a system tuned for ACX and voice actor workflows rather than generic project management.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Status filters for submitted, awaiting, booked, passed, and expired",
              "Rights-type tracking for buyout, royalty-share, and union residual deals",
              "One-click conversion from audition record to booking record",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-white/75 p-5 text-sm leading-7 text-[var(--muted)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
