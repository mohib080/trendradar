"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  MapPin,
  Globe2,
  Share2,
  Smile,
  Cpu,
  Trophy,
  Landmark,
  Film,
  BookmarkCheck,
  Settings as SettingsIcon,
  BarChart3,
  Compass,
  X,
  Radio,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { YoutubeIcon } from "@/components/common/PlatformBadge";
import { Platform } from "@/types/trend";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarInner({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRegion = searchParams?.get("region") || null;
  const currentCategory = searchParams?.get("category") || null;
  const currentSort = searchParams?.get("sort") || null;
  const currentPlatform = searchParams?.get("platform") || null;

  const navigation = [
    {
      name: "Overview",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/" && !currentCategory && !currentRegion && !currentSort && !currentPlatform,
    },
    {
      name: "Trending Now",
      href: "/?sort=growth",
      icon: Flame,
      active: pathname === "/" && currentSort === "growth",
      badge: "Surge",
    },
    {
      name: "Bangladesh Trends",
      href: "/?region=BD",
      icon: MapPin,
      active: pathname === "/" && currentRegion === "BD" && !currentCategory,
      badge: "BD",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "Worldwide Trends",
      href: "/?region=GLOBAL",
      icon: Globe2,
      active: pathname === "/" && currentRegion === "GLOBAL" && !currentCategory,
    },
    {
      name: "Viral Explorer",
      href: "/explorer",
      icon: Compass,
      active: pathname === "/explorer",
      badge: "Hot",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      name: "Analytics & Charts",
      href: "/analytics",
      icon: BarChart3,
      active: pathname === "/analytics",
    },
  ];

  const categories = [
    {
      name: "Technology & AI",
      href: "/?category=technology",
      icon: Cpu,
      active: pathname === "/" && currentCategory === "technology",
    },
    {
      name: "Memes & Viral Content",
      href: "/?category=memes",
      icon: Smile,
      active: pathname === "/" && currentCategory === "memes",
    },
    {
      name: "Sports",
      href: "/?category=sports",
      icon: Trophy,
      active: pathname === "/" && currentCategory === "sports",
    },
    {
      name: "Politics & News",
      href: "/?category=politics",
      icon: Landmark,
      active: pathname === "/" && currentCategory === "politics",
    },
    {
      name: "Entertainment",
      href: "/?category=entertainment",
      icon: Film,
      active: pathname === "/" && currentCategory === "entertainment",
    },
  ];

  const platforms: { name: string; platform: Platform; icon: React.ComponentType<{ className?: string }> }[] = [
    { name: "YouTube", platform: "youtube", icon: YoutubeIcon },
    { name: "Reddit", platform: "reddit", icon: MessageSquare },
    { name: "Google Trends", platform: "googletrends", icon: TrendingUp },
    { name: "Facebook", platform: "facebook", icon: Share2 },
    { name: "Instagram", platform: "instagram", icon: Flame },
    { name: "TikTok", platform: "tiktok", icon: Radio },
    { name: "X (Twitter)", platform: "twitter", icon: MessageSquare },
  ];

  const bottomNav = [
    {
      name: "Saved Trends",
      href: "/saved",
      icon: BookmarkCheck,
      active: pathname === "/saved",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
      active: pathname === "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Mobile close button */}
          <div className="flex md:hidden items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Discover
            </p>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    item.active
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.active ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.badgeColor || (item.active ? "bg-blue-800 text-blue-200" : "bg-slate-100 text-slate-600")
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Category Sections */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Categories
            </p>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    cat.active
                      ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${cat.active ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Platforms Filter list */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Social Platforms
            </p>
            {platforms.map((p) => {
              const Icon = p.icon;
              const isActive = pathname === "/" && currentPlatform === p.platform;
              return (
                <Link
                  key={p.platform}
                  href={`/?platform=${p.platform}`}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold border border-slate-300"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{p.name}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </Link>
              );
            })}
          </div>

          {/* Saved & Settings */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Personalization
            </p>
            {bottomNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    item.active
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? "text-blue-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Source Provenance Footer Card */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-Time Ingestion</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Reddit JSON API & Google Trends RSS are continuously synced. Other sources operate in sandbox mode.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <Suspense
      fallback={
        <aside className="fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-4 hidden md:block">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-100 rounded" />
            <div className="h-6 bg-slate-100 rounded" />
            <div className="h-6 bg-slate-100 rounded" />
          </div>
        </aside>
      }
    >
      <SidebarInner {...props} />
    </Suspense>
  );
}
