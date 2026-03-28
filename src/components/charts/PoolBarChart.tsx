"use client";

import { formatEther } from "viem";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PoolBarChartProps {
  yesPool: bigint;
  noPool: bigint;
}

export default function PoolBarChart({ yesPool, noPool }: PoolBarChartProps) {
  const yesNum = parseFloat(formatEther(yesPool));
  const noNum = parseFloat(formatEther(noPool));

  // Create 5 checkpoints showing linear growth to current values
  const data = Array.from({ length: 5 }, (_, i) => {
    const factor = (i + 1) / 5;
    return {
      name: i === 0 ? "Start" : i === 4 ? "Now" : `T${i}`,
      YES: parseFloat((yesNum * factor).toFixed(4)),
      NO: parseFloat((noNum * factor).toFixed(4)),
    };
  });

  return (
    <div className="d7-card p-4">
      <h4 className="font-display text-sm font-bold text-d7-secondary uppercase tracking-wider mb-4">
        Pool Growth
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#4A6080", fontSize: 11 }}
            axisLine={{ stroke: "#1A2E50" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#4A6080", fontSize: 11 }}
            axisLine={{ stroke: "#1A2E50" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0A1628",
              border: "1px solid #1A2E50",
              borderRadius: "8px",
              color: "#fff",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#8BA3CC" }}
          />
          <Bar dataKey="YES" fill="#00C853" radius={[4, 4, 0, 0]} />
          <Bar dataKey="NO" fill="#D71921" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
