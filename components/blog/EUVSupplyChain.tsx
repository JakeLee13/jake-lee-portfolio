const suppliers = [
  {
    company: "Trumpf",
    role: "EUV laser source",
    detail: "50 kW CO2 laser fires 50,000 pulses/sec at tin droplets",
    location: "Ditzingen, Germany",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/20",
  },
  {
    company: "Carl Zeiss SMT",
    role: "EUV optics",
    detail: "Multilayer Mo/Si mirrors — flattest surfaces ever made (< 1 atom deviation)",
    location: "Oberkochen, Germany",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    company: "ASML",
    role: "System integration",
    detail: "Assembles 100,000+ parts into a tool the size of a bus, ~$380M each",
    location: "Veldhoven, Netherlands",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
];

const stats = [
  { label: "Tools/year", value: "~70" },
  { label: "Cost per tool", value: "$350-400M" },
  { label: "Weight", value: "~180 tons" },
  { label: "Parts", value: "100,000+" },
  { label: "Mirrors", value: "11 (6% total reflectivity)" },
  { label: "Wavelength", value: "13.5 nm" },
];

export function EUVSupplyChain(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          The Trilateral Monopoly
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Three companies. One machine. Zero alternatives.
        </p>
      </div>

      {/* Supply chain flow */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          {suppliers.map((s, i) => (
            <div key={s.company}>
              <div
                className={`${s.bgColor} border rounded-lg px-4 py-3`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`${s.color} font-mono text-xs font-medium`}>
                      {s.company}
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 font-medium">
                      {s.role}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {s.detail}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 whitespace-nowrap mt-0.5">
                    {s.location}
                  </span>
                </div>
              </div>
              {i < suppliers.length - 1 && (
                <div className="flex justify-center py-1">
                  <span className="text-gray-400 text-xs">↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                {s.label}
              </p>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-500 font-mono">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
