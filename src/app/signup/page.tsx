import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { signupAction } from "@/app/actions/auth";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-xl panel rounded-[2.5rem] p-8 md:p-10">
        <p className="eyebrow">14-day free trial</p>
        <h1 className="mt-3 text-4xl font-semibold">Create your narrator workspace</h1>
        <p className="mt-3 text-[var(--muted)]">
          Start with auditions and payments today. Upgrade paths for Stripe and Google are already wired when credentials are ready.
        </p>
        <form action={signupAction} className="mt-8 space-y-4">
          <input name="name" required placeholder="Full name" className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
          <input name="password" type="password" required minLength={8} placeholder="Password" className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
          <button type="submit" className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white">
            Create account
          </button>
        </form>
        <p className="mt-6 text-sm text-[var(--muted)]">
          Already using NarraTrack? <Link className="font-semibold text-[var(--accent)]" href="/login">Log in.</Link>
        </p>
      </div>
    </div>
  );
}
