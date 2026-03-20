interface VerdictBoxProps {
  label?: string;
  children: React.ReactNode;
}

export function VerdictBox({
  label = "Key takeaway",
  children,
}: VerdictBoxProps): React.ReactElement {
  return (
    <div className="not-prose my-8 rounded-lg border border-amber-500/30 bg-gray-50 dark:bg-gray-900/50 p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-3">
        {label}
      </p>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 [&_strong]:text-amber-600 dark:[&_strong]:text-amber-500 [&_strong]:font-medium">
        {children}
      </div>
    </div>
  );
}
