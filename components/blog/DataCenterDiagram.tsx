const layers = [
  {
    level: "GPU ↔ GPU",
    tech: "NVLink 5.0",
    bandwidth: "1.8 TB/s",
    medium: "On-board traces / NVSwitch",
    distance: "< 1m",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  {
    level: "Node ↔ Node",
    tech: "InfiniBand NDR/XDR",
    bandwidth: "400-800 Gbps/port",
    medium: "Copper DAC / Active optical cable",
    distance: "1-5m",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    level: "Rack ↔ Rack",
    tech: "InfiniBand fabric",
    bandwidth: "51.2 Tbps (spine)",
    medium: "Active optical cables",
    distance: "5-100m",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  {
    level: "Cluster ↔ Cluster",
    tech: "Coherent optics (400G/800G)",
    bandwidth: "400-800 Gbps/fiber",
    medium: "Single-mode fiber + pluggable transceivers",
    distance: "100m-80km",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10 border-teal-500/20",
  },
  {
    level: "DC ↔ DC",
    tech: "DWDM long-haul",
    bandwidth: "Tbps aggregate (WDM)",
    medium: "Fiber + amplifiers + coherent DSP",
    distance: "80-10,000+ km",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/20",
  },
];

const powerStack = [
  { label: "Utility grid", detail: "High-voltage feed → substation", icon: "⚡" },
  { label: "Substation", detail: "Step-down transformer → medium voltage", icon: "↓" },
  { label: "UPS + backup", detail: "Batteries + diesel/gas generators", icon: "🔋" },
  { label: "PDU", detail: "Power distribution unit → rack-level", icon: "↓" },
  { label: "GPU rack", detail: "40-100+ kW per rack (vs. 5-10 kW traditional)", icon: "🖥" },
];

const coolingMethods = [
  {
    method: "Air cooling",
    status: "Legacy",
    detail: "Hot/cold aisle, CRACs. Insufficient above ~30 kW/rack.",
  },
  {
    method: "Direct liquid cooling",
    status: "Current",
    detail: "Cold plates on GPUs/CPUs, liquid loops. Handles 40-100+ kW/rack. Required for H100/B200.",
  },
  {
    method: "Immersion cooling",
    status: "Emerging",
    detail: "Servers submerged in dielectric fluid. Best thermal performance but complex maintenance.",
  },
];

export function DataCenterDiagram(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          AI Data Center Architecture
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The networking hierarchy — bandwidth drops, distance grows at each layer
        </p>
      </div>

      {/* Networking layers */}
      <div className="px-6 pb-4 space-y-2">
        {layers.map((l) => (
          <div
            key={l.level}
            className={`${l.bgColor} border rounded-lg px-4 py-2.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`${l.color} font-mono text-xs font-medium`}>
                    {l.level}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {l.tech}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {l.medium}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-xs text-amber-600 dark:text-amber-500 font-medium">
                  {l.bandwidth}
                </p>
                <p className="font-mono text-[9px] text-gray-500">{l.distance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Power + Cooling */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Power stack */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2">
              Power delivery
            </p>
            <div className="space-y-1.5">
              {powerStack.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-2 text-[10px]"
                >
                  <span className="w-4 text-center">{p.icon}</span>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {p.label}
                  </span>
                  <span className="text-gray-500">— {p.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cooling methods */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2">
              Cooling evolution
            </p>
            <div className="space-y-1.5">
              {coolingMethods.map((c) => (
                <div key={c.method} className="text-[10px]">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {c.method}
                  </span>{" "}
                  <span className="text-gray-500 font-mono">({c.status})</span>
                  <p className="text-gray-500 dark:text-gray-400 ml-0">
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
