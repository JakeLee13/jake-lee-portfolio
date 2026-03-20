const generations = [
  {
    name: "HBM1",
    year: "2015",
    dies: 4,
    capacity: "1 GB",
    bandwidth: "128 GB/s",
    interface: "1024-bit",
    color: "bg-teal-800",
  },
  {
    name: "HBM2",
    year: "2016",
    dies: 8,
    capacity: "8 GB",
    bandwidth: "256 GB/s",
    interface: "1024-bit",
    color: "bg-teal-700",
  },
  {
    name: "HBM2E",
    year: "2020",
    dies: 8,
    capacity: "16 GB",
    bandwidth: "460 GB/s",
    interface: "1024-bit",
    color: "bg-teal-600",
  },
  {
    name: "HBM3",
    year: "2022",
    dies: 12,
    capacity: "24 GB",
    bandwidth: "819 GB/s",
    interface: "1024-bit",
    color: "bg-teal-500",
  },
  {
    name: "HBM3E",
    year: "2024",
    dies: 12,
    capacity: "36 GB",
    bandwidth: "1.2 TB/s",
    interface: "1024-bit",
    color: "bg-teal-400",
  },
  {
    name: "HBM4",
    year: "2026",
    dies: 16,
    capacity: "48 GB",
    bandwidth: "1.6+ TB/s",
    interface: "2048-bit",
    color: "bg-teal-300",
  },
];

const concepts = [
  {
    term: "TSV",
    full: "Through-Silicon Via",
    desc: "Copper-filled holes etched through each silicon die, creating vertical electrical pathways between stacked layers. Enables thousands of simultaneous connections.",
  },
  {
    term: "Micro-bump",
    full: "Solder interconnect",
    desc: "Tiny solder balls (~40μm) connecting adjacent dies in the stack. Each stack has tens of thousands of micro-bumps.",
  },
  {
    term: "Base die",
    full: "Logic / buffer die",
    desc: "Bottom die in the stack that interfaces with the processor. Contains I/O circuits, test logic, and the PHY layer that talks to the GPU over the interposer.",
  },
  {
    term: "CoWoS",
    full: "Chip-on-Wafer-on-Substrate",
    desc: "TSMC's advanced packaging: GPU + HBM stacks sit on a shared silicon interposer, then on an organic substrate. The interposer is now a bottleneck itself.",
  },
];

export function HBMStackDiagram(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          HBM Generation Comparison
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Each generation stacks more dies, wider interfaces, exponentially more bandwidth
        </p>
      </div>

      {/* Generation comparison */}
      <div className="px-6 pb-4 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              {["Gen", "Year", "Stack", "Capacity", "Bandwidth", "Interface"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left font-mono text-[10px] uppercase tracking-wider text-gray-500 px-2 py-2 border-b border-gray-200 dark:border-gray-800"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {generations.map((g) => (
              <tr
                key={g.name}
                className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
              >
                <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800/50">
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-500 font-medium">
                    {g.name}
                  </span>
                </td>
                <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800/50 font-mono text-gray-500">
                  {g.year}
                </td>
                <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-end gap-px h-6">
                    {Array.from({ length: g.dies }).map((_, i) => (
                      <div
                        key={i}
                        className={`${g.color} rounded-[1px] opacity-80`}
                        style={{
                          width: `${Math.max(3, 48 / g.dies)}px`,
                          height: `${Math.min(24, 4 + i * (20 / g.dies))}px`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">
                    {g.dies}-hi
                  </span>
                </td>
                <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800/50 font-mono text-gray-600 dark:text-gray-300">
                  {g.capacity}
                </td>
                <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800/50 font-mono text-teal-600 dark:text-teal-400 font-medium">
                  {g.bandwidth}
                </td>
                <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-800/50 font-mono text-gray-500">
                  {g.interface}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key concepts */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-3">
          How stacking works
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {concepts.map((c) => (
            <div
              key={c.term}
              className="bg-teal-500/5 border border-teal-500/10 rounded-lg px-3 py-2.5"
            >
              <p className="font-mono text-[10px] text-teal-500 font-medium">
                {c.term}{" "}
                <span className="text-gray-500 font-normal">— {c.full}</span>
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
