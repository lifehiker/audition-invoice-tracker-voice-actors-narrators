import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ensureUserDefaults } from "@/lib/data";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await ensureUserDefaults(session.user.id);

  return session.user;
}

export function userHasProAccess(user: {
  subscriptionTier?: string | null;
  subscriptionStatus?: string | null;
}) {
  return (
    user.subscriptionTier === "PRO" &&
    ["TRIAL", "ACTIVE"].includes(user.subscriptionStatus ?? "")
  );
}
