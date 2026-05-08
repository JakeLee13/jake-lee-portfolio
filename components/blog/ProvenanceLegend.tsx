const tiers = [
  {
    label: "Primary",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    meaning:
      "Company filing, earnings call, model card, peer-reviewed paper, spec sheet. Independently checkable.",
  },
  {
    label: "Analyst",
    color: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    meaning:
      "Numbers SemiAnalysis / TrendForce / similar publish from their own tracking. Methodology theirs; I'm trusting their aggregation.",
  },
  {
    label: "Speaker claim",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    meaning:
      "Stated by a named individual on a podcast / interview with no independent source. Informed estimate or opinion — not fact.",
  },
  {
    label: "Derived",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    meaning:
      "My own calculation or synthesis built on claims from the other tiers. Check the inputs.",
  },
];

export function ProvenanceLegend(): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-5 pt-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          How to read the sources in this post
        </p>
        <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
          Every load-bearing claim is tagged with a provenance tier. If it says{" "}
          <span className="font-mono text-emerald-700 dark:text-emerald-400">
            Primary
          </span>{" "}
          you can click through and verify it. If it says{" "}
          <span className="font-mono text-amber-700 dark:text-amber-400">
            Speaker claim
          </span>{" "}
          you should treat it as an informed estimate by a named analyst, not as
          independently verified data.
        </p>
      </div>
      <div className="px-5 py-3 space-y-2">
        {tiers.map((t) => (
          <div
            key={t.label}
            className="flex items-start gap-3 text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            <span
              className={`font-mono text-[10px] rounded border px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap ${t.bg} ${t.border} ${t.color}`}
            >
              {t.label}
            </span>
            <span>{t.meaning}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
