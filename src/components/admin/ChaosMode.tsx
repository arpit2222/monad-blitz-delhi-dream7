"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useToast } from "@/components/ui/Toast";
import { DREAM7_ABI, DREAM7_ADDRESS, type Market } from "@/lib/contract";
import { publicClient } from "@/lib/viem";

interface ChaosModeProps {
  markets: Market[];
}

export default function ChaosMode({ markets }: ChaosModeProps) {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { showToast } = useToast();
  const [selectedMarket, setSelectedMarket] = useState("0");
  const [numBets, setNumBets] = useState("10");
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amountEach, setAmountEach] = useState("0.001");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalBets, setTotalBets] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleChaos = async () => {
    if (!isConnected || !walletClient) {
      showToast({ type: "error", message: "Connect MetaMask admin wallet first" });
      return;
    }

    const n = parseInt(numBets);
    if (isNaN(n) || n <= 0) return;

    setIsRunning(true);
    setProgress(0);
    setTotalBets(n);
    setElapsedTime(0);

    const startTime = Date.now();

    try {
      const fnName = side === "yes" ? "betYes" : "betNo";
      const marketId = BigInt(selectedMarket);
      const betValue = parseEther(amountEach);

      for (let i = 0; i < n; i++) {
        const hash = await walletClient.writeContract({
          address: DREAM7_ADDRESS,
          abi: DREAM7_ABI,
          functionName: fnName,
          args: [marketId],
          value: betValue,
        });

        await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
        setProgress(i + 1);
        setElapsedTime((Date.now() - startTime) / 1000);
      }

      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
      showToast({
        type: "success",
        message: `${n}/${n} bets confirmed in ${totalTime}s 🚀 Only possible on Monad.`,
      });
    } catch (error) {
      const msg = String((error as { message?: string })?.message ?? "");
      if (msg.includes("user rejected") || msg.includes("User rejected")) {
        showToast({ type: "error", message: "Chaos mode cancelled" });
      } else {
        console.error("Chaos mode error:", error);
        showToast({ type: "error", message: "Chaos mode failed ❌" });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const progressPercent = totalBets > 0 ? (progress / totalBets) * 100 : 0;

  return (
    <div className="d7-card p-6 space-y-5">
      <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider border-b border-[var(--border)] pb-3">
        ⚡ Chaos Mode (Monad Speed Demo)
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-d7-secondary mb-1">Pick a market</label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="d7-input"
          >
            {markets.map((m) => (
              <option key={m.id.toString()} value={m.id.toString()}>
                Market #{m.id.toString()} — {m.question.slice(0, 40)}...
              </option>
            ))}
            {markets.length === 0 && <option value="0">No markets available</option>}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-d7-secondary mb-1">Number of bets</label>
            <input
              type="number"
              min="1"
              max="50"
              value={numBets}
              onChange={(e) => setNumBets(e.target.value)}
              className="d7-input font-mono"
            />
          </div>
          <div>
            <label className="block text-sm text-d7-secondary mb-1">Amount each (MON)</label>
            <input
              type="number"
              step="0.001"
              value={amountEach}
              onChange={(e) => setAmountEach(e.target.value)}
              className="d7-input font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-d7-secondary mb-1">Side</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSide("yes")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                side === "yes"
                  ? "bg-[var(--accent-green)]/20 border border-[var(--accent-green)] text-[var(--accent-green)]"
                  : "bg-[var(--bg-card)] border border-[var(--border)] text-d7-secondary"
              }`}
            >
              YES ●
            </button>
            <button
              onClick={() => setSide("no")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                side === "no"
                  ? "bg-[var(--accent-red)]/20 border border-[var(--accent-red)] text-[var(--accent-red)]"
                  : "bg-[var(--bg-card)] border border-[var(--border)] text-d7-secondary"
              }`}
            >
              NO ●
            </button>
          </div>
        </div>

        <button
          onClick={handleChaos}
          disabled={isRunning || markets.length === 0}
          className="d7-btn w-full py-3 text-base bg-gradient-to-r from-[var(--accent-yellow)] to-[var(--accent-red)] text-black font-bold disabled:opacity-50"
        >
          {isRunning ? "Running..." : "🔥 FIRE CHAOS MODE"}
        </button>

        {/* Progress bar */}
        {(isRunning || progress > 0) && (
          <div className="space-y-2">
            <div className="w-full h-3 rounded-full bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-yellow)] to-[var(--accent-green)] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-d7-secondary">
                {progress}/{totalBets} txs confirmed
              </span>
              {elapsedTime > 0 && (
                <span className="text-d7-yellow">
                  {elapsedTime.toFixed(1)}s elapsed
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
