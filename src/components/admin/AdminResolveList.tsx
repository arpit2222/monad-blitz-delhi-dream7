"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useToast } from "@/components/ui/Toast";
import { DREAM7_ABI, DREAM7_ADDRESS, type Market } from "@/lib/contract";

interface AdminResolveListProps {
  markets: Market[];
  onResolved?: () => void;
}

export default function AdminResolveList({ markets, onResolved }: AdminResolveListProps) {
  const { isConnected } = useAccount();
  const { showToast, dismissAll } = useToast();
  const [pendingId, setPendingId] = useState<bigint | null>(null);
  const { writeContract } = useWriteContract();

  const unresolvedMarkets = markets.filter((m) => !m.resolved);

  const handleResolve = async (marketId: bigint, outcomeYes: boolean) => {
    if (!isConnected) {
      showToast({ type: "error", message: "Connect MetaMask admin wallet first" });
      return;
    }

    setPendingId(marketId);
    showToast({ type: "loading", message: "Resolving market..." });

    writeContract(
      {
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "resolveMarket",
        args: [marketId, outcomeYes],
      },
      {
        onSuccess: () => {
          dismissAll();
          showToast({
            type: "success",
            message: `Market #${marketId.toString()} resolved ${outcomeYes ? "YES ✅" : "NO ❌"}`,
          });
          setPendingId(null);
          onResolved?.();
        },
        onError: (error) => {
          dismissAll();
          const msg = error.message ?? "";
          if (msg.includes("User rejected") || msg.includes("user rejected")) {
            showToast({ type: "error", message: "Transaction cancelled" });
          } else {
            console.error("resolveMarket error:", error);
            showToast({ type: "error", message: "Failed to resolve market ❌" });
          }
          setPendingId(null);
        },
      }
    );
  };

  return (
    <div className="d7-card p-6 space-y-5">
      <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider border-b border-[var(--border)] pb-3">
        Resolve Markets
      </h3>

      {unresolvedMarkets.length === 0 ? (
        <p className="text-d7-secondary text-sm text-center py-8">
          No markets pending resolution 🏆
        </p>
      ) : (
        <div className="space-y-4">
          {unresolvedMarkets.map((m) => (
            <div
              key={m.id.toString()}
              className="p-4 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border)] space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-d7-muted">
                    #{m.id.toString()}
                  </span>
                  <p className="font-display text-sm font-bold text-white mt-1">
                    {m.question}
                  </p>
                </div>
              </div>
              <div className="text-xs text-d7-secondary font-mono">
                Pool: {parseFloat(formatEther(m.yesPool)).toFixed(3)} YES |{" "}
                {parseFloat(formatEther(m.noPool)).toFixed(3)} NO
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolve(m.id, true)}
                  disabled={pendingId === m.id}
                  className="d7-btn d7-btn-green flex-1 text-sm py-2 disabled:opacity-50"
                >
                  ✅ Resolve YES
                </button>
                <button
                  onClick={() => handleResolve(m.id, false)}
                  disabled={pendingId === m.id}
                  className="d7-btn d7-btn-red flex-1 text-sm py-2 disabled:opacity-50"
                >
                  ❌ Resolve NO
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
