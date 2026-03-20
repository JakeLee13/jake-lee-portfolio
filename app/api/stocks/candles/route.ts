import { NextResponse } from "next/server";
import { getCandles } from "@/lib/finnhub";

const ALLOWED_SYMBOLS = [
  "ASML", "TSM", "SSNLF", "MU", "SNDK", "NVDA",
  "AVGO", "CRWV", "ORCL", "COHR", "LITE", "INTC",
];

const TICKER_WEIGHTS: Record<string, number> = {
  ASML: 0.20, TSM: 0.15, SSNLF: 0.10, MU: 0.05, SNDK: 0.05,
  NVDA: 0.14, AVGO: 0.07, CRWV: 0.045, ORCL: 0.045,
  COHR: 0.035, LITE: 0.035, INTC: 0.03,
};

type Period = "1M" | "3M" | "6M" | "YTD" | "1Y";
const VALID_PERIODS = new Set<Period>(["1M", "3M", "6M", "YTD", "1Y"]);

const cache = new Map<string, { data: object; ts: number }>();

function getCacheTTL(): number {
  const now = new Date();
  const etHour = Number(
    now.toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    })
  );
  const day = now.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  });
  const isWeekday = !["Sat", "Sun"].includes(day);
  const isMarketHours = isWeekday && etHour >= 9 && etHour < 17;
  return isMarketHours ? 5 * 60 * 1000 : 60 * 60 * 1000;
}

function periodToRange(period: Period): { from: number; to: number } {
  const now = Math.floor(Date.now() / 1000);
  const DAY = 86400;
  switch (period) {
    case "1M":
      return { from: now - 30 * DAY, to: now };
    case "3M":
      return { from: now - 90 * DAY, to: now };
    case "6M":
      return { from: now - 180 * DAY, to: now };
    case "YTD": {
      const jan1 = Math.floor(
        new Date(new Date().getFullYear(), 0, 1).getTime() / 1000
      );
      return { from: jan1, to: now };
    }
    case "1Y":
      return { from: now - 365 * DAY, to: now };
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return NextResponse.json(
      { error: "no_api_key", message: "Finnhub API key not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") || "3M") as Period;
  if (!VALID_PERIODS.has(period)) {
    return NextResponse.json({ error: "invalid_period" }, { status: 400 });
  }

  const cached = cache.get(period);
  if (cached && Date.now() - cached.ts < getCacheTTL()) {
    return NextResponse.json({ ...cached.data, cached: true });
  }

  const { from, to } = periodToRange(period);
  const results = await Promise.allSettled(
    ALLOWED_SYMBOLS.map((s) => getCandles(s, from, to))
  );

  // Normalize each ticker to % change from baseline
  const tickers: Record<string, { t: number; v: number }[]> = {};
  const tickerData: Record<
    string,
    { timestamps: number[]; pctChanges: number[] }
  > = {};

  ALLOWED_SYMBOLS.forEach((sym, i) => {
    const result = results[i];
    if (result.status !== "fulfilled" || !result.value) return;

    const { timestamps, closes } = result.value;
    if (closes.length === 0) return;

    const baseline = closes[0];
    const pctChanges = closes.map(
      (c) => ((c - baseline) / baseline) * 100
    );
    const points = timestamps.map((t, j) => ({ t, v: pctChanges[j] }));

    tickers[sym] = points;
    tickerData[sym] = { timestamps, pctChanges };
  });

  // Compute weighted index series using union of all timestamps
  const allTimestamps = new Set<number>();
  for (const sym of Object.keys(tickerData)) {
    for (const t of tickerData[sym].timestamps) {
      allTimestamps.add(t);
    }
  }
  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

  const lookups: Record<string, Map<number, number>> = {};
  for (const [sym, data] of Object.entries(tickerData)) {
    const map = new Map<number, number>();
    data.timestamps.forEach((t, j) => map.set(t, data.pctChanges[j]));
    lookups[sym] = map;
  }

  const index = sortedTimestamps.map((t) => {
    let weightedSum = 0;
    let totalWeight = 0;
    for (const [sym, lookup] of Object.entries(lookups)) {
      const pct = lookup.get(t);
      if (pct !== undefined) {
        const w = TICKER_WEIGHTS[sym] ?? 0;
        weightedSum += w * pct;
        totalWeight += w;
      }
    }
    return { t, v: totalWeight > 0 ? weightedSum / totalWeight : 0 };
  });

  const responseData = { index, tickers, period };
  cache.set(period, { data: responseData, ts: Date.now() });

  return NextResponse.json({ ...responseData, cached: false });
}
