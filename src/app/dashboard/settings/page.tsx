import { createBillingPortalSession } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helpers";
import { featureFlags } from "@/lib/env";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <DashboardShell currentPath="/dashboard/settings">
      <Card>
        <p className="eyebrow">Account</p>
        <h1 className="mt-2 text-3xl font-semibold">Settings</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Email</p>
            <p className="mt-2 font-semibold">{user.email}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Plan state</p>
            <p className="mt-2 font-semibold">
              {user.subscriptionTier || "TRIAL"} / {user.subscriptionStatus || "TRIAL"}
            </p>
          </div>
        </div>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await createBillingPortalSession();
          }}
        >
          <Button type="submit">
            Open billing portal
          </Button>
        </form>
        {!featureFlags.stripe ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Stripe is not configured, so billing management safely stays local in this environment.
          </p>
        ) : null}
        {!featureFlags.stripe ? null : (
          <p className="mt-4 text-sm text-[var(--muted)]">
            If no customer record exists yet, the billing portal falls back safely without breaking the page.
          </p>
        )}
      </Card>
      <Card>
        <p className="eyebrow">Export</p>
        <h2 className="mt-2 text-2xl font-semibold">Take your data with you</h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Export auditions, bookings, and payment history as CSV at any time.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/api/export/auditions" variant="secondary">
            Export auditions
          </Button>
          <Button href="/api/export/bookings" variant="secondary">
            Export bookings
          </Button>
          <Button href="/api/export/payments" variant="secondary">
            Export payments
          </Button>
        </div>
      </Card>
    </DashboardShell>
  );
}
