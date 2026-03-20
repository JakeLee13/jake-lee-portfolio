const cards = [
  {
    label: "Hyperscaler capex 2026",
    value: "$600B+",
    note: "Big four combined. ~$1T across full supply chain. Much of this is setup for 2027–29.",
  },
  {
    label: "TSMC capacity shortfall",
    value: "3x short",
    note: 'Chairman C.C. Wei admitted advanced-node capacity is "about three times short" of customer demand.',
  },
  {
    label: "H100 spot price",
    value: "$2.40/hr",
    note: "Labs signing 2-3 year deals above this. Higher than at launch. GPUs are appreciating, not depreciating.",
  },
  {
    label: "Hard ceiling by 2030",
    value: "~200 GW",
    note: "Set by EUV tool production at ASML. ~700 cumulative tools, 3.5 per GW. Not enough for AGI ambitions.",
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
