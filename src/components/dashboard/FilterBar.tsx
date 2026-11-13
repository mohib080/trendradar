import React from "react";
import {
  Region,
  Category,
  Platform,
  SortOption,
  TimeRange,
} from "@/types/trend";
import {
  ArrowUpDown,
  Clock,
  MapPin,
  Sparkles,
  Layers,
  Filter,
} from "lucide-react";

interface FilterBarProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  selectedPlatform: Platform | "all";
  onPlatformChange: (platform: Platform | "all") => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (time: TimeRange) => void;
}

export function FilterBar({
  selectedRegion,
  onRegionChange,
  selectedCategory,
  onCategoryChange,
  selectedPlatform,
  onPlatformChange,
  selectedSort,
  onSortChange,
  selectedTimeRange,
  onTimeRangeChange,
}: FilterBarProps) {
  const regions: { code: Region; name: string; flag: string }[] = [
    { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
    { code: "GLOBAL", name: "Worldwide", flag: "🌐" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
  ];

  const categories: { code: Category; label: string }[] = [
    { code: "all", label: "All Topics" },
    { code: "bangladesh", label: "Bangladesh" },
    { code: "technology", label: "Tech & AI" },
    { code: "sports", label: "Sports" },
    { code: "politics", label: "Politics & News" },
    { code: "entertainment", label: "Entertainment" },
    { code: "memes", label: "Memes & Viral" },
    { code: "business", label: "Business" },
  ];

  const platforms: { code: Platform | "all"; label: string }[] = [
    { code: "all", label: "All Platforms" },
    { code: "facebook", label: "Facebook" },
    { code: "youtube", label: "YouTube" },
    { code: "reddit", label: "Reddit" },
    { code: "googletrends", label: "Google Trends" },
    { code: "twitter", label: "X" },
    { code: "tiktok", label: "TikTok" },
    { code: "instagram", label: "Instagram" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 space-y-3.5">
      {/* Top Row: Region Selector + Time Filter + Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> Region:
          </span>
          {regions.map((r) => (
            <button
              key={r.code}
              onClick={() => onRegionChange(r.code)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                selectedRegion === r.code
                  ? "bg-slate-900 text-white font-semibold shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70"
              }`}
            >
              <span>{r.flag}</span>
              <span>{r.name}</span>
            </button>
          ))}
        </div>

        {/* Right side: Time Range & Sort controls */}
        <div className="flex items-center gap-2.5">
          {/* Time Filter */}
          <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1.5 hidden sm:block" />
            <button
              onClick={() => onTimeRangeChange("24h")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimeRange === "24h"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              24h
            </button>
            <button
              onClick={() => onTimeRangeChange("7d")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimeRange === "7d"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              7d
            </button>
            <button
              onClick={() => onTimeRangeChange("30d")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimeRange === "30d"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              30d
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1.5 hidden sm:block" />
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-slate-800 font-medium text-xs pr-2 py-1 outline-hidden cursor-pointer"
            >
              <option value="popularity">Popularity Score</option>
              <option value="growth">Growth Velocity (%)</option>
              <option value="recency">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Second Row: Category Pills */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-500" /> Category:
        </span>
        {categories.map((c) => (
          <button
            key={c.code}
            onClick={() => onCategoryChange(c.code)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all shrink-0 ${
              selectedCategory === c.code
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Third Row: Platform Filter Pills */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-slate-500" /> Platform:
        </span>
        {platforms.map((p) => (
          <button
            key={p.code}
            onClick={() => onPlatformChange(p.code)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 ${
              selectedPlatform === p.code
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
