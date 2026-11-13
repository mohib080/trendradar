"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";
import { PLATFORM_INTEGRATIONS_STATUS } from "@/data/mockTrends";
import { PlatformStatus, Region, Category } from "@/types/trend";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { localStore } from "@/lib/supabase";
import {
  Settings,
  Key,
  Database,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Save,
  Globe,
  Bell,
  Cpu,
  RefreshCw,
} from "lucide-react";

function SettingsContent() {
  const [platforms] = useState<PlatformStatus[]>(PLATFORM_INTEGRATIONS_STATUS);
  const [geminiKey, setGeminiKey] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [defaultRegion, setDefaultRegion] = useState<Region>("BD");
  const [notifyOnSpikes, setNotifyOnSpikes] = useState(true);
  const [spikeThreshold, setSpikeThreshold] = useState(100);

  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  useEffect(() => {
    const prefs = localStore.get<any>("user_preferences", {});
    if (prefs.defaultRegion) setDefaultRegion(prefs.defaultRegion);
    if (prefs.notifyOnSpikes !== undefined) setNotifyOnSpikes(prefs.notifyOnSpikes);
    if (prefs.spikeThreshold) setSpikeThreshold(prefs.spikeThreshold);
    if (prefs.geminiKey) setGeminiKey(prefs.geminiKey);
    if (prefs.supabaseUrl) setSupabaseUrl(prefs.supabaseUrl);
    if (prefs.supabaseAnonKey) setSupabaseAnonKey(prefs.supabaseAnonKey);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const prefs = {
      defaultRegion,
      notifyOnSpikes,
      spikeThreshold,
      geminiKey,
      supabaseUrl,
      supabaseAnonKey,
    };
    localStore.set("user_preferences", prefs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const sqlSchemaSnippet = `-- TrendRadar Supabase Schema (Tables: trends, watchlists, saved_trends)
create table if not exists public.saved_trends (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  trend_id text not null,
  saved_at timestamp with time zone default timezone('utc'::text, now())
);`;

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlSchemaSnippet);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        selectedRegion={defaultRegion}
        onRegionChange={setDefaultRegion}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 md:pl-64 min-w-0">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3">
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Configuration & Integrations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Settings & Platform Connections
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Verify platform ingestion statuses, configure optional API tokens in environment variables, and manage personal trend intelligence preferences.
            </p>
          </div>

          {/* Section 1: Platform Ingestion Status Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs mb-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Platform Connection & Ingestion Status
                </h3>
                <p className="text-xs text-slate-500">
                  Status of live data collectors, rate limits, and fallback pipelines
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                7 Platforms Tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Platform</th>
                    <th className="pb-3">Feed Mechanism</th>
                    <th className="pb-3">Integration Status</th>
                    <th className="pb-3">Rate Limit / Policy</th>
                    <th className="pb-3">Credential Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {platforms.map((p) => {
                    const statusBadge = {
                      active_feed: {
                        label: "Live Public Feed",
                        className: "bg-emerald-50 text-emerald-800 border-emerald-200",
                        icon: CheckCircle2,
                      },
                      active_api: {
                        label: "Connected API",
                        className: "bg-blue-50 text-blue-800 border-blue-200",
                        icon: CheckCircle2,
                      },
                      configured: {
                        label: "Ready / Configured",
                        className: "bg-indigo-50 text-indigo-800 border-indigo-200",
                        icon: CheckCircle2,
                      },
                      needs_key: {
                        label: "Key Optional",
                        className: "bg-amber-50 text-amber-800 border-amber-200",
                        icon: AlertTriangle,
                      },
                      simulated: {
                        label: "Demo Sandbox",
                        className: "bg-purple-50 text-purple-800 border-purple-200",
                        icon: HelpCircle,
                      },
                    }[p.status];
                    const Icon = statusBadge.icon;

                    return (
                      <tr key={p.platform} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 font-semibold text-slate-900">
                          <PlatformBadge platform={p.platform} />
                        </td>
                        <td className="py-3 font-medium text-slate-700">{p.feedType}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusBadge.className}`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{statusBadge.label}</span>
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 max-w-xs truncate">{p.rateLimitStatus}</td>
                        <td className="py-3 font-mono text-[11px] text-slate-600">
                          {p.envVarKey || "None (Public)"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Environment Variables Reference */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-white">
                Environment Variables Reference (.env.local)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              To configure live API access for authenticated feeds or deploy to production, add these keys to your <code className="text-amber-300 font-mono">.env.local</code> file:
            </p>

            <pre className="bg-slate-950 p-4 rounded-2xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
{`# 1. Google Gemini AI API (Powers live 7-point intelligence & chat assistant)
GEMINI_API_KEY=your_gemini_api_key_here

# 2. Supabase Integration (Optional: for persisted cloud bookmarks & auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3. Optional Social Platform Credentials
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
YOUTUBE_API_KEY=your_google_youtube_api_key
TWITTER_BEARER_TOKEN=your_twitter_v2_bearer_token`}
            </pre>
          </div>

          {/* Section 3: User Preferences Form */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  User Preferences & Intelligence Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Customize default dashboard region and velocity surge notifications
                </p>
              </div>

              {savedSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>Preferences Saved!</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Region */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Default Target Region
                </label>
                <select
                  value={defaultRegion}
                  onChange={(e) => setDefaultRegion(e.target.value as Region)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden bg-slate-50"
                >
                  <option value="BD">Bangladesh (Dhaka, Chittagong, Local Dailies) 🇧🇩</option>
                  <option value="GLOBAL">Worldwide (Global Feeds) 🌐</option>
                  <option value="IN">India 🇮🇳</option>
                  <option value="US">United States 🇺🇸</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default region shown when you open the main dashboard.
                </p>
              </div>

              {/* Surge Threshold */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Surge Alert Threshold (% Growth)
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  step="25"
                  value={spikeThreshold}
                  onChange={(e) => setSpikeThreshold(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden bg-slate-50"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Highlight topics with velocity surge greater than +{spikeThreshold}%.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifySpikes"
                  checked={notifyOnSpikes}
                  onChange={(e) => setNotifyOnSpikes(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="notifySpikes" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Display real-time notification alerts when trends exceed surge threshold
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>

          {/* Section 4: Supabase Schema SQL viewer */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  Supabase Database Schema (SQL)
                </h4>
              </div>
              <button
                onClick={handleCopySql}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-medium transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Copied SQL" : "Copy SQL"}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              A complete production schema file is included in <code className="font-mono text-blue-600">supabase/schema.sql</code> with Row Level Security (RLS) policies for watchlists, bookmarks, and user preferences.
            </p>
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

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
