const multipliers = [
  {
    id: "01",
    name: "Reasoning tokens",
    range: "3–20×",
    detail:
      "o1/o3/R1/Gemini Thinking burn hidden 'thinking tokens' billed at output rates. Gemini 2.5 Flash's thinking toggle lifts output pricing from $0.60/M → $3.50/M — a 6× step from one flag.",
    anchor: "o3-high on ARC-AGI: ~$30K per task",
    color: "text-rose-500",
    bar: "bg-rose-500",
  },
  {
    id: "02",
    name: "Tool-use loops",
    range: "4–10×",
    detail:
      "Every tool call is a round-trip. Claude Code payload is 45K tokens before the user types a word. Anthropic's own number: agents use ~4× more tokens than chat.",
    anchor: "30-min session ≈ 100K tokens",
    color: "text-amber-500",
    bar: "bg-amber-500",
  },
  {
    id: "03",
    name: "Multi-agent fan-out",
    range: "3–15×",
    detail:
      "Parent spawns sub-agents, each with its own 200K context and tool loops. Anthropic published: multi-agent systems use ~15× more tokens than chat. Token usage explains 80% of BrowseComp variance.",
    anchor: "One research query ≈ 400K tokens",
    color: "text-violet-500",
    bar: "bg-violet-500",
  },
  {
    id: "04",
    name: "MCP / skill context",
    range: "+30–60K tokens",
    detail:
      "Each MCP tool definition runs 280–320 tokens. Five servers with 50 tools consume 30–60K tokens — up to 30% of the context window — before any user prompt.",
    anchor: "Fixed cost per session",
    color: "text-sky-500",
    bar: "bg-sky-500",
  },
  {
    id: "05",
    name: "Long-horizon runtime",
    range: "1 min → 30 hrs",
    detail:
      "Claude Sonnet 4.5 ran 30+ hours autonomously, producing 11K lines of code in one session. A continuous loop at 25 calls/min × 4K tokens = ~180M tokens per 30-hour run.",
    anchor: "Devin ACU pricing: $8–9/hour",
    color: "text-emerald-500",
    bar: "bg-emerald-500",
  },
];

export function FiveMultipliers(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-800">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Demand Compounding
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Five independent multipliers stack on every inference task. Each grew
          on its own curve from 2023–2026.
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">
        {multipliers.map((m) => (
          <div key={m.id} className="flex items-start gap-4">
            <span className="font-mono text-[10px] text-gray-400 pt-1 w-5 flex-shrink-0">
              {m.id}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span
                  className={`${m.color} font-mono text-xs font-medium`}
                >
                  {m.name}
                </span>
                <span className="font-mono text-[11px] text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {m.range}
                </span>
              </div>
              <div className="relative h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className={`${m.bar} absolute inset-y-0 left-0 rounded-full`}
                  style={{
                    width: `${Math.min(
                      100,
                      25 + multipliers.findIndex((x) => x.id === m.id) * 18,
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                {m.detail}
              </p>
              <p className="font-mono text-[10px] text-gray-500 mt-1">
                → {m.anchor}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/70">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
            Stacked
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            <span className="text-amber-600 dark:text-amber-500 font-medium">
              ~1,000× per-task demand growth
            </span>{" "}
            in 24 months. Jensen at GTC 2026: 10,000× workload × 100× usage ={" "}
            <span className="font-medium">1,000,000× total demand</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
