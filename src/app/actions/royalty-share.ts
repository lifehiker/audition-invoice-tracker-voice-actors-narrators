"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-helpers";
import { getPrisma } from "@/lib/prisma";

export async function createRoyaltyProjectAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();

  await prisma.royaltyShareProject.create({
    data: {
      userId: user.id,
      title: String(formData.get("title")),
      finishedHours: Number(formData.get("finishedHours")),
      royaltySplitPercent: Number(formData.get("royaltySplitPercent")),
      acxRetailPrice: Number(formData.get("acxRetailPrice")),
      estimatedMonthlySales: Number(formData.get("estimatedMonthlySales")),
      buyoutEquivalentRate: Number(formData.get("buyoutEquivalentRate")),
    },
  });

  revalidatePath("/dashboard/royalty-share");
  revalidatePath("/dashboard");
}

export async function deleteRoyaltyProjectAction(formData: FormData) {
  const user = await requireUser();
  const prisma = getPrisma();
  const project = await prisma.royaltyShareProject.findFirst({
    where: { id: String(formData.get("id")), userId: user.id },
  });
  if (!project) {
    return;
  }

  await prisma.royaltyShareProject.delete({
    where: { id: project.id },
  });

  revalidatePath("/dashboard/royalty-share");
  revalidatePath("/dashboard");
}
