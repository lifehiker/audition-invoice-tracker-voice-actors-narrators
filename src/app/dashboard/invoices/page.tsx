import Link from "next/link";
import { format } from "date-fns";

import {
  createInvoiceAction,
  deleteInvoiceAction,
  updateInvoiceStatusAction,
} from "@/app/actions/invoices";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireUser } from "@/lib/auth-helpers";
import { getDashboardData } from "@/lib/data";

export default async function InvoicesPage() {
  let user: Awaited<ReturnType<typeof requireUser>>;
  let data: Awaited<ReturnType<typeof getDashboardData>>;
  try {
    user = await requireUser();
    data = await getDashboardData(user.id);
  } catch (e: unknown) {
    if (e instanceof Error && (e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    return (
      <DashboardShell currentPath="/dashboard/invoices">
        <p className="text-[var(--muted)]">Unable to load invoices. Please refresh.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell currentPath="/dashboard/invoices">
      <Card>
        <p className="eyebrow">Create invoice</p>
        <form action={createInvoiceAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <Select name="bookingId">
            <option value="">Optional booking link</option>
            {data.bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.title}
              </option>
            ))}
          </Select>
          <Input name="clientName" required placeholder="Client name" />
          <Input name="amount" type="number" step="0.01" required placeholder="Amount" />
          <Input name="dueDate" type="date" required />
          <Select name="status" defaultValue="DRAFT">{["DRAFT", "SENT", "PAID", "OVERDUE"].map((item) => <option key={item}>{item}</option>)}</Select>
          <Input name="paymentTerms" placeholder="Payment terms" />
          <Textarea name="notes" placeholder="Notes" className="md:col-span-2" />
          <Button type="submit" variant="accent" className="w-fit">
            Save invoice
          </Button>
        </form>
      </Card>
      <Card>
        <p className="eyebrow">Invoices</p>
        <h1 className="mt-2 text-3xl font-semibold">Invoices & payments</h1>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="pb-3">Client</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Due</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Outstanding</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((invoice) => {
                const paid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
                return (
                  <tr key={invoice.id} className="border-t border-[var(--line)]">
                    <td className="py-4 font-medium"><Link href={`/dashboard/invoices/${invoice.id}`}>{invoice.clientName}</Link></td>
                    <td className="py-4">${invoice.amount}</td>
                    <td className="py-4">{format(invoice.dueDate, "MMM d, yyyy")}</td>
                    <td className="py-4"><Badge value={invoice.status} /></td>
                    <td className="py-4">${Math.max(invoice.amount - paid, 0)}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <form action={updateInvoiceStatusAction}>
                          <input type="hidden" name="id" value={invoice.id} />
                          <input type="hidden" name="status" value="PAID" />
                          <button type="submit" className="rounded-full border border-[var(--line)] px-3 py-1.5">Mark paid</button>
                        </form>
                        <form action={deleteInvoiceAction}>
                          <input type="hidden" name="id" value={invoice.id} />
                          <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-700">Delete</button>
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
