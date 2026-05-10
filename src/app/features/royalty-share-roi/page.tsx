import { SiteHeader } from "@/components/layout/site-header";

export const metadata = {
  title: "Royalty-Share ROI",
  description:
    "Model buyout-equivalent PFH rates, breakeven timing, and 12/24 month earnings for ACX royalty-share titles.",
};

export default function RoyaltyFeaturePage() {
  return (
    <div className="pb-16">
      <SiteHeader />
      <section className="shell py-10">
        <div className="panel rounded-[2.5rem] p-10">
          <p className="eyebrow">Feature</p>
          <h1 className="mt-3 text-5xl font-semibold">Royalty-share ROI built for narrator decisions</h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">
            See what a title needs to sell before it outperforms a buyout. Compare multiple books side-by-side and keep the projection with the rest of your business data.
          </p>
        </div>
      </section>
    </div>
  );
}
