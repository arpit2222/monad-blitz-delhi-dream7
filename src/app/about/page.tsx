"use client";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-white">
          DREAM7
        </h1>
        <p className="text-xl text-d7-secondary">
          On-chain IPL Prediction Wall on{" "}
          <span className="text-d7-cyan font-semibold">Monad</span>
        </p>
        <p className="text-sm text-d7-muted">
          Built at Monad Blitz New Delhi · March 2025
        </p>
      </section>

      {/* What is Dream7? */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          What is Dream7?
        </h2>
        <div className="d7-card p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="text-d7-secondary leading-relaxed">
              Dream7 is a decentralized prediction wall where anyone can place
              tiny YES/NO bets on IPL cricket moments and crypto events. Odds
              update in real-time as bets come in. Winners take their share of
              the pool. Everything runs on Monad.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <svg
              viewBox="0 0 120 120"
              className="w-24 h-24 animate-cricket-spin"
              fill="none"
            >
              <circle cx="60" cy="60" r="50" fill="#D71921" />
              <circle cx="60" cy="60" r="50" fill="url(#aboutBallGrad)" />
              <defs>
                <radialGradient id="aboutBallGrad" cx="35%" cy="35%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <path d="M25 42 C35 54, 35 66, 25 78" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M95 42 C85 54, 85 66, 95 78" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>
      </section>

      {/* Why Monad? */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          Why Monad?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "⚡",
              title: "10,000 TPS",
              desc: "Many small bets don't congest the network",
            },
            {
              icon: "💸",
              title: "Near-zero fees",
              desc: "Micro-bets are viable at < $0.001",
            },
            {
              icon: "🔀",
              title: "Parallel Execution",
              desc: "All bets process simultaneously",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="d7-card p-6 text-center space-y-3 d7-card-hover"
            >
              <span className="text-4xl">{card.icon}</span>
              <h3 className="font-display text-xl font-bold text-white">
                {card.title}
              </h3>
              <p className="text-sm text-d7-secondary">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          How It Works
        </h2>
        <div className="d7-card p-6">
          <div className="space-y-6">
            {[
              { step: 1, text: "Connect your wallet (Monad testnet)" },
              { step: 2, text: "Browse live IPL markets on the Wall" },
              { step: 3, text: "Place YES or NO bet with any small amount of MON" },
              { step: 4, text: "Watch odds update live as others bet" },
              { step: 5, text: "Admin resolves market after match ends (oracle)" },
              { step: 6, text: "Winners claim proportional share of total pool" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-white">
                    {item.step}
                  </span>
                </div>
                <p className="text-d7-secondary pt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Tech */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          The Tech
        </h2>
        <div className="d7-card p-6 space-y-3">
          {[
            { label: "Smart Contract", value: "Dream7.sol on Monad Testnet (Solidity 0.8.24)" },
            { label: "Frontend", value: "Next.js 14 + wagmi v2 + Tailwind CSS" },
            { label: "Chain", value: "Monad Testnet (Chain ID: 10143)" },
            { label: "Oracle", value: "Admin wallet (hackathon) → Sports API (production)" },
            { label: "No backend", value: "100% on-chain logic" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-mono text-sm text-d7-cyan font-semibold min-w-[140px]">
                {item.label}:
              </span>
              <span className="text-sm text-d7-secondary">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Production Vision */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          Production Vision
        </h2>
        <div className="d7-card p-6">
          <p className="text-d7-secondary leading-relaxed italic">
            &ldquo;In production, markets would be fed by a real-time sports data
            API (Sportmonks, Cricbuzz API) that automatically calls{" "}
            <code className="font-mono text-d7-cyan text-sm">resolveMarket</code>{" "}
            when a match ends. The admin oracle becomes a verifiable sports data
            oracle. Dream7 scales to millions of users who love cricket and want
            transparent, on-chain prediction without the friction of traditional
            fantasy apps.&rdquo;
          </p>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-16" />
    </div>
  );
}
