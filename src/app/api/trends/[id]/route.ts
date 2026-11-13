import { NextRequest, NextResponse } from "next/server";
import { INITIAL_TRENDS } from "@/data/mockTrends";
import { getAggregatedTrends } from "@/lib/feeds/aggregator";
import { Trend } from "@/types/trend";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // First search INITIAL_TRENDS
    let found: Trend | undefined = INITIAL_TRENDS.find((t) => t.id === id);

    // If not found in static list, search aggregated list
    if (!found) {
      const all = await getAggregatedTrends({ includeLiveFeeds: true });
      found = all.find((t) => t.id === id);
    }

    if (!found) {
      return NextResponse.json(
        { success: false, error: "Trend not found" },
        { status: 404 }
      );
    }

    // Find related trends (same category or overlapping tags)
    const related = INITIAL_TRENDS.filter(
      (t) => t.id !== found!.id && (t.category === found!.category || t.region === found!.region)
    ).slice(0, 4);

    return NextResponse.json({
      success: true,
      data: found,
      related,
    });
  } catch (error) {
    console.error("API /api/trends/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trend details" },
      { status: 500 }
    );
  }
}
