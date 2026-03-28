"use client";

import { useState, useMemo } from "react";
import { useReadContract, useReadContracts, useAccount } from "wagmi";
import { DREAM7_ABI, DREAM7_ADDRESS, type Market } from "@/lib/contract";
import { shortAddr } from "@/lib/dream7utils";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminCreateMarketForm from "@/components/admin/AdminCreateMarketForm";
import AdminResolveList from "@/components/admin/AdminResolveList";
import ChaosMode from "@/components/admin/ChaosMode";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const { address, isConnected } = useAccount();

  // Fetch total markets count
  const { data: totalMarketsRaw, refetch: refetchTotal } = useReadContract({
    address: DREAM7_ADDRESS,
    abi: DREAM7_ABI,
    functionName: "totalMarkets",
    query: { refetchInterval: 5000 },
  });
  const totalMarkets = Number(totalMarketsRaw ?? 0n);

  // Build contract calls for all markets
  const marketContracts = useMemo(() => {
    const calls: { address: `0x${string}`; abi: typeof DREAM7_ABI; functionName: "getMarket"; args: [bigint] }[] = [];
    for (let i = 0; i < totalMarkets; i++) {
      calls.push({
        address: DREAM7_ADDRESS,
        abi: DREAM7_ABI,
        functionName: "getMarket",
        args: [BigInt(i)],
      });
    }
    return calls;
  }, [totalMarkets]);

  const { data: marketData, refetch: refetchMarkets } = useReadContracts({
    contracts: marketContracts,
    query: { refetchInterval: 5000, enabled: totalMarkets > 0 },
  });

  const markets: Market[] = useMemo(() => {
    if (!marketData) return [];
    return marketData
      .filter((d) => d?.result)
      .map((d) => d.result as unknown as Market);
  }, [marketData]);

  const handleRefresh = () => {
    refetchTotal();
    refetchMarkets();
  };

  if (!authed) {
    return <AdminLogin onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-white">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-3">
          {isConnected && address && (
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-d7-cyan">
              🦊 {shortAddr(address)}
            </span>
          )}
          <button
            onClick={() => setAuthed(false)}
            className="text-sm text-d7-muted hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="d7-card p-4 border-[var(--accent-yellow)] text-center">
          <p className="text-d7-yellow text-sm">
            ⚠️ Connect your MetaMask admin wallet (the one that deployed the contract) to perform admin actions.
          </p>
        </div>
      )}

      <AdminCreateMarketForm onCreated={handleRefresh} />
      <AdminResolveList markets={markets} onResolved={handleRefresh} />
      <ChaosMode markets={markets.filter((m) => !m.resolved && Number(m.deadline) > Math.floor(Date.now() / 1000))} />
    </div>
  );
}
