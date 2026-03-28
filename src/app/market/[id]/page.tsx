"use client";

import { use, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useReadContract, useReadContracts, useAccount, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { DREAM7_ABI, DREAM7_ADDRESS, type Market } from "@/lib/contract";
import { useToast } from "@/components/ui/Toast";
import CategoryPill from "@/components/ui/CategoryPill";
import MarketStatusBadge from "@/components/market/MarketStatusBadge";
import MarketTimer from "@/components/market/MarketTimer";
import OddsBar from "@/components/market/OddsBar";
import BetForm from "@/components/market/BetForm";
import PoolBarChart from "@/components/charts/PoolBarChart";
import OddsDonutChart from "@/components/charts/OddsLineChart";
import { playWinSound, playLoseSound } from "@/lib/sounds";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Fake recent activity for demo polish
const FAKE_ACTIVITY = [
  { addr: "0xAb12...cD3F", side: "YES" as const, amount: "0.05", time: "2m ago" },
  { addr: "0x7E89...1a2B", side: "NO" as const, amount: "0.1", time: "5m ago" },
  { addr: "0xFf34...9c0D", side: "YES" as const, amount: "0.02", time: "8m ago" },
  { addr: "0x1122...aaBB", side: "NO" as const, amount: "0.03", time: "12m ago" },
  { addr: "0xDe56...78Ef", side: "YES" as const, amount: "0.08", time: "15m ago" },
];

export default function MarketDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const marketId = BigInt(id);
  const { address: userAddress, isConnected } = useAccount();
  const { showToast, dismissAll } = useToast();
  const { writeContract, isPending: claimPending } = useWriteContract();

  // Fetch market data
  const { data: marketRaw, refetch: refetchMarket } = useReadContract({
    address: DREAM7_ADDRESS,
    abi: DREAM7_ABI,
    functionName: "getMarket",
    args: [marketId],
    query: { refetchInterval: 5000 },
  });

  const { data: oddsRaw } = useReadContract({
    address: DREAM7_ADDRESS,
    abi: DREAM7_ABI,
    functionName: "getOdds",
    args: [marketId],
    query: { refetchInterval: 5000 },
  });

  // User bets
  const userBetsContracts = useMemo(() => {
    if (!userAddress) return [];
    return [
      {
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "getUserBets" as const,
        args: [marketId, userAddress] as const,
      },
      {
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "claimed" as const,
        args: [marketId, userAddress] as const,
      },
      {
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "hasBet" as const,
        args: [marketId, userAddress] as const,
      },
    ];
  }, [userAddress, marketId]);

  const { data: userBetsData, refetch: refetchUser } = useReadContracts({
    contracts: userBetsContracts,
    query: { refetchInterval: 5000, enabled: !!userAddress },
  });

  const market = marketRaw as unknown as Market | undefined;
  const odds = oddsRaw as unknown as [bigint, bigint] | undefined;

  const yesOddsBps = odds?.[0] ?? 5000n;
  const noOddsBps = odds?.[1] ?? 5000n;

  const userYesBet = (userBetsData?.[0]?.result as unknown as [bigint, bigint])?.[0] ?? 0n;
  const userNoBet = (userBetsData?.[0]?.result as unknown as [bigint, bigint])?.[1] ?? 0n;
  const hasClaimed = (userBetsData?.[1]?.result as unknown as boolean) ?? false;
  const userHasBet = (userBetsData?.[2]?.result as unknown as boolean) ?? false;

  const totalPool = (market?.yesPool ?? 0n) + (market?.noPool ?? 0n);
  const now = Math.floor(Date.now() / 1000);
  const isLive = !!market && !market.resolved && Number(market.deadline) > now;
  const isClosed = !!market && !market.resolved && Number(market.deadline) <= now;

  // Determine user win state
  const userWon = !!market && market.resolved && (
    (market.outcomeYes && userYesBet > 0n) ||
    (!market.outcomeYes && userNoBet > 0n)
  );
  const userLost = !!market && market.resolved && (
    (market.outcomeYes && userYesBet === 0n && userNoBet > 0n) ||
    (!market.outcomeYes && userNoBet === 0n && userYesBet > 0n)
  );

  // Estimate winnings
  let winAmount = 0n;
  if (userWon && market) {
    const winPool = market.outcomeYes ? market.yesPool : market.noPool;
    const userBet = market.outcomeYes ? userYesBet : userNoBet;
    if (winPool > 0n) {
      winAmount = (userBet * totalPool) / winPool;
    }
  }

  // Play sound once when page loads:
  // - eh-eh: user won, OR not participated, OR market is still live/ongoing
  // - faaaa: user lost
  const userNotParticipated = userYesBet === 0n && userNoBet === 0n;
  const soundPlayed = useRef(false);
  useEffect(() => {
    if (soundPlayed.current || !market) return;
    if (userLost) {
      playLoseSound();
      soundPlayed.current = true;
    } else if (userWon || userNotParticipated || isLive) {
      playWinSound();
      soundPlayed.current = true;
    }
  }, [market, userWon, userLost, userNotParticipated, isLive]);

  if (!market) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="d7-card p-8 text-center animate-pulse">
          <p className="text-d7-secondary">Loading market...</p>
        </div>
      </div>
    );
  }

  const handleClaim = () => {
    if (!isConnected) return;
    showToast({ type: "loading", message: "Claiming winnings..." });

    writeContract(
      {
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "claim",
        args: [marketId],
      },
      {
        onSuccess: () => {
          dismissAll();
          showToast({ type: "success", message: "Winnings claimed! 🎉" });
          refetchUser();
        },
        onError: (error) => {
          dismissAll();
          console.error("Claim error:", error);
          showToast({ type: "error", message: "Failed to claim ❌" });
        },
      }
    );
  };

  const handleRefresh = () => {
    refetchMarket();
    refetchUser();
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-d7-secondary hover:text-white transition-colors"
      >
        ← Back to Wall
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - 3/5 */}
        <div className="lg:col-span-3 space-y-6">
          {/* Market Info Card */}
          <div className="d7-card p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <CategoryPill category={market.category} />
                <MarketStatusBadge resolved={market.resolved} deadline={market.deadline} />
              </div>
              <span className="text-xs font-mono text-d7-muted">
                Market #{market.id.toString()}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              {market.question}
            </h1>

            {isLive && (
              <div>
                <p className="text-sm text-d7-secondary mb-1">Betting closes in:</p>
                <MarketTimer deadline={market.deadline} />
              </div>
            )}

            {/* Odds + Pool info */}
            <div className="d7-card p-4 space-y-4 bg-[var(--bg-card-hover)]">
              <div className="flex justify-between text-center">
                <div>
                  <p className="text-2xl font-bold text-d7-green font-display">
                    YES
                  </p>
                  <p className="text-lg font-mono font-bold text-white">
                    {(Number(yesOddsBps) / 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-d7-red font-display">
                    NO
                  </p>
                  <p className="text-lg font-mono font-bold text-white">
                    {(Number(noOddsBps) / 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <OddsBar yesOddsBps={yesOddsBps} noOddsBps={noOddsBps} />

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-d7-muted">YES Pool</p>
                  <p className="font-mono text-d7-green font-semibold">
                    {parseFloat(formatEther(market.yesPool)).toFixed(3)} MON
                  </p>
                </div>
                <div>
                  <p className="text-d7-muted">NO Pool</p>
                  <p className="font-mono text-d7-red font-semibold">
                    {parseFloat(formatEther(market.noPool)).toFixed(3)} MON
                  </p>
                </div>
                <div>
                  <p className="text-d7-muted">Total</p>
                  <p className="font-mono text-white font-semibold">
                    {parseFloat(formatEther(totalPool)).toFixed(3)} MON
                  </p>
                </div>
              </div>
            </div>

            {/* User position */}
            {isConnected && (userYesBet > 0n || userNoBet > 0n) && (
              <div className="p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary-light)]/20">
                <p className="text-sm text-d7-secondary">
                  Your position:{" "}
                  {userYesBet > 0n && (
                    <span className="text-d7-green font-mono font-semibold">
                      {parseFloat(formatEther(userYesBet)).toFixed(4)} MON on YES
                    </span>
                  )}
                  {userYesBet > 0n && userNoBet > 0n && " + "}
                  {userNoBet > 0n && (
                    <span className="text-d7-red font-mono font-semibold">
                      {parseFloat(formatEther(userNoBet)).toFixed(4)} MON on NO
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Resolution outcome states */}
            {userWon && !hasClaimed && (
              <div className="p-4 rounded-lg bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 space-y-3">
                <p className="text-lg font-display font-bold text-d7-green">
                  🎉 You won! Claim {parseFloat(formatEther(winAmount)).toFixed(4)} MON
                </p>
                <button
                  onClick={handleClaim}
                  disabled={claimPending}
                  className="d7-btn d7-btn-green w-full disabled:opacity-50"
                >
                  {claimPending ? "Claiming..." : "🎉 CLAIM WINNINGS"}
                </button>
              </div>
            )}

            {userWon && hasClaimed && (
              <div className="p-4 rounded-lg bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30">
                <p className="text-sm font-semibold text-d7-green">
                  ✓ Winnings claimed
                </p>
              </div>
            )}

            {userLost && (
              <div className="p-4 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border)]">
                <p className="text-sm text-d7-secondary">
                  Match ended. Better luck next time 🏏
                </p>
              </div>
            )}

            {market.resolved && (
              <div className="p-3 rounded-lg bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20">
                <p className="text-sm text-d7-cyan font-semibold">
                  Resolved: {market.outcomeYes ? "YES ✅" : "NO ❌"}
                </p>
              </div>
            )}
          </div>

          {/* Bet Form */}
          {isLive && <BetForm market={market} userHasBet={userHasBet} onBetPlaced={handleRefresh} />}
        </div>

        {/* Right Column - 2/5 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pool Bar Chart */}
          <PoolBarChart yesPool={market.yesPool} noPool={market.noPool} />

          {/* Donut Chart */}
          <OddsDonutChart yesPool={market.yesPool} noPool={market.noPool} />

          {/* Recent Activity Feed */}
          <div className="d7-card p-4">
            <h4 className="font-display text-sm font-bold text-d7-secondary uppercase tracking-wider mb-4">
              Recent Activity
            </h4>
            <div className="space-y-3">
              {FAKE_ACTIVITY.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs animate-slide-in-right"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      a.side === "YES" ? "bg-[var(--accent-green)]" : "bg-[var(--accent-red)]"
                    }`}
                  />
                  <span className="font-mono text-d7-muted">{a.addr}</span>
                  <span className="text-d7-secondary">
                    bet {a.amount} MON on{" "}
                    <span
                      className={
                        a.side === "YES" ? "text-d7-green font-semibold" : "text-d7-red font-semibold"
                      }
                    >
                      {a.side}
                    </span>
                  </span>
                  <span className="ml-auto text-d7-muted">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
