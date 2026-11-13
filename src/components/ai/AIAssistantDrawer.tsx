"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  TrendingUp,
  Flame,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Trend, AIAnalysis } from "@/types/trend";

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrend?: Trend | null;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  provider?: string;
}

export function AIAssistantDrawer({
  isOpen,
  onClose,
  activeTrend,
}: AIAssistantDrawerProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "deepdive" | "summary">("chat");

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "Hello! I am **TrendRadar AI**, your real-time social media trend intelligence assistant. Ask me anything about trending topics in Bangladesh, global viral movements, tech developments, or sports discussions.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Deep Dive State for active topic
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Daily Summary State
  const [dailyBriefing, setDailyBriefing] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // If an activeTrend was clicked to analyze, switch to deepdive and fetch analysis
  useEffect(() => {
    if (activeTrend) {
      setActiveTab("deepdive");
      fetchDeepDive(activeTrend);
    }
  }, [activeTrend]);

  const fetchDeepDive = async (trend: Trend) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trend.title,
          description: trend.description,
          category: trend.category,
          platform: trend.platform,
          region: trend.region,
          volumeFormatted: trend.volumeFormatted,
          growthRate: trend.growthRate,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
      }
    } catch (err) {
      console.error("Deep dive error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const res = await fetch("/api/ai/summary");
      const json = await res.json();
      if (json.success) {
        setDailyBriefing(json.data);
      }
    } catch (err) {
      console.error("Summary error:", err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "summary" && !dailyBriefing) {
      fetchSummary();
    }
  }, [activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.answer || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        provider: data.provider,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Sorry, I encountered an error communicating with the trend intelligence service.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const sampleQuestions = [
    "What's trending in Bangladesh today?",
    "What are the biggest memes worldwide?",
    "What's happening in the AI industry?",
    "Which topics are gaining popularity?",
    "What are people discussing about football?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  TrendRadar AI Intelligence
                  <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    PRO
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Grounded trend analytics & objective synthesis
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`pb-2.5 px-3 border-b-2 transition-all ${
                activeTab === "chat"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              AI Assistant Chat
            </button>
            <button
              onClick={() => setActiveTab("deepdive")}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "deepdive"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>7-Point Deep Dive</span>
              {activeTrend && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`pb-2.5 px-3 border-b-2 transition-all ${
                activeTab === "summary"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Daily Briefings
            </button>
          </div>

          {/* Tab 1: AI Assistant Chat */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 text-xs leading-relaxed ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {m.sender === "ai" && (
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 ${
                        m.sender === "user"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 border border-slate-200/80 text-slate-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-slate-200/40 text-[10px] text-slate-400">
                        <span>{m.timestamp}</span>
                        {m.provider && (
                          <span className="font-mono">{m.provider}</span>
                        )}
                      </div>
                    </div>
                    {m.sender === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Analyzing real-time trend indexes...</span>
                  </div>
                )}
              </div>

              {/* Sample Quick Questions */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recommended Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[11px] bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask TrendRadar AI about any topic..."
                  className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white text-xs px-3.5 py-2.5 rounded-xl outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isChatLoading || !inputQuery.trim()}
                  className="bg-slate-900 hover:bg-blue-600 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: 7-Point Deep Dive */}
          {activeTab === "deepdive" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTrend ? (
                <div>
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      Topic under inspection
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      {activeTrend.title}
                    </h4>
                    {activeTrend.bengaliTitle && (
                      <p className="text-xs text-slate-500">{activeTrend.bengaliTitle}</p>
                    )}
                  </div>

                  {isAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                      <p className="text-xs font-semibold text-slate-700">
                        Synthesizing 7-Point Intelligence Report...
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                        Distinguishing verified facts from speculation across platforms
                      </p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-3.5">
                      {/* 1. What is happening? */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                          1. What is happening?
                        </span>
                        <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                          {analysis.whatIsHappening}
                        </p>
                      </div>

                      {/* 2. Why is this trending? */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                          2. Why is this trending?
                        </span>
                        <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                          {analysis.whyTrending}
                        </p>
                      </div>

                      {/* 3. How did it become popular? */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                          3. How did it become popular? (Origin)
                        </span>
                        <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                          {analysis.origin}
                        </p>
                      </div>

                      {/* 4. Which platforms are discussing it? */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                          4. Platforms Discussing
                        </span>
                        <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                          {analysis.platformsDiscussing}
                        </p>
                      </div>

                      {/* 5. Trajectory & Growth */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            5. Popularity Trajectory
                          </span>
                          <span className="text-xs text-slate-600">
                            Current momentum pattern
                          </span>
                        </div>
                        <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                          {analysis.trajectory.replace("_", " ")}
                        </span>
                      </div>

                      {/* 6. What could happen next? */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                          6. What could happen next?
                        </span>
                        <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                          {analysis.potentialOutcomes}
                        </p>
                      </div>

                      {/* 7. Scope & Verification */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            7. Trend Scope
                          </span>
                          <span className="text-xs font-bold capitalize text-slate-800 mt-0.5 block">
                            {analysis.scope} Trend
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Fact Check Status
                          </span>
                          <span className="text-xs font-bold capitalize text-emerald-700 mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {analysis.confidence}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold">No topic currently selected</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click the &quot;AI&quot; button on any trend card to load its 7-point intelligence report.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Daily Summary Briefings */}
          {activeTab === "summary" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Executive Briefings
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {dailyBriefing?.date || "Today's Intelligence Brief"}
                  </p>
                </div>
                <button
                  onClick={fetchSummary}
                  disabled={isSummaryLoading}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSummaryLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {isSummaryLoading ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                  Compiling daily briefings...
                </div>
              ) : dailyBriefing?.briefings ? (
                <div className="space-y-4">
                  {dailyBriefing.briefings.map((b: any) => (
                    <div
                      key={b.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {b.title}
                          </h5>
                          <p className="text-[11px] text-slate-500">{b.subtitle}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {b.dominantPlatform}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 text-xs font-medium text-slate-800">
                        {b.keyTakeaway}
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-700 pl-2">
                        {b.bulletPoints.map((pt: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span className="leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Sentiment: {b.sentiment}</span>
                        <span className="text-emerald-700 font-medium">Verified Pulse</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
