const architectures = [
  {
    name: "Tesla",
    year: "2006",
    aiFeature: "First CUDA architecture — GPGPU becomes possible",
    cudaCores: "128",
    memory: "GDDR3",
    color: "bg-gray-600",
  },
  {
    name: "Fermi",
    year: "2010",
    aiFeature: "ECC memory, true IEEE 754 double-precision — HPC credibility",
    cudaCores: "512",
    memory: "GDDR5",
    color: "bg-gray-500",
  },
  {
    name: "Kepler",
    year: "2012",
    aiFeature: "Dynamic parallelism, GPU Direct. AlexNet trained on GTX 580 (prior gen) ignites deep learning",
    cudaCores: "2,880",
    memory: "GDDR5",
    color: "bg-blue-800",
  },
  {
    name: "Pascal",
    year: "2016",
    aiFeature: "NVLink debut, HBM2 support (GP100). First GPU explicitly targeting deep learning training",
    cudaCores: "3,840",
    memory: "HBM2 / GDDR5X",
    color: "bg-blue-700",
  },
  {
    name: "Volta",
    year: "2017",
    aiFeature: "Tensor cores — 5.12× faster mixed-precision. V100 becomes the AI standard. The inflection point.",
    cudaCores: "5,120",
    memory: "HBM2",
    color: "bg-purple-600",
    highlight: true,
  },
  {
    name: "Ampere",
    year: "2020",
    aiFeature: "3rd-gen tensor cores, sparsity support (2×), MIG partitioning, BF16. A100 dominates training.",
    cudaCores: "6,912",
    memory: "HBM2E",
    color: "bg-purple-500",
  },
  {
    name: "Hopper",
    year: "2022",
    aiFeature: "Transformer Engine (FP8 automatic), NVLink 4.0 (900 GB/s). H100 becomes the AI currency.",
    cudaCores: "16,896",
    memory: "HBM3",
    color: "bg-amber-600",
    highlight: true,
  },
  {
    name: "Blackwell",
    year: "2024",
    aiFeature: "Two-die design, 2nd-gen Transformer Engine, NVLink 5.0 (1.8 TB/s), HBM3E. B200 doubles Hopper throughput.",
    cudaCores: "~21,000",
    memory: "HBM3E",
    color: "bg-amber-500",
  },
  {
    name: "Rubin",
    year: "2026",
    aiFeature: "HBM4, next-gen NVLink, new architecture. Jensen's roadmap: annual cadence from here.",
    cudaCores: "TBD",
    memory: "HBM4",
    color: "bg-red-500",
  },
];

export function GPUEvolution(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Nvidia GPU Architecture Timeline
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          From triangles to tensors — 20 years of GPU evolution for AI
        </p>
      </div>

      <div className="px-6 pb-4 overflow-x-auto">
        <div className="space-y-2">
          {architectures.map((a) => (
            <div
              key={a.name}
              className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${
                a.highlight
                  ? "bg-amber-500/8 border border-amber-500/15"
                  : "hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
              }`}
            >
              {/* Year + color bar */}
              <div className="flex-shrink-0 flex items-center gap-2 w-16">
                <div className={`${a.color} w-2 h-2 rounded-full`} />
                <span className="font-mono text-[11px] text-gray-500">
                  {a.year}
                </span>
              </div>

              {/* Name + specs */}
              <div className="flex-shrink-0 w-20">
                <p className="font-mono text-xs text-amber-600 dark:text-amber-500 font-medium">
                  {a.name}
                </p>
                <p className="font-mono text-[9px] text-gray-500">
                  {a.cudaCores} cores
                </p>
                <p className="font-mono text-[9px] text-gray-500">
                  {a.memory}
                </p>
              </div>

              {/* AI feature */}
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                {a.aiFeature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
