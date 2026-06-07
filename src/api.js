// ── Yahoo Finance API wrapper ─────────────────────────────────────────────────
// Uses the public Yahoo Finance v7 quote endpoint (no API key required).
// A crumb token is fetched once per session to satisfy Yahoo's auth check.

const YF = 'https://query1.finance.yahoo.com';
const QUOTE_CACHE = new Map();   // symbol[] key → { ts, data }
const YTD_CACHE   = new Map();   // symbol key   → { ts, pct }
const CACHE_TTL   = 5 * 60 * 1000; // 5 minutes

let _crumb = null;

async function crumb() {
  if (_crumb) return _crumb;
  try {
    const r = await fetch(`${YF}/v1/test/getcrumb`, { credentials: 'include' });
    if (r.ok) _crumb = await r.text();
  } catch { /* guest — proceed without crumb */ }
  return _crumb;
}

// Fetch live quotes for an array of symbols in one request.
// Returns a Map: symbol → quote object from Yahoo Finance.
export async function fetchQuotes(symbols) {
  const key = [...symbols].sort().join(',');
  const hit = QUOTE_CACHE.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;

  const c   = await crumb();
  const qs  = `symbols=${encodeURIComponent(symbols.join(','))}${c ? `&crumb=${encodeURIComponent(c)}` : ''}`;
  const url = `${YF}/v7/finance/quote?${qs}`;

  const r    = await fetch(url, { credentials: 'include' });
  const json = await r.json();
  const list = json?.quoteResponse?.result ?? [];

  const map = new Map(list.map(q => [q.symbol, q]));
  QUOTE_CACHE.set(key, { ts: Date.now(), data: map });
  return map;
}

// Fetch YTD % return for a single symbol via the chart endpoint.
export async function fetchYTD(symbol) {
  const hit = YTD_CACHE.get(symbol);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.pct;

  try {
    const url = `${YF}/v8/finance/chart/${encodeURIComponent(symbol)}?range=ytd&interval=1d`;
    const r   = await fetch(url, { credentials: 'include' });
    const j   = await r.json();
    const closes = j?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];

    const first = closes.find(c => c != null);
    const last  = [...closes].reverse().find(c => c != null);
    if (first == null || last == null) return null;

    const pct = ((last - first) / first) * 100;
    YTD_CACHE.set(symbol, { ts: Date.now(), pct });
    return pct;
  } catch {
    return null;
  }
}

// Fetch YTD for an array of symbols concurrently (rate-limited to 6 at a time).
export async function fetchYTDBatch(symbols) {
  const results = new Map();
  const CHUNK = 6;
  for (let i = 0; i < symbols.length; i += CHUNK) {
    const chunk = symbols.slice(i, i + CHUNK);
    const settled = await Promise.allSettled(chunk.map(s => fetchYTD(s)));
    chunk.forEach((s, idx) => {
      const r = settled[idx];
      results.set(s, r.status === 'fulfilled' ? r.value : null);
    });
  }
  return results;
}
