import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card>
      <p className="eyebrow">{label}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{helper}</p>
    </Card>
  );
}
