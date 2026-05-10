import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  SUBMITTED: "bg-amber-100 text-amber-900",
  AWAITING: "bg-sky-100 text-sky-900",
  BOOKED: "bg-emerald-100 text-emerald-900",
  PASSED: "bg-stone-200 text-stone-700",
  EXPIRED: "bg-rose-100 text-rose-900",
  IN_PRODUCTION: "bg-amber-100 text-amber-900",
  DELIVERED: "bg-sky-100 text-sky-900",
  PAYMENT_PENDING: "bg-orange-100 text-orange-900",
  PAID: "bg-emerald-100 text-emerald-900",
  DISPUTE: "bg-rose-100 text-rose-900",
  DRAFT: "bg-stone-200 text-stone-700",
  SENT: "bg-sky-100 text-sky-900",
  OVERDUE: "bg-rose-100 text-rose-900",
  BUYOUT: "bg-stone-900 text-white",
  ROYALTY_SHARE: "bg-[var(--accent-2)] text-white",
  UNION_RESIDUAL: "bg-[var(--accent)] text-white",
};

export function Badge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        toneMap[value] || "bg-stone-200 text-stone-700",
      )}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
