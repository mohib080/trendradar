import React from "react";
import { Category } from "@/types/trend";

const CATEGORY_MAP: Record<Category, { label: string; bengali: string; color: string }> = {
  all: { label: "All Categories", bengali: "সকল ক্যাটাগরি", color: "bg-slate-100 text-slate-800 border-slate-200" },
  bangladesh: { label: "Bangladesh", bengali: "বাংলাদেশ", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  technology: { label: "Technology & AI", bengali: "প্রযুক্তি ও এআই", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  sports: { label: "Sports", bengali: "খেলাধুলা", color: "bg-sky-50 text-sky-800 border-sky-200" },
  politics: { label: "Politics & News", bengali: "রাজনীতি ও সংবাদ", color: "bg-rose-50 text-rose-800 border-rose-200" },
  entertainment: { label: "Entertainment", bengali: "বিনোদন", color: "bg-purple-50 text-purple-800 border-purple-200" },
  memes: { label: "Memes & Viral", bengali: "মিম ও ভাইরাল", color: "bg-amber-50 text-amber-800 border-amber-200" },
  business: { label: "Business & Economy", bengali: "ব্যবসা ও বাণিজ্য", color: "bg-cyan-50 text-cyan-800 border-cyan-200" },
  science: { label: "Science & DeepTech", bengali: "বিজ্ঞান ও গবেষণা", color: "bg-teal-50 text-teal-800 border-teal-200" },
};

export function CategoryBadge({
  category,
  showBengali = false,
  className = "",
}: {
  category: Category;
  showBengali?: boolean;
  className?: string;
}) {
  const item = CATEGORY_MAP[category] || {
    label: category,
    bengali: "",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-md border ${item.color} ${className}`}
    >
      {item.label}
      {showBengali && item.bengali && (
        <span className="ml-1 opacity-75 font-normal">({item.bengali})</span>
      )}
    </span>
  );
}

export function getCategoryInfo(category: Category) {
  return CATEGORY_MAP[category] || CATEGORY_MAP.all;
}
