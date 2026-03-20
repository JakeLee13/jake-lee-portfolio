"use client";

import { useState } from "react";

interface Layer {
  id: string;
  label: string;
  name: string;
  description: string;
  schedule: string;
  type: "llm" | "deterministic" | "embedding";
  tooltip: {
    inputs: string;
    outputs: string;
    decision: string;
  };
}

const layers: Layer[] = [
  {
    id: "l0",
    label: "L0",
    name: "Enrichment",
    description: "Compress CRM fields into rich context cards + scrape company websites",
    schedule: "Daily",
    type: "llm",
    tooltip: {
      inputs: "Salesforce opportunities (50+ fields), company websites",
      outputs: "Markdown context cards (~2-3KB per deal), website summaries",
      decision: "Pre-build context so downstream LLMs have full deal history",
    },
  },
  {
    id: "l1",
    label: "L1",
    name: "Signal Extraction",
    description: "Extract evidence-backed signals from call transcripts and email threads",
    schedule: "Daily 8:15am",
    type: "llm",
    tooltip: {
      inputs: "Gong calls, email threads, L0 context cards",
      outputs: "Structured signals with verbatim quotes (3-8 per deal)",
      decision: "Complete quotes, not summaries — reps trust what they can verify",
    },
  },
  {
    id: "l1.5",
    label: "L1.5",
    name: "Timeline Reconstruction",
    description: "Build 5-lane timeline from signals, CRM stages, and rep overrides",
    schedule: "Daily 8:30am",
    type: "deterministic",
    tooltip: {
      inputs: "L1 signals, CRM stage transitions, rep milestone overrides",
      outputs: "5-lane timeline: Stage, Signal, Risk, Activity, Milestone",
      decision: "Preserve L2 milestones in daily rebuild — don't re-score from noisy L1",
    },
  },
  {
    id: "l2",
    label: "L2",
    name: "LLM Synthesis",
    description: "Consolidate milestones, synthesize risks, generate actions and narratives",
    schedule: "Weekly Mon 8am",
    type: "llm",
    tooltip: {
      inputs: "L0 context cards, L1 signals, CRM data, rep overrides",
      outputs: "Milestones (6 dates), risks, actions, executive summary per deal",
      decision: "Each prompt does one thing — extract vs. synthesize vs. format",
    },
  },
  {
    id: "l3",
    label: "L3",
    name: "Deterministic Scoring",
    description: "Score and prioritize deals using objective CRM signals — no LLM",
    schedule: "Hourly",
    type: "deterministic",
    tooltip: {
      inputs: "CRM opportunities, L2 risks/actions, L1 signal timestamps",
      outputs: "Priority score (0-110), tier (This Week / On Radar), daily flags",
      decision: "LLM severity too compressed (~87% Critical) — use objective signals instead",
    },
  },
  {
    id: "l4",
    label: "L4",
    name: "Vector Index",
    description: "Embed timeline events for semantic search and conversational RAG",
    schedule: "Multiple daily",
    type: "embedding",
    tooltip: {
      inputs: "Timeline events (all 5 lanes)",
      outputs: "Vector index with metadata filtering (opportunity, owner, lane)",
      decision: "Single combined index with property-based scoping vs. per-deal indexes",
    },
  },
];

const typeColors: Record<Layer["type"], { bg: string; text: string; border: string; label: string }> = {
  llm: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/50",
    label: "LLM",
  },
  deterministic: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800/50",
    label: "Deterministic",
  },
  embedding: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800/50",
    label: "Embedding",
  },
};

function Arrow(): React.ReactElement {
  return (
    <div className="flex justify-center py-1">
      <svg width="12" height="14" viewBox="0 0 12 14" className="text-gray-400 dark:text-gray-600">
        <path d="M6 0 L6 8 M2 6 L6 12 L10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function LayerPipeline(): React.ReactElement {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="not-prose my-8">
      <div className="flex flex-col items-center gap-0">
        {layers.map((layer, i) => {
          const colors = typeColors[layer.type];
          const isActive = active === layer.id;

          return (
            <div key={layer.id} className="w-full flex flex-col items-center">
              {i > 0 && <Arrow />}
              <div
                className="w-full relative"
                onMouseEnter={() => setActive(layer.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div className={`border rounded-lg overflow-hidden transition-all duration-150 ${isActive ? "border-gray-400 dark:border-gray-500 shadow-sm" : "border-gray-200 dark:border-gray-800"}`}>
                  <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
                    {/* Layer label */}
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                      {layer.label}
                    </span>
                    {/* Name */}
                    <span className="text-sm font-semibold text-black dark:text-white">
                      {layer.name}
                    </span>
                    {/* Description */}
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-1 min-w-[200px]">
                      {layer.description}
                    </span>
                    {/* Tags */}
                    <div className="flex gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {layer.schedule}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                        {colors.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tooltip */}
                {isActive && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-10 mx-4">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Inputs</span>
                          <p className="text-gray-500 dark:text-gray-400 mt-0.5">{layer.tooltip.inputs}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Outputs</span>
                          <p className="text-gray-500 dark:text-gray-400 mt-0.5">{layer.tooltip.outputs}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Key Decision</span>
                          <p className="text-gray-500 dark:text-gray-400 mt-0.5">{layer.tooltip.decision}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
