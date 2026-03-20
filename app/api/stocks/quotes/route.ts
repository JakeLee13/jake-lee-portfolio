import { NextResponse } from "next/server";
import { getQuotes, type StockQuote } from "@/lib/finnhub";

const ALLOWED_SYMBOLS = new Set([
  "ASML",
  "TSM",
  "SSNLF",
  "MU",
  "SNDK",
  "NVDA",
  "AVGO",
  "CRWV",
  "ORCL",
  "COHR",
  "LITE",
  "INTC",
]);

// Simple in-memory cache
let cache: { data: Record<string, StockQuote | null>; ts: number } | null =
  null;
const CACHE_TTL = 15_000; // 15 seconds

export async function GET(request: Request): Promise<NextResponse> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return NextResponse.json(
      { error: "no_api_key", message: "Finnhub API key not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const tickersParam = searchParams.get("tickers");

  const requested = tickersParam
    ? tickersParam
        .split(",")
        .map((t) => t.trim().toUpperCase())
        .filter((t) => ALLOWED_SYMBOLS.has(t))
    : Array.from(ALLOWED_SYMBOLS);

  if (requested.length === 0) {
    return NextResponse.json({ error: "no_valid_tickers" }, { status: 400 });
  }

  // Return cached data if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    const filtered: Record<string, StockQuote | null> = {};
    for (const sym of requested) {
      filtered[sym] = cache.data[sym] ?? null;
    }
    return NextResponse.json({ quotes: filtered, cached: true });
  }

  // Fetch all allowed symbols (keeps cache comprehensive)
  const quotes = await getQuotes(Array.from(ALLOWED_SYMBOLS));
  cache = { data: quotes, ts: Date.now() };

  const filtered: Record<string, StockQuote | null> = {};
  for (const sym of requested) {
    filtered[sym] = quotes[sym] ?? null;
  }

  return NextResponse.json({ quotes: filtered, cached: false });
}
