const cards = [
  {
    label: "Hyperscaler capex 2026",
    value: "$600B+",
    note: "Big-4 combined. ~$1T full supply chain. 30% of this now flows to memory — roughly $180B — with Nvidia margin stacked inside.",
  },
  {
    label: "H100 rental 6-mo move",
    value: "+40%",
    note: "$1.70/hr (Oct 2025) → $2.35/hr (Mar 2026). Labs signing 2–3 yr deals at $2.40. GPUs are appreciating, not depreciating — direct refutation of the Burry short.",
  },
  {
    label: "Demand compounding in 2 yrs",
    value: "1,000,000×",
    note: "Jensen, GTC 2026: per-workload demand up 10,000×; usage up 100×; total up 1M×. Efficiency at 10×/year loses the race.",
  },
  {
    label: "ASML 2030 hard ceiling",
    value: "~200 GW",
    note: "~100 tools/year max, ~700 cumulative fleet, 3.5 tools per GW of Rubin. Altman's 52 GW/yr target = 25% of all global EUV capacity.",
  },
];

export function ComputeInsightCards(): React.ReactElement {
  return (
    <div className="not-prose my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-1">
            {card.label}
          </p>
          <p className="text-3xl font-serif text-amber-600 dark:text-amber-500 leading-tight">
            {card.value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-snug">
            {card.note}
          </p>
        </div>
      ))}
    </div>
  );
}
