"use client";

import React, { useState, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";
import { PopularityTimeChart } from "@/components/charts/PopularityTimeChart";
import { PlatformDistributionChart } from "@/components/charts/PlatformDistributionChart";
import { CategoryBarChart } from "@/components/charts/CategoryBarChart";
import { CountryComparisonChart } from "@/components/charts/CountryComparisonChart";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Layers,
  Globe2,
  PieChart as PieIcon,
  ShieldCheck,
  Flame,
  RefreshCw,
} from "lucide-react";

function AnalyticsContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Sample multi-point momentum data
  const overallMomentumData = [
    { time: "00:00", score: 45, volume: 180000 },
    { time: "04:00", score: 52, volume: 240000 },
    { time: "08:00", score: 70, volume: 450000 },
    { time: "12:00", score: 88, volume: 820000 },
    { time: "16:00", score: 95, volume: 1100000 },
    { time: "20:00", score: 92, volume: 980000 },
  ];

  const platformShareData = [
    { platform: "facebook" as const, percentage: 36, volume: 1400000 },
    { platform: "youtube" as const, percentage: 28, volume: 1080000 },
    { platform: "reddit" as const, percentage: 16, volume: 620000 },
    { platform: "twitter" as const, percentage: 12, volume: 460000 },
    { platform: "googletrends" as const, percentage: 8, volume: 310000 },
  ];

  // Rising vs Declining Trends
  const momentumMatrix = [
    {
      topic: "Dhaka Metro Rail Line-5 Milestones",
      category: "Bangladesh",
      change: "+185%",
      status: "surging",
      currentScore: 94,
    },
    {
      topic: "Autonomous AI Reasoning Benchmarks",
      category: "Technology",
      change: "+245%",
      status: "surging",
      currentScore: 96,
    },
    {
      topic: "BCB Champions Trophy Squad Selections",
      category: "Sports",
      change: "+310%",
      status: "surging",
      currentScore: 98,
    },
    {
      topic: "Classic Drama Parodies & Bangla Memes",
      category: "Memes",
      change: "+215%",
      status: "surging",
      currentScore: 91,
    },
    {
      topic: "Previous Week's Smartphone Launch",
      category: "Technology",
      change: "-38%",
      status: "declining",
      currentScore: 54,
    },
    {
      topic: "Mid-Season BPL Warmup Gossip",
      category: "Sports",
      change: "-22%",
      status: "declining",
      currentScore: 61,
    },
  ];

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
          {/* Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70 text-xs font-semibold mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Trend Intelligence Visualizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cross-Platform Trend Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Explore aggregated engagement curves, cross-platform distribution shares, sector distributions, and regional intensity comparisons.
            </p>
          </div>

          {/* Row 1: Time Series & Platform Share */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <PopularityTimeChart
                data={overallMomentumData}
                title="Aggregate Trend Velocity (24 Hours)"
              />
            </div>
            <div>
              <PlatformDistributionChart
                data={platformShareData}
                title="Global Platform Volume Share"
              />
            </div>
          </div>

          {/* Row 2: Category Distribution & Country Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryBarChart />
            <CountryComparisonChart />
          </div>

          {/* Row 3: Rising vs Declining Trends Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Velocity Momentum Matrix: Surging vs Declining
                </h3>
                <p className="text-xs text-slate-400">
                  Tracking acceleration rates across major tracked topics
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                24h Velocity
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Topic Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Velocity Change</th>
                    <th className="pb-3">Score (0-100)</th>
                    <th className="pb-3 text-right">Momentum Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {momentumMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 max-w-xs truncate">
                        {item.topic}
                      </td>
                      <td className="py-3 text-slate-600">{item.category}</td>
                      <td className="py-3">
                        <span
                          className={`font-bold inline-flex items-center gap-0.5 ${
                            item.status === "surging" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {item.status === "surging" ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          {item.change}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-700">
                        {item.currentScore}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.status === "surging"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Provenance & Transparency Disclosure */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white tracking-tight">
                Data Provenance & Ethical Analytics Standards
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                TrendRadar adheres strictly to platform data accessibility policies. Reddit public feeds and Google Trends RSS feeds are queried live via authorized public protocols. Platforms requiring elevated developer privileges (e.g. Meta Graph API, TikTok Research API, X Enterprise) operate in sandboxed or calibrated benchmark modes when API keys are not supplied in the environment.
              </p>
            </div>
          </div>
        </main>
      </div>

      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
