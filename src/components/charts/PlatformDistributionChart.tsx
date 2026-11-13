"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PlatformShare } from "@/types/trend";

interface PlatformDistributionChartProps {
  data: PlatformShare[];
  title?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "#1877f2",
  youtube: "#ff0000",
  reddit: "#ff4500",
  twitter: "#0f172a",
  googletrends: "#059669",
  tiktok: "#000000",
  instagram: "#e1306c",
};

export function PlatformDistributionChart({
  data,
  title = "Cross-Platform Distribution",
}: PlatformDistributionChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { platform: "facebook" as const, percentage: 45, volume: 200000 },
    { platform: "youtube" as const, percentage: 30, volume: 130000 },
    { platform: "reddit" as const, percentage: 15, volume: 65000 },
    { platform: "twitter" as const, percentage: 10, volume: 43000 },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="mb-3">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
        <p className="text-[11px] text-slate-400">Share of engagement across social channels</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="percentage"
              nameKey="platform"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PLATFORM_COLORS[entry.platform] || "#64748b"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "10px",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value}% share`, "Platform"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(val) => (
                <span className="text-xs capitalize text-slate-700 font-medium">
                  {val}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
