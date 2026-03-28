"use client";

import { useState } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/components/ui/Toast";
import { DREAM7_ABI, DREAM7_ADDRESS, type Market } from "@/lib/contract";
import { estimatePayoutLocal } from "@/lib/dream7utils";
import { playYesSound, playNoSound } from "@/lib/sounds";

interface BetFormProps {
  market: Market;
  userHasBet?: boolean;
  onBetPlaced?: () => void;
}

const PRESETS = ["0.01", "0.05", "0.1"];

export default function BetForm({ market, userHasBet, onBetPlaced }: BetFormProps) {
  const { isConnected } = useAccount();
  const { showToast, dismissAll } = useToast();
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("0.01");
  const [customMode, setCustomMode] = useState(false);

  const { writeContract, isPending, data: txHash } = useWriteContract();

  useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: !!txHash,
    },
  });

  const totalPool = market.yesPool + market.noPool;
  const winPool = side === "yes" ? market.yesPool : market.noPool;

  let potentialReturn = 0n;
  try {
    const betWei = parseEther(amount || "0");
    const newWinPool = winPool + betWei;
    const newTotal = totalPool + betWei;
    potentialReturn = estimatePayoutLocal(betWei, newWinPool, newTotal);
  } catch {
    // invalid input
  }

  const handleBet = async () => {
    if (!isConnected) {
      showToast({ type: "error", message: "Connect your wallet first" });
      return;
    }

    showToast({ type: "loading", message: "Confirming on Monad..." });

    const fnName = side === "yes" ? "betYes" : "betNo";

    writeContract(
      {
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: fnName,
        args: [market.id],
        value: parseEther(amount),
      },
      {
        onSuccess: () => {
          dismissAll();
          showToast({ type: "success", message: "Bet placed! 🏏" });

          // Flash effect
          const flashEl = document.createElement("div");
          flashEl.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;background:${
            side === "yes" ? "rgba(0,200,83,0.1)" : "rgba(215,25,33,0.1)"
          };`;
          document.body.appendChild(flashEl);
          setTimeout(() => flashEl.remove(), 200);

          onBetPlaced?.();
        },
        onError: (error) => {
          dismissAll();
          const msg = error.message ?? "";
          if (msg.includes("user rejected") || msg.includes("User rejected")) {
            showToast({ type: "error", message: "Transaction cancelled" });
          } else {
            console.error("Bet error:", error);
            showToast({ type: "error", message: "Transaction failed ❌" });
          }
        },
      }
    );
  };

  if (!isConnected) {
    return (
      <div className="d7-card p-6 text-center">
        <p className="text-d7-secondary text-sm">Connect wallet to bet</p>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const isClosed = Number(market.deadline) <= now;

  if (isClosed && !market.resolved) {
    return (
      <div className="d7-card p-6 text-center">
        <p className="text-d7-yellow text-sm">⏳ Waiting for result...</p>
      </div>
    );
  }

  if (market.resolved) {
    return null; // Claim UI is handled separately
  }

  if (userHasBet) {
    return (
      <div className="d7-card p-6 text-center">
        <p className="text-d7-cyan text-sm font-semibold">🎯 You already placed your bet on this market!</p>
      </div>
    );
  }

  return (
    <div className="d7-card p-6 space-y-5">
      <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
        Place Your Bet
      </h3>

      {/* Side Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setSide("yes"); playYesSound(); }}
          className={`flex-1 d7-btn text-sm py-3 rounded-lg font-bold transition-all ${
            side === "yes"
              ? "bg-[var(--accent-green)]/20 border border-[var(--accent-green)] text-[var(--accent-green)] shadow-[0_0_15px_rgba(0,200,83,0.3)]"
              : "bg-[var(--bg-card)] border border-[var(--border)] text-d7-secondary hover:border-[var(--accent-green)]"
          }`}
        >
          YES ✓
        </button>
        <button
          onClick={() => { setSide("no"); playNoSound(); }}
          className={`flex-1 d7-btn text-sm py-3 rounded-lg font-bold transition-all ${
            side === "no"
              ? "bg-[var(--accent-red)]/20 border border-[var(--accent-red)] text-[var(--accent-red)] shadow-[0_0_15px_rgba(215,25,33,0.3)]"
              : "bg-[var(--bg-card)] border border-[var(--border)] text-d7-secondary hover:border-[var(--accent-red)]"
          }`}
        >
          NO ✗
        </button>
      </div>

      {/* Preset chips */}
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map((val) => (
          <button
            key={val}
            onClick={() => {
              setAmount(val);
              setCustomMode(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all ${
              amount === val && !customMode
                ? "bg-[var(--primary-light)] text-white"
                : "bg-[var(--bg-card)] border border-[var(--border)] text-d7-secondary hover:border-[var(--primary-light)]"
            }`}
          >
            {val}
          </button>
        ))}
        <button
          onClick={() => setCustomMode(true)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            customMode
              ? "bg-[var(--primary-light)] text-white"
              : "bg-[var(--bg-card)] border border-[var(--border)] text-d7-secondary hover:border-[var(--primary-light)]"
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom input */}
      {customMode && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="d7-input font-mono"
            placeholder="0.01"
          />
          <span className="text-d7-secondary text-sm font-semibold">MON</span>
        </div>
      )}

      {/* Potential return */}
      <div className="flex justify-between text-sm">
        <span className="text-d7-secondary">Potential return:</span>
        <span className="font-mono text-white font-semibold">
          ~{parseFloat(formatEther(potentialReturn)).toFixed(4)} MON
        </span>
      </div>

      {/* Submit */}
      <button
        onClick={handleBet}
        disabled={isPending || !amount || parseFloat(amount) <= 0}
        className="d7-btn d7-btn-primary w-full text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Confirming..." : "⚡ PLACE BET"}
      </button>
    </div>
  );
}
