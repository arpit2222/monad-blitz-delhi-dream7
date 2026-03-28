import { formatEther } from "viem";

// Format MON amount from wei to display
export function formatMON(wei: bigint, decimals = 4): string {
  return `${parseFloat(formatEther(wei)).toFixed(decimals)} MON`;
}

// Format odds from basis points to percent string
export function formatOdds(bps: bigint): string {
  return `${(Number(bps) / 100).toFixed(1)}%`;
}

// Format time remaining from deadline timestamp
export function timeLeft(deadline: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(deadline) - now;
  if (diff <= 0) return "Closed";
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Shorten address for display
export function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// Estimate payout locally (mirrors contract math)
export function estimatePayoutLocal(
  userBet: bigint,
  winPool: bigint,
  totalPool: bigint
): bigint {
  if (winPool === 0n) return 0n;
  return (userBet * totalPool) / winPool;
}

// Format odds percent from basis points as number
export function oddsPercent(bps: bigint): number {
  return Number(bps) / 100;
}
