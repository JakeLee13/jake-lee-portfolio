const layers = [
  {
    name: "EUV tools",
    tickers: "ASML",
    gm: "~50%",
    power: "Self-restrained",
    scale: "Hard-capped",
    stance: "Terminal bottleneck 2028–30",
    dot: "bg-red-500",
    tier: "core",
  },
  {
    name: "Leading-edge foundry",
    tickers: "TSMC",
    gm: "50%+",
    power: "Rising",
    scale: "Wafer-constrained",
    stance: "Core long, 2026–28",
    dot: "bg-red-500",
    tier: "core",
  },
  {
    name: "HBM memory",
    tickers: "SK Hynix · MU · Samsung",
    gm: "50%+ rising",
    power: '"Double or triple again"',
    scale: "4× wafer-area drag",
    stance: "Core long",
    dot: "bg-red-500",
    tier: "core",
  },
  {
    name: "Advanced packaging",
    tickers: "TSMC CoWoS · Amkor · SPIL",
    gm: "40%+",
    power: "NVDA reserves >50% 26–27",
    scale: "Capacity-bound",
    stance: "Embedded in NVDA / TSMC",
    dot: "bg-orange-500",
    tier: "core",
  },
  {
    name: "GPU / accelerator silicon",
    tickers: "NVIDIA",
    gm: "~75%",
    power: "$90B LT contracts",
    scale: "CoWoS-capped",
    stance: "Core long",
    dot: "bg-orange-500",
    tier: "core",
  },
  {
    name: "Custom silicon",
    tickers: "Broadcom TPU · MTIA",
    gm: "60%+",
    power: "Rising",
    scale: "TSMC-capped",
    stance: "Core long",
    dot: "bg-orange-500",
    tier: "core",
  },
  {
    name: "Optical transceivers",
    tickers: "COHR · LITE · FN",
    gm: "30–35%",
    power: "Consumable (replug cycle)",
    scale: "Superlinear with clusters",
    stance: "Satellite long",
    dot: "bg-amber-500",
    tier: "satellite",
  },
  {
    name: "Power / cooling",
    tickers: "VRT · ETN",
    gm: "30–35%",
    power: "Liquid cooling mandatory",
    scale: "Solved-ish",
    stance: "Trim — best gains behind",
    dot: "bg-amber-500",
    tier: "satellite",
  },
  {
    name: "Neoclouds (Platinum tier)",
    tickers: "CoreWeave",
    gm: "45–55%",
    power: "Up 40% in 6 mo",
    scale: "Utilization-dependent",
    stance: "Selective",
    dot: "bg-amber-500",
    tier: "satellite",
  },
  {
    name: "Frontier labs",
    tickers: "OpenAI · Anthropic · GDM",
    gm: "40–46% blended",
    power: "Rising on Opus tier",
    scale: "Spending 2–3× revenue on capex",
    stance: "Private — access via partners",
    dot: "bg-gray-400",
    tier: "neutral",
  },
  {
    name: "Token resellers",
    tickers: "Together · Fireworks · Bedrock",
    gm: "10–20%",
    power: "Commoditizing",
    scale: "Easy entry",
    stance: "Avoid",
    dot: "bg-gray-400",
    tier: "avoid",
  },
];

export function MarginStack(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-800">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Margin Stack
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Where the dollar goes at each layer. Tightest red at the top.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Layer
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Names
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                GM
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Pricing power
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Scale
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Stance
              </th>
            </tr>
          </thead>
          <tbody>
            {layers.map((l) => (
              <tr
                key={l.name}
                className="border-b border-gray-200/50 dark:border-gray-800/50 last:border-b-0"
              >
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`${l.dot} w-1.5 h-1.5 rounded-full flex-shrink-0`}
                    />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {l.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-mono text-[10px] text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {l.tickers}
                </td>
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {l.gm}
                </td>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {l.power}
                </td>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {l.scale}
                </td>
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {l.stance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
