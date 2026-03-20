interface StageRow {
  stage: string;
  input: string;
  output: string;
  pattern: string;
}

const rows: StageRow[] = [
  { stage: "1a-b", input: "Raw emails, context card", output: "Cleaned emails → loss signals", pattern: "llm.parallel(), 60 workers" },
  { stage: "1c", input: "Call transcripts, context card", output: "Loss signals (confidence ≥ 0.75)", pattern: "llm.parallel(), 20 workers" },
  { stage: "1d", input: "Raw usage metrics", output: "Z-scored metric JSON", pattern: "Pure Python (no LLM)" },
  { stage: "2a", input: "All Stage 1 outputs", output: "Triangulated analysis JSON", pattern: "llm.parallel(), 10 workers" },
  { stage: "2b", input: "Stage 2a JSON", output: "Polished HTML report", pattern: "llm.parallel() (formatting only)" },
  { stage: "3a", input: "Chunks of ~8 accounts", output: "Sub-cohort summary JSON", pattern: "llm.parallel(), 4 workers" },
  { stage: "3b", input: "All sub-cohort JSONs", output: "Master cohort JSON", pattern: "Single llm.prompt()" },
  { stage: "3c", input: "Master JSON", output: "Cohort HTML report", pattern: "Single llm.prompt() (formatting only)" },
];

export function StageTable(): React.ReactElement {
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Stage</th>
            <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Input</th>
            <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Output</th>
            <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Pattern</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.stage} className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{row.stage}</td>
              <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">{row.input}</td>
              <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">{row.output}</td>
              <td className="py-2.5 text-gray-500 dark:text-gray-400">
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
                  {row.pattern}
                </code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
