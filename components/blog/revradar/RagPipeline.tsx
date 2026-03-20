"use client";

import { useState } from "react";

interface Node {
  id: string;
  label: string;
  sublabel: string;
  accent: string;
}

const nodes: Node[] = [
  { id: "question", label: "User Question", sublabel: "\"What was the CFO's budget concern?\"", accent: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" },
  { id: "embed", label: "Embed Query", sublabel: "Cohere multilingual model", accent: "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20" },
  { id: "vector", label: "Vector DB", sublabel: "Domo Recall — metadata-filtered", accent: "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20" },
  { id: "topk", label: "Top-K Results", sublabel: "Most relevant timeline events", accent: "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20" },
  { id: "llm", label: "LLM + Deal Context", sublabel: "Context cards + results → response", accent: "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20" },
];

const filterDimensions = [
  "opportunityId",
  "accountName",
  "forecastOwner",
  "forecastManager",
  "eventDate",
  "lane",
  "signalCategory",
];

function HArrow(): React.ReactElement {
  return (
    <div className="hidden md:flex items-center px-0.5 shrink-0">
      <svg width="16" height="12" viewBox="0 0 16 12" className="text-gray-400 dark:text-gray-600">
        <path d="M0 6 L10 6 M8 2 L14 6 L8 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function VArrow(): React.ReactElement {
  return (
    <div className="flex md:hidden justify-center py-1">
      <svg width="12" height="14" viewBox="0 0 12 14" className="text-gray-400 dark:text-gray-600">
        <path d="M6 0 L6 8 M2 6 L6 12 L10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function RagPipeline(): React.ReactElement {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="not-prose my-8">
      <div className="flex flex-col md:flex-row items-stretch">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-col md:flex-row items-stretch flex-1 min-w-0">
            {i > 0 && (
              <>
                <HArrow />
                <VArrow />
              </>
            )}
            <div
              className="relative flex-1"
              onMouseEnter={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div className={`border rounded-lg px-3 py-3 h-full transition-all duration-150 ${node.accent} ${active === node.id ? "shadow-sm ring-1 ring-gray-300 dark:ring-gray-600" : ""}`}>
                <div className="text-xs font-semibold text-black dark:text-white mb-1">
                  {node.label}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">
                  {node.sublabel}
                </div>
                {/* Filter pills on vector DB */}
                {node.id === "vector" && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filterDimensions.slice(0, 4).map((f) => (
                      <span key={f} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                        {f}
                      </span>
                    ))}
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                      +3 more
                    </span>
                  </div>
                )}
              </div>

              {/* Vector DB hover: all filters */}
              {active === "vector" && node.id === "vector" && (
                <div className="absolute left-0 right-0 top-full mt-1 z-10">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2.5">
                    <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Filter Dimensions</span>
                    <div className="flex flex-wrap gap-1">
                      {filterDimensions.map((f) => (
                        <span key={f} className="text-[10px] font-mono px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                      Scope queries: single deal, rep&apos;s book, manager&apos;s org, or global
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
