// ── Portfolio Lab data ────────────────────────────────────────────────────────
// Daily history with dividend-adjusted closes (total return), the quote currency,
// and FX crosses for converting every asset into the portfolio's base currency.

import { buildYfUrl } from '../api.js';
import { tsToDateKey, keyToUtc } from './engine.js';

const CACHE = new Map();
const TTL   = 15 * 60 * 1000;

// Yahoo quotes some venues in minor units (pence, cents). Returns are unaffected,
// but displayed prices and FX lookups need the major currency.
const MINOR_UNITS = { GBp: ['GBP', 0.01], GBX: ['GBP', 0.01], ZAc: ['ZAR', 0.01], ILA: ['ILS', 0.01] };

function normaliseCurrency(ccy) {
  return MINOR_UNITS[ccy] ?? [ccy || 'USD', 1];
}

export async function fetchHistory(symbol, fromKey, signal) {
  const cacheKey = `${symbol}|${fromKey}`;
  const hit = CACHE.get(cacheKey);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const period1 = Math.floor(keyToUtc(fromKey) / 1000);
  const period2 = Math.floor(Date.now() / 1000) + 86400;
  const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1d&events=div%2Csplit&includePrePost=false`;
  const r = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' }, signal });
  if (!r.ok) return null;
  const res = (await r.json())?.chart?.result?.[0];
  if (!res?.timestamp?.length) return null;

  const meta  = res.meta;
  const [currency, scale] = normaliseCurrency(meta.currency);
  const close = res.indicators?.quote?.[0]?.close ?? [];
  const adj   = res.indicators?.adjclose?.[0]?.adjclose ?? close;
  const keys = [], adjOut = [], closeOut = [];
  res.timestamp.forEach((ts, i) => {
    if (!(adj[i] > 0) || !(close[i] > 0)) return;
    const key = tsToDateKey(ts);
    if (keys[keys.length - 1] === key) { adjOut[adjOut.length - 1] = adj[i]; closeOut[closeOut.length - 1] = close[i] * scale; return; }
    keys.push(key); adjOut.push(adj[i]); closeOut.push(close[i] * scale);
  });
  if (!keys.length) return null;

  const data = {
    symbol, currency, keys, adj: adjOut, close: closeOut,
    name:  meta.longName || meta.shortName || symbol,
    type:  meta.instrumentType ?? '',
    price: meta.regularMarketPrice != null ? meta.regularMarketPrice * scale : closeOut[closeOut.length - 1],
  };
  CACHE.set(cacheKey, { ts: Date.now(), data });
  return data;
}

export async function lookupSymbol(symbol) {
  try {
    const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
    const r = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' } });
    if (!r.ok) return null;
    const m = (await r.json())?.chart?.result?.[0]?.meta;
    if (!m) return null;
    const [currency, scale] = normaliseCurrency(m.currency);
    return { name: m.longName || m.shortName || symbol, currency, price: m.regularMarketPrice != null ? m.regularMarketPrice * scale : null };
  } catch { return null; }
}

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: Math.min(size, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}

// Fetches every symbol plus the FX crosses needed to express it in `base`.
export async function loadUniverse({ symbols, base, fromKey, signal, onProgress }) {
  const histories = new Map(), fx = new Map(), failed = [];
  let done = 0;
  const get = s => fetchHistory(s, fromKey, signal).catch(e => { if (e.name === 'AbortError') throw e; return null; });

  await pool(symbols, 6, async s => {
    const h = await get(s);
    if (h) histories.set(s, h); else failed.push(s);
    onProgress?.(++done, symbols.length);
  });

  const ccys = [...new Set([...histories.values()].map(h => h.currency))].filter(c => c !== base);
  await pool(ccys, 6, async c => {
    const h = await get(`${c}${base}=X`);
    if (h) fx.set(c, h);
  });
  return { histories, fx, failed };
}
