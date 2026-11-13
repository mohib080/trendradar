"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ExternalLink,
  Bookmark,
  Sparkles,
  Share2,
  Clock,
  ChevronRight,
  Flame,
  Check,
} from "lucide-react";
import { Trend } from "@/types/trend";
import { PlatformBadge, ProvenanceBadge } from "@/components/common/PlatformBadge";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { formatRelativeTime } from "@/lib/utils";

interface TrendCardProps {
  trend: Trend;
  isSaved?: boolean;
  onToggleSave?: (trendId: string) => void;
  onAnalyzeAi?: (trend: Trend) => void;
}

export function TrendCard({
  trend,
  isSaved = false,
  onToggleSave,
  onAnalyzeAi,
}: TrendCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== "undefined" ? `${window.location.origin}/trend/${trend.id}` : "";
    if (navigator.clipboard && url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(trend.id);
  };

  const handleAi = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAnalyzeAi?.(trend);
  };

  // Color gradient for score meter
  const score = trend.popularityScore;
  const scoreColor =
    score >= 90
      ? "text-rose-600 bg-rose-50 border-rose-200"
      : score >= 75
      ? "text-blue-600 bg-blue-50 border-blue-200"
      : "text-slate-600 bg-slate-50 border-slate-200";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Top Accent Strip for Ultra-High Surge */}
      {trend.growthRate >= 200 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-500 to-amber-500" />
      )}

      {/* Header Row: Badges & Provenance */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <PlatformBadge platform={trend.platform} />
            <CategoryBadge category={trend.category} />
            <ProvenanceBadge type={trend.sourceType} />
          </div>

          {/* Quick Actions: Bookmark & Share */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg border transition-all ${
                isSaved
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-transparent hover:border-slate-200"
              }`}
              title={isSaved ? "Saved in watchlists" : "Save trend"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-500" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title and Bilingual Title */}
        <Link href={`/trend/${trend.id}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug line-clamp-2">
            {trend.title}
          </h3>
          {trend.bengaliTitle && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
              {trend.bengaliTitle}
            </p>
          )}
        </Link>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {trend.description}
        </p>

        {/* Tags */}
        {trend.tags && trend.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {trend.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Metric Scores */}
        <div className="flex items-center gap-3">
          {/* Trend Score */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor}`}
            title="Trend Popularity Index (0-100)"
          >
            <span>Score:</span>
            <span>{score}</span>
          </div>

          {/* Growth Percentage */}
          {trend.growthRate !== undefined && (
            <div
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                trend.growthRate > 0 ? "text-emerald-700" : "text-slate-500"
              }`}
              title="Velocity Surge Rate"
            >
              {trend.growthRate > 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+{trend.growthRate}%</span>
                </>
              ) : (
                <span>0%</span>
              )}
            </div>
          )}

          {/* Volume */}
          <span className="text-[11px] text-slate-500 hidden sm:inline" title="Total engagement volume">
            {trend.volumeFormatted}
          </span>
        </div>

        {/* Right side: Time, AI Analyze, and Source link */}
        <div className="flex items-center gap-2">
          {/* Time detected */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400" title={`First detected: ${new Date(trend.firstDetected).toLocaleString()}`}>
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(trend.firstDetected)}</span>
          </div>

          {/* AI Analyze trigger */}
          {onAnalyzeAi && (
            <button
              onClick={handleAi}
              className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/80"
              title="Generate Instant AI Analysis"
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>AI</span>
            </button>
          )}

          {/* Original Source Link */}
          <a
            href={trend.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Open original source"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Open Details */}
          <Link
            href={`/trend/${trend.id}`}
            className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 pl-1"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
