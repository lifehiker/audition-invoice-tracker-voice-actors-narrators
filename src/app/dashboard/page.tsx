import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { currency, decimal } from "@/lib/utils";
import { getDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/auth-helpers";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <DashboardShell currentPath="/dashboard">
      <section className="panel rounded-[2.5rem] p-8">
        <p className="eyebrow">Overview</p>
        <h1 className="mt-3 text-4xl font-semibold">Your narrator business at a glance</h1>
        <p className="mt-3 max-w-3xl text-[var(--muted)]">
          Track how much is converting, what is still outstanding, and which royalty-share titles are acting like recurring revenue.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Auditions" value={String(data.metrics.activeAuditions)} helper="Submitted or awaiting response" />
        <StatCard label="30-Day Conversion" value={`${decimal(data.metrics.conversion30)}%`} helper={`90-day: ${decimal(data.metrics.conversion90)}%`} />
        <StatCard label="Outstanding Balance" value={currency(data.metrics.outstanding)} helper="Across sent and overdue invoices" />
        <StatCard label="Royalty MRR Equivalent" value={currency(data.metrics.royaltyMonthly)} helper="Projected monthly royalty income" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="eyebrow">Next exclusivity milestone</p>
          <h2 className="mt-3 text-2xl font-semibold">
            {data.metrics.nextExpiry?.title || "Nothing expiring soon"}
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            {data.metrics.nextExpiry?.exclusivityEnd
              ? format(data.metrics.nextExpiry.exclusivityEnd, "MMM d, yyyy")
              : "Add exclusivity dates to your bookings to track renegotiation windows."}
          </p>
        </Card>
        <Card>
          <p className="eyebrow">This month</p>
          <h2 className="mt-3 text-2xl font-semibold">{currency(data.metrics.monthlyPayments)}</h2>
          <p className="mt-2 text-[var(--muted)]">Payments recorded since the start of the current month.</p>
        </Card>
      </section>
    </DashboardShell>
  );
}
