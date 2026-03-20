"use client";

import { useState } from "react";

interface Weight {
  label: string;
  points: number;
  condition: string;
}

interface Category {
  name: string;
  color: string;
  barColor: string;
  weights: Weight[];
}

const categories: Category[] = [
  {
    name: "Urgency",
    color: "text-red-600 dark:text-red-400",
    barColor: "bg-red-400 dark:bg-red-500",
    weights: [
      { label: "Close < 14d", points: 50, condition: "Close date is within 14 days" },
      { label: "Close 14-30d", points: 30, condition: "Close date is 14–30 days out" },
      { label: "Close 30-60d", points: 10, condition: "Close date is 30–60 days out" },
    ],
  },
  {
    name: "Stage",
    color: "text-blue-600 dark:text-blue-400",
    barColor: "bg-blue-400 dark:bg-blue-500",
    weights: [
      { label: "Stage 5", points: 25, condition: "Deal in Negotiations stage" },
      { label: "Stage 4", points: 15, condition: "Deal in Confirm Solution stage" },
      { label: "Stage 3", points: 5, condition: "Deal in Demonstrate Value stage" },
    ],
  },
  {
    name: "Momentum",
    color: "text-green-600 dark:text-green-400",
    barColor: "bg-green-400 dark:bg-green-500",
    weights: [
      { label: "Signal < 7d", points: 15, condition: "Most recent signal is within 7 days" },
      { label: "Signal 7-21d", points: 5, condition: "Most recent signal is 7–21 days old" },
      { label: "Signal 60-180d", points: -15, condition: "Staleness penalty — no signal in 60–180 days" },
    ],
  },
  {
    name: "Friction",
    color: "text-amber-600 dark:text-amber-400",
    barColor: "bg-amber-400 dark:bg-amber-500",
    weights: [
      { label: "Competitor", points: 15, condition: "Top risk tag is Competitor" },
      { label: "Stall", points: 10, condition: "Top risk tag is Timeline/Stall" },
      { label: "Authority", points: 10, condition: "Top risk tag is Authority" },
    ],
  },
  {
    name: "Daily Override",
    color: "text-purple-600 dark:text-purple-400",
    barColor: "bg-purple-400 dark:bg-purple-500",
    weights: [
      { label: "Meeting today", points: 25, condition: "Rep has a call scheduled today with this account" },
      { label: "Unanswered inbound", points: 20, condition: "Prospect emailed ≤14 days ago, rep hasn't replied" },
    ],
  },
];

const exampleDeal = {
  name: "Acme Corp — Platform Deal",
  weights: ["Close < 14d (+50)", "Stage 4 (+15)", "Signal < 7d (+15)", "Competitor (+15)", "Meeting today (+25)"],
  total: 120,
  tier: "This Week",
};

const maxPoints = 50;

export function ScoringBreakdown(): React.ReactElement {
  const [activeWeight, setActiveWeight] = useState<Weight | null>(null);

  return (
    <div className="not-prose my-8">
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-semibold ${cat.color}`}>{cat.name}</span>
            </div>
            <div className="space-y-1">
              {cat.weights.map((w) => {
                const isActive = activeWeight === w;
                const barWidth = Math.abs(w.points) / maxPoints * 100;
                const isNegative = w.points < 0;
                return (
                  <div
                    key={w.label}
                    className={`flex items-center gap-2 px-2 py-1 rounded transition-all duration-100 cursor-default ${isActive ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}
                    onMouseEnter={() => setActiveWeight(w)}
                    onMouseLeave={() => setActiveWeight(null)}
                  >
                    <span className="text-[11px] font-mono text-gray-600 dark:text-gray-400 w-36 shrink-0">
                      {w.label}
                    </span>
                    <div className="flex-1 h-4 relative">
                      <div
                        className={`h-full rounded-sm transition-all duration-150 ${isNegative ? "bg-gray-300 dark:bg-gray-600" : cat.barColor} ${isActive ? "opacity-100" : "opacity-70"}`}
                        style={{ width: `${Math.min(barWidth, 100)}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-mono w-10 text-right shrink-0 ${isNegative ? "text-gray-400" : "text-gray-600 dark:text-gray-400"}`}>
                      {w.points > 0 ? `+${w.points}` : w.points}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hover condition */}
      {activeWeight && (
        <div className="mt-3 text-center">
          <span className="inline-block text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300">
            {activeWeight.condition}
          </span>
        </div>
      )}

      {/* Example deal */}
      <div className="mt-5 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="text-xs font-semibold text-black dark:text-white">{exampleDeal.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">Score: {exampleDeal.total}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              {exampleDeal.tier}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {exampleDeal.weights.map((w) => (
            <span key={w} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Tier divider */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
          ≥ 65 = &quot;This Week&quot; &nbsp;|&nbsp; &lt; 65 = &quot;On Radar&quot;
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}
