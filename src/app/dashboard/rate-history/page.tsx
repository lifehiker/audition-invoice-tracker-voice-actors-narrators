import { format } from "date-fns";

import { createRateEntryAction, deleteRateEntryAction } from "@/app/actions/rates";
import { RateHistoryChart } from "@/components/charts/rate-history-chart";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireUser } from "@/lib/auth-helpers";
import { getDashboardData } from "@/lib/data";

export default async function RateHistoryPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  const chartData = data.rateEntries.map((entry) => ({
    label: format(entry.recordedAt, "MMM yyyy"),
    rate: entry.ratePerFinishedHour,
    benchmark: data.user?.benchmarkRate || 225,
  }));

  return (
    <DashboardShell currentPath="/dashboard/rate-history">
      <Card>
        <p className="eyebrow">Benchmarking</p>
        <h1 className="mt-2 text-3xl font-semibold">PFH rate history</h1>
        <div className="mt-6">
          <RateHistoryChart data={chartData} />
        </div>
      </Card>
      <Card>
        <p className="eyebrow">Add rate entry</p>
        <form action={createRateEntryAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input name="clientName" required placeholder="Client name" />
          <Select name="rightsType" defaultValue="BUYOUT">{["BUYOUT", "ROYALTY_SHARE", "UNION_RESIDUAL"].map((item) => <option key={item}>{item}</option>)}</Select>
          <Input name="ratePerFinishedHour" type="number" step="0.01" required placeholder="PFH rate" />
          <Input name="benchmarkRate" type="number" step="0.01" defaultValue={data.user?.benchmarkRate || 225} />
          <Input name="recordedAt" type="date" required />
          <Input name="notes" placeholder="Notes" />
          <Button type="submit" variant="accent" className="w-fit">
            Save rate entry
          </Button>
        </form>
        <div className="mt-8 space-y-3">
          {data.rateEntries.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/75 p-4">
              <div>
                <p className="font-semibold">{entry.clientName}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {entry.rightsType.replaceAll("_", " ")} • ${entry.ratePerFinishedHour} PFH • {format(entry.recordedAt, "MMM d, yyyy")}
                </p>
              </div>
              <form action={deleteRateEntryAction}>
                <input type="hidden" name="id" value={entry.id} />
                <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-sm text-rose-700">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
