"use client";

import { formatEther } from "viem";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface OddsDonutChartProps {
  yesPool: bigint;
  noPool: bigint;
}

export default function OddsDonutChart({ yesPool, noPool }: OddsDonutChartProps) {
  const yesNum = parseFloat(formatEther(yesPool));
  const noNum = parseFloat(formatEther(noPool));
  const total = yesNum + noNum;

  const data = [
    { name: "YES", value: yesNum || 0.5, color: "#00C853" },
    { name: "NO", value: noNum || 0.5, color: "#D71921" },
  ];

  return (
    <div className="d7-card p-4">
      <h4 className="font-display text-sm font-bold text-d7-secondary uppercase tracking-wider mb-4">
        YES vs NO
      </h4>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0A1628",
                border: "1px solid #1A2E50",
                borderRadius: "8px",
                color: "#fff",
                fontSize: 12,
              }}
              formatter={(value: unknown, name: unknown) => {
                const v = Number(value);
                return [
                  `${v.toFixed(4)} MON (${total > 0 ? ((v / total) * 100).toFixed(0) : 50}%)`,
                  String(name),
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-white">
              {total.toFixed(2)}
            </p>
            <p className="text-xs text-d7-secondary">MON</p>
          </div>
        </div>
      </div>
    </div>
  );
}
