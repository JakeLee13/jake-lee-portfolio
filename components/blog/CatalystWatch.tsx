const bulls = [
  "Anthropic hits 5+ GW capacity by EOY 2026",
  "TSMC CoWoS capacity reaches 90K+ wpm in 2026",
  "ASML order book extends through 2028+ with High-NA bookings",
  "SK Hynix / Micron HBM pricing doubles in 2026 contract cycle",
  "H100 1-yr rental continues rising past $2.35/hr",
  "Claude Code share of GitHub commits crosses 15% in 2026",
  "METR task-horizon doubling stays under 6 months",
  "Anthropic monthly ARR additions stay above $4B",
];

const bears = [
  "H100 rental prices fall for two consecutive quarters",
  "Anthropic monthly ARR growth decelerates <10% MoM for 3 months",
  "METR task-horizon doubling stalls past 12 months",
  "TurboQuant-scale algo efficiency breakthrough ships in production",
  "Huawei 920 / 930 gains material traction outside China",
  "Hyperscaler 2027 capex guidance below $600B",
  "TPU v8 benchmarks show >40% TCO advantage over Rubin at matched latency",
  "Any Mag 7 CEO shifts public language toward 'overspending'",
];

export function CatalystWatch(): React.ReactElement {
  return (
    <div className="not-prose my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
        <div className="px-5 pt-4 pb-2 border-b border-emerald-500/20">
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
            Bull confirmations
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Size up when these trigger
          </p>
        </div>
        <ul className="px-5 py-3 space-y-2">
          {bulls.map((b, i) => (
            <li
              key={b}
              className="flex gap-2 text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              <span className="font-mono text-[10px] text-emerald-600/70 dark:text-emerald-500/70 flex-shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-red-500/30 bg-red-500/5 overflow-hidden">
        <div className="px-5 pt-4 pb-2 border-b border-red-500/20">
          <p className="font-mono text-[10px] uppercase tracking-widest text-red-500">
            Bear signals
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Size down when these trigger
          </p>
        </div>
        <ul className="px-5 py-3 space-y-2">
          {bears.map((b, i) => (
            <li
              key={b}
              className="flex gap-2 text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              <span className="font-mono text-[10px] text-red-500/70 flex-shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
