import {
  AuditionStatus,
  BookingStatus,
  InvoiceStatus,
  RightsType,
  SubscriptionStatus,
  SubscriptionTier,
} from "@prisma/client";
import { addDays, startOfMonth, subDays } from "date-fns";

import { getPrisma } from "@/lib/prisma";
import { calculateRoyaltyProjection } from "@/lib/royalty-calculations";

export async function ensureUserDefaults(userId: string) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        auditions: true,
        bookings: true,
        invoices: true,
        rateEntries: true,
        royaltyProjects: true,
      },
    });

    if (!user) {
      return null;
    }

    if (user.seededAt) {
      return user;
    }

    if (
      user.auditions.length > 0 ||
      user.bookings.length > 0 ||
      user.invoices.length > 0 ||
      user.rateEntries.length > 0 ||
      user.royaltyProjects.length > 0
    ) {
      await tx.user.update({
        where: { id: userId },
        data: { seededAt: new Date() },
      });
      return user;
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: SubscriptionTier.PRO,
        subscriptionStatus: SubscriptionStatus.TRIAL,
        trialEndsAt: addDays(new Date(), 14),
        seededAt: new Date(),
      },
    });

    const bookedAudition = await tx.audition.create({
      data: {
        userId,
        title: "Ashes of Empire",
        author: "Daniel Mercer",
        wordCount: 97000,
        finishedHours: 11.2,
        clientName: "Copperline Publishing",
        submittedAt: subDays(new Date(), 31),
        status: AuditionStatus.BOOKED,
        rightsType: RightsType.BUYOUT,
      },
    });

    await tx.audition.create({
      data: {
        userId,
        title: "The Quiet Harbor",
        author: "Lena West",
        wordCount: 76000,
        finishedHours: 8.5,
        clientName: "Northbound Audio",
        submittedAt: subDays(new Date(), 9),
        status: AuditionStatus.AWAITING,
        rightsType: RightsType.ROYALTY_SHARE,
        notes: "Warm literary tone requested.",
      },
    });

    const booking = await tx.booking.create({
      data: {
        userId,
        auditionId: bookedAudition.id,
        title: bookedAudition.title,
        clientName: bookedAudition.clientName,
        rightsType: bookedAudition.rightsType,
        agreedRate: 250,
        rateType: "PFH",
        finishedHours: 11.2,
        deliveryDeadline: addDays(new Date(), 12),
        exclusivityStart: subDays(new Date(), 80),
        exclusivityEnd: addDays(new Date(), 24),
        status: BookingStatus.PAYMENT_PENDING,
      },
    });

    const invoice = await tx.invoice.create({
      data: {
        userId,
        bookingId: booking.id,
        clientName: booking.clientName,
        amount: 2800,
        dueDate: addDays(new Date(), 7),
        status: InvoiceStatus.SENT,
        paymentTerms: "Net 14",
      },
    });

    await tx.payment.create({
      data: {
        userId,
        invoiceId: invoice.id,
        amount: 1400,
        paidAt: subDays(new Date(), 2),
        method: "PAYPAL",
        notes: "Deposit received.",
      },
    });

    await tx.royaltyShareProject.create({
      data: {
        userId,
        title: "The Quiet Harbor",
        finishedHours: 8.5,
        royaltySplitPercent: 20,
        acxRetailPrice: 19.95,
        estimatedMonthlySales: 55,
        buyoutEquivalentRate: 225,
      },
    });

    await tx.rateEntry.createMany({
      data: [
        {
          userId,
          clientName: "Copperline Publishing",
          rightsType: RightsType.BUYOUT,
          ratePerFinishedHour: 220,
          recordedAt: subDays(new Date(), 120),
        },
        {
          userId,
          clientName: "Northbound Audio",
          rightsType: RightsType.ROYALTY_SHARE,
          ratePerFinishedHour: 235,
          recordedAt: subDays(new Date(), 60),
        },
        {
          userId,
          clientName: "Copperline Publishing",
          rightsType: RightsType.BUYOUT,
          ratePerFinishedHour: 250,
          recordedAt: startOfMonth(new Date()),
        },
      ],
    });

    return user;
  });
}

export async function getDashboardData(userId: string) {
  const prisma = getPrisma();
  await ensureUserDefaults(userId);

  const [auditions, bookings, invoices, payments, rateEntries, royaltyProjects, user] =
    await Promise.all([
      prisma.audition.findMany({
        where: { userId },
        include: { booking: true },
        orderBy: { submittedAt: "desc" },
      }),
      prisma.booking.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
      prisma.invoice.findMany({
        where: { userId },
        include: { payments: true },
        orderBy: { dueDate: "asc" },
      }),
      prisma.payment.findMany({ where: { userId }, orderBy: { paidAt: "desc" } }),
      prisma.rateEntry.findMany({ where: { userId }, orderBy: { recordedAt: "asc" } }),
      prisma.royaltyShareProject.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

  const thirtyDaysAgo = subDays(new Date(), 30);
  const ninetyDaysAgo = subDays(new Date(), 90);
  const within30 = auditions.filter((item) => item.submittedAt >= thirtyDaysAgo);
  const within90 = auditions.filter((item) => item.submittedAt >= ninetyDaysAgo);
  const conversion30 =
    within30.length === 0
      ? 0
      : (within30.filter((item) => item.status === AuditionStatus.BOOKED).length / within30.length) *
        100;
  const conversion90 =
    within90.length === 0
      ? 0
      : (within90.filter((item) => item.status === AuditionStatus.BOOKED).length / within90.length) *
        100;
  const outstanding = invoices.reduce((sum, invoice) => {
    const paid = invoice.payments.reduce((inner, payment) => inner + payment.amount, 0);
    return sum + Math.max(invoice.amount - paid, 0);
  }, 0);
  const monthlyPayments = payments
    .filter((payment) => payment.paidAt >= startOfMonth(new Date()))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const nextExpiry = bookings
    .filter((booking) => booking.exclusivityEnd)
    .sort((a, b) => (a.exclusivityEnd!.getTime() > b.exclusivityEnd!.getTime() ? 1 : -1))[0];
  const royaltyMonthly = royaltyProjects.reduce((sum, project) => {
    return sum + calculateRoyaltyProjection(project).monthlyRoyalty;
  }, 0);

  return {
    user,
    auditions,
    bookings,
    invoices,
    payments,
    rateEntries,
    royaltyProjects,
    metrics: {
      activeAuditions: auditions.filter(
        (item) =>
          item.status === AuditionStatus.SUBMITTED ||
          item.status === AuditionStatus.AWAITING,
      ).length,
      conversion30,
      conversion90,
      outstanding,
      monthlyPayments,
      nextExpiry,
      royaltyMonthly,
    },
  };
}
