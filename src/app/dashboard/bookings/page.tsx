import Link from "next/link";
import { format } from "date-fns";

import { createBookingAction, deleteBookingAction, updateBookingStatusAction } from "@/app/actions/bookings";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireUser } from "@/lib/auth-helpers";
import { getDashboardData } from "@/lib/data";

export default async function BookingsPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <DashboardShell currentPath="/dashboard/bookings">
      <Card>
        <p className="eyebrow">Add booking</p>
        <form action={createBookingAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input name="title" required placeholder="Title" />
          <Input name="clientName" required placeholder="Client name" />
          <Select name="rightsType" defaultValue="BUYOUT">{["BUYOUT", "ROYALTY_SHARE", "UNION_RESIDUAL"].map((item) => <option key={item}>{item}</option>)}</Select>
          <Input name="agreedRate" type="number" step="0.01" required placeholder="Agreed rate" />
          <Select name="rateType" defaultValue="PFH">{["PFH", "FLAT"].map((item) => <option key={item}>{item}</option>)}</Select>
          <Input name="finishedHours" type="number" step="0.1" placeholder="Finished hours" />
          <Input name="deliveryDeadline" type="date" />
          <Input name="exclusivityStart" type="date" />
          <Input name="exclusivityEnd" type="date" />
          <Select name="status" defaultValue="IN_PRODUCTION" className="md:col-span-2">{["IN_PRODUCTION", "DELIVERED", "PAYMENT_PENDING", "PAID", "DISPUTE"].map((item) => <option key={item}>{item}</option>)}</Select>
          <Textarea name="notes" placeholder="Notes" className="md:col-span-2" />
          <Button type="submit" variant="accent" className="w-fit">
            Save booking
          </Button>
        </form>
      </Card>
      <Card>
        <p className="eyebrow">Projects</p>
        <h1 className="mt-2 text-3xl font-semibold">Bookings</h1>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Rate</th>
                <th className="pb-3">Hours</th>
                <th className="pb-3">Exclusivity end</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-[var(--line)]">
                  <td className="py-4 font-medium"><Link href={`/dashboard/bookings/${booking.id}`}>{booking.title}</Link><div className="text-xs text-[var(--muted)]">{booking.clientName}</div></td>
                  <td className="py-4">${booking.agreedRate}/{booking.rateType}</td>
                  <td className="py-4">{booking.finishedHours || "—"}</td>
                  <td className="py-4">{booking.exclusivityEnd ? format(booking.exclusivityEnd, "MMM d, yyyy") : "—"}</td>
                  <td className="py-4"><Badge value={booking.status} /></td>
                  <td className="py-4">
                    <form action={updateBookingStatusAction}>
                      <input type="hidden" name="id" value={booking.id} />
                      <input type="hidden" name="status" value="DELIVERED" />
                      <button type="submit" className="rounded-full border border-[var(--line)] px-3 py-1.5">Mark delivered</button>
                    </form>
                    <form action={deleteBookingAction}>
                      <input type="hidden" name="id" value={booking.id} />
                      <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-700">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
