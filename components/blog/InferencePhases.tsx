const phases = [
  {
    name: "Prefill",
    bound: "Compute-bound",
    boundColor: "text-blue-500",
    intensity: "200–400 FLOPs / byte",
    util: "~92%",
    utilLabel: "Tensor core utilization",
    floor: "Scales with prompt length²",
    floorLabel: "Wall-clock floor",
    note: "All input tokens processed in parallel. Tensor cores light up. This phase looks a lot like training.",
    bar: "bg-blue-500",
    barWidth: "92%",
  },
  {
    name: "Decode",
    bound: "Memory-bandwidth-bound",
    boundColor: "text-rose-500",
    intensity: "1–2 FLOPs / byte",
    util: "~28%",
    utilLabel: "Tensor core utilization",
    floor: "model_weight_bytes / HBM_bandwidth",
    floorLabel: "Wall-clock floor",
    note: "One output token at a time. Full weight + KV read per step. ~42 ms/token for Llama-3 70B at FP16 on H100.",
    bar: "bg-rose-500",
    barWidth: "28%",
  },
];

export function InferencePhases(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-800">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          The single asymmetry
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Prefill and decode run on the same GPU but hit different walls. Every serving technique of the last five years is a response.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
        {phases.map((p) => (
          <div key={p.name} className="px-6 py-5">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                {p.name}
              </span>
              <span
                className={`${p.boundColor} font-mono text-[10px] uppercase tracking-wider`}
              >
                {p.bound}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                  Arithmetic intensity
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {p.intensity}
                </p>
              </div>

              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                  {p.utilLabel}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`${p.bar} h-full rounded-full`}
                      style={{ width: p.barWidth }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-gray-700 dark:text-gray-300 w-10 text-right">
                    {p.util}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                  {p.floorLabel}
                </p>
                <p className="font-mono text-[10px] text-gray-600 dark:text-gray-400">
                  {p.floor}
                </p>
              </div>

              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed pt-1 border-t border-gray-200 dark:border-gray-800">
                {p.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/70">
        <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mr-2">
            Consequence
          </span>
          The two phases want different hardware. Colocating them wastes either
          FLOPs (during decode) or bandwidth (during prefill). Disaggregated
          serving, FP4 inference, PagedAttention, continuous batching — all
          solutions to this one asymmetry.
        </p>
      </div>
    </div>
  );
}
