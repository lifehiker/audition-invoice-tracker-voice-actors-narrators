"use server";

import { AuditionStatus, RightsType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import { sendAuditionStatusChangeEmail } from "@/lib/email";
import { getPrisma } from "@/lib/prisma";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.coerce.number().optional(),
);

const auditionSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  clientName: z.string().min(2),
  submittedAt: z.string(),
  status: z.nativeEnum(AuditionStatus),
  rightsType: z.nativeEnum(RightsType),
  wordCount: optionalNumber,
  finishedHours: optionalNumber,
  notes: z.string().optional(),
});

export async function createAuditionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = auditionSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();
  await prisma.audition.create({
    data: {
      userId: user.id,
      title: parsed.title,
      author: parsed.author,
      clientName: parsed.clientName,
      submittedAt: new Date(parsed.submittedAt),
      status: parsed.status,
      rightsType: parsed.rightsType,
      wordCount: parsed.wordCount,
      finishedHours: parsed.finishedHours,
      notes: parsed.notes,
    },
  });
  revalidatePath("/dashboard/auditions");
  revalidatePath("/dashboard");
}

export async function updateAuditionStatusAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const status = formData.get("status") as AuditionStatus;
  const prisma = getPrisma();
  const existing = await prisma.audition.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) {
    return;
  }
  const updated = await prisma.audition.update({
    where: { id: existing.id },
    data: { status },
  });
  await sendAuditionStatusChangeEmail(
    { email: user.email || "", name: user.name },
    updated.title,
    updated.status,
  );
  revalidatePath("/dashboard/auditions");
  revalidatePath("/dashboard");
}

export async function convertAuditionToBookingAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const audition = await prisma.audition.findUniqueOrThrow({
    where: { id: String(formData.get("id")), userId: user.id },
  });

  await prisma.audition.update({
    where: { id: audition.id },
    data: { status: AuditionStatus.BOOKED },
  });

  await prisma.booking.create({
    data: {
      userId: user.id,
      auditionId: audition.id,
      title: audition.title,
      clientName: audition.clientName,
      rightsType: audition.rightsType,
      agreedRate: Number(formData.get("agreedRate") || 225),
      rateType: String(formData.get("rateType") || "PFH") as "FLAT" | "PFH",
      finishedHours: audition.finishedHours,
      deliveryDeadline: formData.get("deliveryDeadline")
        ? new Date(String(formData.get("deliveryDeadline")))
        : null,
      status: "IN_PRODUCTION",
    },
  });

  revalidatePath("/dashboard/auditions");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
}

export async function deleteAuditionAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const audition = await prisma.audition.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
    include: { booking: true },
  });
  if (!audition) {
    return;
  }

  if (audition.booking) {
    await prisma.booking.delete({
      where: { id: audition.booking.id },
    });
  }

  await prisma.audition.delete({
    where: { id: audition.id },
  });

  revalidatePath("/dashboard/auditions");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
}
