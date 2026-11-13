import { NextRequest, NextResponse } from "next/server";
import { getAggregatedTrends } from "@/lib/feeds/aggregator";
import { Region, Category, Platform, SortOption, TimeRange } from "@/types/trend";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const region = (searchParams.get("region") as Region) || "BD";
    const category = (searchParams.get("category") as Category) || "all";
    const platform = (searchParams.get("platform") as Platform | "all") || "all";
    const search = searchParams.get("search") || "";
    const sort = (searchParams.get("sort") as SortOption) || "popularity";
    const timeRange = (searchParams.get("timeRange") as TimeRange) || "24h";
    const includeLive = searchParams.get("includeLive") !== "false";

    const trends = await getAggregatedTrends({
      region,
      category,
      platform,
      search,
      sort,
      timeRange,
      includeLiveFeeds: includeLive,
    });

    const stats = {
      totalTracked: trends.length,
      risingCount: trends.filter((t) => t.growthRate > 100).length,
      topCategory: getTopCategory(trends),
      activePlatforms: new Set(trends.map((t) => t.platform)).size,
    };

    return NextResponse.json({
      success: true,
      data: trends,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API /api/trends error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load trends data",
      },
      { status: 500 }
    );
  }
}

function getTopCategory(trends: { category: Category }[]): string {
  if (!trends.length) return "General";
  const counts: Record<string, number> = {};
  for (const t of trends) {
    counts[t.category] = (counts[t.category] || 0) + 1;
  }
  let maxCat = "all";
  let maxCount = 0;
  for (const [cat, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxCat = cat;
    }
  }
  return maxCat.charAt(0).toUpperCase() + maxCat.slice(1);
}
