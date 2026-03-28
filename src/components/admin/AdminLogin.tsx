"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface AdminLoginProps {
  onAuth: () => void;
}

export default function AdminLogin({ onAuth }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side only — contract enforces admin via msg.sender
    if (password === "thala") {
      onAuth();
    } else {
      showToast({ type: "error", message: "Wrong password ❌" });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="d7-card p-8 w-full max-w-sm space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl">🔐</span>
          <h2 className="font-display text-2xl font-bold text-white mt-2">
            Admin Login
          </h2>
        </div>

        <div>
          <label className="block text-sm text-d7-secondary mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="d7-input"
            placeholder="Enter admin password"
          />
        </div>

        <button type="submit" className="d7-btn d7-btn-primary w-full">
          Enter Admin Panel
        </button>

        <p className="text-center text-xs text-d7-muted">
          Hint: Think like a captain 🏏
        </p>
      </form>
    </div>
  );
}
