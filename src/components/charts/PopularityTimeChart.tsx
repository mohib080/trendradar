"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendHistoryPoint } from "@/types/trend";

interface PopularityTimeChartProps {
  data: TrendHistoryPoint[];
  title?: string;
}

export function PopularityTimeChart({
  data,
  title = "Popularity Index Over Time",
}: PopularityTimeChartProps) {
  const [activeMetric, setActiveMetric] = useState<"score" | "volume">("score");

  // Fallback if data is empty
  const chartData = data && data.length > 0 ? data : [
    { time: "00:00", score: 25, volume: 80000 },
    { time: "04:00", score: 40, volume: 140000 },
    { time: "08:00", score: 62, volume: 220000 },
    { time: "12:00", score: 85, volume: 380000 },
    { time: "16:00", score: 94, volume: 420000 },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
          <p className="text-[11px] text-slate-400">Time-series tracking of velocity surges</p>
        </div>

        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveMetric("score")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeMetric === "score"
                ? "bg-white text-blue-600 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Trend Score (0-100)
          </button>
          <button
            onClick={() => setActiveMetric("volume")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeMetric === "volume"
                ? "bg-white text-blue-600 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Raw Volume
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              domain={activeMetric === "score" ? [0, 100] : ["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "12px",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#93c5fd" }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={activeMetric === "score" ? "#2563eb" : "#10b981"}
              strokeWidth={2.5}
              fill={activeMetric === "score" ? "url(#scoreGradient)" : "url(#volumeGradient)"}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
