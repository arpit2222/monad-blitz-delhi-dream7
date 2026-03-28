"use client";

interface CategoryPillProps {
  category: string;
  className?: string;
}

const CATEGORY_CONFIG: Record<string, { emoji: string; bg: string; text: string }> = {
  IPL: { emoji: "🏏", bg: "bg-[var(--accent-yellow)]/20", text: "text-d7-yellow" },
  CRICKET: { emoji: "🎯", bg: "bg-yellow-400/10", text: "text-yellow-400" },
  CRYPTO: { emoji: "₿", bg: "bg-[var(--accent-cyan)]/20", text: "text-d7-cyan" },
  MEMES: { emoji: "🐸", bg: "bg-purple-500/20", text: "text-purple-300" },
};

export default function CategoryPill({ category, className = "" }: CategoryPillProps) {
  const upper = category.toUpperCase();
  const config = CATEGORY_CONFIG[upper] || {
    emoji: "📌",
    bg: "bg-[var(--primary)]/20",
    text: "text-d7-secondary",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.text} ${className}`}
    >
      <span>{config.emoji}</span>
      {upper}
    </span>
  );
}
