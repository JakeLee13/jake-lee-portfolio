interface ScoreItem {
  question: string;
  answer: string;
  status: "yes" | "partial" | "no" | "shifting";
}

const scores: ScoreItem[] = [
  {
    question: "Is TSMC still 3x short on advanced node capacity?",
    answer: "Yes — as of Q1 2026",
    status: "yes",
  },
  {
    question: "Are H100 spot prices still above $2.00/hr?",
    answer: "Yes — $2.40 deals signed",
    status: "yes",
  },
  {
    question: "Has Samsung won a major design win below 4nm?",
    answer: "Partial — Tesla AI6, but no Apple/AMD",
    status: "partial",
  },
  {
    question: "Has Intel 18A achieved viable yields?",
    answer: "Not yet — watch mid-2026",
    status: "no",
  },
  {
    question: "Are HBM prices still doubling YoY?",
    answer: "Yes — multi-year lock-ins",
    status: "yes",
  },
  {
    question: "Is ASML EUV production still at ~70/yr?",
    answer: "Yes — 80 projected for 2027",
    status: "yes",
  },
  {
    question: "Are Anthropic/OpenAI still compute-constrained?",
    answer: "Yes — both scrambling for 5+ GW",
    status: "yes",
  },
  {
    question: "Is HBM4 sampling on schedule at SK Hynix?",
    answer: "Yes — production samples H2 2026",
    status: "yes",
  },
  {
    question: "Has any CUDA alternative gained >5% AI workload share?",
    answer: "No — ROCm/oneAPI still marginal",
    status: "no",
  },
  {
    question:
      'Has China separated "peaceful" from "reunification" re: Taiwan?',
    answer: "Yes — 2026-2030 Five-Year Plan",
    status: "yes",
  },
];

const statusStyles: Record<ScoreItem["status"], string> = {
  yes: "bg-green-500/15 text-green-500",
  partial: "bg-amber-500/15 text-amber-500",
  no: "bg-red-500/15 text-red-500",
  shifting: "bg-purple-500/15 text-purple-400",
};

export function Scorecard(): React.ReactElement {
  return (
    <div className="not-prose my-8">
      {scores.map((s, i) => (
        <div
          key={i}
          className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800/50 gap-4"
        >
          <span className="flex-1 text-sm text-gray-600 dark:text-gray-400">
            {s.question}
          </span>
          <span
            className={`${statusStyles[s.status]} font-mono text-xs font-medium px-3 py-1 rounded whitespace-nowrap`}
          >
            {s.answer}
          </span>
        </div>
      ))}
    </div>
  );
}
