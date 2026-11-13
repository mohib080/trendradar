import { NextRequest, NextResponse } from "next/server";
import { INITIAL_VIRAL_CONTENT } from "@/data/mockTrends";
import { ViralContentType, Region, Category, Platform } from "@/types/trend";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = (searchParams.get("type") as ViralContentType | "all") || "all";
    const region = (searchParams.get("region") as Region | "all") || "all";
    const category = (searchParams.get("category") as Category | "all") || "all";
    const platform = (searchParams.get("platform") as Platform | "all") || "all";
    const search = searchParams.get("search") || "";

    let items = [...INITIAL_VIRAL_CONTENT];

    if (type !== "all") {
      items = items.filter((it) => it.type === type);
    }
    if (region !== "all") {
      items = items.filter((it) => it.region === region || it.region === "GLOBAL");
    }
    if (category !== "all") {
      items = items.filter((it) => it.category === category);
    }
    if (platform !== "all") {
      items = items.filter((it) => it.platform === platform);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          (it.bengaliTitle && it.bengaliTitle.toLowerCase().includes(q)) ||
          it.description.toLowerCase().includes(q) ||
          it.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort by virality index
    items.sort((a, b) => b.viralityIndex - a.viralityIndex);

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error) {
    console.error("API /api/viral error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load viral content" },
      { status: 500 }
    );
  }
}
