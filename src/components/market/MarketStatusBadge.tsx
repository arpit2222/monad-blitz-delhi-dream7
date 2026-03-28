"use client";

interface MarketStatusBadgeProps {
  resolved: boolean;
  deadline: bigint;
}

export default function MarketStatusBadge({ resolved, deadline }: MarketStatusBadgeProps) {
  const now = BigInt(Math.floor(Date.now() / 1000));

  if (resolved) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--primary)]/20 text-d7-cyan border border-[var(--accent-cyan)]/30">
        ✓ Resolved
      </span>
    );
  }

  if (deadline > now) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--accent-green)]/10 text-d7-green border border-[var(--accent-green)]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
        Live
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-500/10 text-d7-muted border border-[var(--text-muted)]/30">
      Closed
    </span>
  );
}
