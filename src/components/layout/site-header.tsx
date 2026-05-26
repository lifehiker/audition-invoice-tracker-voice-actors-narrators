import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // auth unavailable (e.g. DB timeout) — render unauthenticated UI
  }

  return (
    <header className="shell py-6">
      <div className="panel flex items-center justify-between rounded-full px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white">
            N
          </span>
          <div>
            <p className="text-lg font-semibold">NarraTrack</p>
            <p className="text-xs text-[var(--muted)]">Built for ACX narrators</p>
          </div>
        </Link>
        <nav className="hidden gap-6 text-sm text-[var(--muted)] md:flex">
          <Link href="/features/audition-tracker">Audition Tracker</Link>
          <Link href="/features/royalty-share-roi">Royalty ROI</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Button href="/dashboard" variant="secondary">
                Dashboard
              </Button>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost">
                Log in
              </Button>
              <Button href="/signup" variant="accent">
                Start free trial
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
