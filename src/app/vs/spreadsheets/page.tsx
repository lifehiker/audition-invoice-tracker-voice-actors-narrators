import { SiteHeader } from "@/components/layout/site-header";

export default function VsSpreadsheetsPage() {
  return (
    <div className="pb-16">
      <SiteHeader />
      <section className="shell py-10">
        <div className="panel rounded-[2.5rem] p-10">
          <p className="eyebrow">Comparison</p>
          <h1 className="mt-3 text-5xl font-semibold">NarraTrack vs. ACX spreadsheet templates</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white/75 p-6">
              <p className="font-semibold">Spreadsheet template</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                <li>• Manual formulas and duplicate data entry</li>
                <li>• No invoice or payment linkage</li>
                <li>• No automated reminders or rights-type logic</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-[var(--foreground)] p-6 text-white">
              <p className="font-semibold">NarraTrack</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>• Audition to booking to invoice pipeline in one record</li>
                <li>• Built-in royalty-share math and PFH benchmarking</li>
                <li>• Exportable data with guarded billing and email workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
