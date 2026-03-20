const steps = [
  {
    label: "Keystroke → API call",
    detail:
      "Claude Code packages conversation context + tool schemas into an HTTPS request to api.anthropic.com",
    stat: "~50K tokens of context",
    zone: "local",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  {
    label: "Tokenization (BPE)",
    detail:
      'Text split into subword tokens via Byte Pair Encoding. "add dark mode" → ["add", " dark", " mode"]. ~4 characters per token.',
    stat: "~150 tokens per 100 words",
    zone: "api",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    label: "Embedding + positional encoding",
    detail:
      "Each token mapped to a high-dimensional vector (~8,192 dims). Position information encoded so the model knows word order.",
    stat: "8,192-dim vectors",
    zone: "gpu",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    label: "Attention + KV cache (prefill)",
    detail:
      "All input tokens processed in parallel. Key and Value matrices computed and cached in HBM — so they don't need recomputing for each output token.",
    stat: "KV cache: 10–50 GB for 200K context",
    zone: "gpu",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    label: "MoE routing",
    detail:
      "A learned router network selects which expert subnetworks activate for each token. Only ~25% of total parameters fire per forward pass.",
    stat: "~300B params, ~75B active",
    zone: "gpu",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    label: "Autoregressive decoding",
    detail:
      "One token generated at a time. Each step: attend to all previous tokens (via KV cache), run through active experts, produce logits, sample next token. Repeat.",
    stat: "~50–200ms per token",
    zone: "gpu",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    label: "Tool use (agentic loop)",
    detail:
      'Model outputs structured tool call: Read("app/globals.css"). Generation pauses. Claude Code executes locally. Result appended to context. Inference resumes.',
    stat: "10–50+ tool calls per task",
    zone: "local",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  {
    label: "Streaming response (SSE)",
    detail:
      "Each token streamed back via Server-Sent Events as it's generated. That's why text appears character by character.",
    stat: "Chunked HTTP response",
    zone: "api",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
];

const zones: Record<string, { label: string; dotColor: string }> = {
  local: { label: "Your machine", dotColor: "bg-amber-500" },
  api: { label: "Network / API", dotColor: "bg-blue-500" },
  gpu: { label: "GPU cluster", dotColor: "bg-purple-500" },
};

export function InferenceFlow(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Inference Request Path
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          What happens between keystroke and response — step by step
        </p>
      </div>

      {/* Legend */}
      <div className="px-6 pb-3 flex gap-4 flex-wrap">
        {Object.values(zones).map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <div className={`${z.dotColor} w-2 h-2 rounded-full`} />
            <span className="text-[10px] text-gray-500 font-mono">
              {z.label}
            </span>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="px-6 pb-4 space-y-2">
        {steps.map((s, i) => (
          <div key={s.label}>
            <div className={`${s.bgColor} border rounded-lg px-4 py-2.5`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`${s.color} font-mono text-xs font-medium`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {s.detail}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-[9px] text-gray-500 whitespace-nowrap">
                    {s.stat}
                  </p>
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <span className="text-gray-400 text-[10px]">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
