"use client";

import { useState } from "react";

interface FunnelLevel {
  id: string;
  label: string;
  detail: string;
  size: string;
  widthPercent: number;
  color: string;
  hoverDetail: string;
}

const levels: FunnelLevel[] = [
  {
    id: "raw",
    label: "Raw Data",
    detail: "CRM fields, call transcripts, email threads, websites",
    size: "~50 fields + hours of calls + 1000s of emails",
    widthPercent: 100,
    color: "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
    hoverDetail: "Salesforce opportunities (50+ fields each), Gong call recordings (30-60 min), email threads (hundreds per deal), company websites",
  },
  {
    id: "signals",
    label: "Extracted Signals",
    detail: "Structured JSON with verbatim quotes",
    size: "3-8 signals per deal",
    widthPercent: 75,
    color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50",
    hoverDetail: "Each signal: event date, actors, quoted evidence, category (Milestone / Risk / Use Case / Momentum). Complete quotes, not summaries.",
  },
  {
    id: "intelligence",
    label: "Synthesized Intelligence",
    detail: "Milestones, top risk, top action, narrative",
    size: "6 dates + 1 risk + 1 action + summary",
    widthPercent: 50,
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
    hoverDetail: "6 milestone dates (Demo → Closing Plan), highest-severity risk with evidence, highest-priority action with rationale, executive summary narrative (~1KB)",
  },
  {
    id: "score",
    label: "Priority Score",
    detail: "Deterministic score + tier assignment",
    size: "1 number + 1 tier",
    widthPercent: 30,
    color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50",
    hoverDetail: "Weighted linear score (0-110) from close date, stage, signal recency, risk tags, daily overrides. Tier: 'This Week' (≥65) or 'On Radar'.",
  },
  {
    id: "context",
    label: "Assembled Context",
    detail: "Curated context window for Deal Chat",
    size: "~2KB high-signal context",
    widthPercent: 20,
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50",
    hoverDetail: "Context cards + summary + milestones + risks + actions + 30 timeline events. Every token is high-signal. This is what the LLM actually sees.",
  },
];

export function ContextFunnel(): React.ReactElement {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="not-prose my-8">
      <div className="flex flex-col items-center gap-1.5">
        {levels.map((level) => {
          const isActive = active === level.id;
          return (
            <div
              key={level.id}
              className="w-full flex flex-col items-center relative"
              onMouseEnter={() => setActive(level.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div
                className={`border rounded-lg px-4 py-3 transition-all duration-150 ${level.color} ${isActive ? "shadow-sm ring-1 ring-gray-300 dark:ring-gray-600" : ""}`}
                style={{ width: `${level.widthPercent}%`, minWidth: "280px" }}
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2 min-w-0 flex-1">
                    <span className="text-sm font-semibold text-black dark:text-white whitespace-nowrap">
                      {level.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {level.detail}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {level.size}
                  </span>
                </div>
              </div>

              {/* Hover detail */}
              {isActive && (
                <div className="absolute top-full mt-1 z-10 w-full max-w-md">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-xs text-gray-500 dark:text-gray-400">
                    {level.hoverDetail}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
