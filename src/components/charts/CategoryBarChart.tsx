"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CategoryDataPoint {
  category: string;
  count: number;
  avgScore: number;
}

export function CategoryBarChart({ data }: { data?: CategoryDataPoint[] }) {
  const chartData = data && data.length > 0 ? data : [
    { category: "Bangladesh", count: 48, avgScore: 88 },
    { category: "Tech & AI", count: 42, avgScore: 92 },
    { category: "Sports", count: 35, avgScore: 94 },
    { category: "Memes", count: 31, avgScore: 89 },
    { category: "Entertainment", count: 28, avgScore: 84 },
    { category: "Politics", count: 24, avgScore: 79 },
    { category: "Business", count: 18, avgScore: 75 },
  ];

  const BAR_COLORS = [
    "#10b981", // Emerald
    "#6366f1", // Indigo
    "#0284c7", // Sky
    "#f59e0b", // Amber
    "#a855f7", // Purple
    "#f43f5e", // Rose
    "#06b6d4", // Cyan
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
          Trends by Category
        </h4>
        <p className="text-[11px] text-slate-400">
          Distribution of trending topics across sectors
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "10px",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
              }}
              formatter={(val, name) => [val, name === "count" ? "Tracked Topics" : "Avg Score"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
