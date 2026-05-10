import { notFound } from "next/navigation";
import { format } from "date-fns";

import { deleteBookingAction, updateBookingAction } from "@/app/actions/bookings";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireUser } from "@/lib/auth-helpers";
import { getPrisma } from "@/lib/prisma";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const prisma = getPrisma();
  const booking = await prisma.booking.findFirst({
    where: { id, userId: user.id },
    include: { audition: true, invoices: true },
  });

  if (!booking) {
    notFound();
  }

  return (
    <DashboardShell currentPath="/dashboard/bookings">
      <Card>
        <p className="eyebrow">Booking detail</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-semibold">{booking.title}</h1>
          <Badge value={booking.status} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Client</p>
            <p className="mt-2 font-semibold">{booking.clientName}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Rate</p>
            <p className="mt-2 font-semibold">${booking.agreedRate}/{booking.rateType}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Delivery deadline</p>
            <p className="mt-2 font-semibold">{booking.deliveryDeadline ? format(booking.deliveryDeadline, "MMM d, yyyy") : "Not set"}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Exclusivity window</p>
            <p className="mt-2 font-semibold">{booking.exclusivityEnd ? format(booking.exclusivityEnd, "MMM d, yyyy") : "Not set"}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Linked audition</p>
            <p className="mt-2 font-semibold">{booking.audition?.title || "None"}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Linked invoices</p>
            <p className="mt-2 font-semibold">{booking.invoices.length}</p>
          </div>
        </div>
      </Card>
      <Card>
        <p className="eyebrow">Edit booking</p>
        <form action={updateBookingAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={booking.id} />
          <Input name="title" required defaultValue={booking.title} />
          <Input name="clientName" required defaultValue={booking.clientName} />
          <Select name="rightsType" defaultValue={booking.rightsType}>
            {["BUYOUT", "ROYALTY_SHARE", "UNION_RESIDUAL"].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Input name="agreedRate" type="number" step="0.01" required defaultValue={booking.agreedRate} />
          <Select name="rateType" defaultValue={booking.rateType}>
            {["PFH", "FLAT"].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Input name="finishedHours" type="number" step="0.1" defaultValue={booking.finishedHours ?? ""} />
          <Input name="deliveryDeadline" type="date" defaultValue={booking.deliveryDeadline ? booking.deliveryDeadline.toISOString().slice(0, 10) : ""} />
          <Input name="exclusivityStart" type="date" defaultValue={booking.exclusivityStart ? booking.exclusivityStart.toISOString().slice(0, 10) : ""} />
          <Input name="exclusivityEnd" type="date" defaultValue={booking.exclusivityEnd ? booking.exclusivityEnd.toISOString().slice(0, 10) : ""} />
          <Select name="status" defaultValue={booking.status} className="md:col-span-2">
            {["IN_PRODUCTION", "DELIVERED", "PAYMENT_PENDING", "PAID", "DISPUTE"].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Textarea name="notes" defaultValue={booking.notes ?? ""} className="md:col-span-2" />
          <Button type="submit" variant="accent" className="w-fit">
            Save changes
          </Button>
        </form>
        <form action={deleteBookingAction} className="mt-4">
          <input type="hidden" name="id" value={booking.id} />
          <Button type="submit" variant="secondary" className="border-rose-200 text-rose-700">
            Delete booking
          </Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
