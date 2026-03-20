"use client";

import { useState } from "react";

interface TimelineEvent {
  lane: string;
  x: number; // 0-100 position on timeline
  color: string;
  hoverText: string;
}

interface Lane {
  name: string;
  color: string;
  dotColor: string;
}

const lanes: Lane[] = [
  { name: "Stage", color: "bg-green-100 dark:bg-green-950/20", dotColor: "bg-green-500" },
  { name: "Milestone", color: "bg-amber-100 dark:bg-amber-950/20", dotColor: "bg-amber-500" },
  { name: "Signal", color: "bg-blue-100 dark:bg-blue-950/20", dotColor: "bg-blue-500" },
  { name: "Risk", color: "bg-red-100 dark:bg-red-950/20", dotColor: "bg-red-500" },
  { name: "Activity", color: "bg-gray-100 dark:bg-gray-800/50", dotColor: "bg-gray-400 dark:bg-gray-500" },
];

const events: TimelineEvent[] = [
  // Stage transitions
  { lane: "Stage", x: 5, color: "bg-green-500", hoverText: "Jan 8 — Created → Stage 1" },
  { lane: "Stage", x: 20, color: "bg-green-500", hoverText: "Feb 3 — Stage 1 → Stage 2" },
  { lane: "Stage", x: 45, color: "bg-green-500", hoverText: "Mar 12 — Stage 2 → Stage 3" },
  { lane: "Stage", x: 72, color: "bg-green-500", hoverText: "Apr 18 — Stage 3 → Stage 4" },
  // Milestones
  { lane: "Milestone", x: 15, color: "bg-amber-500", hoverText: "Jan 22 — Demo completed with VP Engineering" },
  { lane: "Milestone", x: 38, color: "bg-amber-500", hoverText: "Mar 1 — POC kicked off with technical team" },
  { lane: "Milestone", x: 58, color: "bg-amber-500", hoverText: "Mar 28 — Pricing discussion with CFO" },
  { lane: "Milestone", x: 80, color: "bg-amber-500", hoverText: "Apr 25 — Ask for Sale with VP" },
  // Signals
  { lane: "Signal", x: 25, color: "bg-blue-500", hoverText: "Feb 10 — Use Case: \"Need real-time dashboards for field teams\"" },
  { lane: "Signal", x: 50, color: "bg-blue-500", hoverText: "Mar 18 — Momentum: Stakeholder expansion to COO" },
  { lane: "Signal", x: 68, color: "bg-blue-500", hoverText: "Apr 8 — Use Case: API integration with Snowflake" },
  // Risks
  { lane: "Risk", x: 35, color: "bg-red-500", hoverText: "Feb 25 — Competitor: Power BI mentioned in call" },
  { lane: "Risk", x: 62, color: "bg-red-500", hoverText: "Apr 2 — Budget: CFO flagged Q3 budget freeze" },
  { lane: "Risk", x: 85, color: "bg-red-500", hoverText: "May 1 — Timeline: \"Hold off until Q3 review\"" },
  // Activity
  { lane: "Activity", x: 8, color: "bg-gray-400 dark:bg-gray-500", hoverText: "Jan 12 — Call: Discovery call (45 min)" },
  { lane: "Activity", x: 18, color: "bg-gray-400 dark:bg-gray-500", hoverText: "Jan 28 — Email: Follow-up on requirements" },
  { lane: "Activity", x: 30, color: "bg-gray-400 dark:bg-gray-500", hoverText: "Feb 18 — Call: Technical deep dive (60 min)" },
  { lane: "Activity", x: 42, color: "bg-gray-400 dark:bg-gray-500", hoverText: "Mar 8 — Email: POC proposal sent" },
  { lane: "Activity", x: 55, color: "bg-gray-400 dark:bg-gray-500", hoverText: "Mar 22 — Call: POC review with team" },
  { lane: "Activity", x: 65, color: "bg-gray-400 dark:bg-gray-500", hoverText: "Apr 5 — Call: Pricing discussion" },
  { lane: "Activity", x: 75, color: "bg-gray-400 dark:bg-gray-500", hoverText: "Apr 20 — Email: Proposal v2 sent" },
  { lane: "Activity", x: 88, color: "bg-gray-400 dark:bg-gray-500", hoverText: "May 3 — Call: Executive alignment" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May"];

export function TimelineLanes(): React.ReactElement {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);

  return (
    <div className="not-prose my-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3 justify-end">
        {lanes.map((lane) => (
          <div key={lane.name} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${lane.dotColor}`} />
            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">{lane.name}</span>
          </div>
        ))}
      </div>

      {/* Swimlanes */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        {lanes.map((lane) => {
          const laneEvents = events.filter((e) => e.lane === lane.name);
          return (
            <div key={lane.name} className={`flex items-center ${lane.color} border-b border-gray-200 dark:border-gray-800 last:border-b-0`}>
              {/* Lane label */}
              <div className="w-20 shrink-0 px-3 py-2.5 border-r border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono font-medium text-gray-600 dark:text-gray-400">
                  {lane.name}
                </span>
              </div>
              {/* Events track */}
              <div className="flex-1 relative h-9">
                {laneEvents.map((event, i) => (
                  <div
                    key={`${event.lane}-${i}`}
                    className="absolute top-1/2 -translate-y-1/2 group"
                    style={{ left: `${event.x}%` }}
                    onMouseEnter={() => setActiveEvent(event)}
                    onMouseLeave={() => setActiveEvent(null)}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${event.color} transition-transform duration-100 cursor-default ${activeEvent === event ? "scale-150" : "hover:scale-125"}`} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time axis */}
      <div className="flex justify-between mt-1.5 pl-20">
        {months.map((m) => (
          <span key={m} className="text-[10px] font-mono text-gray-400 dark:text-gray-500">{m}</span>
        ))}
      </div>

      {/* Hover tooltip */}
      {activeEvent && (
        <div className="mt-2 text-center">
          <span className="inline-block text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300">
            {activeEvent.hoverText}
          </span>
        </div>
      )}
    </div>
  );
}
