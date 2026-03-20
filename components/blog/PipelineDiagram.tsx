interface SubStep {
  label: string;
  detail: string;
  tag?: string;
}

interface Stage {
  label: string;
  title: string;
  substeps: SubStep[];
}

const sources: SubStep[] = [
  { label: "Call Transcripts", detail: "Historical call recordings", tag: "Gong" },
  { label: "Email Threads", detail: "Customer correspondence", tag: "People AI" },
  { label: "Usage Metrics", detail: "Product interaction data", tag: "Domo" },
];

const etl: SubStep = { label: "Domo ETL", detail: "Filter, join, and stage datasets for the pipeline" };

const trigger: SubStep = { label: "Jupyter Notebook", detail: "Triggered on closed-lost opportunities" };

const pipelineStages: Stage[] = [
  {
    label: "Stage 1",
    title: "Signal Extraction",
    substeps: [
      { label: "Emails", detail: "Clean → Extract signals", tag: "LLM" },
      { label: "Calls", detail: "Extract signals", tag: "LLM" },
      { label: "Metrics", detail: "Z-score normalization", tag: "Python" },
    ],
  },
  {
    label: "Stage 2",
    title: "Account Reports",
    substeps: [
      { label: "2a: Triangulate", detail: "Deep reasoning → JSON analysis", tag: "LLM" },
      { label: "2b: Format", detail: "JSON → HTML report", tag: "LLM" },
    ],
  },
  {
    label: "Stage 3",
    title: "Cohort Reports",
    substeps: [
      { label: "3a: Map", detail: "Chunk → JSON analysis", tag: "LLM" },
      { label: "3b: Reduce", detail: "Consolidate → JSON report", tag: "LLM" },
      { label: "3c: Format", detail: "JSON report → cohort HTML", tag: "LLM" },
    ],
  },
];

function SubStepTile({ sub }: { sub: SubStep }): React.ReactElement {
  return (
    <div className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {sub.label}
        </span>
        {sub.tag && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            {sub.tag}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        {sub.detail}
      </p>
    </div>
  );
}

function VerticalArrow(): React.ReactElement {
  return (
    <div className="flex justify-center py-1.5">
      <svg width="12" height="16" viewBox="0 0 12 16" className="text-black dark:text-white">
        <path d="M6 0 L6 10 M2 8 L6 14 L10 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function HorizontalArrow(): React.ReactElement {
  return (
    <div className="flex items-center px-1">
      <svg width="16" height="12" viewBox="0 0 16 12" className="text-black dark:text-white shrink-0">
        <path d="M0 6 L10 6 M8 2 L14 6 L8 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function PipelineDiagram(): React.ReactElement {
  return (
    <div className="not-prose my-8">
      <div className="flex flex-col items-center gap-0">
        {/* Sources - full width */}
        <div className="w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mr-2">Sources</span>
            <span className="text-sm font-medium text-black dark:text-white">Data Sources</span>
          </div>
          <div className="p-3 flex flex-wrap gap-2">
            {sources.map((sub) => (
              <div key={sub.label} className="flex-1 min-w-[140px]">
                <SubStepTile sub={sub} />
              </div>
            ))}
          </div>
        </div>

        <VerticalArrow />

        {/* ETL */}
        <div className="w-1/2 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mr-2">ETL</span>
            <span className="text-sm font-medium text-black dark:text-white">Data Prep</span>
          </div>
          <div className="p-3">
            <SubStepTile sub={etl} />
          </div>
        </div>

        <VerticalArrow />

        {/* Trigger */}
        <div className="w-1/2 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mr-2">Trigger</span>
            <span className="text-sm font-medium text-black dark:text-white">Notebook Execution</span>
          </div>
          <div className="p-3">
            <SubStepTile sub={trigger} />
          </div>
        </div>

        <VerticalArrow />

        {/* Pipeline stages - horizontal flow */}
        <div className="w-full">
          <div className="flex items-stretch gap-0">
            {pipelineStages.map((stage, i) => (
              <div key={stage.label} className="flex flex-1 items-stretch">
                <div className="flex-1 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                  {/* Stage header */}
                  <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/20 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mr-1.5">
                      {stage.label}
                    </span>
                    <span className="text-xs font-medium text-black dark:text-white">
                      {stage.title}
                    </span>
                  </div>
                  {/* Substeps stacked vertically */}
                  <div className="p-2 flex flex-col gap-1.5">
                    {stage.substeps.map((sub) => (
                      <SubStepTile key={sub.label} sub={sub} />
                    ))}
                  </div>
                </div>
                {i < pipelineStages.length - 1 && <HorizontalArrow />}
              </div>
            ))}
          </div>
        </div>

        <VerticalArrow />

        {/* Output */}
        <div className="w-1/2 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mr-2">Output</span>
            <span className="text-sm font-medium text-black dark:text-white">Reports</span>
          </div>
          <div className="p-3">
            <SubStepTile sub={{ label: "Domo App", detail: "HTML reports hosted and shared with CS leaders and executives" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
