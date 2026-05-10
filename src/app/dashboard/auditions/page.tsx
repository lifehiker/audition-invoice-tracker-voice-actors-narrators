import { format } from "date-fns";

import {
  convertAuditionToBookingAction,
  createAuditionAction,
  deleteAuditionAction,
  updateAuditionStatusAction,
} from "@/app/actions/auditions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireUser } from "@/lib/auth-helpers";
import { getDashboardData } from "@/lib/data";

export default async function AuditionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    rightsType?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const filters = await searchParams;
  const filteredAuditions = data.auditions.filter((audition) => {
    if (filters.status && audition.status !== filters.status) {
      return false;
    }

    if (filters.rightsType && audition.rightsType !== filters.rightsType) {
      return false;
    }

    if (filters.from && audition.submittedAt < new Date(filters.from)) {
      return false;
    }

    if (filters.to) {
      const endOfDay = new Date(filters.to);
      endOfDay.setHours(23, 59, 59, 999);
      if (audition.submittedAt > endOfDay) {
        return false;
      }
    }

    return true;
  });

  return (
    <DashboardShell currentPath="/dashboard/auditions">
      <Card>
        <p className="eyebrow">Add audition</p>
        <form action={createAuditionAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input name="title" required placeholder="Title" />
          <Input name="author" required placeholder="Author" />
          <Input name="clientName" required placeholder="Client or publisher" />
          <Input name="submittedAt" type="date" required />
          <Select name="status" defaultValue="SUBMITTED">
            {["SUBMITTED", "AWAITING", "BOOKED", "PASSED", "EXPIRED"].map((status) => <option key={status}>{status}</option>)}
          </Select>
          <Select name="rightsType" defaultValue="BUYOUT">
            {["BUYOUT", "ROYALTY_SHARE", "UNION_RESIDUAL"].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Input name="wordCount" type="number" placeholder="Word count" />
          <Input name="finishedHours" type="number" step="0.1" placeholder="Finished hours" />
          <Textarea name="notes" placeholder="Notes" className="md:col-span-2" />
          <Button type="submit" variant="accent" className="w-fit">
            Save audition
          </Button>
        </form>
      </Card>
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h1 className="mt-2 text-3xl font-semibold">Auditions</h1>
          </div>
          <form className="grid gap-3 md:grid-cols-4">
            <Select name="status" defaultValue={filters.status || ""}>
              <option value="">All statuses</option>
              {["SUBMITTED", "AWAITING", "BOOKED", "PASSED", "EXPIRED"].map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <Select name="rightsType" defaultValue={filters.rightsType || ""}>
              <option value="">All rights types</option>
              {["BUYOUT", "ROYALTY_SHARE", "UNION_RESIDUAL"].map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <Input name="from" type="date" defaultValue={filters.from || ""} />
            <div className="flex gap-3">
              <Input name="to" type="date" defaultValue={filters.to || ""} />
              <Button type="submit" variant="secondary">
                Filter
              </Button>
            </div>
          </form>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Submitted</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Rights</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditions.map((audition) => (
                <tr key={audition.id} className="border-t border-[var(--line)]">
                  <td className="py-4 font-medium">{audition.title}<div className="text-xs text-[var(--muted)]">{audition.clientName}</div></td>
                  <td className="py-4">{audition.author}</td>
                  <td className="py-4">{format(audition.submittedAt, "MMM d, yyyy")}</td>
                  <td className="py-4"><Badge value={audition.status} /></td>
                  <td className="py-4"><Badge value={audition.rightsType} /></td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <form action={updateAuditionStatusAction}>
                        <input type="hidden" name="id" value={audition.id} />
                        <input type="hidden" name="status" value="BOOKED" />
                        <button type="submit" className="rounded-full border border-[var(--line)] px-3 py-1.5">Mark booked</button>
                      </form>
                      {!audition.booking ? (
                        <form action={convertAuditionToBookingAction} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={audition.id} />
                          <input type="hidden" name="agreedRate" value="225" />
                          <input type="hidden" name="rateType" value="PFH" />
                          <button type="submit" className="rounded-full bg-[var(--foreground)] px-3 py-1.5 text-white">Convert</button>
                        </form>
                      ) : null}
                      <form action={deleteAuditionAction}>
                        <input type="hidden" name="id" value={audition.id} />
                        <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-700">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAuditions.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">No auditions match the current filters.</p>
        ) : null}
      </Card>
    </DashboardShell>
  );
}
