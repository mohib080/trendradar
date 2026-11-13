"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";
import { TrendCard } from "@/components/dashboard/TrendCard";
import { Trend, Watchlist } from "@/types/trend";
import { INITIAL_TRENDS } from "@/data/mockTrends";
import { localStore } from "@/lib/supabase";
import {
  Bookmark,
  ListPlus,
  Hash,
  Download,
  Trash2,
  Plus,
  Check,
  X,
  Bell,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";

function SavedContent() {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "watchlists" | "keywords">("bookmarks");
  const [savedTrendIds, setSavedTrendIds] = useState<string[]>([]);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    {
      id: "wl-1",
      name: "Bangladesh Urban & Infrastructure",
      description: "Monitoring Dhaka transit, metro rail lines, city governance, and utility updates.",
      keywords: ["metro rail", "dhaka transit", "mrt line 5", "mirpur traffic"],
      tags: ["#DhakaMetro", "#BangladeshDevelopment"],
      color: "#10b981",
      createdAt: new Date().toISOString(),
    },
    {
      id: "wl-2",
      name: "Autonomous AI & LLM Systems",
      description: "Frontier reasoning benchmarks, open weights models, and software engineering agentic tooling.",
      keywords: ["deepseek", "reasoning model", "agentic workflows", "evals"],
      tags: ["#AgenticAI", "#MachineLearning"],
      color: "#6366f1",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [followedKeywords, setFollowedKeywords] = useState<string[]>([
    "Dhaka Metro",
    "Bangladesh Cricket",
    "Gemini AI",
    "Pitha Utsab",
    "Karwan Bazar",
  ]);

  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [isNewWatchlistOpen, setIsNewWatchlistOpen] = useState(false);
  const [newWlName, setNewWlName] = useState("");
  const [newWlDesc, setNewWlDesc] = useState("");
  const [newWlKeywords, setNewWlKeywords] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStore.get<string[]>("saved_ids", [
      "bd-metro-expansion-2026",
      "gemini-ultra-reasoning-ai",
    ]);
    setSavedTrendIds(saved);

    const storedWl = localStore.get<Watchlist[]>("watchlists", []);
    if (storedWl.length > 0) setWatchlists(storedWl);

    const storedKw = localStore.get<string[]>("followed_keywords", []);
    if (storedKw.length > 0) setFollowedKeywords(storedKw);
  }, []);

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

  const handleCreateWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWlName.trim()) return;

    const newWl: Watchlist = {
      id: `wl-${Date.now()}`,
      name: newWlName.trim(),
      description: newWlDesc.trim(),
      keywords: newWlKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      tags: [`#${newWlName.replace(/\s+/g, "")}`],
      color: "#2563eb",
      createdAt: new Date().toISOString(),
    };

    const updated = [...watchlists, newWl];
    setWatchlists(updated);
    localStore.set("watchlists", updated);

    setNewWlName("");
    setNewWlDesc("");
    setNewWlKeywords("");
    setIsNewWatchlistOpen(false);
  };

  const handleDeleteWatchlist = (id: string) => {
    const updated = watchlists.filter((w) => w.id !== id);
    setWatchlists(updated);
    localStore.set("watchlists", updated);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim() || followedKeywords.includes(newKeywordInput.trim())) return;
    const updated = [...followedKeywords, newKeywordInput.trim()];
    setFollowedKeywords(updated);
    localStore.set("followed_keywords", updated);
    setNewKeywordInput("");
  };

  const handleRemoveKeyword = (kw: string) => {
    const updated = followedKeywords.filter((k) => k !== kw);
    setFollowedKeywords(updated);
    localStore.set("followed_keywords", updated);
  };

  // Export Saved Trends to JSON
  const handleExportJson = () => {
    const data = {
      savedTrends: INITIAL_TRENDS.filter((t) => savedTrendIds.includes(t.id)),
      watchlists,
      followedKeywords,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trendradar-intelligence-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Saved Trends to CSV
  const handleExportCsv = () => {
    const saved = INITIAL_TRENDS.filter((t) => savedTrendIds.includes(t.id));
    const header = "ID,Title,Category,Platform,Region,PopularityScore,GrowthRate,SourceUrl\n";
    const rows = saved
      .map(
        (t) =>
          `"${t.id}","${t.title.replace(/"/g, '""')}","${t.category}","${t.platform}","${t.region}",${t.popularityScore},${t.growthRate},"${t.url}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trendradar-trends-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const savedTrendsList = INITIAL_TRENDS.filter((t) => savedTrendIds.includes(t.id));

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        selectedRegion="BD"
        onRegionChange={() => {}}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 md:pl-64 min-w-0">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70 text-xs font-semibold mb-3">
                <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                <span>Personal Intelligence Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Saved Trends & Watchlists
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Manage your bookmarked topics, custom sector watchlists, followed keywords, and export data intelligence.
              </p>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors border border-slate-200 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 mb-6 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === "bookmarks"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked Trends ({savedTrendsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("watchlists")}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === "watchlists"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span>Custom Watchlists ({watchlists.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("keywords")}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === "keywords"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Followed Keywords ({followedKeywords.length})</span>
            </button>
          </div>

          {/* Tab 1: Bookmarked Trends */}
          {activeTab === "bookmarks" && (
            <div>
              {savedTrendsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedTrendsList.map((trend) => (
                    <TrendCard
                      key={trend.id}
                      trend={trend}
                      isSaved={true}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-800">No saved trends yet</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Click the bookmark icon on any trend card in the dashboard to save it here for quick reference.
                  </p>
                  <Link
                    href="/"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                  >
                    Explore Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Custom Watchlists */}
          {activeTab === "watchlists" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Active Watchlists</h3>
                <button
                  onClick={() => setIsNewWatchlistOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Watchlist</span>
                </button>
              </div>

              {/* Watchlist Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchlists.map((wl) => (
                  <div
                    key={wl.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: wl.color }}
                          />
                          <h4 className="font-bold text-slate-900 text-sm">{wl.name}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteWatchlist(wl.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {wl.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {wl.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Created {new Date(wl.createdAt).toLocaleDateString()}</span>
                      <span className="text-blue-600 font-semibold cursor-pointer">
                        Filter Feed →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Watchlist Modal */}
              {isNewWatchlistOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <h4 className="font-bold text-base text-slate-900">
                        Create Custom Watchlist
                      </h4>
                      <button
                        onClick={() => setIsNewWatchlistOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateWatchlist} className="space-y-3.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Watchlist Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newWlName}
                          onChange={(e) => setNewWlName(e.target.value)}
                          placeholder="e.g. Bangladesh Fintech & Remittances"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={newWlDesc}
                          onChange={(e) => setNewWlDesc(e.target.value)}
                          placeholder="Brief notes on what trends to cluster..."
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Keywords & Hashtags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={newWlKeywords}
                          onChange={(e) => setNewWlKeywords(e.target.value)}
                          placeholder="fintech, qr payment, bKash, startups"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsNewWatchlistOpen(false)}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                        >
                          Create Watchlist
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Followed Keywords */}
          {activeTab === "keywords" && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Follow Specific Keywords & Topics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receive live alerts and highlights whenever these terms spike on Bangladesh or global social platforms.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddKeyword} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  placeholder="Enter keyword or #tag (e.g. #DhakaMetro)"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  Follow
                </button>
              </form>

              {/* Keyword List */}
              <div className="flex flex-wrap gap-2 pt-2">
                {followedKeywords.map((kw, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium transition-colors"
                  >
                    <Hash className="w-3.5 h-3.5 text-blue-500" />
                    <span>{kw}</span>
                    <button
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />
    </div>
  );
}

export default function SavedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <SavedContent />
    </Suspense>
  );
}
