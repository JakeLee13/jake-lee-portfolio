const rotations = [
  {
    year: "2023–24",
    constraint: "CoWoS packaging",
    lead: "Months",
    winners: "TSMC (captured)",
    status: "played",
  },
  {
    year: "2024–25",
    constraint: "Power + data centers",
    lead: "1–2 years",
    winners: "VRT · CRWV · WULF / CIFR",
    status: "played",
  },
  {
    year: "2026–27",
    constraint: "HBM + N3 logic wafers",
    lead: "2–3 years",
    winners: "SK Hynix · MU · TSMC · NVDA",
    status: "live",
  },
  {
    year: "2027–28",
    constraint: "HBM4 + N2 wafers + packaging",
    lead: "2–3 years",
    winners: "SK Hynix · TSMC · NVDA · AVGO",
    status: "live",
  },
  {
    year: "2028–30",
    constraint: "ASML EUV tool throughput",
    lead: "3–5 years",
    winners: "ASML · Zeiss · Cymer",
    status: "entry",
  },
];

const statusColor: Record<string, { dot: string; label: string; tone: string }> = {
  played: { dot: "bg-gray-400", label: "Played", tone: "text-gray-500" },
  live: { dot: "bg-amber-500", label: "Live", tone: "text-amber-600 dark:text-amber-500" },
  entry: { dot: "bg-red-500", label: "Entry window", tone: "text-red-500" },
};

export function RotationTable(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-800">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Bottleneck Rotation
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The constraint moves up the stack each year, and each subsequent layer has a longer lead time. Capital rotates with it.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Window
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Binding constraint
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Lead time
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Who owns it
              </th>
              <th className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-4 py-2 whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rotations.map((r) => {
              const s = statusColor[r.status];
              return (
                <tr
                  key={r.year}
                  className="border-b border-gray-200/50 dark:border-gray-800/50 last:border-b-0"
                >
                  <td className="px-4 py-2.5 font-mono text-[11px] text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {r.year}
                  </td>
                  <td className="px-4 py-2.5 text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
                    {r.constraint}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {r.lead}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[10px] text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {r.winners}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`${s.dot} w-1.5 h-1.5 rounded-full flex-shrink-0`}
                      />
                      <span className={`${s.tone} font-mono text-[10px] uppercase tracking-wider`}>
                        {s.label}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
