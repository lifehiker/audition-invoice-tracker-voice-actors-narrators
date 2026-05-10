import Link from "next/link";

import { auth, signIn } from "@/auth";
import { loginAction } from "@/app/actions/auth";
import { featureFlags } from "@/lib/env";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  const params = await searchParams;

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-xl panel rounded-[2.5rem] p-8 md:p-10">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-3 text-4xl font-semibold">Log in to NarraTrack</h1>
        <p className="mt-3 text-[var(--muted)]">
          Pick up where your audition pipeline, royalty models, and invoices left off.
        </p>
        {params.message ? (
          <p className="mt-5 rounded-2xl bg-amber-100 px-4 py-3 text-sm">{params.message}</p>
        ) : null}
        <form action={loginAction} className="mt-8 space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
          <input name="password" type="password" required placeholder="Password" className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
          <button type="submit" className="w-full rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
            Log in
          </button>
        </form>
        {featureFlags.googleAuth ? (
          <form
            className="mt-4"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button type="submit" className="w-full rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold">
              Continue with Google
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Google OAuth is available as soon as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured.
          </p>
        )}
        <p className="mt-6 text-sm text-[var(--muted)]">
          No account yet? <Link className="font-semibold text-[var(--accent)]" href="/signup">Start your free trial.</Link>
        </p>
      </div>
    </div>
  );
}
