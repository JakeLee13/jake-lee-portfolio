"use client";

import { useState } from "react";

interface FlowStep {
  id: string;
  label: string;
  detail: string;
  accent: string;
}

const steps: FlowStep[] = [
  {
    id: "focus",
    label: "Focus Card",
    detail: "L3 scores deal, assigns action type badge",
    accent: "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20",
  },
  {
    id: "drawer",
    label: "Deal Drawer Opens",
    detail: "Full deal view with timeline, milestones, risks",
    accent: "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: "context",
    label: "Context Assembled",
    detail: "6 sources compiled into LLM context window",
    accent: "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20",
  },
  {
    id: "response",
    label: "AI Responds",
    detail: "Email draft, call agenda, coaching, or demo",
    accent: "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20",
  },
];

const contextSources = [
  { label: "Context Cards", detail: "Rich deal history from L0" },
  { label: "Executive Summary", detail: "AI narrative from L2" },
  { label: "Milestones", detail: "6 milestone dates + confidence" },
  { label: "Risks", detail: "Severity-tagged with evidence" },
  { label: "Actions", detail: "Priority-tagged with rationale" },
  { label: "Timeline", detail: "30 most recent events" },
];

function HorizontalArrow(): React.ReactElement {
  return (
    <div className="hidden md:flex items-center px-1 shrink-0">
      <svg width="20" height="12" viewBox="0 0 20 12" className="text-gray-400 dark:text-gray-600">
        <path d="M0 6 L14 6 M12 2 L18 6 L12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function VerticalArrow(): React.ReactElement {
  return (
    <div className="flex md:hidden justify-center py-1">
      <svg width="12" height="14" viewBox="0 0 12 14" className="text-gray-400 dark:text-gray-600">
        <path d="M6 0 L6 8 M2 6 L6 12 L10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function ActionRoutingFlow(): React.ReactElement {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="not-prose my-8">
      {/* Speed callout */}
      <div className="text-center mb-3">
        <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          One click → 90 seconds to action
        </span>
      </div>

      {/* Flow */}
      <div className="flex flex-col md:flex-row items-stretch">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col md:flex-row items-stretch flex-1 min-w-0">
            {i > 0 && (
              <>
                <HorizontalArrow />
                <VerticalArrow />
              </>
            )}
            <div
              className="relative flex-1"
              onMouseEnter={() => setActive(step.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div className={`border rounded-lg px-3 py-3 h-full transition-all duration-150 ${step.accent} ${active === step.id ? "shadow-sm ring-1 ring-gray-300 dark:ring-gray-600" : ""}`}>
                <div className="text-xs font-semibold text-black dark:text-white mb-1">
                  {step.label}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  {step.detail}
                </div>
              </div>

              {/* Context sources tooltip */}
              {active === "context" && step.id === "context" && (
                <div className="absolute left-0 right-0 top-full mt-1 z-10">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      {contextSources.map((src) => (
                        <div key={src.label} className="px-2 py-1.5 rounded bg-gray-50 dark:bg-gray-800/50">
                          <span className="text-[11px] font-medium text-black dark:text-white">{src.label}</span>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{src.detail}</p>
                        </div>
                      ))}
                    </div>
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
