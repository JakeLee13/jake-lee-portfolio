const modes = [
  {
    mode: "Consumer product",
    example: "Claude.ai, ChatGPT",
    inference: "Anthropic / OpenAI cloud",
    tools: "None (chat only)",
    whoSees: "End user directly",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    mode: "Agentic developer tool",
    example: "Claude Code, Codex",
    inference: "Same cloud + local tool loop",
    tools: "File ops, bash, git, browser",
    whoSees: "Developer",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    mode: "Enterprise backend API",
    example: "Stripe on Bedrock, Ramp product features",
    inference: "AWS VPC (never hits public internet)",
    tools: "Lambda, SageMaker, custom",
    whoSees: "End customer indirectly",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10 border-teal-500/20",
  },
  {
    mode: "Internal productivity agent",
    example: "Ramp Inspect — 30% of merged PRs",
    inference: "Modal sandbox + LLM backend",
    tools: "Full dev env: DB, CI/CD, feature flags",
    whoSees: "Engineers internally",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
];

export function ConsumptionModes(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Four Ways to Consume Inference
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Same scarce GPU hours — radically different infrastructure paths
        </p>
      </div>

      <div className="px-6 pb-4 space-y-2">
        {modes.map((m) => (
          <div
            key={m.mode}
            className={`${m.bgColor} border rounded-lg px-4 py-3`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className={`${m.color} font-mono text-xs font-medium`}>
                  {m.mode}
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  {m.example}
                </p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-[10px] text-gray-500 font-mono">
                  {m.whoSees}
                </p>
              </div>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5">
              <p className="text-[10px] text-gray-500">
                <span className="text-gray-400">Inference:</span>{" "}
                {m.inference}
              </p>
              <p className="text-[10px] text-gray-500">
                <span className="text-gray-400">Tools:</span> {m.tools}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-3">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
          Every mode creates demand for the same scarce resources — GPU hours,
          HBM bandwidth, optical networking, fab capacity, EUV tools. The
          difference is how many layers of infrastructure sit between the user
          and the GPU.
        </p>
      </div>
    </div>
  );
}
