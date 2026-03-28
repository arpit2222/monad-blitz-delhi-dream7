"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/components/ui/Toast";
import { DREAM7_ABI, DREAM7_ADDRESS } from "@/lib/contract";

const IPL_TEMPLATES = [
  { question: "Will CSK win their next IPL match?", category: "IPL" },
  { question: "Will total 6s in the match be more than 10?", category: "IPL" },
  { question: "Will the match go to the last over?", category: "IPL" },
  { question: "Will today's top scorer score more than 60 runs?", category: "CRICKET" },
  { question: "Will MON price be above $0.50 today?", category: "CRYPTO" },
];

const CATEGORIES = ["IPL", "CRICKET", "CRYPTO", "MEMES"];

export default function AdminCreateMarketForm({ onCreated }: { onCreated?: () => void }) {
  const { address, isConnected } = useAccount();
  const { showToast, dismissAll } = useToast();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("IPL");
  const [deadline, setDeadline] = useState("");
  const [minBet, setMinBet] = useState("0.001");
  const [maxBet, setMaxBet] = useState("1.0");

  const { writeContract, isPending, data: txHash } = useWriteContract();

  useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: !!txHash,
    },
  });

  const handleTemplate = (t: typeof IPL_TEMPLATES[number]) => {
    setQuestion(t.question);
    setCategory(t.category);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      showToast({ type: "error", message: "Connect MetaMask admin wallet first" });
      return;
    }
    if (!question || !deadline) {
      showToast({ type: "error", message: "Fill in all fields" });
      return;
    }

    showToast({ type: "loading", message: "Creating market..." });

    const deadlineUnix = BigInt(Math.floor(new Date(deadline).getTime() / 1000));

    writeContract(
      {
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "createMarket",
        args: [question, category, deadlineUnix, parseEther(minBet), parseEther(maxBet)],
      },
      {
        onSuccess: () => {
          dismissAll();
          showToast({ type: "success", message: "Market created! 🎉" });
          setQuestion("");
          setDeadline("");
          onCreated?.();
        },
        onError: (error) => {
          dismissAll();
          const msg = error.message ?? "";
          if (msg.includes("User rejected") || msg.includes("user rejected")) {
            showToast({ type: "error", message: "Transaction cancelled" });
          } else {
            console.error("createMarket error:", error);
            showToast({ type: "error", message: "Failed to create market ❌" });
          }
        },
      }
    );
  };

  return (
    <div className="d7-card p-6 space-y-5">
      <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider border-b border-[var(--border)] pb-3">
        Create New Market
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-d7-secondary mb-1">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="d7-input"
            placeholder="Will CSK win their next match?"
          />
        </div>

        <div>
          <label className="block text-sm text-d7-secondary mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="d7-input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-d7-secondary mb-1">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="d7-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-d7-secondary mb-1">Min Bet (MON)</label>
            <input
              type="number"
              step="0.001"
              value={minBet}
              onChange={(e) => setMinBet(e.target.value)}
              className="d7-input font-mono"
            />
          </div>
          <div>
            <label className="block text-sm text-d7-secondary mb-1">Max Bet (MON)</label>
            <input
              type="number"
              step="0.1"
              value={maxBet}
              onChange={(e) => setMaxBet(e.target.value)}
              className="d7-input font-mono"
            />
          </div>
        </div>

        {/* Quick Templates */}
        <div>
          <p className="text-xs text-d7-muted mb-2 uppercase tracking-wider">
            IPL Quick Templates:
          </p>
          <div className="flex flex-wrap gap-2">
            {IPL_TEMPLATES.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleTemplate(t)}
                className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border)] text-d7-secondary hover:border-[var(--accent-yellow)] hover:text-d7-yellow transition-colors"
              >
                {t.question.length > 30 ? t.question.slice(0, 30) + "..." : t.question}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="d7-btn d7-btn-primary w-full disabled:opacity-50"
        >
          {isPending ? "Creating..." : "🏏 CREATE MARKET"}
        </button>
      </form>
    </div>
  );
}
