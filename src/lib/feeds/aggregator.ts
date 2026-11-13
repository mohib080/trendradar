import { Trend, Region, Category, Platform, SortOption, TimeRange } from "@/types/trend";
import { INITIAL_TRENDS } from "@/data/mockTrends";
import { fetchRedditTrends } from "./reddit";
import { fetchGoogleTrends } from "./googleTrends";
import { fetchHackerNewsTrends } from "./hackernews";

export interface AggregatorFilterOptions {
  region?: Region;
  category?: Category;
  platform?: Platform | "all";
  search?: string;
  sort?: SortOption;
  timeRange?: TimeRange;
  includeLiveFeeds?: boolean;
}

export async function getAggregatedTrends(options: AggregatorFilterOptions = {}): Promise<Trend[]> {
  const {
    region = "BD",
    category = "all",
    platform = "all",
    search = "",
    sort = "popularity",
    timeRange = "24h",
    includeLiveFeeds = true,
  } = options;

  let allTrends: Trend[] = [...INITIAL_TRENDS];

  if (includeLiveFeeds) {
    try {
      // Parallel fetch with timeout safeguard so dashboard is always fast
      const feedPromises: Promise<Trend[]>[] = [];

      // 1. Google Trends (matches selected region or BD)
      feedPromises.push(fetchGoogleTrends(region, 6).catch(() => []));

      // 2. Reddit trends (targeted by category/region)
      if (region === "BD") {
        feedPromises.push(fetchRedditTrends("bangladesh", 6).catch(() => []));
      } else if (category === "technology") {
        feedPromises.push(fetchRedditTrends("technology", 6).catch(() => []));
      } else if (category === "memes") {
        feedPromises.push(fetchRedditTrends("memes", 6).catch(() => []));
      } else {
        feedPromises.push(fetchRedditTrends("worldnews", 5).catch(() => []));
      }

      // 3. Hacker News for tech category or general
      if (category === "technology" || category === "all") {
        feedPromises.push(fetchHackerNewsTrends(4).catch(() => []));
      }

      const results = await Promise.allSettled(feedPromises);
      for (const res of results) {
        if (res.status === "fulfilled" && Array.isArray(res.value)) {
          allTrends = [...allTrends, ...res.value];
        }
      }
    } catch (err) {
      console.warn("Live feed aggregation warning:", err);
    }
  }

  // Deduplicate by title similarity or id
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const uniqueTrends: Trend[] = [];

  for (const item of allTrends) {
    const cleanTitle = item.title.toLowerCase().trim();
    if (!seenIds.has(item.id) && !seenTitles.has(cleanTitle)) {
      seenIds.add(item.id);
      seenTitles.add(cleanTitle);
      uniqueTrends.push(item);
    }
  }

  // Filter by Region
  let filtered = uniqueTrends;
  if (region && region !== "GLOBAL") {
    filtered = filtered.filter((t) => t.region === region || t.region === "GLOBAL");
  }

  // Filter by Category
  if (category && category !== "all") {
    filtered = filtered.filter((t) => t.category === category);
  }

  // Filter by Platform
  if (platform && platform !== "all") {
    filtered = filtered.filter((t) => t.platform === platform);
  }

  // Filter by Search
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.bengaliTitle && t.bengaliTitle.toLowerCase().includes(q)) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  }

  // Filter by TimeRange
  const now = Date.now();
  if (timeRange === "24h") {
    const cutoff = now - 24 * 3600000;
    filtered = filtered.filter((t) => new Date(t.firstDetected).getTime() >= cutoff);
  } else if (timeRange === "7d") {
    const cutoff = now - 7 * 24 * 3600000;
    filtered = filtered.filter((t) => new Date(t.firstDetected).getTime() >= cutoff);
  } // '30d' allows all items

  // Sort
  if (sort === "popularity") {
    filtered.sort((a, b) => b.popularityScore - a.popularityScore);
  } else if (sort === "growth") {
    filtered.sort((a, b) => b.growthRate - a.growthRate);
  } else if (sort === "recency") {
    filtered.sort(
      (a, b) => new Date(b.firstDetected).getTime() - new Date(a.firstDetected).getTime()
    );
  }

  return filtered;
}

export function getTrendById(id: string): Trend | undefined {
  return INITIAL_TRENDS.find((t) => t.id === id);
}
