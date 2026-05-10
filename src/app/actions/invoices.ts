"use server";

import { InvoiceStatus, PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import { getPrisma } from "@/lib/prisma";

const optionalString = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().optional(),
);

const invoiceSchema = z.object({
  bookingId: optionalString,
  clientName: z.string().min(2),
  amount: z.coerce.number().min(1),
  dueDate: z.string(),
  status: z.nativeEnum(InvoiceStatus),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

export async function createInvoiceAction(formData: FormData) {
  const user = await requireUser();
  const parsed = invoiceSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();

  await prisma.invoice.create({
    data: {
      userId: user.id,
      bookingId: parsed.bookingId || null,
      clientName: parsed.clientName,
      amount: parsed.amount,
      dueDate: new Date(parsed.dueDate),
      status: parsed.status,
      paymentTerms: parsed.paymentTerms,
      notes: parsed.notes,
    },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

export async function updateInvoiceStatusAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const invoice = await prisma.invoice.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
  });
  if (!invoice) {
    return;
  }
  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { status: formData.get("status") as InvoiceStatus },
  });
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

export async function updateInvoiceAction(formData: FormData) {
  const user = await requireUser();
  const parsed = invoiceSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();
  const invoice = await prisma.invoice.findFirstOrThrow({
    where: { id: String(formData.get("id")), userId: user.id },
  });

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      bookingId: parsed.bookingId || null,
      clientName: parsed.clientName,
      amount: parsed.amount,
      dueDate: new Date(parsed.dueDate),
      status: parsed.status,
      paymentTerms: parsed.paymentTerms,
      notes: parsed.notes,
    },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoice.id}`);
  revalidatePath("/dashboard");
}

export async function logPaymentAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const invoice = await prisma.invoice.findFirstOrThrow({
    where: { id: String(formData.get("invoiceId")), userId: user.id },
  });

  await prisma.payment.create({
    data: {
      userId: user.id,
      invoiceId: invoice.id,
      amount: Number(formData.get("amount") || 0),
      paidAt: new Date(String(formData.get("paidAt"))),
      method: formData.get("method") as PaymentMethod,
      notes: String(formData.get("notes") || ""),
    },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoice.id}`);
  revalidatePath("/dashboard");
}

export async function deletePaymentAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const payment = await prisma.payment.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
  });
  if (!payment) {
    return;
  }

  await prisma.payment.delete({
    where: { id: payment.id },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${payment.invoiceId}`);
  revalidatePath("/dashboard");
}

export async function deleteInvoiceAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const invoice = await prisma.invoice.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
  });
  if (!invoice) {
    return;
  }

  await prisma.invoice.delete({
    where: { id: invoice.id },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}
