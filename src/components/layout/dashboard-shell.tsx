import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Auditions", "/dashboard/auditions"],
  ["Bookings", "/dashboard/bookings"],
  ["Invoices & Payments", "/dashboard/invoices"],
  ["Royalty-Share ROI", "/dashboard/royalty-share"],
  ["Rate History", "/dashboard/rate-history"],
  ["Settings", "/dashboard/settings"],
];

export async function DashboardShell({
  currentPath,
  children,
}: {
  currentPath: string;
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="shell grid gap-6 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="panel rounded-[2rem] p-6">
        <div className="mb-8">
          <p className="eyebrow">NarraTrack</p>
          <h1 className="mt-2 text-2xl font-semibold">Business cockpit</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            ACX auditions, bookings, invoices, and royalties in one place.
          </p>
        </div>
        <div className="mb-6 flex items-center gap-3 rounded-3xl bg-white/80 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-2)] text-white">
            {(session?.user?.name || session?.user?.email || "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{session?.user?.name || "Working Narrator"}</p>
            <p className="text-xs text-[var(--muted)]">{session?.user?.email}</p>
          </div>
        </div>
        <div className="mb-6">
          <Badge value={session?.user?.subscriptionTier || "TRIAL"} />
        </div>
        <nav className="space-y-2">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm transition",
                currentPath === href
                  ? "bg-[var(--foreground)] text-white"
                  : "text-[var(--muted)] hover:bg-white/80 hover:text-[var(--foreground)]",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="secondary" className="w-full">
            Sign out
          </Button>
        </form>
      </aside>
      <main className="space-y-6">{children}</main>
    </div>
  );
}
