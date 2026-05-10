import { notFound } from "next/navigation";
import { format } from "date-fns";

import {
  deleteInvoiceAction,
  deletePaymentAction,
  logPaymentAction,
  updateInvoiceAction,
} from "@/app/actions/invoices";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireUser } from "@/lib/auth-helpers";
import { getPrisma } from "@/lib/prisma";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const prisma = getPrisma();
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
    include: { payments: true, booking: true },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <DashboardShell currentPath="/dashboard/invoices">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-semibold">{invoice.clientName}</h1>
          <Badge value={invoice.status} />
        </div>
        <p className="mt-3 text-[var(--muted)]">
          Due {format(invoice.dueDate, "MMM d, yyyy")} • Linked booking: {invoice.booking?.title || "None"}
        </p>
      </Card>
      <Card>
        <p className="eyebrow">Log payment</p>
        <form action={logPaymentAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <Input name="amount" type="number" step="0.01" required placeholder="Amount received" />
          <Input name="paidAt" type="date" required />
          <Select name="method" defaultValue="PAYPAL">{["ACX_DIRECT", "PAYPAL", "CHECK", "BANK_TRANSFER", "OTHER"].map((item) => <option key={item}>{item}</option>)}</Select>
          <Input name="notes" placeholder="Notes" />
          <Button type="submit" variant="accent" className="w-fit">
            Log payment
          </Button>
        </form>
      </Card>
      <Card>
        <p className="eyebrow">Edit invoice</p>
        <form action={updateInvoiceAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={invoice.id} />
          <Input name="clientName" required defaultValue={invoice.clientName} />
          <Input name="amount" type="number" step="0.01" required defaultValue={invoice.amount} />
          <Input name="dueDate" type="date" required defaultValue={invoice.dueDate.toISOString().slice(0, 10)} />
          <Select name="status" defaultValue={invoice.status}>
            {["DRAFT", "SENT", "PAID", "OVERDUE"].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Input name="paymentTerms" defaultValue={invoice.paymentTerms ?? ""} />
          <Input name="notes" defaultValue={invoice.notes ?? ""} className="md:col-span-2" />
          <Button type="submit" variant="accent" className="w-fit">
            Save invoice
          </Button>
        </form>
        <form action={deleteInvoiceAction} className="mt-4">
          <input type="hidden" name="id" value={invoice.id} />
          <Button type="submit" variant="secondary" className="border-rose-200 text-rose-700">
            Delete invoice
          </Button>
        </form>
      </Card>
      <Card>
        <p className="eyebrow">Payment history</p>
        <div className="mt-4 space-y-3">
          {invoice.payments.map((payment) => (
            <div key={payment.id} className="rounded-3xl bg-white/75 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">${payment.amount}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {payment.method.replaceAll("_", " ")} • {format(payment.paidAt, "MMM d, yyyy")}
                  </p>
                </div>
                <form action={deletePaymentAction}>
                  <input type="hidden" name="id" value={payment.id} />
                  <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-sm text-rose-700">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
