interface GapRow {
  account: string;
  crm: string;
  pipeline: string;
}

const rows: GapRow[] = [
  {
    account: "Acct A",
    crm: "Budget",
    pipeline: "Budget + Competitive Pressure (Power BI eval started 6 months prior, Unique User Logins at z=-2.3)",
  },
  {
    account: "Acct B",
    crm: "Product",
    pipeline: "Value Realization — implementation never completed, Dataflow Runs at z=-3.0 for 4 consecutive months",
  },
  {
    account: "Acct C",
    crm: "Internal Change",
    pipeline: "Strategy Shift + Support Problems (3 escalation emails unanswered over 2 months)",
  },
];

export function CrmGapTable(): React.ReactElement {
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Account</th>
            <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">CRM Loss Reason</th>
            <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">What the Pipeline Found</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.account} className="border-b border-gray-100 dark:border-gray-800/50 align-top">
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{row.account}</td>
              <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.crm}</td>
              <td className="py-2.5 text-gray-700 dark:text-gray-300">{row.pipeline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
