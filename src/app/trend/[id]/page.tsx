"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Hash,
  Key,
  Globe2,
  Flame,
  Check,
  Radio,
} from "lucide-react";
import { Trend, AIAnalysis } from "@/types/trend";
import { PlatformBadge, ProvenanceBadge } from "@/components/common/PlatformBadge";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { PopularityTimeChart } from "@/components/charts/PopularityTimeChart";
import { PlatformDistributionChart } from "@/components/charts/PlatformDistributionChart";
import { TrendCard } from "@/components/dashboard/TrendCard";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";
import { formatRelativeTime } from "@/lib/utils";
import { localStore } from "@/lib/supabase";

export default function TrendDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const trendId = resolvedParams.id;

  const [trend, setTrend] = useState<Trend | null>(null);
  const [relatedTrends, setRelatedTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function fetchTrend() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/trends/${trendId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setTrend(json.data);
          if (json.related) setRelatedTrends(json.related);
          if (json.data.aiSummary) setActiveAnalysis(json.data.aiSummary);

          // Check bookmark
          const savedIds = localStore.get<string[]>("saved_ids", []);
          setIsSaved(savedIds.includes(json.data.id));
        }
      } catch (err) {
        console.error("Error fetching trend details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrend();
  }, [trendId]);

  const handleToggleSave = () => {
    if (!trend) return;
    const savedIds = localStore.get<string[]>("saved_ids", []);
    let updated: string[];
    if (savedIds.includes(trend.id)) {
      updated = savedIds.filter((id) => id !== trend.id);
      setIsSaved(false);
    } else {
      updated = [...savedIds, trend.id];
      setIsSaved(true);
    }
    localStore.set("saved_ids", updated);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTriggerAiAnalysis = async () => {
    if (!trend) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trend.title,
          description: trend.description,
          category: trend.category,
          platform: trend.platform,
          region: trend.region,
          volumeFormatted: trend.volumeFormatted,
          growthRate: trend.growthRate,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveAnalysis(data.data);
      }
    } catch (err) {
      console.error("AI trigger error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          selectedRegion="BD"
          onRegionChange={() => {}}
          onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        />
        <div className="max-w-6xl w-full mx-auto p-8 animate-pulse space-y-6">
          <div className="w-32 h-6 bg-slate-200 rounded-md" />
          <div className="w-2/3 h-10 bg-slate-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-72 bg-slate-200 rounded-2xl" />
            <div className="h-72 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          selectedRegion="BD"
          onRegionChange={() => {}}
          onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        />
        <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Trend Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            The requested trend ID &quot;{trendId}&quot; could not be retrieved from the live index.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            ← Back to Trend Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        selectedRegion={trend.region}
        onRegionChange={() => {}}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trends</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
                isSaved
                  ? "bg-amber-50 text-amber-700 border-amber-200 font-semibold"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isSaved ? "Saved" : "Save Topic"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium bg-white text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Link" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Hero Topic Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platform={trend.platform} size="lg" />
              <CategoryBadge category={trend.category} showBengali={true} />
              <ProvenanceBadge type={trend.sourceType} />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>First detected {formatRelativeTime(trend.firstDetected)}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {trend.title}
          </h1>
          {trend.bengaliTitle && (
            <h2 className="text-base sm:text-lg font-medium text-slate-600 mt-1">
              {trend.bengaliTitle}
            </h2>
          )}

          <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed max-w-4xl">
            {trend.description}
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Popularity Score
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900">{trend.popularityScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Growth Velocity
              </span>
              <div className="flex items-center gap-1 mt-1 text-emerald-600 font-black text-2xl">
                <TrendingUp className="w-5 h-5" />
                <span>+{trend.growthRate}%</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tracked Volume
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 block truncate">
                {trend.volumeFormatted}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Target Region
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                {trend.region === "BD" ? "Bangladesh" : trend.region}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid: Popularity Over Time & Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PopularityTimeChart data={trend.history} />
          </div>
          <div>
            <PlatformDistributionChart data={trend.platformBreakdown} />
          </div>
        </div>

        {/* AI Trend Analysis Deep-Dive Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-900 to-blue-900 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  AI Trend Intelligence & Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Objective synthesis distinguishing verified data from speculation
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerAiAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? "Analyzing..." : "Re-Analyze with AI"}</span>
            </button>
          </div>

          {activeAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question 1: What is happening? */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  1. What is happening?
                </span>
                <p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed">
                  {activeAnalysis.whatIsHappening}
                </p>
              </div>

              {/* Question 2: Why is this trending? */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                  2. Why is this trending?
                </span>
                <p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed">
                  {activeAnalysis.whyTrending}
                </p>
              </div>

              {/* Question 3: How did it become popular? */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                  3. Origin & Acceleration
                </span>
                <p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed">
                  {activeAnalysis.origin}
                </p>
              </div>

              {/* Question 4: Platforms Discussing */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                  4. Cross-Platform Discourse
                </span>
                <p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed">
                  {activeAnalysis.platformsDiscussing}
                </p>
              </div>

              {/* Question 5: Trajectory */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    5. Current Trajectory
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">Velocity status over 24-48 hours</p>
                </div>
                <span className="text-xs font-bold uppercase px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  {activeAnalysis.trajectory.replace("_", " ")}
                </span>
              </div>

              {/* Question 6: Potential Outcomes */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
                  6. What could happen next?
                </span>
                <p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed">
                  {activeAnalysis.potentialOutcomes}
                </p>
              </div>

              {/* Question 7: Local vs Global & Fact Check */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    7. Geographic Influence Scope:
                  </span>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-lg bg-blue-100 text-blue-800">
                    {activeAnalysis.scope} Scope
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Information Verification Status:
                  </span>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {activeAnalysis.confidence}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={handleTriggerAiAnalysis}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
              >
                Generate 7-Point AI Analysis
              </button>
            </div>
          )}
        </div>

        {/* Geographic Distribution & Related Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Regional Interest Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Geographic Interest Breakdown</span>
            </h4>
            <div className="space-y-3">
              {trend.regionBreakdown.map((r, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{r.region}</span>
                    <span className="font-bold">{r.score}% Intensity</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags and Keywords */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-indigo-600" />
                <span>Related Hashtags</span>
              </h4>
              <div className="flex flex-wrap gap-2 mb-5">
                {trend.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono font-medium text-blue-700 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-xl"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-3">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Related Keywords & Semantic Entities</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {trend.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Original Source Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Verified Origin Post:</span>
              <a
                href={trend.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 px-4 py-2 rounded-xl transition-colors shadow-xs"
              >
                <span>Visit Original Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Related Trends Section */}
        {relatedTrends.length > 0 && (
          <div className="mt-8">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Related Trending Discussions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedTrends.map((rt) => (
                <TrendCard
                  key={rt.id}
                  trend={rt}
                  isSaved={false}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        activeTrend={trend}
      />
    </div>
  );
}
