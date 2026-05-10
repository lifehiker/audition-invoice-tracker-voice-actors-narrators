import { createRoyaltyProjectAction, deleteRoyaltyProjectAction } from "@/app/actions/royalty-share";
import { RoyaltyCalculator } from "@/components/dashboard/royalty-calculator";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireUser, userHasProAccess } from "@/lib/auth-helpers";
import { getDashboardData } from "@/lib/data";
import { calculateRoyaltyProjection } from "@/lib/royalty-calculations";
import { currency } from "@/lib/utils";

export default async function RoyaltySharePage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  if (!userHasProAccess(user)) {
    return (
      <DashboardShell currentPath="/dashboard/royalty-share">
        <Card>
          <p className="eyebrow">Pro feature</p>
          <h1 className="mt-3 text-4xl font-semibold">Royalty-share ROI is available on Pro.</h1>
          <p className="mt-3 text-[var(--muted)]">
            This environment still keeps the page functional. Upgrade from pricing to unlock saved comparison workflows.
          </p>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell currentPath="/dashboard/royalty-share">
      <RoyaltyCalculator />
      <Card>
        <p className="eyebrow">Save title projection</p>
        <form action={createRoyaltyProjectAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input name="title" required placeholder="Title" />
          <Input name="finishedHours" type="number" step="0.1" required placeholder="Finished hours" />
          <Input name="royaltySplitPercent" type="number" step="0.1" required placeholder="Royalty split %" />
          <Input name="acxRetailPrice" type="number" step="0.01" required placeholder="Retail price" />
          <Input name="estimatedMonthlySales" type="number" step="0.1" required placeholder="Monthly sales estimate" />
          <Input name="buyoutEquivalentRate" type="number" step="0.01" required placeholder="Buyout PFH rate" />
          <Button type="submit" variant="accent" className="w-fit">
            Save comparison
          </Button>
        </form>
      </Card>
      <Card>
        <p className="eyebrow">Saved comparisons</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Buyout equivalent</th>
                <th className="pb-3">12 months</th>
                <th className="pb-3">24 months</th>
                <th className="pb-3">Breakeven</th>
              </tr>
            </thead>
            <tbody>
              {data.royaltyProjects.map((project) => {
                const projection = calculateRoyaltyProjection(project);
                return (
                  <tr key={project.id} className="border-t border-[var(--line)]">
                    <td className="py-4 font-medium">{project.title}</td>
                    <td className="py-4">{currency(projection.buyoutEquivalent)}</td>
                    <td className="py-4">{currency(projection.projected12Months)}</td>
                    <td className="py-4">{currency(projection.projected24Months)}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>{projection.breakevenMonth ?? "Not reached"}</span>
                        <form action={deleteRoyaltyProjectAction}>
                          <input type="hidden" name="id" value={project.id} />
                          <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-sm text-rose-700">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
