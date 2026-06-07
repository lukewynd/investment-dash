// ── Yahoo Finance API wrapper ─────────────────────────────────────────────────
// In dev:  requests go through the Vite proxy at /yf  (see vite.config.js)
// In prod: requests are wrapped with allorigins.win to bypass CORS restrictions

const YF_HOST = 'https://query1.finance.yahoo.com';

// Build the final fetch URL, applying the CORS proxy in production.
function yfUrl(path) {
  if (import.meta.env.DEV) return `/yf${path}`;
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(YF_HOST + path)}`;
}

const QUOTE_CACHE = new Map();
const YTD_CACHE   = new Map();
const CACHE_TTL   = 5 * 60 * 1000;

// Fetch live quotes for a group of symbols.
// Returns a Map: symbol → quote object. Never throws — returns empty Map on failure.
export async function fetchQuotes(symbols) {
  if (!symbols.length) return new Map();

  const key = [...symbols].sort().join(',');
  const hit = QUOTE_CACHE.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;

  const path = `/v7/finance/quote?symbols=${encodeURIComponent(symbols.join(','))}&formatted=false`;
  const r    = await fetch(yfUrl(path));
  if (!r.ok) throw new Error(`Quote fetch failed: ${r.status}`);

  const json = await r.json();
  const list = json?.quoteResponse?.result ?? [];

  const map = new Map(list.map(q => [q.symbol, q]));
  QUOTE_CACHE.set(key, { ts: Date.now(), data: map });
  return map;
}

// Fetch YTD % return for one symbol. Returns null on failure.
export async function fetchYTD(symbol) {
  const hit = YTD_CACHE.get(symbol);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.pct;

  try {
    const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=ytd&interval=1d`;
    const r    = await fetch(yfUrl(path));
    if (!r.ok) return null;

    const j      = await r.json();
    const closes = j?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const first  = closes.find(c => c != null);
    const last   = [...closes].reverse().find(c => c != null);
    if (first == null || last == null) return null;

    const pct = ((last - first) / first) * 100;
    YTD_CACHE.set(symbol, { ts: Date.now(), pct });
    return pct;
  } catch {
    return null;
  }
}

// Fetch YTD for many symbols concurrently in chunks of 6.
export async function fetchYTDBatch(symbols) {
  const results = new Map();
  const CHUNK   = 6;
  for (let i = 0; i < symbols.length; i += CHUNK) {
    const chunk   = symbols.slice(i, i + CHUNK);
    const settled = await Promise.allSettled(chunk.map(s => fetchYTD(s)));
    chunk.forEach((s, idx) => {
      results.set(s, settled[idx].status === 'fulfilled' ? settled[idx].value : null);
    });
  }
  return results;
}
