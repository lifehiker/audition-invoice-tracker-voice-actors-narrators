import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";

function toCsv(rows: Record<string, string | number | null | undefined>[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => `"${String(row[header] ?? "").replaceAll('"', '""')}"`)
        .join(","),
    ),
  ];

  return lines.join("\n");
}

export async function GET(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { type } = await context.params;
  const prisma = getPrisma();

  let rows: Record<string, string | number | null | undefined>[] = [];

  if (type === "auditions") {
    const items = await prisma.audition.findMany({ where: { userId: session.user.id } });
    rows = items.map((item) => ({
      title: item.title,
      author: item.author,
      clientName: item.clientName,
      submittedAt: item.submittedAt.toISOString(),
      status: item.status,
      rightsType: item.rightsType,
    }));
  } else if (type === "bookings") {
    const items = await prisma.booking.findMany({ where: { userId: session.user.id } });
    rows = items.map((item) => ({
      title: item.title,
      clientName: item.clientName,
      agreedRate: item.agreedRate,
      rateType: item.rateType,
      status: item.status,
    }));
  } else if (type === "payments") {
    const items = await prisma.payment.findMany({ where: { userId: session.user.id } });
    rows = items.map((item) => ({
      amount: item.amount,
      paidAt: item.paidAt.toISOString(),
      method: item.method,
      notes: item.notes,
    }));
  } else {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}.csv"`,
    },
  });
}
