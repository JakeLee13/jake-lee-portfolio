interface Holding {
  ticker: string;
  value: string;
  type: string;
  layer: string;
  layerClass: string;
}

const holdings: Holding[] = [
  {
    ticker: "CRWV",
    value: "$1.21B",
    type: "Calls + equity",
    layer: "Infra",
    layerClass: "bg-amber-500/15 text-amber-400",
  },
  {
    ticker: "BE",
    value: "$911M",
    type: "Equity + calls",
    layer: "Power",
    layerClass: "bg-orange-500/15 text-orange-400",
  },
  {
    ticker: "INTC",
    value: "$747M",
    type: "Calls only",
    layer: "Foundry",
    layerClass: "bg-purple-500/15 text-purple-400",
  },
  {
    ticker: "LITE",
    value: "$479M",
    type: "Equity",
    layer: "Networking",
    layerClass: "bg-amber-500/15 text-amber-400",
  },
  {
    ticker: "CORZ",
    value: "$419M",
    type: "Equity (9.4% stake)",
    layer: "BTC→AI",
    layerClass: "bg-orange-500/15 text-orange-400",
  },
  {
    ticker: "IREN",
    value: "$329M",
    type: "Equity",
    layer: "BTC→AI",
    layerClass: "bg-orange-500/15 text-orange-400",
  },
  {
    ticker: "APLD",
    value: "$278M",
    type: "Equity",
    layer: "Neocloud",
    layerClass: "bg-amber-500/15 text-amber-400",
  },
  {
    ticker: "SNDK",
    value: "$250M",
    type: "Equity (+816%)",
    layer: "Memory",
    layerClass: "bg-teal-500/15 text-teal-400",
  },
  {
    ticker: "EQT",
    value: "$171M",
    type: "Equity + calls",
    layer: "Power",
    layerClass: "bg-orange-500/15 text-orange-400",
  },
  {
    ticker: "CIFR",
    value: "$155M",
    type: "Equity",
    layer: "BTC→AI",
    layerClass: "bg-orange-500/15 text-orange-400",
  },
  {
    ticker: "COHR",
    value: "$89M",
    type: "Equity",
    layer: "Networking",
    layerClass: "bg-amber-500/15 text-amber-400",
  },
  {
    ticker: "+ 18 others",
    value: "~$500M",
    type: "Mixed",
    layer: "Various",
    layerClass: "bg-gray-500/15 text-gray-400",
  },
];

export function SAPortfolioTable(): React.ReactElement {
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {["Position", "$ Value", "Type", "Layer"].map((h) => (
              <th
                key={h}
                className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 px-3 py-2.5 border-b border-gray-200 dark:border-gray-800"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
            >
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50 font-mono text-xs text-amber-600 dark:text-amber-500 font-medium">
                {h.ticker}
              </td>
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50 text-xs">
                {h.value}
              </td>
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50 text-xs text-gray-600 dark:text-gray-400">
                {h.type}
              </td>
              <td className="px-3 py-3 border-b border-gray-100 dark:border-gray-800/50">
                <span
                  className={`${h.layerClass} font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded`}
                >
                  {h.layer}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
