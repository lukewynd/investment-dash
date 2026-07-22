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
  const params  = 'range=ytd&interval=1d';

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

    const first = closes.find(c => c != null);
    const last  = [...closes].reverse().find(c => c != null);
    const ytdPct = (first != null && last != null && first !== 0)
      ? ((last - first) / first) * 100
      : null;

    const price = meta.regularMarketPrice ?? null;
    const prev  = meta.chartPreviousClose ?? null;
    const regularMarketChangePercent = (price != null && prev != null && prev !== 0)
      ? ((price - prev) / prev) * 100
      : null;
    const regularMarketChange = (price != null && prev != null) ? price - prev : null;

    const data = {
      symbol,
      regularMarketPrice: price,
      regularMarketChangePercent,
      regularMarketChange,
      chartPreviousClose: prev,
      quoteType: meta.instrumentType ?? '',
      ytdPct,
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
