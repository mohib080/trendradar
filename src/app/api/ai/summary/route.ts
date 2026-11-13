import { NextResponse } from "next/server";


export async function GET() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const summaries = {
    date: today,
    briefings: [
      {
        id: "bd-daily-pulse",
        title: "Bangladesh Daily Pulse",
        subtitle: "Key discussions across Dhaka, Chittagong, and the diaspora",
        keyTakeaway: "Infrastructure progress, cricket squad debates, and seasonal cultural celebrations drive peak engagement.",
        bulletPoints: [
          "Dhaka Metro Rail Line-5 test runs spark praise across urban transit groups on Facebook.",
          "BCB Champions Trophy preliminary roster announcement dominates sports talk shows and YouTube views.",
          "Winter Pitha festivals at university campuses inspire aesthetic short-form reels on TikTok and Instagram.",
          "Citizen-led price checks in Karwan Bazar foster positive community sentiment regarding essential goods.",
        ],
        dominantPlatform: "Facebook & YouTube",
        sentiment: "Predominantly Positive (68%)",
      },
      {
        id: "global-briefing",
        title: "Global Trend Briefing",
        subtitle: "Worldwide viral velocity across X, Reddit, and Google Trends",
        keyTakeaway: "Football derbies, viral pet humor, and macro tech shifts capture mass international attention.",
        bulletPoints: [
          "Premier League weekend fixtures generate over 2M discussions on X and r/soccer.",
          "'The Thinking Orange Cat' reaches 4.8M creations as the week's undisputed viral audio.",
          "Google Trends reports major search spikes for international tournament broadcast rights.",
          "Climate and renewable energy milestone reports gain traction across European forums.",
        ],
        dominantPlatform: "X (Twitter) & TikTok",
        sentiment: "Mixed / Vibrant (54% Neutral-Positive)",
      },
      {
        id: "tech-ai-digest",
        title: "Technology & AI Digest",
        subtitle: "Developments shaping developer forums and research circles",
        keyTakeaway: "Focus moves decisively from text generation to autonomous reasoning and agent evaluation.",
        bulletPoints: [
          "Frontier reasoning models show major gains in multi-step problem solving on Hacker News.",
          "Software engineering discussions in r/cscareerquestions emphasize agent pipeline skills.",
          "Quantum chemistry simulation papers achieve fault-tolerant benchmarks in peer-reviewed journals.",
          "New open-weights code generation tools spur thousands of local deployment guides.",
        ],
        dominantPlatform: "Hacker News, Reddit & X",
        sentiment: "Strongly Bullish (82% Positive)",
      },
    ],
  };

  return NextResponse.json({
    success: true,
    data: summaries,
  });
}
