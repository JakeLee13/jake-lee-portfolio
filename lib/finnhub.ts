const FINNHUB_BASE = "https://finnhub.io/api/v1";

export interface StockQuote {
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

export async function getQuote(symbol: string): Promise<StockQuote | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || apiKey === "your_key_here") return null;

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
      { next: { revalidate: 15 } }
    );

    if (!res.ok) return null;

    const data = await res.json();

    // Finnhub returns { c, d, dp, h, l, o, pc, t }
    if (!data.c || data.c === 0) return null;

    return {
      symbol,
      current: data.c,
      change: data.d,
      percentChange: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t,
    };
  } catch {
    return null;
  }
}

export async function getQuotes(
  symbols: string[]
): Promise<Record<string, StockQuote | null>> {
  const results = await Promise.allSettled(
    symbols.map((s) => getQuote(s))
  );

  const quotes: Record<string, StockQuote | null> = {};
  symbols.forEach((symbol, i) => {
    const result = results[i];
    quotes[symbol] =
      result.status === "fulfilled" ? result.value : null;
  });

  return quotes;
}

export interface StockCandle {
  symbol: string;
  timestamps: number[];
  closes: number[];
}

export async function getCandles(
  symbol: string,
  from: number,
  to: number,
  resolution: string = "D"
): Promise<StockCandle | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || apiKey === "your_key_here") return null;

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (data.s !== "ok" || !data.c || !data.t) return null;

    return {
      symbol,
      timestamps: data.t,
      closes: data.c,
    };
  } catch {
    return null;
  }
}
