import React from "react";
import { Platform, DataSourceType } from "@/types/trend";
import {
  Globe,
  Share2,
  TrendingUp,
  MessageSquare,
  Flame,
  Radio,
} from "lucide-react";

export function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export const PLATFORM_CONFIG: Record<
  Platform,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  facebook: {
    label: "Facebook",
    bgColor: "bg-blue-50 text-blue-700 border-blue-200",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    icon: Share2,
  },
  instagram: {
    label: "Instagram",
    bgColor: "bg-pink-50 text-pink-700 border-pink-200",
    textColor: "text-pink-700",
    borderColor: "border-pink-200",
    icon: Flame,
  },
  tiktok: {
    label: "TikTok",
    bgColor: "bg-zinc-100 text-zinc-900 border-zinc-300",
    textColor: "text-zinc-900",
    borderColor: "border-zinc-300",
    icon: Radio,
  },
  youtube: {
    label: "YouTube",
    bgColor: "bg-red-50 text-red-700 border-red-200",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    icon: YoutubeIcon,
  },
  twitter: {
    label: "X (Twitter)",
    bgColor: "bg-slate-100 text-slate-900 border-slate-300",
    textColor: "text-slate-900",
    borderColor: "border-slate-300",
    icon: MessageSquare,
  },
  reddit: {
    label: "Reddit",
    bgColor: "bg-orange-50 text-orange-700 border-orange-200",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    icon: MessageSquare,
  },
  googletrends: {
    label: "Google Trends",
    bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    icon: TrendingUp,
  },
};

export function PlatformBadge({
  platform,
  showLabel = true,
  size = "md",
}: {
  platform: Platform;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const config = PLATFORM_CONFIG[platform] || {
    label: platform,
    bgColor: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Globe,
  };
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bgColor} ${sizeClasses}`}
      title={`Source: ${config.label}`}
    >
      <Icon className={iconSizes} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export function ProvenanceBadge({ type }: { type: DataSourceType }) {
  const config = {
    LIVE_API: {
      label: "Live API",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    PUBLIC_FEED: {
      label: "Public Feed",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    API_KEY_REQUIRED: {
      label: "API Key Required",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    SIMULATED_SANDBOX: {
      label: "Demo Sandbox",
      className: "bg-purple-50 text-purple-700 border-purple-200",
      dot: "bg-purple-500",
    },
  }[type] || {
    label: "Data Feed",
    className: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${config.className}`}
      title={`Data Provenance: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
