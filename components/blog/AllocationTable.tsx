interface Allocation {
  layer: string;
  layerClass: string;
  ticker: string;
  weight: string;
  rationale: string;
}

const allocations: Allocation[] = [
  {
    layer: "EUV",
    layerClass: "bg-red-500/15 text-red-400",
    ticker: "ASML",
    weight: "20%",
    rationale:
      "Ultimate chokepoint by 2028. Only company on Earth that makes EUV tools. ~70 tools/yr is a hard physics ceiling — every advanced chip on the planet flows through this bottleneck.",
  },
  {
    layer: "Foundry",
    layerClass: "bg-purple-500/15 text-purple-400",
    ticker: "TSM",
    weight: "15%",
    rationale:
      "67% market share, $52-56B capex. The pure-play foundry model Morris Chang invented in 1987 is now the most critical node in the global supply chain.",
  },
  {
    layer: "Foundry",
    layerClass: "bg-purple-500/15 text-purple-400",
    ticker: "Samsung",
    weight: "10%",
    rationale:
      "Contrarian diversification bet. $73B investment. 2nm GAA at 55-60% yields. Tesla $16.5B deal. Hyperscalers must diversify away from TSMC concentration.",
  },
  {
    layer: "Memory",
    layerClass: "bg-teal-500/15 text-teal-400",
    ticker: "MU / SNDK",
    weight: "10%",
    rationale:
      "HBM consumes 4x the wafer area per GB versus standard DRAM. The memory crunch is accelerating — prices doubling, multi-year contracts locked. SA's 816% SNDK increase is the signal.",
  },
  {
    layer: "Chip design",
    layerClass: "bg-blue-500/15 text-blue-400",
    ticker: "NVDA",
    weight: "14%",
    rationale:
      "20 years of CUDA ecosystem lock-in. From gaming GPUs to tensor cores — Nvidia's architecture evolution (Volta→Hopper→Blackwell→Rubin) defines the AI compute frontier.",
  },
  {
    layer: "Chip design",
    layerClass: "bg-blue-500/15 text-blue-400",
    ticker: "AVGO",
    weight: "7%",
    rationale:
      "Every hyperscaler designing custom silicon (TPUs, Trainium, etc.) routes through Broadcom. Indirect play on the custom ASIC wave.",
  },
  {
    layer: "Infra",
    layerClass: "bg-amber-500/15 text-amber-400",
    ticker: "CRWV / ORCL",
    weight: "9%",
    rationale:
      "GPU cloud. CoreWeave 98% on 3+yr contracts — assets appreciate as inference demand grows. Oracle has massive OpenAI backend exposure.",
  },
  {
    layer: "Networking",
    layerClass: "bg-amber-500/15 text-amber-400",
    ticker: "COHR / LITE",
    weight: "7%",
    rationale:
      "Optical interconnect scales non-linearly with cluster size. Copper fails above rack-scale — coherent optics is the only path to GW-class data centers.",
  },
  {
    layer: "Optionality",
    layerClass: "bg-green-500/15 text-green-400",
    ticker: "INTC calls",
    weight: "3%",
    rationale:
      "Cheap optionality on 18A turnaround. If yields work, Intel becomes the third viable advanced foundry. Binary outcome — options structure defines the loss.",
  },
];

export function AllocationTable(): React.ReactElement {
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 px-3 py-2.5 border-b border-gray-200 dark:border-gray-800">
              Layer
            </th>
            <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 px-3 py-2.5 border-b border-gray-200 dark:border-gray-800">
              Name
            </th>
            <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 px-3 py-2.5 border-b border-gray-200 dark:border-gray-800">
              Weight
            </th>
            <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 px-3 py-2.5 border-b border-gray-200 dark:border-gray-800">
              Rationale
            </th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((a, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
            >
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50 align-top">
                <span
                  className={`${a.layerClass} font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded`}
                >
                  {a.layer}
                </span>
              </td>
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50 align-top font-mono text-xs text-amber-600 dark:text-amber-500 font-medium">
                {a.ticker}
              </td>
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50 align-top font-mono text-xs">
                {a.weight}
              </td>
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50 align-top text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {a.rationale}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
