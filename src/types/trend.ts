export type Platform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "reddit"
  | "googletrends";

export type Category =
  | "all"
  | "bangladesh"
  | "technology"
  | "sports"
  | "politics"
  | "entertainment"
  | "memes"
  | "business"
  | "science";

export type Region = "BD" | "GLOBAL" | "IN" | "US" | "GB" | "JP";

export type TimeRange = "24h" | "7d" | "30d";

export type SortOption = "popularity" | "growth" | "recency";

export type DataSourceType =
  | "LIVE_API"
  | "PUBLIC_FEED"
  | "API_KEY_REQUIRED"
  | "SIMULATED_SANDBOX";

export interface AIAnalysis {
  whatIsHappening: string;
  whyTrending: string;
  origin: string;
  platformsDiscussing: string;
  trajectory: "rapidly_rising" | "peaked" | "stabilizing" | "declining";
  potentialOutcomes: string;
  scope: "local" | "regional" | "global";
  confidence: "verified" | "high" | "developing" | "speculative";
  lastAnalyzedAt: string;
}

export interface TrendHistoryPoint {
  time: string;
  score: number;
  volume: number;
}

export interface PlatformShare {
  platform: Platform;
  percentage: number;
  volume: number;
}

export interface RegionShare {
  region: string;
  score: number;
}

export interface Trend {
  id: string;
  title: string;
  bengaliTitle?: string;
  description: string;
  category: Category;
  platform: Platform;
  region: Region;
  popularityScore: number; // 0 - 100
  growthRate: number; // e.g. +145%
  volumeFormatted: string; // e.g. "1.2M searches" or "84K mentions"
  rawVolume?: number;
  firstDetected: string;
  url: string;
  author?: string;
  sourceType: DataSourceType;
  tags: string[];
  keywords: string[];
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  history: TrendHistoryPoint[];
  platformBreakdown: PlatformShare[];
  regionBreakdown: RegionShare[];
  aiSummary?: AIAnalysis;
  verifiedSource?: boolean;
}

export type ViralContentType =
  | "hashtag"
  | "video"
  | "meme"
  | "audio"
  | "search_query"
  | "discussion";

export interface ViralContentItem {
  id: string;
  type: ViralContentType;
  title: string;
  bengaliTitle?: string;
  description: string;
  platform: Platform;
  region: Region;
  category: Category;
  metricLabel: string;
  metricValue: string;
  growthRate?: number;
  thumbnailUrl?: string;
  mediaUrl?: string;
  sourceUrl: string;
  author?: string;
  tags: string[];
  date: string;
  viralityIndex: number; // 0-100
}

export interface PlatformStatus {
  platform: Platform;
  name: string;
  status: "active_feed" | "active_api" | "configured" | "needs_key" | "simulated";
  feedType: string;
  rateLimitStatus: string;
  description: string;
  envVarKey?: string;
  setupInstructions: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  tags: string[];
  color: string;
  createdAt: string;
}

export interface SavedTrend {
  id: string;
  trendId: string;
  savedAt: string;
  notes?: string;
  watchlistId?: string;
  trend?: Trend;
}

export interface UserPreferences {
  preferredRegion: Region;
  preferredCategories: Category[];
  preferredPlatforms: Platform[];
  theme: "light" | "system";
  notificationEmail?: string;
  notifyOnSpikes: boolean;
  spikeThreshold: number;
}
