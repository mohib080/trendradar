# TrendRadar — Global Social Media Trend Intelligence Platform

<p align="center">
  <strong>Real-time cross-platform trend aggregation, viral content intelligence, and AI-powered synthesis for Bangladesh and the world.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Charts-Recharts-2563eb" alt="Recharts" />
  <img src="https://img.shields.io/badge/Database-Supabase_RLS-3ecf8e?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/AI-Google_Gemini-8e24aa?logo=google" alt="Google Gemini" />
</p>

---

## 📌 Overview

**TrendRadar** is a modern, full-featured intelligence dashboard designed to give users one central place to understand what's trending across multiple social media platforms without having to visit each platform individually. 

It provides deep-focus tracking on **Bangladesh** (Dhaka transit, civic discourse, cricket squad announcements, winter festivals, Bangla natok memes, tech startups) alongside **Worldwide** trends across **7 major platforms**:
- **Facebook**
- **YouTube**
- **Reddit** (live public subreddits)
- **Google Trends** (live official daily RSS feeds)
- **X (Twitter)**
- **TikTok**
- **Instagram**

---

## 🚀 Key Features

### 1. Editorial Analytics Dashboard (`/`)
- **Top Metrics Bar:** Real-time counts of total tracked trends, surging trends (>100% velocity), top category, and active platform integrations.
- **Geographic Filtering:** Seamlessly switch between **Bangladesh (🇧🇩)**, **Worldwide (🌐)**, **India (🇮🇳)**, and **United States (🇺🇸)**.
- **Velocity & Recency Controls:** Filter by **24h**, **7d**, and **30d** timeframes; sort by **Popularity Score (0-100)**, **Growth Velocity (%)**, or **Most Recent**.
- **Instant Search:** Real-time fuzzy query across topic titles, Bengali translations, hashtags, keywords, and descriptions.
- **Data Provenance Badges:** Clear labeling distinguishing `Live Public Feed`, `Live API`, `API Key Required`, and `Demo Sandbox`.

### 2. Trending Content Explorer (`/explorer`)
A dedicated viral discovery suite categorized into 6 specialized modalities:
- **Trending Hashtags:** Volume counts, 24h momentum, sparklines, and origin channels.
- **Viral Videos:** View velocity, creator attributions, and direct video links.
- **Popular Memes:** Template origins, cultural context, and virality indexes.
- **Trending Audio & Songs:** Track usage velocity and platform distribution.
- **Top Search Queries:** Breakout Google searches with search volume indexes.
- **Viral Discussions:** Community mega-threads from Reddit and online forums.

### 3. AI Trend Intelligence Engine
- **7-Point Deep Dive:**
  1. *What is happening?* (Factual event summary)
  2. *Why is this trending?* (Emotional and societal triggers)
  3. *How did it become popular?* (Origin and acceleration path)
  4. *Which platforms are discussing it?* (Channel breakdown)
  5. *Is it gaining or losing popularity?* (Trajectory analysis)
  6. *What could happen next?* (Projected outcomes)
  7. *Is this a local or global trend?* (Geographic scope)
- **Executive Daily Pulse:** Auto-compiled briefings including the *Bangladesh Daily Pulse*, *Global Trend Briefing*, and *Technology & AI Digest*.
- **Interactive AI Assistant:** Grounded chat drawer answering natural language queries like *"What's trending in Bangladesh today?"* or *"What are the biggest memes worldwide?"* without hallucinated metrics.

### 4. Detailed Analytics View (`/trend/[id]`)
- Interactive Recharts **Popularity Over Time** (Area/Line chart with score and volume toggle).
- Interactive **Platform Distribution** (Donut chart).
- **Geographic Interest Intensity** regional breakdown bars.
- Semantic entities, related hashtags, and verified source links.
- Contextual related topics carousel.

### 5. Personalization & Watchlists (`/saved`)
- Bookmark and persist trends locally or to Supabase.
- Build custom **Sector Watchlists** with custom tags, keywords, and colors.
- Follow specific keywords & hashtags for notification surge alerts.
- **One-click Export:** Export your tracked intelligence directly to **JSON** or **CSV**.

### 6. Platform Integration & Settings (`/settings`)
- Live connection status table for all 7 platforms.
- Setup instructions and documentation links for API credentials.
- In-browser preference controls for target regions and surge thresholds.
- Supabase SQL schema viewer with one-click copy.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with editorial design palette
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visualizations:** [Recharts 3](https://recharts.org/)
- **Live Feeds:** `fast-xml-parser` for Google Trends RSS & native JSON for Reddit / Hacker News
- **Database / Auth:** [Supabase](https://supabase.com/) (`@supabase/supabase-js` + localStorage hybrid sync)
- **AI Analytics:** [Google Gemini API](https://ai.google.dev/) (`@google/genai` with heuristic fallback)

---

## 📦 Getting Started

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/mohib080/trendradar.git
cd trendradar
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure environment variables (Optional)
Copy the example environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in any desired credentials:
\`\`\`ini
# Google Gemini (powers live AI deep dive & chat assistant)
GEMINI_API_KEY=your_gemini_api_key

# Supabase (optional: for persisted database sync)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`
*(Note: TrendRadar runs out of the box with zero configuration! Public feeds and heuristic intelligence work immediately.)*

### 4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 🗄️ Supabase Database Schema

A ready-to-run schema is provided in `supabase/schema.sql`:

\`\`\`sql
create table if not exists public.trends (
  id text primary key,
  title text not null,
  bengali_title text,
  description text not null,
  category text not null,
  platform text not null,
  region text not null,
  popularity_score numeric not null default 50,
  growth_rate numeric not null default 0,
  volume_formatted text not null,
  first_detected timestamp with time zone default timezone('utc'::text, now()),
  url text not null,
  source_type text not null default 'PUBLIC_FEED'
);
\`\`\`

---

## 📄 License

MIT © [Mohibul Hasan](https://github.com/mohib080)
