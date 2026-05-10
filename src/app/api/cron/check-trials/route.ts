import { addDays } from "date-fns";
import { NextResponse } from "next/server";

import { sendTrialEndingReminder } from "@/lib/email";
import { env } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (request.headers.get("x-cron-secret") !== env.cronSecret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const prisma = getPrisma();
  const users = await prisma.user.findMany({
    where: {
      trialEndsAt: {
        gte: new Date(),
        lte: addDays(new Date(), 2),
      },
    },
  });

  for (const user of users) {
    if (user.trialEndsAt) {
      await sendTrialEndingReminder(user, user.trialEndsAt.toDateString());
    }
  }

  return NextResponse.json({ processed: users.length });
}
