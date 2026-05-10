import Link from "next/link";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

const styles = {
  primary:
    "bg-[var(--foreground)] text-white hover:opacity-90",
  secondary:
    "bg-white/70 text-[var(--foreground)] border border-[var(--line)] hover:bg-white",
  accent:
    "bg-[var(--accent)] text-white hover:opacity-90",
  ghost:
    "text-[var(--foreground)] hover:bg-white/70",
};

export function Button({
  className,
  children,
  variant = "primary",
  href,
  type = "button",
}: {
  className?: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  href?: string;
  type?: "button" | "submit";
}) {
  const base = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <Link className={base} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={base} type={type}>
      {children}
    </button>
  );
}
