"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Wall" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "Admin" },
];

function CricketBallIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="18" fill="#D71921" />
      <path
        d="M8 14 C12 18, 12 22, 8 26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 14 C28 18, 28 22, 32 26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 12 L12 14"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M10 28 L12 26"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M30 12 L28 14"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M30 28 L28 26"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { login, logout, ready, authenticated } = usePrivy();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--bg-base)]/80 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <CricketBallIcon className="w-8 h-8 group-hover:animate-cricket-spin" />
          <span className="font-display text-xl font-bold text-d7-yellow tracking-wider">
            DREAM7
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display text-sm font-semibold uppercase tracking-wider transition-colors ${
                pathname === link.href
                  ? "text-d7-yellow border-b-2 border-[var(--accent-yellow)] pb-0.5"
                  : "text-d7-secondary hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Wallet + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {authenticated ? (
            <button
              onClick={logout}
              className="d7-btn d7-btn-primary text-sm px-4 py-2"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={login}
              disabled={!ready}
              className="d7-btn d7-btn-primary text-sm px-4 py-2 disabled:opacity-50"
            >
              Connect Wallet
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--bg-card)] border-t border-[var(--border)] px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block font-display text-sm font-semibold uppercase tracking-wider ${
                pathname === link.href
                  ? "text-d7-yellow"
                  : "text-d7-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
