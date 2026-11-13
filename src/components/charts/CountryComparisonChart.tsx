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
  Legend,
} from "recharts";

export function CountryComparisonChart() {
  const data = [
    { metric: "Tech & AI", Bangladesh: 68, Worldwide: 95, India: 88, US: 96 },
    { metric: "Sports (Cricket/EPL)", Bangladesh: 98, Worldwide: 82, India: 94, US: 70 },
    { metric: "Memes & Humor", Bangladesh: 91, Worldwide: 94, India: 85, US: 92 },
    { metric: "Local Infrastructure", Bangladesh: 94, Worldwide: 45, India: 72, US: 55 },
    { metric: "Entertainment & OTT", Bangladesh: 89, Worldwide: 88, India: 90, US: 86 },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
          Regional Interest Intensity Comparison
        </h4>
        <p className="text-[11px] text-slate-400">
          Comparative engagement index across key national markets
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="metric"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "10px",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(val) => (
                <span className="text-xs text-slate-700 font-medium">
                  {val}
                </span>
              )}
            />
            <Bar dataKey="Bangladesh" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Worldwide" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="India" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="US" fill="#64748b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
