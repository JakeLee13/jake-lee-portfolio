const architectures = [
  {
    name: "Planar MOSFET",
    era: "1960s – 2011",
    description:
      "Gate sits on top of a flat channel. Current flows in a 2D plane beneath the gate. At ~22nm, leakage current made further scaling impractical — electrons tunneled through the gate oxide.",
    gateControl: "1 side",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10 border-gray-500/20",
    milestone: "Every chip made before 2012",
  },
  {
    name: "FinFET",
    era: "2012 – 2024",
    description:
      "Channel rises as a vertical \"fin\" — gate wraps around three sides. Invented by Chenming Hu (UC Berkeley, 1999). Intel shipped the first production FinFET at 22nm (Ivy Bridge, 2012). Dominated for over a decade.",
    gateControl: "3 sides",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    milestone: "Intel 22nm → TSMC 5nm/3nm",
  },
  {
    name: "GAA / Nanosheet",
    era: "2024+",
    description:
      "Gate wraps completely around horizontal nanosheets (thin channels stacked vertically). Better electrostatic control means less leakage at smaller dimensions. Samsung shipped first production GAA (3nm, 2022). TSMC follows at N2 (2025).",
    gateControl: "4 sides",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
    milestone: "Samsung 3nm GAA → TSMC N2",
  },
  {
    name: "CFET (next)",
    era: "~2028+",
    description:
      "Complementary FET: stacks NMOS on top of PMOS vertically — two transistors in the footprint of one. Still in R&D. Could enable continued scaling beyond GAA limits.",
    gateControl: "4 sides × 2 stacked",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10 border-teal-500/20",
    milestone: "Research / early development",
  },
];

export function TransistorEvolution(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Transistor Architecture Evolution
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          How the gate gained control — from one side to all sides
        </p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
        {architectures.map((a) => (
          <div key={a.name} className="px-6 py-4">
            <div className="flex items-start gap-4">
              {/* Gate control indicator */}
              <div className="flex-shrink-0 w-16 text-center">
                <p className={`${a.color} font-mono text-xs font-medium`}>
                  {a.gateControl}
                </p>
                <p className="font-mono text-[9px] text-gray-500 mt-0.5">
                  gate wrap
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`${a.color} font-mono text-xs font-medium`}>
                    {a.name}
                  </span>
                  <span className="font-mono text-[10px] text-gray-500">
                    {a.era}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {a.description}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">
                  {a.milestone}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
