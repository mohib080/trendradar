import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrendRadar — Global & Bangladesh Social Media Trend Intelligence",
  description:
    "Aggregating trending topics, viral content, hashtags, memes, news, and emerging discussions from Bangladesh and around the world in one central intelligence platform.",
  keywords: [
    "TrendRadar",
    "Bangladesh Trends",
    "Global Trends",
    "Social Media Intelligence",
    "Dhaka Trends",
    "Viral Memes",
    "Google Trends Bangladesh",
    "AI Trend Analysis",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
