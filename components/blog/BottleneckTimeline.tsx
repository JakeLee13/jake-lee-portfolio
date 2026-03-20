const segments = [
  { label: "Power", flex: 2, color: "bg-orange-600" },
  { label: "Logic + Memory", flex: 3, color: "bg-purple-600" },
  { label: "HBM crunch", flex: 2, color: "bg-teal-600" },
  { label: "ASML / EUV", flex: 3, color: "bg-red-600" },
];

const years = ["2024", "2026", "2028", "2030"];

export function BottleneckTimeline(): React.ReactElement {
  return (
    <div className="not-prose my-8">
      <div className="flex rounded-md overflow-hidden h-10">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} flex items-center justify-center text-[10px] font-mono uppercase tracking-wider text-white font-medium`}
            style={{ flex: seg.flex }}
          >
            {seg.label}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 font-mono text-[10px] tracking-wider text-gray-500 dark:text-gray-500">
        {years.map((y) => (
          <span key={y}>{y}</span>
        ))}
      </div>
    </div>
  );
}
