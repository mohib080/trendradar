"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";
import {
  ViralContentItem,
  ViralContentType,
  Region,
  Category,
  Platform,
} from "@/types/trend";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import {
  Compass,
  Hash,
  Video,
  Smile,
  Music,
  Search,
  MessageSquare,
  ExternalLink,
  Flame,
  Filter,
  Sparkles,
  TrendingUp,
  MapPin,
  RefreshCw,
} from "lucide-react";

const CONTENT_TYPE_TABS: { type: ViralContentType | "all"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "all", label: "All Viral Content", icon: Compass },
  { type: "hashtag", label: "Trending Hashtags", icon: Hash },
  { type: "video", label: "Viral Videos", icon: Video },
  { type: "meme", label: "Popular Memes", icon: Smile },
  { type: "audio", label: "Trending Audio & Songs", icon: Music },
  { type: "search_query", label: "Top Search Queries", icon: Search },
  { type: "discussion", label: "Viral Discussions", icon: MessageSquare },
];

function ExplorerContent() {
  const [selectedType, setSelectedType] = useState<ViralContentType | "all">("all");
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<ViralContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchViral() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          type: selectedType,
          region: selectedRegion,
          category: selectedCategory,
          platform: selectedPlatform,
          search: searchQuery,
        });

        const res = await fetch(`/api/viral?${params.toString()}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
        }
      } catch (err) {
        console.error("Failed to load viral content:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchViral();
  }, [selectedType, selectedRegion, selectedCategory, selectedPlatform, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion === "all" ? "BD" : selectedRegion}
        onRegionChange={(r) => setSelectedRegion(r)}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 md:pl-64 min-w-0">
          {/* Hero Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6 relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Viral Content Radar</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Trending Content Explorer
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Track breakout hashtags, viral video clips, popular meme templates, audio trends, and breakout search queries across Bangladesh and global social feeds.
              </p>
            </div>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
            {CONTENT_TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedType === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => setSelectedType(tab.type)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Filter:
              </span>

              {/* Region */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region | "all")}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 font-medium cursor-pointer"
              >
                <option value="all">All Regions</option>
                <option value="BD">Bangladesh 🇧🇩</option>
                <option value="GLOBAL">Worldwide 🌐</option>
                <option value="US">United States 🇺🇸</option>
                <option value="IN">India 🇮🇳</option>
              </select>

              {/* Platform */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Platform | "all")}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 font-medium cursor-pointer"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">X</option>
                <option value="reddit">Reddit</option>
                <option value="googletrends">Google Trends</option>
              </select>
            </div>

            <span className="text-slate-400 font-medium">
              Showing {items.length} viral items
            </span>
          </div>

          {/* Grid of Viral Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse space-y-3">
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                  <div className="w-3/4 h-5 bg-slate-200 rounded" />
                  <div className="w-full h-12 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Platform & Type Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <PlatformBadge platform={item.platform} size="sm" />
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {item.type.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span>Score {item.viralityIndex}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.bengaliTitle && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {item.bengaliTitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Author or Channel */}
                    {item.author && (
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">
                        By {item.author}
                      </p>
                    )}

                    {/* Tags */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Metrics & Link */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {item.metricLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {item.metricValue}
                      </span>
                    </div>

                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-colors"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No content found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No viral items matched your active filters. Try selecting All Content or All Regions.
              </p>
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

export default function ExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <ExplorerContent />
    </Suspense>
  );
}
