"use client";

import { useState, useEffect } from "react";
import { timeLeft } from "@/lib/dream7utils";

interface MarketTimerProps {
  deadline: bigint;
}

export default function MarketTimer({ deadline }: MarketTimerProps) {
  const [display, setDisplay] = useState(timeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(timeLeft(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const now = Math.floor(Date.now() / 1000);
  const diff = Number(deadline) - now;
  const isUrgent = diff > 0 && diff < 1800; // < 30 minutes
  const isClosed = diff <= 0;

  if (isClosed) {
    return (
      <span className="font-mono-stats text-sm text-d7-muted">
        Betting Closed
      </span>
    );
  }

  return (
    <span
      className={`font-mono-stats text-sm ${
        isUrgent ? "text-d7-yellow" : "text-d7-secondary"
      }`}
    >
      ⏱ {display} remaining
    </span>
  );
}
