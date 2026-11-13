import React from "react";
import { TrendingUp, Flame, Tag, Layers, RefreshCw } from "lucide-react";

interface StatsBarProps {
  totalTracked: number;
  risingCount: number;
  topCategory: string;
  activePlatforms: number;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export function StatsBar({
  totalTracked,
  risingCount,
  topCategory,
  activePlatforms,
  isRefreshing,
  onRefresh,
  lastUpdated,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Total Tracked Trends */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Tracked</span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {totalTracked.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Ingested across BD & Global feeds</p>
        </div>
      </div>

      {/* 2. Rising Trends */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Rising Trends</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {risingCount.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Surge
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">&gt; 100% velocity in 24 hours</p>
        </div>
      </div>

      {/* 3. Most Popular Category */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Top Category</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Tag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900 truncate">
              {topCategory}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Dominant topic share today</p>
        </div>
      </div>

      {/* 4. Number of Tracked Platforms */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Active Platforms</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
              title="Refresh Live Feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
            </button>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {activePlatforms}
            </span>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              7 Integrated
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lastUpdated ? `Synced ${lastUpdated}` : "Real-time sync active"}
          </p>
        </div>
      </div>
    </div>
  );
}
