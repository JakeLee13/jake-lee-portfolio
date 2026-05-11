interface SideNoteProps {
  label: string;
  children: React.ReactNode;
}

export function SideNote({ label, children }: SideNoteProps): React.ReactElement {
  return (
    <aside
      className={[
        "not-prose",
        // Mobile / tablet default: inline aside between paragraphs
        "block my-4 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 px-4 py-3",
        // Desktop (≥1220px): float into the right rail provided by the page container
        "min-[1220px]:float-right min-[1220px]:clear-right min-[1220px]:w-[16rem] min-[1220px]:-mr-[18rem] min-[1220px]:my-1 min-[1220px]:py-2 min-[1220px]:px-3 min-[1220px]:bg-transparent min-[1220px]:border-0 min-[1220px]:border-l min-[1220px]:rounded-none min-[1220px]:border-gray-200 dark:min-[1220px]:border-gray-800",
      ].join(" ")}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
        {label}
      </p>
      <div className="text-[12.5px] leading-relaxed text-gray-600 dark:text-gray-400 space-y-2 [&_code]:font-mono [&_code]:text-[11.5px] [&_code]:text-gray-700 dark:[&_code]:text-gray-300 [&_strong]:font-medium [&_strong]:text-gray-800 dark:[&_strong]:text-gray-200">
        {children}
      </div>
    </aside>
  );
}
