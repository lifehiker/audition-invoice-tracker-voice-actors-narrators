"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "2rem" }}>
      <p>Something went wrong loading this page. Please refresh or try again.</p>
      <button onClick={reset} style={{ marginTop: "1rem" }}>
        Try again
      </button>
    </div>
  );
}
