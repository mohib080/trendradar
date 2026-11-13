"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { TrendCard } from "@/components/dashboard/TrendCard";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";
import { Trend, Region, Category, Platform, SortOption, TimeRange } from "@/types/trend";
import { localStore } from "@/lib/supabase";
import {
  TrendingUp,
  Flame,
  SearchX,
  RefreshCw,
  Sparkles,
  Info,
  Radio,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization
  const initialRegion = (searchParams.get("region") as Region) || "BD";
  const initialCategory = (searchParams.get("category") as Category) || "all";
  const initialPlatform = (searchParams.get("platform") as Platform | "all") || "all";
  const initialSort = (searchParams.get("sort") as SortOption) || "popularity";

  // Filter States
  const [selectedRegion, setSelectedRegion] = useState<Region>(initialRegion);
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">(initialPlatform);
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("24h");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [trends, setTrends] = useState<Trend[]>([]);
  const [stats, setStats] = useState({
    totalTracked: 1482,
    risingCount: 327,
    topCategory: "Bangladesh",
    activePlatforms: 7,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [trendForAi, setTrendForAi] = useState<Trend | null>(null);

  // Saved Trends (Bookmarks)
  const [savedTrendIds, setSavedTrendIds] = useState<string[]>([]);

  // Load saved bookmarks from local storage
  useEffect(() => {
    const saved = localStore.get<string[]>("saved_ids", []);
    setSavedTrendIds(saved);
  }, []);

  // Sync params with URL changes when user clicks sidebar items
  useEffect(() => {
    const r = searchParams.get("region") as Region;
    const c = searchParams.get("category") as Category;
    const p = searchParams.get("platform") as Platform;
    const s = searchParams.get("sort") as SortOption;

    if (r) setSelectedRegion(r);
    if (c) setSelectedCategory(c);
    if (p) setSelectedPlatform(p);
    if (s) setSelectedSort(s);
  }, [searchParams]);

  // Fetch Trends function
  const loadTrends = useCallback(async (isRefreshAction = false) => {
    if (isRefreshAction) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const params = new URLSearchParams({
        region: selectedRegion,
        category: selectedCategory,
        platform: selectedPlatform,
        sort: selectedSort,
        timeRange: selectedTimeRange,
        search: searchQuery,
      });

      const res = await fetch(`/api/trends?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setTrends(json.data);
        if (json.stats) setStats(json.stats);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (err) {
      console.error("Failed to load trends:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedRegion, selectedCategory, selectedPlatform, selectedSort, selectedTimeRange, searchQuery]);

  useEffect(() => {
    loadTrends();
  }, [loadTrends]);

  const handleToggleSave = (trendId: string) => {
    let updated: string[];
    if (savedTrendIds.includes(trendId)) {
      updated = savedTrendIds.filter((id) => id !== trendId);
    } else {
      updated = [...savedTrendIds, trendId];
    }
    setSavedTrendIds(updated);
    localStore.set("saved_ids", updated);
  };

  const handleOpenAiForTrend = (trend: Trend) => {
    setTrendForAi(trend);
    setIsAiDrawerOpen(true);
  };

  const resetFilters = () => {
    setSelectedRegion("BD");
    setSelectedCategory("all");
    setSelectedPlatform("all");
    setSelectedSort("popularity");
    setSelectedTimeRange("24h");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        onOpenAiAssistant={() => {
          setTrendForAi(null);
          setIsAiDrawerOpen(true);
        }}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 md:pl-64 min-w-0">
          {/* Top Banner Notice: Live Intelligence Status */}
          <div className="mb-5 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100/90 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-900">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
              </span>
              <p className="font-medium">
                Live Data Ingestion Active &bull; Tracking real-time discussions across Bangladesh and global platforms
              </p>
            </div>
            <button
              onClick={() => {
                setTrendForAi(null);
                setIsAiDrawerOpen(true);
              }}
              className="font-bold flex items-center gap-1.5 hover:underline text-blue-700 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Assistant</span>
            </button>
          </div>

          {/* Stats Bar */}
          <StatsBar
            totalTracked={stats.totalTracked}
            risingCount={stats.risingCount}
            topCategory={stats.topCategory}
            activePlatforms={stats.activePlatforms}
            isRefreshing={isRefreshing}
            onRefresh={() => loadTrends(true)}
            lastUpdated={lastUpdated}
          />

          {/* Filter & Sorter Controls */}
          <FilterBar
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={setSelectedTimeRange}
          />

          {/* Content Header & Feed Title */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {selectedSort === "growth" ? (
                  <>
                    <Flame className="w-5 h-5 text-rose-500" />
                    <span>Surging Trends</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>
                      {selectedRegion === "BD"
                        ? "Bangladesh Trends Feed"
                        : selectedRegion === "GLOBAL"
                        ? "Worldwide Trends Feed"
                        : `${selectedRegion} Trends Feed`}
                    </span>
                  </>
                )}
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                {trends.length}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Sorted by {selectedSort}
            </span>
          </div>

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse space-y-3.5"
                >
                  <div className="flex gap-2">
                    <div className="w-20 h-5 bg-slate-200 rounded-full" />
                    <div className="w-24 h-5 bg-slate-200 rounded-md" />
                  </div>
                  <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
                  <div className="w-full h-10 bg-slate-100 rounded-md" />
                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <div className="w-24 h-4 bg-slate-200 rounded-md" />
                    <div className="w-16 h-4 bg-slate-200 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : trends.length > 0 ? (
            /* Trending Topics Feed Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.map((trend) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  isSaved={savedTrendIds.includes(trend.id)}
                  onToggleSave={handleToggleSave}
                  onAnalyzeAi={handleOpenAiForTrend}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
              <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                No matching trending topics found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No trends matched your current filter criteria &quot;{searchQuery}&quot;. Try resetting filters or choosing a different region.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        activeTrend={trendForAi}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
