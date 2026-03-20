"use client";

import { useRef, useEffect, useState } from "react";
import useSWR from "swr";
import {
  createChart,
  LineSeries,
  ColorType,
  type IChartApi,
} from "lightweight-charts";

interface CandlePoint {
  t: number;
  v: number;
}

interface CandlesResponse {
  index: CandlePoint[];
  tickers: Record<string, CandlePoint[]>;
  period: string;
  cached: boolean;
  error?: string;
}

type Period = "1M" | "3M" | "6M" | "YTD" | "1Y";

const PERIODS: { label: string; value: Period }[] = [
  { label: "1M", value: "1M" },
  { label: "3M", value: "3M" },
  { label: "6M", value: "6M" },
  { label: "YTD", value: "YTD" },
  { label: "1Y", value: "1Y" },
];

const TICKER_COLORS: Record<string, string> = {
  ASML: "#c084fc",
  TSM: "#c084fc",
  SSNLF: "#c084fc",
  MU: "#2dd4bf",
  SNDK: "#2dd4bf",
  NVDA: "#60a5fa",
  AVGO: "#60a5fa",
  CRWV: "#fbbf24",
  ORCL: "#fbbf24",
  COHR: "#fbbf24",
  LITE: "#fbbf24",
  INTC: "#4ade80",
};

const INDEX_COLOR = "#f59e0b";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok)
      return res.json().then((d: CandlesResponse) => Promise.reject(d));
    return res.json();
  });

export function ComputeIndexPerformance(): React.ReactElement {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [period, setPeriod] = useState<Period>("3M");

  const { data, error, isLoading } = useSWR<CandlesResponse>(
    `/api/stocks/candles?period=${period}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  );

  useEffect(() => {
    if (!chartContainerRef.current || !data?.index) return;

    const isDark = document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 320,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: isDark ? "#9ca3af" : "#6b7280",
        fontFamily: "ui-monospace, monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: isDark ? "#1f2937" : "#f3f4f6" },
        horzLines: { color: isDark ? "#1f2937" : "#f3f4f6" },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
      },
      crosshair: {
        horzLine: { visible: true, labelVisible: true },
        vertLine: { visible: true, labelVisible: true },
      },
    });

    chartRef.current = chart;

    // Add individual ticker lines (thin, subtle)
    for (const sym of Object.keys(data.tickers)) {
      const color = TICKER_COLORS[sym] || "#9ca3af";
      const series = chart.addSeries(LineSeries, {
        color,
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      series.setData(
        data.tickers[sym].map((p) => ({
          time: p.t as unknown as import("lightweight-charts").UTCTimestamp,
          value: p.v,
        }))
      );
    }

    // Add index line (thick, prominent)
    const indexSeries = chart.addSeries(LineSeries, {
      color: INDEX_COLOR,
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
    });
    indexSeries.setData(
      data.index.map((p) => ({
        time: p.t as unknown as import("lightweight-charts").UTCTimestamp,
        value: p.v,
      }))
    );

    chart.timeScale().fitContent();

    const container = chartContainerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [data]);

  if (error?.error === "no_api_key") {
    return (
      <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">
          Compute Index — Performance
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
          to{" "}
          <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            .env.local
          </code>{" "}
          to enable performance tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      {/* Header with period selector */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Compute Index — Performance
            </p>
            <p className="text-xs text-gray-500">
              % change from period start, allocation-weighted
            </p>
          </div>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  period === p.value
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="px-6 py-4">
        {isLoading ? (
          <div className="h-[320px] flex items-center justify-center">
            <div className="animate-pulse text-xs font-mono text-gray-400">
              Loading historical data...
            </div>
          </div>
        ) : error ? (
          <div className="h-[320px] flex items-center justify-center">
            <p className="text-xs font-mono text-red-400">
              Unable to load historical data.
            </p>
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full" />
        )}
      </div>

      {/* Legend */}
      {data?.tickers && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-0.5 rounded"
                style={{ backgroundColor: INDEX_COLOR }}
              />
              <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                INDEX
              </span>
            </div>
            {Object.keys(data.tickers).map((sym) => (
              <div key={sym} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-0.5 rounded"
                  style={{
                    backgroundColor: TICKER_COLORS[sym] || "#9ca3af",
                  }}
                />
                <span className="font-mono text-[10px] text-gray-500">
                  {sym}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-100/50 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-800">
        <p className="text-[10px] text-gray-400 font-mono">
          Daily closes from Finnhub · % change from period start · Not financial
          advice
        </p>
      </div>
    </div>
  );
}
