import { addDays } from "date-fns";
import { NextResponse } from "next/server";

import { sendExclusivityWindowAlert } from "@/lib/email";
import { env } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (request.headers.get("x-cron-secret") !== env.cronSecret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const prisma = getPrisma();
  const bookings = await prisma.booking.findMany({
    where: {
      exclusivityEnd: {
        gte: new Date(),
        lte: addDays(new Date(), 7),
      },
    },
    include: { user: true },
  });

  for (const booking of bookings) {
    if (booking.exclusivityEnd) {
      await sendExclusivityWindowAlert(
        booking.user,
        booking.title,
        booking.exclusivityEnd.toDateString(),
      );
    }
  }

  return NextResponse.json({ processed: bookings.length });
}
