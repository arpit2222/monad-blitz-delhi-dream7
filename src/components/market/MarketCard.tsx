"use client";

import Link from "next/link";
import { formatEther } from "viem";
import type { Market } from "@/lib/contract";
import CategoryPill from "@/components/ui/CategoryPill";
import MarketStatusBadge from "@/components/market/MarketStatusBadge";
import OddsBar from "@/components/market/OddsBar";
import MarketTimer from "@/components/market/MarketTimer";

interface MarketCardProps {
  market: Market;
  yesOddsBps: bigint;
  noOddsBps: bigint;
}

export default function MarketCard({ market, yesOddsBps, noOddsBps }: MarketCardProps) {
  const totalPool = market.yesPool + market.noPool;
  const poolDisplay = parseFloat(formatEther(totalPool)).toFixed(2);
  const now = BigInt(Math.floor(Date.now() / 1000));
  const isLive = !market.resolved && market.deadline > now;

  return (
    <div
      className={`d7-card d7-card-hover p-5 flex flex-col gap-4 ${
        isLive ? "animate-live-pulse" : ""
      }`}
    >
      {/* Top row: category + status */}
      <div className="flex items-center justify-between">
        <CategoryPill category={market.category} />
        <MarketStatusBadge resolved={market.resolved} deadline={market.deadline} />
      </div>

      {/* Question */}
      <h3 className="font-display text-lg font-bold leading-tight text-white">
        {market.question}
      </h3>

      {/* Odds Bar */}
      <OddsBar yesOddsBps={yesOddsBps} noOddsBps={noOddsBps} />

      {/* Pool + Timer */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-d7-secondary">
          Pool: {poolDisplay} MON
        </span>
        <MarketTimer deadline={market.deadline} />
      </div>

      {/* CTA */}
      <Link
        href={`/market/${market.id.toString()}`}
        className="d7-btn d7-btn-primary w-full text-center text-sm"
      >
        View & Bet →
      </Link>
    </div>
  );
}
