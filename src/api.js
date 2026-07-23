// ── Yahoo Finance API wrapper ─────────────────────────────────────────────────
// Uses v8/finance/chart per symbol — v7 batch quote is no longer available.
// Each call returns price, 1D change, and YTD in a single request.
//
// In dev:  requests go through the Vite proxy at /yf  (see vite.config.js)
// In prod: corsproxy.io wraps each request to bypass CORS.
//
// For production reliability, deploy cf-worker.js to Cloudflare Workers (free),
// then set CF_WORKER_BASE to your worker URL (e.g. 'https://yf-proxy.you.workers.dev').

const YF_HOST = 'https://query2.finance.yahoo.com';

// Set to your Cloudflare Worker URL to bypass corsproxy.io entirely.
const CF_WORKER_BASE = 'https://yf-proxy.lukewynd.workers.dev';

// General URL builder for arbitrary Yahoo Finance paths (no pre-encoded characters in path).
// Used by other tabs (stock, portfolio) that construct their own paths.
export function buildYfUrl(path) {
  if (import.meta.env.DEV) return `/yf${path}`;
  if (CF_WORKER_BASE) return `${CF_WORKER_BASE}${path}`;
  return `https://corsproxy.io/?${encodeURIComponent(YF_HOST + path)}`;
}

// Build a fetch URL for one symbol, avoiding double-encoding when wrapping with a proxy.
// rawSymbol is the un-encoded ticker (e.g. '^GSPC', 'GC=F').
function yfChartUrl(rawSymbol) {
  const encoded = encodeURIComponent(rawSymbol);
  const params  = 'range=1y&interval=1d';

  if (import.meta.env.DEV) {
    return `/yf/v8/finance/chart/${encoded}?${params}`;
  }
  const fullUrl = `${YF_HOST}/v8/finance/chart/${encoded}?${params}`;
  if (CF_WORKER_BASE) return `${CF_WORKER_BASE}/v8/finance/chart/${encoded}?${params}`;
  return `https://corsproxy.io/?${encodeURIComponent(fullUrl)}`;
}

const SYMBOL_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000;

// Fetch a single symbol via v8 chart (ytd range gives price + 1D change + YTD in one request).
// Returns an enriched quote object or null on failure.
async function fetchSymbol(symbol) {
  const hit = SYMBOL_CACHE.get(symbol);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;

  try {
    const r = await fetch(yfChartUrl(symbol), { headers: { Accept: 'application/json' } });
    if (!r.ok) return null;

    const j = await r.json();
    const result = j?.chart?.result?.[0];
    if (!result) return null;

    const meta   = result.meta;
    const closes = result.indicators?.quote?.[0]?.close ?? [];

    const price  = meta.regularMarketPrice  ?? null;
    // meta.regularMarketChange is the actual current-session $ change — independent of chart range.
    // (meta.chartPreviousClose with range=1y is the year-ago close, NOT yesterday's close.)
    const change = meta.regularMarketChange ?? null;
    const prevClose1d = (price != null && change != null) ? price - change : null;
    const pct1d = (prevClose1d != null && prevClose1d !== 0) ? (change / prevClose1d) * 100 : null;

    // Multi-period returns — walk back from last valid close in the 1y array.
    const n = closes.length;
    let lastValidIdx = n - 1;
    while (lastValidIdx >= 0 && closes[lastValidIdx] == null) lastValidIdx--;
    const effectivePrice = price ?? (lastValidIdx >= 0 ? closes[lastValidIdx] : null);

    const closeAtOffset = (offset) => {
      let idx = lastValidIdx - offset;
      while (idx >= 0 && closes[idx] == null) idx--;
      const c = idx >= 0 ? closes[idx] : null;
      return (c != null && effectivePrice != null && c !== 0)
        ? ((effectivePrice - c) / c) * 100
        : null;
    };

    // YTD: first close of current calendar year
    const nowYear = new Date().getFullYear();
    const timestamps = result.timestamp ?? [];
    let ytdBase = null;
    for (let i = 0; i < timestamps.length; i++) {
      if (new Date(timestamps[i] * 1000).getFullYear() === nowYear && closes[i] != null) {
        ytdBase = closes[i];
        break;
      }
    }
    const pctYtd = (ytdBase != null && ytdBase !== 0 && effectivePrice != null)
      ? ((effectivePrice - ytdBase) / ytdBase) * 100
      : null;

    const data = {
      symbol,
      regularMarketPrice: price,
      regularMarketChangePercent: pct1d,
      regularMarketChange: change,
      quoteType: meta.instrumentType ?? '',
      ytdPct: pctYtd,
      pct1d,
      pct1w:  closeAtOffset(5),
      pct1m:  closeAtOffset(21),
      pct3m:  closeAtOffset(63),
      pctYtd,
    };

    SYMBOL_CACHE.set(symbol, { ts: Date.now(), data });
    return data;
  } catch {
    return null;
  }
}

// Fetch all symbols in parallel chunks. Returns Map<symbol, data>.
// Failed symbols are omitted from the map.
export async function fetchAll(symbols) {
  const CHUNK   = 8;
  const results = new Map();

  for (let i = 0; i < symbols.length; i += CHUNK) {
    const chunk   = symbols.slice(i, i + CHUNK);
    const settled = await Promise.allSettled(chunk.map(s => fetchSymbol(s)));
    chunk.forEach((s, idx) => {
      const val = settled[idx].status === 'fulfilled' ? settled[idx].value : null;
      if (val) results.set(s, val);
    });
  }
  return results;
}
