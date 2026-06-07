import { requireUser } from "@/lib/auth-helpers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireUser();
  } catch (e: unknown) {
    // Re-throw Next.js redirects (e.g. unauthenticated → /login)
    if (e instanceof Error && (e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    // DB/auth timeout — let page-level error handling render a visible fallback
  }

  return children;
}
