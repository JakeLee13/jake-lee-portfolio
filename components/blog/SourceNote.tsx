interface SourceNoteProps {
  tier: "primary" | "analyst" | "speaker" | "derived";
  children: React.ReactNode;
}

const tierConfig = {
  primary: {
    label: "Primary",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  analyst: {
    label: "Analyst",
    color: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
  },
  speaker: {
    label: "Speaker claim",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  derived: {
    label: "Derived",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
};

export function SourceNote({
  tier,
  children,
}: SourceNoteProps): React.ReactElement {
  const cfg = tierConfig[tier];
  return (
    <span
      className={`not-prose inline-flex items-baseline gap-1.5 align-baseline rounded px-1.5 py-0.5 mx-0.5 text-[10px] font-mono border ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span className="font-medium">{cfg.label}</span>
      <span className="text-gray-500 dark:text-gray-400 font-normal">
        {children}
      </span>
    </span>
  );
}
