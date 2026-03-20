interface ComparisonRow {
  property: string;
  agent: string;
  pipeline: string;
}

const rows: ComparisonRow[] = [
  { property: "Execution order", agent: "Runtime-determined", pipeline: "Fixed at design time" },
  { property: "Tool selection", agent: "Model chooses", pipeline: "No tools, just prompts" },
  { property: "Looping", agent: "Yes, model decides when to stop", pipeline: "No loops, linear stages" },
  { property: "Failure mode", agent: "Unbounded cost/time, hard to debug", pipeline: "Bounded, each stage independently testable" },
  { property: "Debugging", agent: "Trace through decision tree", pipeline: "Inspect input/output at each stage" },
  { property: "When to use", agent: "Ambiguous tasks, open-ended exploration", pipeline: "Well-defined transformations with known data" },
];

export function ComparisonTable(): React.ReactElement {
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Property</th>
            <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Agent</th>
            <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Pipeline (this system)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.property} className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-2.5 pr-4 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.property}</td>
              <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{row.agent}</td>
              <td className="py-2.5 text-gray-700 dark:text-gray-300">{row.pipeline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
