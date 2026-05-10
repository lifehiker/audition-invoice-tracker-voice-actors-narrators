"use client";

import { useMemo, useState } from "react";

import { calculateRoyaltyProjection } from "@/lib/royalty-calculations";
import { currency } from "@/lib/utils";

type Props = {
  defaultValues?: {
    finishedHours?: number;
    royaltySplitPercent?: number;
    acxRetailPrice?: number;
    estimatedMonthlySales?: number;
    buyoutEquivalentRate?: number;
  };
  cta?: React.ReactNode;
};

export function RoyaltyCalculator({ defaultValues, cta }: Props) {
  const [state, setState] = useState({
    finishedHours: defaultValues?.finishedHours ?? 8,
    royaltySplitPercent: defaultValues?.royaltySplitPercent ?? 20,
    acxRetailPrice: defaultValues?.acxRetailPrice ?? 19.95,
    estimatedMonthlySales: defaultValues?.estimatedMonthlySales ?? 50,
    buyoutEquivalentRate: defaultValues?.buyoutEquivalentRate ?? 225,
  });

  const result = useMemo(() => calculateRoyaltyProjection(state), [state]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="panel rounded-[2rem] p-6">
        <p className="eyebrow">Calculator</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Finished hours", "finishedHours"],
            ["Royalty split %", "royaltySplitPercent"],
            ["ACX retail price", "acxRetailPrice"],
            ["Monthly sales estimate", "estimatedMonthlySales"],
            ["Buyout PFH rate", "buyoutEquivalentRate"],
          ].map(([label, key]) => (
            <label key={key} className="block space-y-2">
              <span className="text-sm font-medium">{label}</span>
              <input
                type="number"
                step="0.1"
                value={state[key as keyof typeof state]}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    [key]: Number(event.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
              />
            </label>
          ))}
        </div>
      </div>
      <div className="panel rounded-[2rem] p-6">
        <p className="eyebrow">Projection</p>
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Monthly royalty projection</p>
            <p className="mt-2 text-3xl font-semibold">{currency(result.monthlyRoyalty)}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/80 p-5">
              <p className="text-sm text-[var(--muted)]">12 months</p>
              <p className="mt-2 text-2xl font-semibold">{currency(result.projected12Months)}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5">
              <p className="text-sm text-[var(--muted)]">24 months</p>
              <p className="mt-2 text-2xl font-semibold">{currency(result.projected24Months)}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">Buyout equivalent</p>
            <p className="mt-2 text-2xl font-semibold">{currency(result.buyoutEquivalent)}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Breakeven month: {result.breakevenMonth ?? "Not reached"}
            </p>
          </div>
          {cta}
        </div>
      </div>
    </div>
  );
}
