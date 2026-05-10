"use server";

import { BookingStatus, RateType, RightsType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth-helpers";
import { getPrisma } from "@/lib/prisma";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.coerce.number().optional(),
);
const optionalString = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().optional(),
);

const bookingSchema = z.object({
  title: z.string().min(2),
  clientName: z.string().min(2),
  rightsType: z.nativeEnum(RightsType),
  agreedRate: z.coerce.number().min(0),
  rateType: z.nativeEnum(RateType),
  finishedHours: optionalNumber,
  deliveryDeadline: optionalString,
  exclusivityStart: optionalString,
  exclusivityEnd: optionalString,
  status: z.nativeEnum(BookingStatus),
  notes: z.string().optional(),
});

export async function createBookingAction(formData: FormData) {
  const user = await requireUser();
  const parsed = bookingSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();

  await prisma.booking.create({
    data: {
      userId: user.id,
      title: parsed.title,
      clientName: parsed.clientName,
      rightsType: parsed.rightsType,
      agreedRate: parsed.agreedRate,
      rateType: parsed.rateType,
      finishedHours: parsed.finishedHours,
      deliveryDeadline: parsed.deliveryDeadline ? new Date(parsed.deliveryDeadline) : null,
      exclusivityStart: parsed.exclusivityStart ? new Date(parsed.exclusivityStart) : null,
      exclusivityEnd: parsed.exclusivityEnd ? new Date(parsed.exclusivityEnd) : null,
      status: parsed.status,
      notes: parsed.notes,
    },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
}

export async function updateBookingStatusAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const booking = await prisma.booking.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
  });
  if (!booking) {
    return;
  }
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: formData.get("status") as BookingStatus,
    },
  });
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
}

export async function updateBookingAction(formData: FormData) {
  const user = await requireUser();
  const parsed = bookingSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();
  const booking = await prisma.booking.findFirstOrThrow({
    where: { id: String(formData.get("id")), userId: user.id },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      title: parsed.title,
      clientName: parsed.clientName,
      rightsType: parsed.rightsType,
      agreedRate: parsed.agreedRate,
      rateType: parsed.rateType,
      finishedHours: parsed.finishedHours,
      deliveryDeadline: parsed.deliveryDeadline ? new Date(parsed.deliveryDeadline) : null,
      exclusivityStart: parsed.exclusivityStart ? new Date(parsed.exclusivityStart) : null,
      exclusivityEnd: parsed.exclusivityEnd ? new Date(parsed.exclusivityEnd) : null,
      status: parsed.status,
      notes: parsed.notes,
    },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath(`/dashboard/bookings/${booking.id}`);
  revalidatePath("/dashboard");
}

export async function deleteBookingAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const booking = await prisma.booking.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
  });
  if (!booking) {
    return;
  }

  await prisma.booking.delete({
    where: { id: booking.id },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/royalty-share");
  revalidatePath("/dashboard");
}
