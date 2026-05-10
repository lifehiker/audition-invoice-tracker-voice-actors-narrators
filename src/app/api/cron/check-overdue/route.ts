import { InvoiceStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { sendOverdueInvoiceReminder } from "@/lib/email";
import { env } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (request.headers.get("x-cron-secret") !== env.cronSecret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const prisma = getPrisma();
  const overdue = await prisma.invoice.findMany({
    where: {
      dueDate: { lt: new Date() },
      status: InvoiceStatus.SENT,
    },
    include: { user: true },
  });

  for (const invoice of overdue) {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: InvoiceStatus.OVERDUE },
    });
    await sendOverdueInvoiceReminder(invoice.user, invoice.clientName);
  }

  return NextResponse.json({ processed: overdue.length });
}
