"use client";

import { useState, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useReadContract, useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { DREAM7_ABI, DREAM7_ADDRESS, type Market } from "@/lib/contract";
import MarketCard from "@/components/market/MarketCard";
import { playIplTheme } from "@/lib/sounds";

const CATEGORIES = ["All", "IPL", "CRICKET", "CRYPTO", "MEMES"];
const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🔥",
  IPL: "🏏",
  CRICKET: "🎯",
  CRYPTO: "₿",
  MEMES: "🐸",
};

function CricketBallHero() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-20 h-20 sm:w-24 sm:h-24 animate-cricket-spin"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#D71921" />
      <circle cx="50" cy="50" r="45" fill="url(#ballGrad)" />
      <defs>
        <radialGradient id="ballGrad" cx="35%" cy="35%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <path d="M20 35 C30 45, 30 55, 20 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M80 35 C70 45, 70 55, 80 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M22 30 L27 35" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 70 L27 65" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M78 30 L73 35" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M78 70 L73 65" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="d7-card p-5 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-16 rounded-full bg-[var(--bg-card-hover)]" />
        <div className="h-5 w-14 rounded-full bg-[var(--bg-card-hover)]" />
      </div>
      <div className="h-5 w-3/4 rounded bg-[var(--bg-card-hover)]" />
      <div className="h-8 w-full rounded-lg bg-[var(--bg-card-hover)]" />
      <div className="flex justify-between">
        <div className="h-4 w-24 rounded bg-[var(--bg-card-hover)]" />
        <div className="h-4 w-28 rounded bg-[var(--bg-card-hover)]" />
      </div>
      <div className="h-10 w-full rounded-lg bg-[var(--bg-card-hover)]" />
    </div>
  );
}

export default function Home() {
  const { login, ready, authenticated } = usePrivy();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("d7_entered");
    }
    return true;
  });

  const handleEnter = () => {
    sessionStorage.setItem("d7_entered", "1");
    setShowSplash(false);
    playIplTheme();
  };

  // Fetch total markets count
  const { data: totalMarketsRaw } = useReadContract({
    address: DREAM7_ADDRESS,
    abi: DREAM7_ABI,
    functionName: "totalMarkets",
    query: { refetchInterval: 5000 },
  });
  const totalMarkets = Number(totalMarketsRaw ?? 0n);

  // Build contract calls for all markets
  const marketContracts = useMemo(() => {
    const calls: { address: `0x${string}`; abi: typeof DREAM7_ABI; functionName: "getMarket" | "getOdds"; args: [bigint] }[] = [];
    for (let i = 0; i < totalMarkets; i++) {
      calls.push({
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "getMarket",
        args: [BigInt(i)],
      });
      calls.push({
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "getOdds",
        args: [BigInt(i)],
      });
    }
    return calls;
  }, [totalMarkets]);

  const { data: marketData, isLoading } = useReadContracts({
    contracts: marketContracts,
    query: { refetchInterval: 5000, enabled: totalMarkets > 0 },
  });

  // Parse markets and odds
  const markets: { market: Market; yesOddsBps: bigint; noOddsBps: bigint }[] = useMemo(() => {
    if (!marketData) return [];
    const result: { market: Market; yesOddsBps: bigint; noOddsBps: bigint }[] = [];
    for (let i = 0; i < totalMarkets; i++) {
      const mData = marketData[i * 2];
      const oData = marketData[i * 2 + 1];
      if (mData?.result && oData?.result) {
        const m = mData.result as unknown as Market;
        const odds = oData.result as unknown as [bigint, bigint];
        result.push({
          market: m,
          yesOddsBps: odds[0],
          noOddsBps: odds[1],
        });
      }
    }
    return result;
  }, [marketData, totalMarkets]);

  // Filter by category
  const filtered = activeCategory === "All"
    ? markets
    : markets.filter((m) => m.market.category.toUpperCase() === activeCategory);

  // Stats
  const totalPoolWei = markets.reduce(
    (sum, m) => sum + m.market.yesPool + m.market.noPool,
    0n
  );
  const totalPoolDisplay = parseFloat(formatEther(totalPoolWei)).toFixed(2);
  const liveCount = markets.filter(
    (m) => !m.market.resolved && m.market.deadline > BigInt(Math.floor(Date.now() / 1000))
  ).length;

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <CricketBallHero />
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white">
            Dream<span className="text-d7-yellow">7</span>
          </h1>
          <p className="text-d7-secondary text-lg">
            IPL Prediction Wall on <span className="text-d7-cyan">Monad</span>
          </p>
          <button
            onClick={handleEnter}
            className="d7-btn d7-btn-primary text-lg px-10 py-4 animate-pulse"
          >
            🏏 Enter the Arena
          </button>
          <p className="text-xs text-d7-muted">Tap to enable sound</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-none">
                IPL Prediction Wall on{" "}
                <span className="text-d7-cyan">Monad</span>
              </h1>
              <div className="hidden sm:block">
                <CricketBallHero />
              </div>
            </div>
            <p className="text-lg text-d7-secondary max-w-lg">
              Bet YES or NO on live cricket moments. Instant. On-chain. Cheap.
            </p>
            {!authenticated && (
              <button
                onClick={login}
                disabled={!ready}
                className="d7-btn d7-btn-primary text-base px-8 py-3.5 disabled:opacity-50"
              >
                ⚡ Connect Wallet & Play
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-8 flex flex-wrap gap-3 sm:gap-6">
          {[
            { label: "Markets Live", value: liveCount.toString() },
            { label: "MON in Pools", value: totalPoolDisplay },
            { label: "Total Markets", value: totalMarkets.toString() },
            { label: "Confirmations", value: "~0.3s" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="d7-card px-4 py-2.5 flex items-center gap-2"
            >
              <span className="font-mono text-lg font-bold text-white">
                {stat.value}
              </span>
              <span className="text-xs text-d7-muted uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Pills */}
      <section>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[var(--accent-yellow)] text-black font-bold"
                  : "bg-[var(--bg-card)] border border-[var(--border)] text-d7-secondary hover:border-[var(--accent-yellow)] hover:text-white"
              }`}
            >
              {CATEGORY_EMOJIS[cat]} {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Markets Grid */}
      <section>
        {isLoading && totalMarkets > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 d7-card">
            <p className="text-3xl mb-2">🏏</p>
            <p className="text-d7-secondary">
              {totalMarkets === 0
                ? "No markets yet. Head to Admin to create one!"
                : "No markets in this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m) => (
              <MarketCard
                key={m.market.id.toString()}
                market={m.market}
                yesOddsBps={m.yesOddsBps}
                noOddsBps={m.noOddsBps}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
