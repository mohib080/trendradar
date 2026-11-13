"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Radio,
  Sparkles,
  Bell,
  User,
  ExternalLink,
  X,
  Menu,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Region } from "@/types/trend";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  onOpenAiAssistant: () => void;
  onToggleSidebar?: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  onOpenAiAssistant,
  onToggleSidebar,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: "1",
      title: "Dhaka Metro Rail Line-5 Spiking in BD",
      time: "25m ago",
      growth: "+185%",
      type: "surge",
    },
    {
      id: "2",
      title: "New reasoning benchmark viral on r/MachineLearning",
      time: "1h ago",
      growth: "+245%",
      type: "surge",
    },
    {
      id: "3",
      title: "Google Trends detected breakout query: 'Champions Trophy schedule'",
      time: "2h ago",
      growth: "+450%",
      type: "breakout",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition-colors">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Trend<span className="text-blue-600">Radar</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                Global & Bangladesh Social Media Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search trending topics, #hashtags, memes, or keywords..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-900 placeholder-slate-400 pl-10 pr-9 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Region Quick Toggle */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onRegionChange("BD")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                selectedRegion === "BD"
                  ? "bg-white text-emerald-800 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Bangladesh
            </button>
            <button
              onClick={() => onRegionChange("GLOBAL")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                selectedRegion === "GLOBAL"
                  ? "bg-white text-blue-800 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Worldwide
            </button>
          </div>

          {/* AI Assistant Trigger Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 bg-linear-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-spin-slow" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors relative"
              aria-label="Trend Alerts"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Live Velocity Alerts
                  </h4>
                  <span className="text-[11px] text-blue-600 font-medium">3 New</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-slate-800 leading-snug">
                          {n.title}
                        </p>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                          {n.growth}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                        <span>{n.time}</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <TrendingUp className="w-3 h-3 text-blue-500" /> Surge
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                  <Link
                    href="/explorer"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    View all viral surges →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="User profile"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                M
              </div>
              <span className="text-xs font-medium hidden md:block">Mohib</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 bg-slate-50 rounded-xl mb-2">
                  <p className="text-xs font-semibold text-slate-900">Mohibul Hasan</p>
                  <p className="text-[11px] text-slate-500">mohibul.sawrav2004@gmail.com</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md font-medium w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Trend Intelligence Pro
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  <Link
                    href="/saved"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span>Saved Trends & Watchlists</span>
                    <span className="text-[11px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">
                      Active
                    </span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    API Keys & Platform Settings
                  </Link>
                  <a
                    href="https://github.com/mohib080/trendradar"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span>GitHub Repository</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
