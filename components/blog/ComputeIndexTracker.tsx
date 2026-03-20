"use client";

import useSWR from "swr";

interface Quote {
  symbol: string;
  current: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface ApiResponse {
  quotes: Record<string, Quote | null>;
  cached: boolean;
  error?: string;
  message?: string;
}

interface TrackerTicker {
  symbol: string;
  label: string;
  weight: number; // allocation weight as decimal (0.15 = 15%)
}

interface TrackerGroup {
  name: string;
  color: string;
  tickers: TrackerTicker[];
}

const groups: TrackerGroup[] = [
  {
    name: "EUV / Foundry",
    color: "text-purple-400",
    tickers: [
      { symbol: "ASML", label: "ASML", weight: 0.2 },
      { symbol: "TSM", label: "TSMC", weight: 0.15 },
      { symbol: "SSNLF", label: "Samsung", weight: 0.1 },
    ],
  },
  {
    name: "Memory",
    color: "text-teal-400",
    tickers: [
      { symbol: "MU", label: "Micron", weight: 0.05 },
      { symbol: "SNDK", label: "SanDisk", weight: 0.05 },
    ],
  },
  {
    name: "Chip Design",
    color: "text-blue-400",
    tickers: [
      { symbol: "NVDA", label: "Nvidia", weight: 0.14 },
      { symbol: "AVGO", label: "Broadcom", weight: 0.07 },
    ],
  },
  {
    name: "Infrastructure",
    color: "text-amber-400",
    tickers: [
      { symbol: "CRWV", label: "CoreWeave", weight: 0.045 },
      { symbol: "ORCL", label: "Oracle", weight: 0.045 },
      { symbol: "COHR", label: "Coherent", weight: 0.035 },
      { symbol: "LITE", label: "Lumentum", weight: 0.035 },
    ],
  },
  {
    name: "Optionality",
    color: "text-green-400",
    tickers: [
      { symbol: "INTC", label: "Intel", weight: 0.03 },
    ],
  },
];

const allTickers = groups.flatMap((g) => g.tickers);
const tickerString = allTickers.map((t) => t.symbol).join(",");

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) return res.json().then((d: ApiResponse) => Promise.reject(d));
    return res.json();
  });

function computeIndex(quotes: Record<string, Quote | null>): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const t of allTickers) {
    const q = quotes[t.symbol];
    if (!q || q.percentChange === undefined) continue;
    // For short positions, invert the sign (short profits when price drops)
    const effectiveChange =
      t.weight < 0 ? -q.percentChange : q.percentChange;
    weightedSum += Math.abs(t.weight) * effectiveChange;
    totalWeight += Math.abs(t.weight);
  }

  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
}

function formatChange(val: number): string {
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}

function changeColor(val: number): string {
  if (val > 0) return "text-green-500";
  if (val < 0) return "text-red-500";
  return "text-gray-500";
}

export function ComputeIndexTracker(): React.ReactElement {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/stocks/quotes?tickers=${tickerString}`,
    fetcher,
    {
      refreshInterval: 30_000,
      dedupingInterval: 15_000,
      revalidateOnFocus: false,
    }
  );

  // No API key configured
  if (error?.error === "no_api_key") {
    return (
      <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">
          Compute Index — Live Tracker
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add your{" "}
          <a
            href="https://finnhub.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 dark:text-amber-500 underline"
          >
            Finnhub API key
          </a>{" "}
          to <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">.env.local</code> to enable live tracking.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-4">
          Compute Index — Live Tracker
        </p>
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data?.quotes) {
    return (
      <div className="not-prose my-8 rounded-lg border border-red-500/20 bg-gray-50 dark:bg-gray-900/50 p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-red-400 mb-2">
          Compute Index — Live Tracker
        </p>
        <p className="text-sm text-gray-500">
          Unable to load market data. Will retry automatically.
        </p>
      </div>
    );
  }

  const quotes = data.quotes;
  const indexValue = computeIndex(quotes);

  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      {/* Header with index value */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Compute Index — Live
            </p>
            {indexValue !== null ? (
              <p className={`text-3xl font-serif ${changeColor(indexValue)}`}>
                {formatChange(indexValue)}
              </p>
            ) : (
              <p className="text-3xl font-serif text-gray-400">—</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Allocation-weighted daily change
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-400">
              {data.cached ? "cached" : "live"} ·{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Ticker groups */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
        {groups.map((group) => (
          <div key={group.name} className="px-6 py-4">
            <p
              className={`font-mono text-[10px] uppercase tracking-wider ${group.color} mb-2`}
            >
              {group.name}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
              {group.tickers.map((t) => {
                const q = quotes[t.symbol];
                return (
                  <div key={t.symbol} className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-amber-600 dark:text-amber-500 font-medium w-12">
                      {t.symbol}
                    </span>
                    {q ? (
                      <>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          ${q.current.toFixed(2)}
                        </span>
                        <span
                          className={`text-xs font-mono ${changeColor(q.percentChange)}`}
                        >
                          {formatChange(q.percentChange)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-100/50 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-800">
        <p className="text-[10px] text-gray-400 font-mono">
          Data from Finnhub · Refreshes every 30s · Not financial advice ·
          Weights based on allocation thesis
        </p>
      </div>
    </div>
  );
}
