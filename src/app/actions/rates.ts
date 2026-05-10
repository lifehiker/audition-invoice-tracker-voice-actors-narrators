"use server";

import { RightsType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-helpers";
import { getPrisma } from "@/lib/prisma";

export async function createRateEntryAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();

  await prisma.rateEntry.create({
    data: {
      userId: user.id,
      clientName: String(formData.get("clientName")),
      rightsType: formData.get("rightsType") as RightsType,
      ratePerFinishedHour: Number(formData.get("ratePerFinishedHour")),
      recordedAt: new Date(String(formData.get("recordedAt"))),
      notes: String(formData.get("notes") || ""),
    },
  });

  if (formData.get("benchmarkRate")) {
    await prisma.user.update({
      where: { id: user.id },
      data: { benchmarkRate: Number(formData.get("benchmarkRate")) },
    });
  }

  revalidatePath("/dashboard/rate-history");
  revalidatePath("/dashboard");
}

export async function deleteRateEntryAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const entry = await prisma.rateEntry.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
  });
  if (!entry) {
    return;
  }

  await prisma.rateEntry.delete({
    where: { id: entry.id },
  });

  revalidatePath("/dashboard/rate-history");
  revalidatePath("/dashboard");
}
